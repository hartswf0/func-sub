# Dataset Integration Guide for func-orb-training.html

## Overview
Integrate `complete_node_dataset.json` with the hexagon radar and grid system to provide contextual prompts based on avatar position and chat interactions.

## 1. Load Dataset on Startup

Add to initialization section:

```javascript
// Load complete node dataset
let COMPLETE_DATASET = null;

async function loadCompleteDataset() {
  try {
    const response = await fetch('/Users/gaia/FUNC-SUB/complete_node_dataset.json');
    COMPLETE_DATASET = await response.json();
    console.log('✅ Dataset loaded:', COMPLETE_DATASET.metadata.total_coordinates, 'coordinates');
    
    // Store in appState for access
    appState.nodeDataset = COMPLETE_DATASET;
    
    return COMPLETE_DATASET;
  } catch (e) {
    console.error('❌ Failed to load dataset:', e);
    return null;
  }
}

// Call during init
loadCompleteDataset();
```

## 2. Update Radar Based on Chat

Modify `sendMessageWithLEGOS` to detect axis keywords and update radar:

```javascript
async function sendMessageWithLEGOS(channel, userText) {
  // ... existing code ...
  
  // DETECT AXIS KEYWORDS and update radar
  const axisKeywords = {
    'IDENTITY': ['identity', 'self', 'who am i', 'instinct', 'reason'],
    'EXPERIENCE': ['experience', 'seen', 'unseen', 'perception'],
    'LANGUAGE': ['language', 'ideas', 'ideology', 'communication'],
    'DOMAIN': ['domain', 'source', 'resource', 'context'],
    'PURPOSE': ['purpose', 'heart', 'head', 'intention'],
    'ORDER': ['order', 'parts', 'whole', 'structure']
  };
  
  Object.keys(axisKeywords).forEach(axis => {
    const keywords = axisKeywords[axis];
    if (keywords.some(kw => userText.toLowerCase().includes(kw))) {
      // Boost this axis in radar
      if (!channel.trainingAxisValues) {
        channel.trainingAxisValues = TRAINING_GROUND.AXES.map(() => 0.3);
      }
      const axisIndex = TRAINING_GROUND.AXES.indexOf(axis);
      channel.trainingAxisValues[axisIndex] = Math.min(1.0, 
        channel.trainingAxisValues[axisIndex] + 0.1
      );
      
      // Update 3D radar
      if (channel.update3DRadar) {
        channel.update3DRadar();
        console.log('📊 Radar updated from chat keyword:', axis);
      }
    }
  });
  
  // ... continue with API call ...
}
```

## 3. Avatar Position → Dataset Node Prompts

When avatar moves to a cell, show the corresponding node data:

```javascript
// In avatar movement handler (around line 2974)
if (newRow !== avatar.row || newCol !== avatar.col) {
  avatar.row = newRow;
  avatar.col = newCol;
  
  // ... existing position update ...
  
  // CHECK FOR DATASET NODE at this position
  if (appState.nodeDataset && appState.nodeDataset.known_nodes) {
    const node = appState.nodeDataset.known_nodes.find(n => 
      n.coordinate[0] === newRow && n.coordinate[1] === newCol
    );
    
    if (node) {
      addMessage(channel, 'system',
        `📍 **${node.name}** (${node.subtitle})\\n\\n` +
        `**Axis:** ${node.axis} · **Polarity:** ${node.polarity}\\n\\n` +
        `🔴 **SHED:** ${node.shedding}\\n\\n` +
        `⚪ **INTEGRATE:** ${node.integrating}\\n\\n` +
        `🟢 **GROUND:** ${node.grounding}`
      );
      renderMessages(channel);
      
      // Update radar to reflect this node's axis
      const axisIndex = TRAINING_GROUND.AXES.indexOf(node.axis.toUpperCase());
      if (axisIndex >= 0) {
        channel.trainingAxisValues[axisIndex] = 0.9;
        channel.update3DRadar();
      }
    }
  }
  
  // ... rest of movement code ...
}
```

## 4. Click Grid Cell → Show Node Info

Add click handler to grid cells:

```javascript
// In init3DForChannel, after creating grid cells
channel.gridCells.forEach(cell => {
  cell.addEventListener('click', (e) => {
    e.stopPropagation();
    
    const row = cell.row;
    const col = cell.col;
    
    if (appState.nodeDataset && appState.nodeDataset.known_nodes) {
      const node = appState.nodeDataset.known_nodes.find(n => 
        n.coordinate[0] === row && n.coordinate[1] === col
      );
      
      if (node) {
        // Show node prompt in chat
        addMessage(channel, 'system',
          `📍 **Node ${node.id}: ${node.name}**\\n\\n` +
          `**${node.subtitle}** · ${node.axis} ${node.polarity}\\n\\n` +
          `Choose a phase:\\n` +
          `• Type \`@shed ${node.axis} ${node.polarity}\`\\n` +
          `• Type \`@integrate ${node.axis} ${node.polarity}\`\\n` +
          `• Type \`@ground ${node.axis} ${node.polarity}\``
        );
        renderMessages(channel);
        
        // Highlight this cell
        cell.material.emissive.setHex(node.polarity === 'Inner' ? 0xff5c7c : 0x569fff);
        cell.material.emissiveIntensity = 0.8;
        
        setTimeout(() => {
          cell.material.emissive.setHex(0x000000);
          cell.material.emissiveIntensity = 0;
        }, 2000);
      }
    }
  });
});
```

## 5. Entity Placement → Use Dataset Prompts

When AI places entities via @shed/@integrate/@ground commands, pull from dataset:

```javascript
// In @shed/@integrate/@ground handler
if (axisName && pairName) {
  // Check if we should use dataset node
  if (appState.nodeDataset) {
    const matchingNode = appState.nodeDataset.known_nodes.find(n =>
      n.axis.toUpperCase() === axisName &&
      n.polarity.toUpperCase() === pairName
    );
    
    if (matchingNode) {
      // Use dataset text instead of hardcoded TRAINING_GROUND
      const phaseText = {
        'SHED': matchingNode.shedding,
        'INTEGRATE': matchingNode.integrating,
        'GROUND': matchingNode.grounding
      }[stageName];
      
      // Place entity with dataset text
      addMessage(channel, 'system',
        `✅ Placed **${matchingNode.name}** at (${emptyCell.row},${emptyCell.col})\\n\\n` +
        `**${stageName}:** ${phaseText}\\n\\n` +
        `📊 ${axisName} axis updated in radar`
      );
      
      // Create entity with node metadata
      const entity = createGridEntity(
        channel, 
        emptyCell.row, 
        emptyCell.col,
        matchingNode.name,
        matchingNode.subtitle,
        pairName === 'INNER' ? 0xff5c7c : 0x569fff
      );
      
      entity.nodeData = matchingNode; // Store full node data
      
      // ... continue placement ...
    }
  }
}
```

## 6. Dynamic Radar Updates

Add automatic radar decay and boost system:

```javascript
// Add to animate3D loop
function updateRadarDynamically(channel) {
  if (!channel.trainingAxisValues) return;
  
  // Decay all axes slightly over time (creates dynamic feel)
  channel.trainingAxisValues = channel.trainingAxisValues.map(v => 
    Math.max(0.1, v * 0.998) // Slow decay to 0.1 minimum
  );
  
  // Check entities on grid - boost their axes
  const entities = appState.gridEntities.get(channel.id) || [];
  entities.forEach(entity => {
    if (entity.nodeData && entity.nodeData.axis) {
      const axisIndex = TRAINING_GROUND.AXES.indexOf(
        entity.nodeData.axis.toUpperCase()
      );
      if (axisIndex >= 0) {
        // Small boost per frame
        channel.trainingAxisValues[axisIndex] = Math.min(1.0,
          channel.trainingAxisValues[axisIndex] + 0.001
        );
      }
    }
  });
  
  // Update radar every 60 frames
  if (channel.radarUpdateCounter === undefined) {
    channel.radarUpdateCounter = 0;
  }
  channel.radarUpdateCounter++;
  
  if (channel.radarUpdateCounter >= 60) {
    channel.radarUpdateCounter = 0;
    if (channel.update3DRadar) {
      channel.update3DRadar();
    }
  }
}

// Call in animate3D
appState.channels.forEach(channel => {
  if (!channel.scene || !channel.renderer) return;
  updateRadarDynamically(channel);
  // ... rest of animation ...
});
```

## 7. Chat Commands for Dataset

Add convenient commands:

```javascript
// In sendMessageWithLEGOS

// SHOW NODE INFO command
if (lowerText.startsWith('show node') || lowerText.match(/node (\d+)/)) {
  const nodeId = parseInt(lowerText.match(/\d+/)?.[0] || '1');
  const node = appState.nodeDataset?.known_nodes.find(n => n.id === nodeId);
  
  if (node) {
    addMessage(channel, 'system',
      `📍 **Node ${node.id}: ${node.name}**\\n\\n` +
      `**${node.subtitle}**\\n` +
      `Axis: ${node.axis} · Polarity: ${node.polarity}\\n` +
      `Position: (${node.coordinate[0]}, ${node.coordinate[1]})\\n\\n` +
      `🔴 **SHED:** ${node.shedding}\\n\\n` +
      `⚪ **INTEGRATE:** ${node.integrating}\\n\\n` +
      `🟢 **GROUND:** ${node.grounding}`
    );
  } else {
    addMessage(channel, 'system', `❌ Node ${nodeId} not found in dataset`);
  }
  renderMessages(channel);
  return;
}

// LIST NODES command
if (lowerText === 'list nodes' || lowerText === 'show all nodes') {
  const nodes = appState.nodeDataset?.known_nodes || [];
  const list = nodes.map(n => 
    `${n.id}. **${n.name}** (${n.subtitle}) - ${n.axis} ${n.polarity} at (${n.coordinate[0]},${n.coordinate[1]})`
  ).join('\\n');
  
  addMessage(channel, 'system',
    `📋 **Complete Node Dataset** (${nodes.length} nodes):\\n\\n${list}\\n\\n` +
    `Type \`show node [#]\` to see details`
  );
  renderMessages(channel);
  return;
}
```

## Summary

This integration creates a **living, responsive system** where:
- ✅ Radar updates based on chat keywords
- ✅ Avatar movement reveals dataset prompts
- ✅ Grid clicks show node information
- ✅ Entity placement uses dataset text
- ✅ Radar dynamically reflects active nodes
- ✅ Commands explore the dataset

The hexagon becomes a **real-time psychographic** that changes as you interact!
