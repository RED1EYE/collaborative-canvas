class DrawingCanvas {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.isDrawing = false;
        this.currentPath = [];
        
        // Drawing settings
        this.color = '#000000';
        this.width = 2;
        this.tool = 'brush';
        
        // Callbacks
        this.onDrawEnd = null;
        this.onCursorMove = null;
        
        // Operations for undo/redo
        this.operations = [];
        
        // Remote cursors
        this.remoteCursors = new Map();
        
        this.setupCanvas();
        this.attachEventListeners();
    }
    
    setupCanvas() {
        // Make canvas responsive
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Set canvas size (accounting for padding)
        const width = rect.width - 40;
        const height = rect.height - 40;
        
        // Store current canvas content
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Restore canvas content if exists
        if (imageData.width > 0) {
            this.ctx.putImageData(imageData, 0, 0);
        }
        
        // Set canvas styling for high-DPI displays
        const dpr = window.devicePixelRatio || 1;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
    }
    
    attachEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        
        // Cursor tracking
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.onCursorMove) {
                const pos = this.getMousePos(e);
                this.onCursorMove(pos);
            }
        });
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        this.canvas.dispatchEvent(mouseEvent);
    }
    
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getMousePos(e);
        this.currentPath = [pos];
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const pos = this.getMousePos(e);
        
        // Draw locally
        if (this.currentPath.length > 0) {
            this.drawLine(
                this.currentPath[this.currentPath.length - 1],
                pos,
                this.color,
                this.width,
                this.tool
            );
        }
        
        this.currentPath.push(pos);
    }
    
    stopDrawing(e) {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        
        // Send complete path to server
        if (this.currentPath.length > 0 && this.onDrawEnd) {
            this.onDrawEnd({
                points: this.currentPath,
                color: this.color,
                width: this.width,
                tool: this.tool
            });
        }
        
        this.currentPath = [];
    }
    
    drawLine(start, end, color, width, tool) {
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        
        if (tool === 'eraser') {
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.lineWidth = width * 2;
        } else {
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = width;
        }
        
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();
        
        // Reset composite operation
        this.ctx.globalCompositeOperation = 'source-over';
    }
    
    drawRemotePath(pathData) {
        const { points, color, width, tool } = pathData;
        
        if (!points || points.length < 2) return;
        
        for (let i = 1; i < points.length; i++) {
            this.drawLine(points[i - 1], points[i], color, width, tool);
        }
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCursors();
    }
    
    redrawFromOperations() {
        this.clear();
        
        this.operations.forEach(op => {
            if (!op.deleted) {
                this.drawRemotePath(op.data);
            }
        });
        
        this.drawCursors();
    }
    
    updateRemoteCursor(userId, position, color) {
        this.remoteCursors.set(userId, { ...position, color });
        this.redrawFromOperations();
    }
    
    removeRemoteCursor(userId) {
        this.remoteCursors.delete(userId);
        this.redrawFromOperations();
    }
    
    drawCursors() {
        this.remoteCursors.forEach((cursor, userId) => {
            // Draw cursor circle
            this.ctx.beginPath();
            this.ctx.arc(cursor.x, cursor.y, 6, 0, 2 * Math.PI);
            this.ctx.fillStyle = cursor.color;
            this.ctx.fill();
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Draw user ID label
            this.ctx.fillStyle = cursor.color;
            this.ctx.font = 'bold 11px Arial';
            const label = userId.substr(5, 6);
            this.ctx.fillText(label, cursor.x + 12, cursor.y - 8);
        });
    }
    
    setColor(color) {
        this.color = color;
        this.tool = 'brush';
    }
    
    setWidth(width) {
        this.width = width;
    }
    
    setTool(tool) {
        this.tool = tool;
    }
}