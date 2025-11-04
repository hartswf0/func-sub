/**
 * Integration Module for func-orb-training.html
 * Updates psychograph/hexagon radar based on avatar movement
 * WITHOUT crashing or freezing
 */

// Add to func-orb-training.html after loading

// 1. Load the complete node dataset
let PSYCHOGRAPH_DATASET = null;
let psychographUpdateScheduled = false;
let lastAvatarPosition = { row: 0, col: 4 };

async function loadPsychographDataset() {
    try {
        console.log('📦 Loading psychograph dataset...');
        // Use relative path (works on web servers and locally)
        const response = await fetch('complete_node_dataset.json');
        PSYCHOGRAPH_DATASET = await response.json();
        console.log('✅ Psychograph dataset loaded:', PSYCHOGRAPH_DATASET.known_nodes.length, 'nodes');
        return PSYCHOGRAPH_DATASET;
    } catch (e) {
        console.error('❌ Failed to load psychograph dataset:', e);
        return null;
    }
}

// 2. Smooth update function using requestAnimationFrame
function schedulePsychographUpdate(channel) {
    if (psychographUpdateScheduled) return;
    
    psychographUpdateScheduled = true;
    requestAnimationFrame(() => {
        updatePsychographFromPosition(channel);
        psychographUpdateScheduled = false;
    });
}

// 3. Update psychograph based on avatar position
function updatePsychographFromPosition(channel) {
    if (!PSYCHOGRAPH_DATASET || !channel.avatar) return;
    
    const { row, col } = channel.avatar;
    
    // Check if position actually changed
    if (row === lastAvatarPosition.row && col === lastAvatarPosition.col) {
        return;
    }
    
    lastAvatarPosition = { row, col };
    
    // Find node at current position
    // Check known nodes first
    let currentNode = PSYCHOGRAPH_DATASET.known_nodes.find(n =>
        n.coordinate[0] === row && n.coordinate[1] === col
    );
    
    // Check synthetic nodes if no known node found
    let isSynthetic = false;
    if (!currentNode && PSYCHOGRAPH_DATASET.synthetic_nodes) {
        currentNode = PSYCHOGRAPH_DATASET.synthetic_nodes.find(n =>
            n.coordinate[0] === row && n.coordinate[1] === col
        );
        isSynthetic = true;
    }
    
    if (currentNode) {
        console.log('📍 Avatar at node:', currentNode.name, `(${row}, ${col})`);
        
        // Boost the axis for this node
        const axes = ['IDENTITY', 'EXPERIENCE', 'LANGUAGE', 'DOMAIN', 'PURPOSE', 'ORDER'];
        
        if (!isSynthetic && currentNode.axis) {
            // Known node - strong boost
            const axisIndex = axes.indexOf(currentNode.axis.toUpperCase());
            if (axisIndex >= 0 && channel.trainingAxisValues) {
                const targetValue = 0.8;
                const currentValue = channel.trainingAxisValues[axisIndex];
                const delta = (targetValue - currentValue) * 0.2;
                channel.trainingAxisValues[axisIndex] += delta;
                
                // Slight decay for other axes
                channel.trainingAxisValues.forEach((v, i) => {
                    if (i !== axisIndex) {
                        channel.trainingAxisValues[i] = Math.max(0.15, v * 0.98);
                    }
                });
                
                if (channel.update3DRadar) channel.update3DRadar();
            }
            
            // Show node info in chat
            addMessage(channel, 'system',
                `📍 **${currentNode.name}** · ${currentNode.subtitle}\n` +
                `${currentNode.axis} ${currentNode.polarity}`
            );
            renderMessages(channel);
        } else if (isSynthetic && currentNode.nearest_node) {
            // Synthetic node - moderate boost based on nearest
            const nearestAxis = currentNode.nearest_node.split('(')[0].trim().split(' ')[0].toUpperCase();
            const axisIndex = axes.indexOf(nearestAxis);
            if (axisIndex >= 0 && channel.trainingAxisValues) {
                channel.trainingAxisValues[axisIndex] = Math.min(0.7, channel.trainingAxisValues[axisIndex] + 0.1);
                if (channel.update3DRadar) channel.update3DRadar();
            }
            
            // Show synthetic node info
            addMessage(channel, 'system',
                `📍 **${currentNode.name}**\n` +
                `Synthetic · Near ${currentNode.nearest_node}`
            );
            renderMessages(channel);
        }
    } else {
        // Not on a known node - gradual decay
        if (channel.trainingAxisValues) {
            let changed = false;
            channel.trainingAxisValues.forEach((v, i) => {
                const newValue = Math.max(0.2, v * 0.995); // Very slow decay
                if (Math.abs(newValue - v) > 0.001) {
                    channel.trainingAxisValues[i] = newValue;
                    changed = true;
                }
            });
            
            // Only update radar if values actually changed
            if (changed && channel.update3DRadar) {
                channel.update3DRadar();
            }
        }
    }
}

// 4. Hook into avatar movement (ADD THIS TO AVATAR MOVEMENT CODE)
/*
// In the avatar movement handler around line 2974 in func-orb-training.html
// After updating avatar.row and avatar.col, add:

if (newRow !== avatar.row || newCol !== avatar.col) {
    avatar.row = newRow;
    avatar.col = newCol;
    
    // Update position
    const newPos = gridRowColToWorld(newRow, newCol);
    avatar.mesh.position.x = newPos.x;
    avatar.mesh.position.z = newPos.z;
    
    // 🎯 SCHEDULE PSYCHOGRAPH UPDATE (non-blocking)
    schedulePsychographUpdate(channel);
}
*/

// 5. Proximity-based boost (even when NOT on exact node)
function updatePsychographFromProximity(channel) {
    if (!PSYCHOGRAPH_DATASET || !channel.avatar) return;
    
    const { row, col } = channel.avatar;
    
    // Find nearest nodes within 2 cell radius
    const nearbyNodes = PSYCHOGRAPH_DATASET.known_nodes.filter(n => {
        const distance = Math.abs(n.coordinate[0] - row) + Math.abs(n.coordinate[1] - col);
        return distance <= 2;
    });
    
    if (nearbyNodes.length > 0 && channel.trainingAxisValues) {
        const axes = ['IDENTITY', 'EXPERIENCE', 'LANGUAGE', 'DOMAIN', 'PURPOSE', 'ORDER'];
        
        // Reset influence map
        const influence = [0, 0, 0, 0, 0, 0];
        
        // Calculate influence from each nearby node
        nearbyNodes.forEach(node => {
            const distance = Math.abs(node.coordinate[0] - row) + Math.abs(node.coordinate[1] - col);
            const strength = 1 / (1 + distance); // Inverse distance weighting
            
            const axisIndex = axes.indexOf(node.axis.toUpperCase());
            if (axisIndex >= 0) {
                influence[axisIndex] += strength * 0.15;
            }
        });
        
        // Apply influence smoothly
        channel.trainingAxisValues.forEach((v, i) => {
            const target = Math.max(0.2, Math.min(0.9, v + influence[i]));
            const delta = (target - v) * 0.1; // Smooth interpolation
            channel.trainingAxisValues[i] += delta;
        });
        
        // Update radar
        if (channel.update3DRadar) {
            channel.update3DRadar();
        }
    }
}

// 6. Initialize on page load
(async function initPsychographIntegration() {
    console.log('🔄 Loading psychograph integration...');
    await loadPsychographDataset();
    
    // Set initial values if needed
    if (window.appState && window.appState.channels) {
        window.appState.channels.forEach(channel => {
            if (!channel.trainingAxisValues) {
                channel.trainingAxisValues = [0.3, 0.3, 0.3, 0.3, 0.3, 0.3];
            }
        });
    }
    
    console.log('✅ Psychograph integration ready');
})();

// 7. Export functions for use in func-orb-training.html
window.schedulePsychographUpdate = schedulePsychographUpdate;
window.updatePsychographFromPosition = updatePsychographFromPosition;
window.updatePsychographFromProximity = updatePsychographFromProximity;
window.PSYCHOGRAPH_DATASET = PSYCHOGRAPH_DATASET;
