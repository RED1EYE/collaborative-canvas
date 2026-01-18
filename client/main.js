// Initialize canvas
const canvas = new DrawingCanvas(document.getElementById('canvas'));

// Initialize WebSocket
const wsClient = new WebSocketClient(window.location.origin.replace(/^http/, 'ws'));

// Store local operations
let localOperations = [];
let users = [];

// Connection status handling
wsClient.onConnect = () => {
    updateConnectionStatus('connected');
};

wsClient.onDisconnect = () => {
    updateConnectionStatus('disconnected');
};

wsClient.onError = (error) => {
    console.error('Connection error:', error);
    updateConnectionStatus('disconnected');
};

// Initialize with server state
wsClient.onInit = (initData) => {
    console.log('Received initial state:', initData);
    localOperations = initData.operations || [];
    users = initData.users || [];
    
    canvas.operations = localOperations;
    canvas.redrawFromOperations();
    updateUserList(users);
};

// Handle incoming drawings
wsClient.onDraw = (drawData) => {
    localOperations.push(drawData);
    canvas.operations = localOperations;
    canvas.drawRemotePath(drawData.data);
};

// Handle local drawing
canvas.onDrawEnd = (pathData) => {
    const operation = {
        id: generateLocalId(),
        data: pathData,
        deleted: false
    };
    localOperations.push(operation);
    wsClient.sendDrawing(pathData);
};

// Cursor handling with throttling
let lastCursorSend = 0;
const CURSOR_THROTTLE = 50; // ms

canvas.onCursorMove = (position) => {
    const now = Date.now();
    if (now - lastCursorSend > CURSOR_THROTTLE) {
        wsClient.sendCursor(position);
        lastCursorSend = now;
    }
};

wsClient.onCursor = (userId, position) => {
    const user = users.find(u => u.userId === userId);
    const color = user ? user.color : '#999999';
    canvas.updateRemoteCursor(userId, position, color);
};

// Undo/Redo handlers
wsClient.onUndo = () => {
    for (let i = localOperations.length - 1; i >= 0; i--) {
        if (!localOperations[i].deleted) {
            localOperations[i].deleted = true;
            break;
        }
    }
    canvas.operations = localOperations;
    canvas.redrawFromOperations();
};

wsClient.onRedo = () => {
    for (let i = localOperations.length - 1; i >= 0; i--) {
        if (localOperations[i].deleted) {
            localOperations[i].deleted = false;
            break;
        }
    }
    canvas.operations = localOperations;
    canvas.redrawFromOperations();
};

wsClient.onClear = () => {
    localOperations.forEach(op => {
        op.deleted = true;
    });
    canvas.operations = localOperations;
    canvas.clear();
};

// User list updates
wsClient.onUsers = (userList) => {
    users = userList;
    updateUserList(userList);
};

// Tool controls
document.getElementById('colorPicker').addEventListener('change', (e) => {
    canvas.setColor(e.target.value);
    updateToolUI('brush');
});

// Color presets
document.querySelectorAll('.color-preset').forEach(btn => {
    btn.addEventListener('click', () => {
        const color = btn.dataset.color;
        canvas.setColor(color);
        document.getElementById('colorPicker').value = color;
        updateToolUI('brush');
    });
});

document.getElementById('widthSlider').addEventListener('input', (e) => {
    const width = parseInt(e.target.value);
    canvas.setWidth(width);
    document.getElementById('widthValue').textContent = width;
});

document.getElementById('brushBtn').addEventListener('click', () => {
    canvas.setTool('brush');
    updateToolUI('brush');
});

document.getElementById('eraserBtn').addEventListener('click', () => {
    canvas.setTool('eraser');
    updateToolUI('eraser');
});

// Action buttons
document.getElementById('undoBtn').addEventListener('click', () => {
    wsClient.sendUndo();
});

document.getElementById('redoBtn').addEventListener('click', () => {
    wsClient.sendRedo();
});

document.getElementById('clearBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the entire canvas? This will affect all users.')) {
        wsClient.sendClear();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+Z or Cmd+Z for undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        wsClient.sendUndo();
    }
    // Ctrl+Shift+Z or Cmd+Shift+Z for redo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        wsClient.sendRedo();
    }
    // B for brush
    if (e.key === 'b' || e.key === 'B') {
        canvas.setTool('brush');
        updateToolUI('brush');
    }
    // E for eraser
    if (e.key === 'e' || e.key === 'E') {
        canvas.setTool('eraser');
        updateToolUI('eraser');
    }
});

// UI Helper Functions
function updateToolUI(activeTool) {
    document.getElementById('brushBtn').classList.toggle('active', activeTool === 'brush');
    document.getElementById('eraserBtn').classList.toggle('active', activeTool === 'eraser');
}

function updateUserList(userList) {
    const userListEl = document.getElementById('userList');
    const userCountEl = document.getElementById('userCount');
    
    userListEl.innerHTML = '';
    userCountEl.textContent = userList.length;
    
    userList.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="user-color" style="background: ${user.color}"></span>
            <span class="user-name">${user.userId}</span>
        `;
        userListEl.appendChild(li);
    });
}

function updateConnectionStatus(status) {
    const indicator = document.getElementById('connectionIndicator');
    const text = document.getElementById('connectionText');
    
    indicator.className = 'status-indicator ' + status;
    
    switch (status) {
        case 'connected':
            text.textContent = 'Connected';
            break;
        case 'connecting':
            text.textContent = 'Connecting...';
            break;
        case 'disconnected':
            text.textContent = 'Disconnected';
            break;
    }
}

function generateLocalId() {
    return 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Initialize connection status
updateConnectionStatus('connecting');