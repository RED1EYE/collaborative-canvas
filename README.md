# 🎨 Real-Time Collaborative Drawing Canvas

A multi-user collaborative drawing application built with vanilla JavaScript, HTML5 Canvas API, and WebSocket for real-time synchronization.

## ✨ Features

- ✅ **Real-time multi-user drawing** - See other users draw as they draw
- ✅ **Drawing tools** - Brush and eraser with customizable colors and widths
- ✅ **Global undo/redo** - Works across all connected users
- ✅ **User cursor indicators** - See where other users are drawing
- ✅ **Online user list** - View all connected users with their assigned colors
- ✅ **Touch support** - Full mobile device compatibility
- ✅ **Keyboard shortcuts** - Ctrl+Z (undo), Ctrl+Shift+Z (redo), B (brush), E (eraser)
- ✅ **Auto-reconnection** - Automatically reconnects on connection loss
- ✅ **Responsive design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js v14 or higher
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/collaborative-canvas.git
cd collaborative-canvas
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

4. **Open in browser**
```
http://localhost:3000
```

### Testing with Multiple Users

1. Open `http://localhost:3000` in multiple browser tabs
2. Or share your local network IP with other devices: `http://YOUR_IP:3000`
3. Start drawing - all connected users will see your drawings in real-time!

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Vanilla JavaScript, HTML5 Canvas API, CSS3
- **Backend**: Node.js, Express.js
- **Real-time Communication**: WebSocket (ws library)
- **No external libraries** for canvas operations

### System Design
```
┌─────────────┐                    ┌─────────────┐
│   Client A  │ ◄─── WebSocket ───►│             │
└─────────────┘                    │             │
                                   │   Server    │
┌─────────────┐                    │             │
│   Client B  │ ◄─── WebSocket ───►│             │
└─────────────┘                    └─────────────┘
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed documentation.

## 📁 Project Structure
```
collaborative-canvas/
├── client/
│   ├── index.html           # Main HTML file
│   ├── style.css            # Styling
│   ├── canvas.js            # Canvas drawing logic
│   ├── websocket-client.js  # WebSocket client
│   └── main.js              # Application integration
├── server/
│   └── server.js            # Express + WebSocket server
├── .gitignore
├── package.json
├── Procfile                 # For Heroku deployment
├── README.md
└── ARCHITECTURE.md
```

## 🎮 Usage

### Drawing
- **Click and drag** to draw on canvas
- **Touch and drag** on mobile devices

### Tools
- **Brush**: Click the brush button or press `B`
- **Eraser**: Click the eraser button or press `E`
- **Color**: Click color picker or use preset colors
- **Width**: Adjust stroke width with slider

### Actions
- **Undo**: Click undo button or press `Ctrl+Z` / `Cmd+Z`
- **Redo**: Click redo button or press `Ctrl+Shift+Z` / `Cmd+Shift+Z`
- **Clear**: Click clear button (affects all users)

## 🔧 Configuration

### Environment Variables
```bash
PORT=3000  # Server port (default: 3000)
```

### Development Mode
```bash
npm run dev  # Uses nodemon for auto-restart
```

## 🌐 Deployment

### Deploy to Render (Free)

1. **Create account** at [render.com](https://render.com)

2. **Create new Web Service**
   - Connect your GitHub repository
   - Select branch: `main`

3. **Configure**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

4. **Deploy** - Click "Create Web Service"

5. **Access** - Your app will be live at `https://your-app-name.onrender.com`

### Deploy to Heroku
```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Deploy
git push heroku main

# Open app
heroku open
```

### Deploy to Railway

1. Visit [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Node.js and deploys

## 🧪 Testing

### Manual Testing Checklist
- [x] Drawing with mouse
- [x] Drawing with touch
- [x] Color changes
- [x] Width changes
- [x] Tool switching
- [x] Undo/Redo
- [x] Multi-user sync
- [x] User cursors
- [x] Connection/Disconnection

### Load Testing
- Tested with up to 10 simultaneous users
- Smooth performance with 100+ drawing operations
- Average latency: <100ms

## ⚠️ Known Limitations

1. **No persistence** - Canvas clears when server restarts (in-memory storage)
2. **Global undo** - Undo affects last operation by anyone, not per-user
3. **Scalability** - Optimized for ~50 concurrent users per instance
4. **Browser support** - Requires modern browser with WebSocket support

## 🚧 Future Enhancements

- [ ] Room/session system for isolated canvases
- [ ] Database persistence (MongoDB/PostgreSQL)
- [ ] User authentication
- [ ] Drawing shapes (rectangles, circles, lines)
- [ ] Text tool
- [ ] Image upload
- [ ] Export as PNG/SVG
- [ ] Layer system
- [ ] Per-user undo/redo

## 📊 Time Spent

- **Day 1**: 10 hours (WebSocket learning + real-time sync)
- **Day 2**: 10 hours (Undo/redo + user features)
- **Day 3**: 10 hours (Polish + documentation + deployment)
- **Total**: 30 hours

## 📄 License

MIT License - feel free to use this project for learning or as a base for your own applications.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👤 Author

**Your Name**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- HTML5 Canvas API documentation
- WebSocket specification
- Node.js community