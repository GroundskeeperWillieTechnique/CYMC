import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Swords,
  Skull,
  Trophy,
  Shield,
  ShoppingCart,
  Settings,
  User,
  Gem,
  Coins,
  Clock,
  Zap,
  Flame,
  Bone,
  Crown,
  Boxes,
  BarChart3,
  CheckSquare,
  Home,
} from 'lucide-react';

const monsters = [
  { id: 1, name: 'BONERAGE CYMC', hp: 140, atk: 55, border: 'border-amber-500/80', color: 'from-stone-900 via-amber-950 to-black', icon: <Bone size={14} />, moves: ['Bone Smash', 'Skeletal Roar'], face: '☠' },
  { id: 2, name: 'FLAMEDRIP CYMC', hp: 150, atk: 70, border: 'border-orange-500/80', color: 'from-black via-red-950 to-orange-950', icon: <Flame size={14} />, moves: ['Melt Down', 'Fire Blast'], face: '🔥' },
  { id: 7, name: 'VOIDKING CYMC', hp: 190, atk: 88, border: 'border-purple-500/90', color: 'from-black via-purple-950 to-black', icon: <Gem size={14} />, moves: ['Void Crush', 'Dark Eclipse'], face: '◉' },
  { id: 4, name: 'CYBERCLAW CYMC', hp: 160, atk: 78, border: 'border-cyan-500/80', color: 'from-black via-cyan-950 to-slate-950', icon: <Zap size={14} />, moves: ['Electro Slash', 'System Overload'], face: '⚙' },
  { id: 6, name: 'GOLDGRILL BEAST', hp: 170, atk: 74, border: 'border-yellow-500/80', color: 'from-black via-yellow-950 to-black', icon: <Crown size={14} />, moves: ['Rich Bite', 'Diamond Flex'], face: '◍' },
];

const starterLog = [
  { turn: 'Turn 1', player: 'CYMCLEGEND', move: 'Void Crush', color: 'text-purple-400' },
  { turn: '', player: 'DARKHUNTER', move: 'Toxic Splash', color: 'text-lime-400' },
  { turn: 'Turn 2', player: 'CYMCLEGEND', move: 'Dark Eclipse', color: 'text-purple-400' },
  { turn: '', player: 'DARKHUNTER', move: 'Slime Shield', color: 'text-lime-400' },
];

const menu = [
  ['BATTLE', <Swords size={20} />], ['MY MONSTERS', <Skull size={20} />], ['COLLECTION', <Boxes size={20} />], ['MARKETPLACE', <Home size={20} />], ['LEADERBOARD', <BarChart3 size={20} />], ['MISSIONS', <CheckSquare size={20} />], ['SHOP', <ShoppingCart size={20} />], ['STAKING', <Shield size={20} />], ['PROFILE', <User size={20} />], ['SETTINGS', <Settings size={20} />],
];

function MenuItem({ icon, label, active }) {
  return <div className={`flex items-center gap-3 rounded-sm border px-4 py-3 text-sm font-black ${active ? 'border-purple-500 bg-purple-700/80 text-white' : 'border-white/10 bg-black/35 text-zinc-300'}`}>{icon}<span>{label}</span></div>;
}

export default function App() {
  const [selected, setSelected] = useState(7);
  const [turn, setTurn] = useState(3);
  const [energy, setEnergy] = useState(6);
  const [log, setLog] = useState(starterLog);
  const selectedMonster = useMemo(() => monsters.find((m) => m.id === selected), [selected]);

  const endTurn = () => {
    const enemyMoves = ['Acid Roar', 'Toxic Splash', 'Slime Shield', 'Corrode'];
    setTurn((t) => Math.min(t + 1, 50));
    setEnergy((e) => Math.min(e + 1, 10));
    setLog((prev) => [{ turn: `Turn ${turn}`, player: 'CYMCLEGEND', move: `${selectedMonster?.moves[0] ?? 'Void Crush'}`, color: 'text-purple-400' }, { turn: '', player: 'DARKHUNTER', move: enemyMoves[Math.floor(Math.random() * enemyMoves.length)], color: 'text-lime-400' }, ...prev].slice(0, 10));
  };

  return (
    <div className="min-h-screen overflow-hidden bg-black font-sans text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,.35),transparent_30%),radial-gradient(circle_at_70%_40%,rgba(249,115,22,.24),transparent_30%),linear-gradient(180deg,#050008,#050505)]" />
      <aside className="absolute left-4 top-4 z-30 w-56 space-y-3">
        <div><h1 className="text-5xl font-black text-yellow-400">CYMC</h1><div className="text-2xl font-black italic">BATTLE ARENA</div></div>
        <nav className="space-y-2 rounded-xl border border-white/10 bg-black/65 p-3">{menu.map(([label, icon]) => <MenuItem key={label} label={label} icon={icon} active={label === 'BATTLE'} />)}</nav>
      </aside>
      <main className="relative z-10 ml-60 min-h-screen pr-72">
        <div className="absolute left-0 right-0 top-4 text-center"><div className="text-4xl font-black italic text-purple-400">RANKED BATTLE</div><div className="text-2xl font-black">SEASON 1</div></div>
        <div className="absolute right-5 top-4 z-40 flex gap-3 text-xl font-black"><div className="flex items-center gap-2 rounded-lg border border-purple-500/50 bg-black/70 px-4 py-2"><Gem className="text-purple-400"/>2,450</div><div className="flex items-center gap-2 rounded-lg border border-yellow-500/50 bg-black/70 px-4 py-2"><Coins className="text-yellow-400"/>18.6K</div></div>

        <section className="relative flex min-h-screen items-center justify-center pt-20">
          <div className="relative z-10 flex items-center gap-20">
            <Card side="left" title="7. VOIDKING CYMC" hp="190" accent="purple" emoji="👁️" />
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.8 }} className="text-8xl font-black italic text-purple-300">VS</motion.div>
            <Card side="right" title="3. TOXICSLIME CYMC" hp="160" accent="lime" emoji="🧪" />
          </div>
        </section>

        <section className="absolute bottom-5 left-5 right-5 z-30">
          <div className="mx-auto mb-3 flex w-fit items-center gap-4 rounded-lg border border-purple-500/50 bg-black/80 px-5 py-2 text-xl font-black"><Zap className="text-purple-400"/><span>{Math.floor(turn / 2)} / 10</span><div className="flex gap-1">{Array.from({ length: 10 }).map((_, i) => <Gem key={i} size={18} className={i < energy ? 'text-purple-400' : 'text-zinc-700'} />)}</div><button onClick={endTurn} className="ml-4 rounded border border-purple-500 bg-purple-800/60 px-4 py-1">END TURN</button></div>
          <div className="flex items-end justify-center gap-3">{monsters.map((m) => <button key={m.id} onClick={() => setSelected(m.id)} className={`h-56 w-44 rounded-lg border-2 ${m.border} bg-gradient-to-br ${m.color} p-3 text-left ${selected === m.id ? 'ring-4 ring-purple-400' : ''}`}><div className="flex justify-between font-black text-yellow-300 text-xs"><span>{m.id}. {m.name}</span><span>{m.hp}</span></div><div className="mt-4 grid h-24 place-items-center rounded-full bg-black/30 text-6xl">{m.face}</div><div className="mt-2 space-y-1">{m.moves.map((move) => <div key={move} className="flex items-center gap-2 rounded bg-black/60 px-2 py-1 text-[10px] font-black uppercase">{m.icon}{move}</div>)}</div></button>)}</div>
        </section>
      </main>

      <aside className="absolute right-4 top-20 z-30 w-64 space-y-4">
        <div className="rounded-xl border border-white/10 bg-black/75 p-5"><h3 className="mb-4 text-center text-xl font-black italic text-purple-400">BATTLE INFO</h3><div className="space-y-4 text-sm font-bold"><div><div className="text-zinc-500">MODE</div><div>RANKED 1v1</div></div><div><div className="text-yellow-400">TIME LEFT</div><div className="flex items-center gap-2 text-3xl"><Clock className="text-yellow-400"/>18</div></div><div><div className="text-zinc-500">TURN</div><div className="text-3xl">{turn} / 50</div></div></div></div>
        <div className="rounded-xl border border-white/10 bg-black/75 p-5"><h3 className="mb-4 text-center text-xl font-black italic text-purple-400">BATTLE LOG</h3><div className="space-y-4">{log.map((l, i) => <div key={i} className="border-b border-white/10 pb-3 text-xs">{l.turn && <div className="mb-1 font-black text-zinc-300">{l.turn}</div>}<div className={`font-black ${l.color}`}>{l.player}</div><div className="text-zinc-300">played</div><div className="font-black text-white">{l.move}</div></div>)}</div></div>
      </aside>
    </div>
  );
}

function Card({ title, hp, accent, emoji }) {
  const colors = accent === 'purple' ? 'border-purple-500 shadow-purple-600/60 from-purple-700/30 to-purple-950/40 text-purple-200' : 'border-lime-500 shadow-lime-500/50 from-lime-700/30 to-green-950/40 text-lime-300';
  return <div className={`relative w-[28rem] overflow-hidden rounded-xl border-2 bg-black/80 p-4 shadow-2xl ${colors}`}><div className={`absolute inset-0 bg-gradient-to-br ${colors}`} /><div className="relative z-10 flex justify-between"><div className="text-3xl font-black">{title}</div><div className="text-2xl font-black">HP {hp}</div></div><div className="relative z-10 mt-8 grid h-72 place-items-center text-8xl">{emoji}</div><div className="relative z-10 mt-4 flex justify-center gap-2">{[1,2,3,4,5].map((i)=> <div key={i} className="grid h-8 w-8 place-items-center rounded-full border border-current">◉</div>)}</div></div>;
}
