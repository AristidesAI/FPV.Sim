# FPV Drone Simulator

A browser-based 3D FPV drone flying game with blocky art style, realistic Betaflight Actual Rates physics, and multiplayer support. Fly through a vibrant city of colorful buildings, glass skyscrapers, and obstacles using your real radio controller.

[**Play Now (Single Player)**](https://aristidesai.github.io/FPV.Sim/)

## Features

### Flight Physics
- **Betaflight Actual Rates**: Authentic rate calculations with Center Sensitivity, Max Rate, and Expo
- **6DOF Physics**: Realistic thrust, gravity, and drag simulation
- **Acro Mode**: Full manual control - pitch forward to go forward, just like a real quad

### Blocky World
- **Vibrant Colors**: Primary color palette inspired by Slow Roads
- **Glass Skyscrapers**: Tall towers with reflective glass floors
- **Fly-Through Gaps**: Buildings with openings to thread through
- **Arches & Obstacles**: Various structures to navigate around and under
- **Boundary Walls**: Red transparent walls mark the map edges (crash on contact)

### Multiplayer (Server Required)
- **Real-time Multiplayer**: Fly with friends in the same world
- **NPC Drones**: 8 AI-controlled drones with different behaviors:
  - Freestyle: Tricks and aggressive maneuvers
  - Racing: Fast, smooth racing lines
  - Explorer: Slow, cinematic movements
  - Beginner: Hesitant, learning to fly
- **Random Names**: Auto-generated pilot names
- **Player Collision**: Crash into other players

### Controller Support
- **Universal Compatibility**: Works with any USB radio (Radiomaster, TBS, Jumper, etc.)
- **Custom Mapping**: Configure any axis for Roll/Pitch/Yaw/Throttle
- **Persistent Settings**: Saved to browser localStorage

## Quick Start

### Option 1: GitHub Pages (Single Player)

Just open the link - no installation required:

**[Play](https://aristidesai.github.io/FPV.Sim/)**

### Option 2: Local Server (Multiplayer)

```bash
# Clone the repository
git clone https://github.com/AristidesAI/Betaflight-Actual-Rates-Simulator-.git
cd Betaflight-Actual-Rates-Simulator-

# Install dependencies
npm install

# Start the server
npm start
```

Open `http://localhost:3000` in your browser. Share this URL on your local network for others to join!

## Deploying to GitHub Pages

GitHub Pages hosts static files only, so the multiplayer server won't work there. However, single-player mode works perfectly.

### Steps to Deploy:

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Update game"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** > **Pages** (in the left sidebar)
   - Under "Source", select **Deploy from a branch**
   - Choose **main** branch and **/ (root)** folder
   - Click **Save**

3. **Access your site**
   - Wait 1-2 minutes for deployment
   - Your game will be live at: `https://YOUR-USERNAME.github.io/Betaflight-Actual-Rates-Simulator-/`

### Custom Domain (Optional)
1. In **Settings > Pages**, enter your custom domain
2. Add a CNAME record pointing to `YOUR-USERNAME.github.io`
3. Check "Enforce HTTPS"

## Controls

| Input | Action |
|-------|--------|
| Right Stick (Horizontal) | Roll |
| Right Stick (Vertical) | Pitch |
| Left Stick (Horizontal) | Yaw |
| Left Stick (Vertical) | Throttle |
| **R** key | Reset position |
| **Space** | Start race mode |

## Controller Setup

1. Connect your radio via USB (set to USB Joystick/HID mode)
2. Click **Configure Controller** button
3. Move your sticks to see which axes respond
4. Assign each axis to the correct function
5. Use **Inv** checkbox if a direction is reversed
6. Click **Save & Close**

## Rate Tuning

Adjust in the sidebar:

| Setting | Description |
|---------|-------------|
| **Center Sensitivity** | Responsiveness around stick center (higher = twitchier) |
| **Max Rate** | Maximum rotation speed in °/sec at full deflection |
| **Expo** | Softens center while keeping max rate (higher = softer center) |

## Tech Stack

- **3D Engine**: [Three.js](https://threejs.org/) r128
- **Input**: HTML5 Gamepad API
- **Multiplayer**: WebSocket (ws library)
- **Server**: Node.js (for multiplayer only)
- **UI**: Vanilla CSS with dark mode support

## File Structure

```
├── index.html      # Complete game (single file)
├── server.js       # Multiplayer server
├── package.json    # Node.js dependencies
└── README.md       # This file
```

## License

This project uses Betaflight algorithms for rate modeling and Three.js for 3D rendering.

**Created by [AristidesAI](https://github.com/AristidesAI)** | [@aristides.fpv](https://www.instagram.com/aristides.fpv/)
