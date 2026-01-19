# 🎨 Real-Time Collaborative Drawing Canvas

**🌐 Live Demo:** https://redeye-fribble.onrender.com/

**📁 GitHub Repository:** https://github.com/RED1EYE/collaborative-canvas

A real-time multi-user collaborative drawing application with WebSocket synchronization, built with vanilla JavaScript and HTML5 Canvas API.

---

## ✨ Core Features

### **Required Features (Implemented):**
- ✅ **Real-time Drawing Synchronization** - Multiple users can draw simultaneously with instant updates
- ✅ **Drawing Tools** - Brush and eraser with adjustable colors and stroke widths
- ✅ **User Presence Indicators** - See active users with assigned colors and cursor positions
- ✅ **Undo/Redo System** - Global undo/redo that works across all connected users
- ✅ **Conflict Resolution** - Last-write-wins strategy for concurrent operations
- ✅ **Connection Management** - Automatic reconnection on network interruption
- ✅ **Touch Support** - Full compatibility with mobile and tablet devices
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### **Additional Features:**
- ⌨️ Keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z, B, E)
- 🎨 Color picker with preset color palette
- 🧹 Clear canvas functionality (affects all users)
- 📊 Real-time online user count

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js version 14 or higher
- npm (comes with Node.js)

### **Installation & Setup**

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

The server will start on `http://localhost:3000`

### **For Development (with auto-restart)**
```bash
npm run dev
```

---

## 🧪 Testing with Multiple Users

### **Local Testing:**

**Option 1 - Multiple Browser Tabs:**
1. Open `http://localhost:3000` in your browser
2. Open the same URL in a new tab (or use incognito mode)
3. Start drawing in one tab - you'll see it appear in the other tab instantly

**Option 2 - Multiple Devices on Same Network:**
1. Find your local IP address:
   - **Windows:** Run `ipconfig` in Command Prompt (look for IPv4 Address)
   - **Mac/Linux:** Run `ifconfig` or `ip addr` (look for inet address)
   - Example: `192.168.1.100`

2. On the host machine: `http://localhost:3000`
3. On other devices: `http://YOUR_IP:3000` (e.g., `http://192.168.1.100:3000`)

**Option 3 - Test with Live Demo:**
1. Open https://redeye-fribble.onrender.com/ in multiple devices/browsers
2. Share the link with others to test collaborative features

### **What to Test:**
- ✅ Drawing appears in all connected browsers
- ✅ Undo/redo works across all users
- ✅ User cursors are visible
- ✅ User list updates when users join/leave
- ✅ Reconnection works after network interruption
- ✅ Tools (brush/eraser) and colors sync properly

---

## 🏗️ Architecture & Technical Details

### **Technology Stack**

**Frontend:**
- HTML5 with Canvas API
- CSS3 (Flexbox, custom styling)
- Vanilla JavaScript (ES6+)
- WebSocket API (client-side)

**Backend:**
- Node.js (v14+)
- Express.js (^4.18.2)
- ws WebSocket library (^8.14.2)

**Communication:**
- WebSocket protocol for real-time bidirectional communication
- JSON message format

**Deployment:**
- Render (free tier with automatic GitHub deployment)

### **Why These Technologies?**

**Vanilla JavaScript over frameworks:**
- Assignment requirement: no external drawing libraries
- Direct control over Canvas API
- Lighter bundle size
- Better understanding of fundamentals

**Native WebSocket over Socket.io:**
- Learning experience with raw protocol
- Lighter weight (no library overhead)
- Native browser support
- More control over message handling

**Express.js:**
- Simple static file serving
- Easy WebSocket integration
- Industry-standard Node.js framework

### **Project Structure**
```
collaborative-canvas/
├── client/
│   ├── index.html           # Main HTML structure
│   ├── style.css            # UI styling and layout
│   ├── canvas.js            # Canvas drawing logic & operations
│   ├── websocket-client.js  # WebSocket client & connection handling
│   └── main.js              # Application initialization & integration
├── server/
│   └── server.js            # Express server + WebSocket server
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── package-lock.json        # Locked dependency versions
├── Procfile                 # Deployment configuration
├── README.md                # This file
└── ARCHITECTURE.md          # Detailed architecture documentation
```

### **System Architecture**
```
┌──────────────┐                           ┌──────────────┐
│   Client A   │                           │   Client B   │
│              │                           │              │
│  Canvas API  │                           │  Canvas API  │
│  WebSocket   │                           │  WebSocket   │
└──────┬───────┘                           └──────┬───────┘
       │                                          │
       │         WebSocket Connection            │
       │                                          │
       └────────────────┬─────────────────────────┘
                        │
                        ▼
                ┌───────────────┐
                │  Server (WS)  │
                │               │
                │  • User Mgmt  │
                │  • Operations │
                │  • Broadcast  │
                │  • Undo/Redo  │
                └───────────────┘
```

For detailed architecture documentation including data flow, WebSocket protocol, undo/redo strategy, performance optimizations, and conflict resolution, see **[ARCHITECTURE.md](ARCHITECTURE.md)**.

---

## 🎮 User Guide

### **Drawing:**
- **Mouse:** Click and drag to draw
- **Touch:** Touch and drag on mobile/tablet devices
- Lines appear in real-time for all connected users

### **Tools:**
- **Brush Tool:** Click brush icon or press `B`
- **Eraser Tool:** Click eraser icon or press `E`

### **Customization:**
- **Color:** Click color picker or select from preset colors
- **Stroke Width:** Adjust slider (1-20px)

### **Actions:**
- **Undo:** Click undo button or press `Ctrl+Z` (Mac: `Cmd+Z`)
- **Redo:** Click redo button or press `Ctrl+Shift+Z` (Mac: `Cmd+Shift+Z`)
- **Clear Canvas:** Click clear button (affects all users)

### **User Indicators:**
- See other users' cursor positions as colored circles
- View online user list in the sidebar
- Each user has a unique assigned color

---

## 🌐 Deployment

### **Live Demo**
Currently deployed at: **https://redeye-fribble.onrender.com/**

### **Deploy Your Own Instance**

**Deploy to Render (Recommended - Free):**

1. Create account at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `your-app-name`
   - **Branch:** `main`
   - **Build Command:** `npm install`
   - **Start Command:** `node server/server.js`
   - **Instance Type:** `Free`
5. Click "Create Web Service"
6. Wait 2-3 minutes for deployment

Your app will be live at `https://your-app-name.onrender.com`

**Other Deployment Options:**
- Railway.app - Auto-detects Node.js
- Fly.io - Use `fly launch` command
- Any VPS with Node.js support

---

## ⚠️ Known Limitations

### **Current Limitations:**
1. **No Persistence:** Canvas state is stored in memory only - clears on server restart
2. **Global Undo:** Undo affects the last operation by anyone, not per-user
3. **Single Canvas:** No room/session isolation - all users share one canvas
4. **Scalability:** Optimized for ~50 concurrent users per instance
5. **Browser Support:** Requires modern browser with WebSocket and Canvas API support
6. **Free Tier Sleep:** Render free tier sleeps after 15 minutes of inactivity (~30-50 second cold start on first request)

### **Why These Limitations?**
These represent intentional trade-offs for the assignment scope:
- Focused on core real-time features over persistence
- Simpler architecture for easier understanding and debugging
- 30-hour time constraint prioritized working features over scalability

---

## 🚧 Future Enhancements

### **Potential Improvements:**
- [ ] Room/session system for isolated canvases
- [ ] Database persistence (MongoDB/PostgreSQL)
- [ ] Per-user undo/redo stacks
- [ ] User authentication and saved drawings
- [ ] Drawing shapes (rectangles, circles, lines)
- [ ] Text tool
- [ ] Image upload and manipulation
- [ ] Export canvas as PNG/SVG/PDF
- [ ] Layer system
- [ ] Drawing history timeline
- [ ] Collaborative cursor following
- [ ] Voice chat integration

---

## 📊 Development & Time Investment

### **Time Breakdown:**
- **Day 1 (10 hours):** WebSocket research, server setup, basic drawing sync
- **Day 2 (10 hours):** Undo/redo system, user management, cursor indicators
- **Day 3 (10 hours):** UI polish, testing, documentation, deployment
- **Total: 30 hours** over 3 days

### **Testing:**
- Manual testing with 2-10 simultaneous users
- Tested on Chrome, Firefox, Safari
- Tested on Windows, macOS, Android, iOS
- Network interruption testing (disconnect/reconnect)
- Performance testing (100+ rapid operations)
- Latency: Average <100ms between user action and sync

### **Key Challenges Solved:**
1. **Soft-delete undo/redo** - Preserves history while hiding operations
2. **WebSocket reconnection** - Automatic connection recovery with full state sync
3. **Performance optimization** - Throttled cursor updates, complete path transmission
4. **Conflict resolution** - Last-write-wins with operation sequencing
5. **Mobile support** - Touch event handling with preventDefault

---

## 🔧 Configuration

### **Environment Variables:**
```bash
PORT=3000  # Server port (default: 3000)
```

### **For Development:**
```bash
# Install nodemon if not already installed
npm install

# Run with auto-restart on file changes
npm run dev
```

---

## 📄 License

MIT License - Free to use for learning, personal projects, or as a base for your own applications.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/RED1EYE/collaborative-canvas/issues).

### **To Contribute:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author

**RED1EYE**

- GitHub: [@RED1EYE](https://github.com/RED1EYE)
- Repository: [collaborative-canvas](https://github.com/RED1EYE/collaborative-canvas)
- Live Demo: [redeye-fribble.onrender.com](https://redeye-fribble.onrender.com/)

---

## 🙏 Acknowledgments

- HTML5 Canvas API documentation
- WebSocket protocol specification
- Node.js and Express.js communities
- Render for free hosting platform

---

## 📧 Questions or Feedback?

Open an issue at [github.com/RED1EYE/collaborative-canvas/issues](https://github.com/RED1EYE/collaborative-canvas/issues)

---

**⭐ If you found this project helpful or interesting, please give it a star on GitHub!**

---

*Built with ❤️ as part of a technical assignment demonstrating real-time web technologies and collaborative systems.*
