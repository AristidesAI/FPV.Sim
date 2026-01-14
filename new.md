lets make several changes to the game:

The drone control and movement system will stay the same

- Remove the trees, grass, train & tracks.
- add a defined boundary with red see transparent plane on each edge of the ground plane map area. when the player flies through they should automatically crash and restart

- **Blocky art style** - Vibrant primary colors like Slow Roads
- **buildings & gaps to fly through** - Various sizes and shapes

add more things to fly through and under and around and up and down, blocky terrain to fly under. Make another class of building called the skyscraper, Which has hundreds of glass floors that reflect the sun/moons light. 

add multiplayer functionality so online players can join and fly around the game world, when they join they will be given a randomized name that they can change in the game configuration. 

Allow players to crash into one another. Make sure the game world stays the same so players can join and leave as they please. Once the map is built dont change it. 

Add NPC rudementary AI players that fly around with human like behaviour.

This document outlines the implementation plan for adding mass multiplayer functionality to the FPV Drone Simulator, including a single massive server and NPC drones that simulate human-like flying behavior.






## Architecture

### Server Infrastructure

```
┌─────────────────────────────────────────────────────────────┐
│                    GAME SERVER (Node.js)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ WebSocket   │  │ Game State  │  │ NPC AI Controller   │  │
│  │ Manager     │  │ Manager     │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Player      │  │ World Sync  │  │ Physics Validator   │  │
│  │ Manager     │  │ Service     │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                    WebSocket (wss://)
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
┌───────┐              ┌───────┐              ┌───────┐
│Client │              │Client │              │Client │
│  1    │              │  2    │              │  N    │
└───────┘              └───────┘              └───────┘
```


## NPC Drone System

### Behavior Types

#### 1. Freestyle NPCs
- Perform tricks: flips, rolls, powerloops
- Aggressive rates, high throttle bursts
- Random trick sequences

#### 2. Racing NPCs
- Follow optimal racing lines
- Seek gates and fly-through gaps
- Consistent high speed
- Smooth, efficient movements

#### 3. Explorer NPCs
- Wander the world procedurally
- Slow, cinematic movements
- Respond to environment (avoid obstacles)
- Hover and observe

#### 4. Beginner NPCs
- Simulate new player behavior
- Occasional crashes and recovery
- Hesitant movements
- Low camera angles

### AI State Machine

```
┌──────────────┐
│   IDLE       │ ───────────────────────┐
└──────────────┘                        │
       │                                │
       ▼                                │
┌──────────────┐     ┌──────────────┐   │
│  SEEK_TARGET │ ──▶ │  APPROACH    │   │
└──────────────┘     └──────────────┘   │
                            │           │
                            ▼           │
                     ┌──────────────┐   │
                     │ EXECUTE_MOVE │   │
                     └──────────────┘   │
                            │           │
                            ▼           │
                     ┌──────────────┐   │
                     │  RECOVER     │ ──┘
                     └──────────────┘
```