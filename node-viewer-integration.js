/**
 * Node Dataset Viewer Integration for func-orb-training.html
 * Makes the 3D scene work with node dataset and shows prompts in chat
 */

// Global state for node viewer
let NODE_VIEWER = {
    dataset: null,
    selectedNode: null,
    viewMode: 'observer' // 'inner', 'outer', or 'observer'
};

// Load and initialize node dataset
async function initNodeViewer() {
    try {
        const response = await fetch('complete_node_dataset.json');
        NODE_VIEWER.dataset = await response.json();
        console.log('✅ Node Viewer: Dataset loaded -', 
            NODE_VIEWER.dataset.known_nodes.length, 'known,',
            NODE_VIEWER.dataset.synthetic_nodes.length, 'synthetic');
        
        // Make grid cells clickable for all channels
        if (window.appState && window.appState.channels) {
            window.appState.channels.forEach(channel => {
                if (channel.gridCells) {
                    makeGridCellsClickable(channel);
                }
            });
        }
        
        return true;
    } catch (e) {
        console.error('❌ Node Viewer: Failed to load dataset', e);
        return false;
    }
}

// Make grid cells clickable to show node data
function makeGridCellsClickable(channel) {
    if (!NODE_VIEWER.dataset || !channel.gridCells) return;
    
    channel.gridCells.forEach(cell => {
        const row = cell.row;
        const col = cell.col;
        
        // Add click handler
        cell.mesh.userData.clickHandler = () => {
            showNodeAtPosition(channel, row, col);
        };
        
        // Mouse pointer on hover if there's a node here
        const hasNode = findNodeAtPosition(row, col);
        if (hasNode) {
            cell.mesh.userData.hasNode = true;
        }
    });
}

// Find node (known or synthetic) at position
function findNodeAtPosition(row, col) {
    if (!NODE_VIEWER.dataset) return null;
    
    // Check known nodes first
    let node = NODE_VIEWER.dataset.known_nodes.find(n =>
        n.coordinate[0] === row && n.coordinate[1] === col
    );
    
    if (node) {
        node._type = 'known';
        return node;
    }
    
    // Check synthetic nodes
    node = NODE_VIEWER.dataset.synthetic_nodes.find(n =>
        n.coordinate[0] === row && n.coordinate[1] === col
    );
    
    if (node) {
        node._type = 'synthetic';
        return node;
    }
    
    return null;
}

// Show node data in chat when clicked
function showNodeAtPosition(channel, row, col) {
    const node = findNodeAtPosition(row, col);
    
    if (!node) {
        addMessage(channel, 'system', `📍 Position (${row}, ${col}) - No node data available`);
        renderMessages(channel);
        return;
    }
    
    NODE_VIEWER.selectedNode = node;
    const isKnown = node._type === 'known';
    
    // Build node info message
    let message = '';
    
    if (isKnown) {
        // Known node with full data
        const color = node.polarity === 'Inner' ? '🔴' : '🔵';
        message = `
${color} **${node.name}** · ${node.subtitle}

**Axis:** ${node.axis}  
**Polarity:** ${node.polarity}  
**Position:** (${node.coordinate[0]}, ${node.coordinate[1]})

---

### 🔴 SHED
${node.shedding}

### ⚪ INTEGRATE  
${node.integrating}

### 🟢 GROUND
${node.grounding}

---
Type \`focus ${node.axis.toLowerCase()}\` to boost this axis on the radar.
        `.trim();
    } else {
        // Synthetic node
        message = `
📍 **${node.name}**

**Type:** Synthetic Node  
**Position:** (${node.coordinate[0]}, ${node.coordinate[1]})  
**Quadrant:** ${node.quadrant || 'Center'}  
**Distance from Center:** ${node.distance_from_center ? node.distance_from_center.toFixed(2) : 'N/A'}  
**Nearest Known Node:** ${node.nearest_node || 'N/A'}

---

### 🔴 SHED
${node.shedding}

### ⚪ INTEGRATE
${node.integrating}

### 🟢 GROUND
${node.grounding}

---
*Synthetic nodes are interpolated from nearby known coordinates*
        `.trim();
    }
    
    addMessage(channel, 'system', message);
    renderMessages(channel);
    
    // Update radar to highlight this node's axis
    if (isKnown && node.axis && channel.trainingAxisValues) {
        const axes = ['IDENTITY', 'EXPERIENCE', 'LANGUAGE', 'DOMAIN', 'PURPOSE', 'ORDER'];
        const axisIndex = axes.indexOf(node.axis.toUpperCase());
        if (axisIndex >= 0) {
            channel.trainingAxisValues[axisIndex] = 0.85;
            // Slight decay for others
            channel.trainingAxisValues.forEach((v, i) => {
                if (i !== axisIndex) channel.trainingAxisValues[i] = Math.max(0.2, v * 0.8);
            });
            if (channel.update3DRadar) channel.update3DRadar();
        }
    }
}

// Command: Show node by ID or coordinate
window.showNode = function(idOrCoord, channel) {
    channel = channel || window.appState.channels[0];
    
    let node = null;
    
    // Try as ID (1-12)
    if (typeof idOrCoord === 'number' || !isNaN(idOrCoord)) {
        const id = parseInt(idOrCoord);
        node = NODE_VIEWER.dataset.known_nodes.find(n => n.id === id);
        if (node) node._type = 'known';
    }
    // Try as coordinate string "3,5"
    else if (typeof idOrCoord === 'string' && idOrCoord.includes(',')) {
        const [row, col] = idOrCoord.split(',').map(n => parseInt(n.trim()));
        node = findNodeAtPosition(row, col);
    }
    
    if (node) {
        showNodeAtPosition(channel, node.coordinate[0], node.coordinate[1]);
    } else {
        addMessage(channel, 'system', `❌ Node not found: ${idOrCoord}`);
        renderMessages(channel);
    }
};

// Command: List all nodes
window.listNodes = function(filter, channel) {
    channel = channel || window.appState.channels[0];
    
    if (!NODE_VIEWER.dataset) {
        addMessage(channel, 'system', '❌ Dataset not loaded');
        renderMessages(channel);
        return;
    }
    
    let nodes = NODE_VIEWER.dataset.known_nodes;
    let title = '📋 **All Known Nodes**';
    
    if (filter === 'inner') {
        nodes = nodes.filter(n => n.polarity === 'Inner');
        title = '🔴 **INNER Nodes**';
    } else if (filter === 'outer') {
        nodes = nodes.filter(n => n.polarity === 'Outer');
        title = '🔵 **OUTER Nodes**';
    } else if (filter === 'synthetic') {
        nodes = NODE_VIEWER.dataset.synthetic_nodes.slice(0, 20); // First 20
        title = '📍 **Synthetic Nodes** (first 20)';
    }
    
    const list = nodes.map(n => {
        const coord = `(${n.coordinate[0]},${n.coordinate[1]})`;
        if (n.id) {
            return `${n.id}. **${n.name}** (${n.subtitle}) - ${n.axis} ${n.polarity} ${coord}`;
        } else {
            return `• **${n.name}** - ${n.nearest_node || 'Synthetic'} ${coord}`;
        }
    }).join('\n');
    
    const message = `${title}\n\n${list}\n\n---\nType \`show node [id]\` or click grid cells to see details.`;
    
    addMessage(channel, 'system', message);
    renderMessages(channel);
};

// Command: Focus on an axis
window.focusAxis = function(axisName, channel) {
    channel = channel || window.appState.channels[0];
    
    const axes = ['IDENTITY', 'EXPERIENCE', 'LANGUAGE', 'DOMAIN', 'PURPOSE', 'ORDER'];
    const axisIndex = axes.indexOf(axisName.toUpperCase());
    
    if (axisIndex < 0) {
        addMessage(channel, 'system', `❌ Unknown axis: ${axisName}\nValid: ${axes.join(', ')}`);
        renderMessages(channel);
        return;
    }
    
    if (!channel.trainingAxisValues) {
        channel.trainingAxisValues = axes.map(() => 0.3);
    }
    
    // Boost the target axis
    channel.trainingAxisValues[axisIndex] = 0.9;
    
    // Decay others
    channel.trainingAxisValues.forEach((v, i) => {
        if (i !== axisIndex) channel.trainingAxisValues[i] = 0.2;
    });
    
    if (channel.update3DRadar) channel.update3DRadar();
    
    addMessage(channel, 'system', `🎯 Focused on **${axes[axisIndex]}** axis`);
    renderMessages(channel);
};

// Add click handling to existing grid cells
function enableGridCellClicks(channel) {
    if (!channel.gridCells || !channel.renderer) return;
    
    const canvas = channel.dom.trainCanvas;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, channel.camera);
        const intersects = raycaster.intersectObjects(
            channel.gridCells.map(c => c.mesh).filter(Boolean)
        );
        
        if (intersects.length > 0) {
            const cell = channel.gridCells.find(c => c.mesh === intersects[0].object);
            if (cell && cell.row !== undefined && cell.col !== undefined) {
                showNodeAtPosition(channel, cell.row, cell.col);
            }
        }
    });
    
    console.log('✅ Grid cells are now clickable for', channel.name);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            initNodeViewer().then(success => {
                if (success && window.appState) {
                    window.appState.channels.forEach(enableGridCellClicks);
                }
            });
        }, 1000); // Wait for main app to initialize
    });
} else {
    // Already loaded
    setTimeout(() => {
        initNodeViewer().then(success => {
            if (success && window.appState) {
                window.appState.channels.forEach(enableGridCellClicks);
            }
        });
    }, 1000);
}

// Export to window
window.NODE_VIEWER = NODE_VIEWER;
window.showNodeAtPosition = showNodeAtPosition;
window.findNodeAtPosition = findNodeAtPosition;

console.log('📊 Node Viewer Integration loaded');
