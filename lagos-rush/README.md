# Lagos Rush — Day 1

React + TypeScript + Vite + Three.js + React Three Fiber free-run prototype.

## Run

```sh
npm install
npm run dev
```

`npm run build` checks TypeScript and creates the production bundle. `npm run preview` serves that bundle.

## Controls

Start with the on-screen button. Arrow keys or A/D switch between three bounded lanes. Up, W or Space jumps; Down or S slides. P/Escape pauses. Swipe in four directions on the scene, or use the mobile buttons. Losing window focus pauses the run. Reset returns to the beginning.

## Architecture

- `src/App.tsx`: shared run ref, keyboard/pointer input and UI. Distance UI updates at 10 Hz.
- `src/Game.tsx`: canvas, frame-based movement, damped player/camera and eight recycled road segments. Simulation freezes on pause and caps frame delta after stalls.
- `src/style.css`: responsive HUD and start/pause screens.

Three lanes are centered at -3, 0 and 3. The world moves at 15 m/s while the player stays near the camera. Road segments recycle over a 192 m loop. Scenery uses procedural geometry: yellow danfos, roadside stalls, warm buildings, trees and streetlights. No downloaded models are required. Fonts have system fallbacks.

This is a Day 1 movement sandbox: no collisions, obstacles, coins, failure state or saved scores yet. Jump and slide are visual actions ready for future gameplay. Requires a WebGL-capable browser.
