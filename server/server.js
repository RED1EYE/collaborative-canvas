const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '../client')));

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Application state
const state = {
    operations: [],
    users: new Map()
};

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New client connected. Total clients:', wss.clients.size);
    
    let currentUser = null;
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            handleMessage(ws, data);
        } catch (error) {
            console.error('Error parsing message:', error);
            ws.send(JSON.stringify({ 
                type: 'error', 
                message: 'Invalid message format' 
            }));
        }
    });
    
    ws.on('close', () => {
        if (currentUser) {
            state.users.delete(currentUser.userId);
            console.log(`User ${currentUser.userId} disconnected. Remaining clients:`, wss.clients.size);
            
            // Notify all users about updated user list
            broadcastUserList();
        }
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
    
    function handleMessage(ws, message) {
        const { type, userId, data, timestamp } = message;
        
        switch (type) {
            case 'register':
                const userColor = generateUserColor();
                currentUser = {
                    userId,
                    ws,
                    color: userColor,
                    connectedAt: timestamp
                };
                state.users.set(userId, currentUser);
                
                console.log(`User ${userId} registered with color ${userColor}`);
                
                // Send initial state to new user
                ws.send(JSON.stringify({
                    type: 'init',
                    data: {
                        operations: state.operations,
                        users: Array.from(state.users.values()).map(u => ({
                            userId: u.userId,
                            color: u.color
                        })),
                        yourUserId: userId,
                        yourColor: userColor
                    }
                }));
                
                // Notify all other users about new user
                broadcastUserList();
                break;
                
            case 'draw':
                const operation = {
                    id: generateOperationId(),
                    userId,
                    timestamp,
                    data,
                    deleted: false
                };
                
                state.operations.push(operation);
                
                // Broadcast to all other users
                broadcast({
                    type: 'draw',
                    data: operation
                }, userId);
                
                console.log(`Operation ${operation.id} from ${userId}`);
                break;
                
            case 'undo':
                handleUndo();
                break;
                
            case 'redo':
                handleRedo();
                break;
                
            case 'cursor':
                // Broadcast cursor position to all other users
                broadcast({
                    type: 'cursor',
                    userId,
                    data
                }, userId);
                break;
                
            case 'clear':
                // Mark all operations as deleted
                state.operations.forEach(op => op.deleted = true);
                broadcast({
                    type: 'clear'
                });
                console.log('Canvas cleared');
                break;
                
            default:
                console.warn('Unknown message type:', type);
        }
    }
    
    function handleUndo() {
        // Find last non-deleted operation
        for (let i = state.operations.length - 1; i >= 0; i--) {
            if (!state.operations[i].deleted) {
                state.operations[i].deleted = true;
                
                broadcast({
                    type: 'undo',
                    operationId: state.operations[i].id
                });
                
                console.log(`Undone operation ${state.operations[i].id}`);
                break;
            }
        }
    }
    
    function handleRedo() {
        // Find last deleted operation (scanning backwards)
        for (let i = state.operations.length - 1; i >= 0; i--) {
            if (state.operations[i].deleted) {
                state.operations[i].deleted = false;
                
                broadcast({
                    type: 'redo',
                    operationId: state.operations[i].id
                });
                
                console.log(`Redone operation ${state.operations[i].id}`);
                break;
            }
        }
    }
    
    function broadcast(message, excludeUserId = null) {
        const messageStr = JSON.stringify(message);
        state.users.forEach((user) => {
            if (user.userId !== excludeUserId && user.ws.readyState === WebSocket.OPEN) {
                user.ws.send(messageStr);
            }
        });
    }
    
    function broadcastUserList() {
        broadcast({
            type: 'users',
            data: Array.from(state.users.values()).map(u => ({
                userId: u.userId,
                color: u.color
            }))
        });
    }
});

function generateUserColor() {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
        '#F38181', '#AA96DA', '#FCBAD3', '#A8E6CF', '#FFD3B6',
        '#FF8B94', '#A8DADC', '#E63946', '#06FFA5', '#F77F00'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function generateOperationId() {
    return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Start server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});