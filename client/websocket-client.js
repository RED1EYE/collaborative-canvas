class WebSocketClient {
    constructor(url) {
        this.url = url;
        this.ws = null;
        this.userId = this.generateUserId();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 2000;
        
        // Callbacks
        this.onConnect = null;
        this.onDisconnect = null;
        this.onDraw = null;
        this.onCursor = null;
        this.onInit = null;
        this.onUsers = null;
        this.onUndo = null;
        this.onRedo = null;
        this.onClear = null;
        this.onError = null;
        
        this.connect();
    }
    
    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }
    
    connect() {
        try {
            // Determine WebSocket URL (ws or wss based on page protocol)
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const host = window.location.host;
            this.ws = new WebSocket(`${protocol}//${host}`);
            
            this.ws.onopen = () => {
                console.log('Connected to server');
                this.reconnectAttempts = 0;
                
                // Register this user
                this.send({
                    type: 'register',
                    userId: this.userId
                });
                
                this.onConnect && this.onConnect();
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    this.handleMessage(message);
                } catch (error) {
                    console.error('Failed to parse message:', error);
                }
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.onError && this.onError(error);
            };
            
            this.ws.onclose = () => {
                console.log('Disconnected from server');
                this.onDisconnect && this.onDisconnect();
                this.attemptReconnect();
            };
            
        } catch (error) {
            console.error('Connection failed:', error);
            this.attemptReconnect();
        }
    }
    
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = this.reconnectDelay * this.reconnectAttempts;
            console.log(`Reconnecting in ${delay/1000} seconds... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => this.connect(), delay);
        } else {
            console.error('Max reconnection attempts reached');
            this.onError && this.onError(new Error('Could not reconnect to server'));
        }
    }
    
    handleMessage(message) {
        switch (message.type) {
            case 'init':
                this.onInit && this.onInit(message.data);
                break;
            case 'draw':
                this.onDraw && this.onDraw(message.data);
                break;
            case 'cursor':
                this.onCursor && this.onCursor(message.userId, message.data);
                break;
            case 'undo':
                this.onUndo && this.onUndo();
                break;
            case 'redo':
                this.onRedo && this.onRedo();
                break;
            case 'clear':
                this.onClear && this.onClear();
                break;
            case 'users':
                this.onUsers && this.onUsers(message.data);
                break;
            case 'error':
                console.error('Server error:', message.message);
                this.onError && this.onError(new Error(message.message));
                break;
            default:
                console.warn('Unknown message type:', message.type);
        }
    }
    
    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                ...message,
                userId: this.userId,
                timestamp: Date.now()
            }));
        } else {
            console.warn('WebSocket not connected');
        }
    }
    
    sendDrawing(pathData) {
        this.send({
            type: 'draw',
            data: pathData
        });
    }
    
    sendCursor(position) {
        this.send({
            type: 'cursor',
            data: position
        });
    }
    
    sendUndo() {
        this.send({ type: 'undo' });
    }
    
    sendRedo() {
        this.send({ type: 'redo' });
    }
    
    sendClear() {
        this.send({ type: 'clear' });
    }
}