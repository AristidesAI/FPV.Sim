// FPV Drone Simulator - Multiplayer Server
// Run with: node server.js

const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Game state
const players = new Map();
const npcs = [];
let nextPlayerId = 1;

// Random name generator
const adjectives = ['Swift', 'Crazy', 'Flying', 'Turbo', 'Nitro', 'Phantom', 'Ghost', 'Shadow', 'Thunder', 'Lightning', 'Blazing', 'Sonic', 'Hyper', 'Mega', 'Ultra'];
const nouns = ['Pilot', 'Ace', 'Hawk', 'Eagle', 'Falcon', 'Drone', 'Racer', 'Flyer', 'Wing', 'Jet', 'Storm', 'Blade', 'Arrow', 'Comet', 'Star'];

function generateRandomName() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 99) + 1;
    return `${adj}${noun}${num}`;
}

// NPC AI behaviors
const NPC_BEHAVIORS = {
    FREESTYLE: 'freestyle',
    RACING: 'racing',
    EXPLORER: 'explorer',
    BEGINNER: 'beginner'
};

// Create NPC drones
function createNPC(behavior) {
    const npc = {
        id: `npc_${npcs.length + 1}`,
        name: `[BOT] ${generateRandomName()}`,
        behavior: behavior,
        position: {
            x: (Math.random() - 0.5) * 200,
            y: 10 + Math.random() * 30,
            z: (Math.random() - 0.5) * 200
        },
        rotation: { x: 0, y: Math.random() * Math.PI * 2, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        state: 'idle',
        targetPoint: null,
        stateTimer: 0,
        crashed: false
    };
    npcs.push(npc);
    return npc;
}

// Update NPC AI
function updateNPC(npc, dt) {
    if (npc.crashed) {
        npc.stateTimer -= dt;
        if (npc.stateTimer <= 0) {
            // Respawn
            npc.position = {
                x: (Math.random() - 0.5) * 200,
                y: 10 + Math.random() * 30,
                z: (Math.random() - 0.5) * 200
            };
            npc.velocity = { x: 0, y: 0, z: 0 };
            npc.crashed = false;
        }
        return;
    }

    npc.stateTimer -= dt;

    switch (npc.behavior) {
        case NPC_BEHAVIORS.FREESTYLE:
            updateFreestyleNPC(npc, dt);
            break;
        case NPC_BEHAVIORS.RACING:
            updateRacingNPC(npc, dt);
            break;
        case NPC_BEHAVIORS.EXPLORER:
            updateExplorerNPC(npc, dt);
            break;
        case NPC_BEHAVIORS.BEGINNER:
            updateBeginnerNPC(npc, dt);
            break;
    }

    // Apply gravity and movement
    npc.velocity.y -= 9.81 * dt * 0.3;
    npc.position.x += npc.velocity.x * dt;
    npc.position.y += npc.velocity.y * dt;
    npc.position.z += npc.velocity.z * dt;

    // Ground collision
    if (npc.position.y < 1) {
        if (Math.abs(npc.velocity.y) > 5) {
            npc.crashed = true;
            npc.stateTimer = 3; // Respawn in 3 seconds
        } else {
            npc.position.y = 1;
            npc.velocity.y = 0;
        }
    }

    // Boundary check
    const bound = 180;
    if (Math.abs(npc.position.x) > bound || Math.abs(npc.position.z) > bound) {
        npc.crashed = true;
        npc.stateTimer = 3;
    }
}

function updateFreestyleNPC(npc, dt) {
    if (npc.stateTimer <= 0) {
        // Pick new random action
        const action = Math.random();
        if (action < 0.3) {
            // Climb
            npc.velocity.y = 15 + Math.random() * 10;
        } else if (action < 0.5) {
            // Dive
            npc.velocity.y = -5;
        }
        // Random horizontal movement
        npc.velocity.x = (Math.random() - 0.5) * 20;
        npc.velocity.z = (Math.random() - 0.5) * 20;
        npc.stateTimer = 1 + Math.random() * 2;
    }
}

function updateRacingNPC(npc, dt) {
    // Maintain consistent forward speed
    const speed = 25;
    if (!npc.targetPoint || npc.stateTimer <= 0) {
        npc.targetPoint = {
            x: (Math.random() - 0.5) * 150,
            y: 15 + Math.random() * 20,
            z: (Math.random() - 0.5) * 150
        };
        npc.stateTimer = 5;
    }

    // Move toward target
    const dx = npc.targetPoint.x - npc.position.x;
    const dy = npc.targetPoint.y - npc.position.y;
    const dz = npc.targetPoint.z - npc.position.z;
    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

    if (dist > 5) {
        npc.velocity.x = (dx / dist) * speed;
        npc.velocity.y = (dy / dist) * speed * 0.5;
        npc.velocity.z = (dz / dist) * speed;
    }
}

function updateExplorerNPC(npc, dt) {
    // Slow, cinematic movements
    if (npc.stateTimer <= 0) {
        npc.targetPoint = {
            x: (Math.random() - 0.5) * 180,
            y: 20 + Math.random() * 40,
            z: (Math.random() - 0.5) * 180
        };
        npc.stateTimer = 8 + Math.random() * 5;
    }

    const speed = 8;
    const dx = npc.targetPoint.x - npc.position.x;
    const dy = npc.targetPoint.y - npc.position.y;
    const dz = npc.targetPoint.z - npc.position.z;
    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

    if (dist > 3) {
        npc.velocity.x = (dx / dist) * speed;
        npc.velocity.y = (dy / dist) * speed * 0.3;
        npc.velocity.z = (dz / dist) * speed;
    } else {
        // Hover
        npc.velocity.x *= 0.9;
        npc.velocity.z *= 0.9;
        npc.velocity.y = Math.sin(Date.now() * 0.001) * 2;
    }
}

function updateBeginnerNPC(npc, dt) {
    // Hesitant, slow movements with occasional crashes
    if (npc.stateTimer <= 0) {
        const action = Math.random();
        if (action < 0.1) {
            // Occasional crash (simulate mistake)
            npc.velocity.y = -20;
        } else {
            npc.velocity.x = (Math.random() - 0.5) * 8;
            npc.velocity.z = (Math.random() - 0.5) * 8;
            npc.velocity.y = (Math.random() - 0.3) * 5;
        }
        npc.stateTimer = 2 + Math.random() * 3;
    }

    // Keep low altitude
    if (npc.position.y > 15) {
        npc.velocity.y -= 2 * dt;
    }
}

// Initialize NPCs
function initializeNPCs() {
    createNPC(NPC_BEHAVIORS.FREESTYLE);
    createNPC(NPC_BEHAVIORS.FREESTYLE);
    createNPC(NPC_BEHAVIORS.RACING);
    createNPC(NPC_BEHAVIORS.RACING);
    createNPC(NPC_BEHAVIORS.EXPLORER);
    createNPC(NPC_BEHAVIORS.EXPLORER);
    createNPC(NPC_BEHAVIORS.BEGINNER);
    createNPC(NPC_BEHAVIORS.BEGINNER);
}

// Create HTTP server for serving static files
const server = http.createServer((req, res) => {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);

    const extname = path.extname(filePath);
    const contentTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif'
    };

    const contentType = contentTypes[extname] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    const playerId = nextPlayerId++;
    const playerName = generateRandomName();

    const player = {
        id: playerId,
        name: playerName,
        position: { x: 0, y: 5, z: -120 },
        rotation: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        crashed: false
    };

    players.set(playerId, player);

    // Send welcome message with player info
    ws.send(JSON.stringify({
        type: 'welcome',
        playerId: playerId,
        playerName: playerName,
        players: Array.from(players.values()),
        npcs: npcs
    }));

    // Notify other players
    broadcast({
        type: 'playerJoined',
        player: player
    }, ws);

    console.log(`Player ${playerName} (${playerId}) connected. Total players: ${players.size}`);

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            switch (data.type) {
                case 'update':
                    // Update player state
                    const p = players.get(playerId);
                    if (p) {
                        p.position = data.position;
                        p.rotation = data.rotation;
                        p.velocity = data.velocity;
                        p.crashed = data.crashed;
                    }
                    break;

                case 'nameChange':
                    const player = players.get(playerId);
                    if (player) {
                        player.name = data.name;
                        broadcast({
                            type: 'nameChanged',
                            playerId: playerId,
                            name: data.name
                        });
                    }
                    break;

                case 'crash':
                    broadcast({
                        type: 'playerCrashed',
                        playerId: playerId
                    });
                    break;
            }
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    });

    ws.on('close', () => {
        players.delete(playerId);
        broadcast({
            type: 'playerLeft',
            playerId: playerId
        });
        console.log(`Player ${playerName} (${playerId}) disconnected. Total players: ${players.size}`);
    });
});

function broadcast(message, exclude = null) {
    const msg = JSON.stringify(message);
    wss.clients.forEach((client) => {
        if (client !== exclude && client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    });
}

// Game loop for NPCs and state broadcasting
let lastTime = Date.now();
setInterval(() => {
    const now = Date.now();
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    // Update NPCs
    npcs.forEach(npc => updateNPC(npc, dt));

    // Broadcast game state
    broadcast({
        type: 'gameState',
        players: Array.from(players.values()),
        npcs: npcs
    });
}, 50); // 20 updates per second

// Initialize and start server
initializeNPCs();

server.listen(PORT, () => {
    console.log(`
========================================
  FPV Drone Simulator - Multiplayer Server
========================================
  Server running at http://localhost:${PORT}

  Open this URL in your browser to play!
  Share with friends to play together.

  ${npcs.length} NPC drones active
========================================
`);
});
