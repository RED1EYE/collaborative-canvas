# 🎨 Real-Time Collaborative Drawing Canvas

**🌐 Live Demo:** https://redeye-fribble.onrender.com/

**📁 GitHub Repository:** https://github.com/RED1EYE/collaborative-canvas

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
git clone https://github.com/RED1EYE/collaborative-canvas.git
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
├── Procfile                 # For deployment
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

### Live Demo
**Deployed on Render:** https://redeye-fribble.onrender.com/

### Load Testing
- Tested with up to 10 simultaneous users
- Smooth performance with 100+ drawing operations
- Average latency: <100ms

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

## 📄 License

MIT License - feel free to use this project for learning or as a base for your own applications.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/RED1EYE/collaborative-canvas/issues).

## 👤 Author

**RED1EYE**
- GitHub: [@RED1EYE](https://github.com/RED1EYE)
- Project: [collaborative-canvas](https://github.com/RED1EYE/collaborative-canvas)
- Live Demo: [https://redeye-fribble.onrender.com/](https://redeye-fribble.onrender.com/)

## 🙏 Acknowledgments

- HTML5 Canvas API documentation
- WebSocket specification
- Node.js community
- Express.js framework

---

**⭐ If you found this project helpful, please give it a star on GitHub!**

**💬 Questions or feedback?** Open an issue at [github.com/RED1EYE/collaborative-canvas/issues](https://github.com/RED1EYE/collaborative-canvas/issues)
