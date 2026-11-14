import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Group, MathUtils } from 'three';

export type RunState = { lane: number; distance: number; elapsed: number; jumpAt: number; slideUntil: number; running: boolean };
const SPEED = 15;
const LENGTH = 24;
const COUNT = 8;

function Box({ position, size, color }: { position: [number, number, number]; size: [number, number, number]; color: string }) {
  return <mesh position={position} receiveShadow castShadow><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={0.85}/></mesh>;
}

function Danfo() {
  return <group><Box position={[0, 0.85, 0]} size={[1.8, 1.5, 3.8]} color="#f9bd25"/><Box position={[0, 1.2, -1.93]} size={[1.5, 0.6, 0.06]} color="#244b55"/><Box position={[0, 0.65, -1.95]} size={[1.8, 0.15, 0.06]} color="#252b29"/>{[-0.9, 0.9].flatMap(x => [-1.2, 1.2].map(z => <mesh key={`${x}:${z}`} position={[x, 0.35, z]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.35, 0.35, 0.18, 12]}/><meshStandardMaterial color="#202623"/></mesh>))}</group>;
}

function RoadChunk({ index, state }: { index: number; state: React.RefObject<RunState> }) {
  const group = useRef<Group>(null);
  useFrame(() => { if (group.current) group.current.position.z = -index * LENGTH + (state.current.distance % (LENGTH * COUNT)); if (group.current && group.current.position.z > LENGTH) group.current.position.z -= LENGTH * COUNT; });
  return <group ref={group}>
    <Box position={[0, -0.18, 0]} size={[9, 0.3, LENGTH]} color="#3b4445"/>
    {[-1.5, 1.5].flatMap(x => [-9, -3, 3, 9].map(z => <Box key={`${x}:${z}`} position={[x, -0.015, z]} size={[0.1, 0.025, 2.8]} color="#f6e5b9"/>))}
    {[-1, 1].map(side => <group key={side}>
      <Box position={[side * 5.15, -0.03, 0]} size={[1.3, 0.5, LENGTH]} color="#c6bba1"/>
      <Box position={[side * 9, 2.5 + index % 3, -5]} size={[4, 5 + index % 3 * 2, 7]} color={['#c88661', '#e3c58a', '#749e91'][index % 3]}/>
      {[1.5, 3.4].map(y => <Box key={y} position={[side * 6.98, y, -5]} size={[0.04, 0.8, 4.5]} color="#314e51"/>)}
      <Box position={[side * 6.5, 1.15, 5]} size={[2, 2.2, 2.8]} color="#bb654b"/>
      <Box position={[side * 6.5, 2.35, 5]} size={[2.8, 0.2, 3.4]} color={index % 2 ? '#efb832' : '#278d78'}/>
      <Box position={[side * 5.8, 2.6, -10]} size={[0.14, 5.2, 0.14]} color="#4e574c"/>
      <Box position={[side * 5.1, 5.15, -10]} size={[1.5, 0.12, 0.2]} color="#4e574c"/>
      <mesh position={[side * 12, 4, 7]} castShadow><sphereGeometry args={[2.6, 8, 6]}/><meshStandardMaterial color="#397564"/></mesh>
      <Box position={[side * 12, 1.4, 7]} size={[0.5, 4, 0.5]} color="#735d41"/>
    </group>)}
    {index % 2 === 0 && <group position={[7.2, 0.2, 0]}><Danfo/></group>}
  </group>;
}

function World({ state }: { state: React.RefObject<RunState> }) {
  const player = useRef<Group>(null);
  useFrame(({ camera }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const run = state.current;
    if (run.running) { run.distance += SPEED * delta; run.elapsed += delta; }
    const x = player.current ? MathUtils.damp(player.current.position.x, run.lane * 3, 12, delta) : 0;
    const age = run.elapsed - run.jumpAt;
    const jump = age >= 0 && age < 0.8 ? Math.sin(age / 0.8 * Math.PI) * 2.4 : 0;
    if (player.current) { player.current.position.set(x, jump, 3); player.current.scale.y = run.elapsed < run.slideUntil ? 0.5 : 1; player.current.rotation.z = run.running ? Math.sin(run.elapsed * 12) * 0.045 : 0; }
    camera.position.x = MathUtils.damp(camera.position.x, x * 0.35, 4, delta);
    camera.lookAt(x * 0.3, 1.4, -12);
  });
  return <>
    <color attach="background" args={['#d9b996']}/><fog attach="fog" args={['#d9b996', 35, 125]}/>
    <ambientLight intensity={1.5}/><directionalLight position={[-12, 22, 10]} intensity={2.5} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-25} shadow-camera-right={25} shadow-camera-top={25} shadow-camera-bottom={-25}/>
    <Box position={[0, -0.5, -65]} size={[160, 0.3, 260]} color="#ab9c73"/>
    {Array.from({ length: COUNT }, (_, i) => <RoadChunk key={i} index={i} state={state}/>)}
    <group ref={player} position={[0, 0, 3]}>
      <Box position={[0, 1.2, 0]} size={[0.8, 1.1, 0.5]} color="#198f83"/>
      <mesh position={[0, 2.05, 0]} castShadow><sphereGeometry args={[0.33, 16, 12]}/><meshStandardMaterial color="#714c34"/></mesh>
      {[-1, 1].map(side => <group key={side}><Box position={[side * 0.22, 0.35, 0]} size={[0.27, 0.7, 0.32]} color="#20333f"/><Box position={[side * 0.57, 1.15, 0]} size={[0.24, 0.9, 0.28]} color="#714c34"/><Box position={[side * 0.22, 0.1, -0.1]} size={[0.32, 0.18, 0.55]} color="#efe8cf"/></group>)}
      <Box position={[0, 1.25, 0.38]} size={[0.6, 0.75, 0.3]} color="#e9ad36"/>
    </group>
  </>;
}

export function Game({ state }: { state: React.RefObject<RunState> }) {
  return <Canvas shadows camera={{ position: [0, 5, 11], fov: 60 }} dpr={[1, 1.5]}><World state={state}/></Canvas>;
}
