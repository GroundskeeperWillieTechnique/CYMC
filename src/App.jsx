import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Inline icon system so the game runs even when external icon CDN imports fail.
function GameIcon({ glyph, size = 20, className = "" }) {
  return (
    <span
      className={cx("inline-grid place-items-center leading-none", className)}
      style={{ width: size, height: size, fontSize: Math.max(12, size * 0.82) }}
    >
      {glyph}
    </span>
  );
}

const Swords = (p) => <GameIcon glyph="⚔" {...p} />;
const Skull = (p) => <GameIcon glyph="☠" {...p} />;
const Trophy = (p) => <GameIcon glyph="🏆" {...p} />;
const Shield = (p) => <GameIcon glyph="🛡" {...p} />;
const ShoppingCart = (p) => <GameIcon glyph="🛒" {...p} />;
const Settings = (p) => <GameIcon glyph="⚙" {...p} />;
const User = (p) => <GameIcon glyph="👤" {...p} />;
const Gem = (p) => <GameIcon glyph="◆" {...p} />;
const Coins = (p) => <GameIcon glyph="◎" {...p} />;
const Clock = (p) => <GameIcon glyph="◷" {...p} />;
const Zap = (p) => <GameIcon glyph="ϟ" {...p} />;
const Flame = (p) => <GameIcon glyph="🔥" {...p} />;
const Bone = (p) => <GameIcon glyph="☠" {...p} />;
const Crown = (p) => <GameIcon glyph="♛" {...p} />;
const Boxes = (p) => <GameIcon glyph="▣" {...p} />;
const BarChart3 = (p) => <GameIcon glyph="▥" {...p} />;
const CheckSquare = (p) => <GameIcon glyph="☑" {...p} />;
const Home = (p) => <GameIcon glyph="⌂" {...p} />;
const Sparkles = (p) => <GameIcon glyph="✦" {...p} />;
const Lock = (p) => <GameIcon glyph="🔒" {...p} />;
const Star = (p) => <GameIcon glyph="★" {...p} />;
const BadgeDollarSign = (p) => <GameIcon glyph="$" {...p} />;
const RefreshCw = (p) => <GameIcon glyph="↻" {...p} />;

const STARTING_HAND = [1, 2, 7, 4, 6];

const ELEMENTS = {
  bone: { label: "BONE", icon: Bone, main: "amber", beat: "void", weak: "slime" },
  fire: { label: "FIRE", icon: Flame, main: "orange", beat: "bone", weak: "cyber" },
  void: { label: "VOID", icon: Gem, main: "purple", beat: "cyber", weak: "bone" },
  cyber: { label: "CYBER", icon: Zap, main: "cyan", beat: "slime", weak: "void" },
  gold: { label: "GOLD", icon: Crown, main: "yellow", beat: "fire", weak: "bone" },
  slime: { label: "SLIME", icon: Sparkles, main: "lime", beat: "gold", weak: "cyber" },
};

const ALL_MONSTERS = [
  {
    id: 1,
    name: "BONERAGE CYMC",
    short: "BONERAGE",
    rarity: "Rare",
    hp: 140,
    maxHp: 140,
    atk: 55,
    armor: 3,
    type: "bone",
    cost: 1,
    color: "from-stone-950 via-amber-950 to-black",
    glow: "shadow-amber-500/40",
    border: "border-amber-500/80",
    face: "💀",
    edition: "Genesis #001",
    holder: "0xCYMC...B0NE",
    moves: [
      { name: "Bone Smash", power: 22, cost: 1, text: "Fast strike. +6 if target has shield." },
      { name: "Skeletal Roar", power: 10, cost: 2, shield: 16, text: "Damage and gain shield." },
    ],
  },
  {
    id: 2,
    name: "FLAMEDRIP CYMC",
    short: "FLAMEDRIP",
    rarity: "Epic",
    hp: 150,
    maxHp: 150,
    atk: 70,
    armor: 1,
    type: "fire",
    cost: 2,
    color: "from-black via-red-950 to-orange-950",
    glow: "shadow-orange-500/50",
    border: "border-orange-500/80",
    face: "👹",
    edition: "Genesis #002",
    holder: "0xCYMC...F1RE",
    moves: [
      { name: "Melt Down", power: 26, cost: 2, burn: 8, text: "Burns enemy next turn." },
      { name: "Fire Blast", power: 38, cost: 3, text: "Heavy burst damage." },
    ],
  },
  {
    id: 7,
    name: "VOIDKING CYMC",
    short: "VOIDKING",
    rarity: "Legendary",
    hp: 190,
    maxHp: 190,
    atk: 88,
    armor: 2,
    type: "void",
    cost: 7,
    color: "from-black via-purple-950 to-black",
    glow: "shadow-purple-500/70",
    border: "border-purple-500/90",
    face: "👁️",
    edition: "Abyss #007",
    holder: "0xCYMC...VOID",
    moves: [
      { name: "Void Crush", power: 34, cost: 3, text: "Signature attack." },
      { name: "Dark Eclipse", power: 24, cost: 4, leech: 14, text: "Steal HP after damage." },
    ],
  },
  {
    id: 4,
    name: "CYBERCLAW CYMC",
    short: "CYBERCLAW",
    rarity: "Epic",
    hp: 160,
    maxHp: 160,
    atk: 78,
    armor: 2,
    type: "cyber",
    cost: 4,
    color: "from-black via-cyan-950 to-slate-950",
    glow: "shadow-cyan-500/50",
    border: "border-cyan-500/80",
    face: "🤖",
    edition: "Neon #004",
    holder: "0xCYMC...CYBR",
    moves: [
      { name: "Electro Slash", power: 28, cost: 2, text: "Clean damage." },
      { name: "System Overload", power: 20, cost: 3, stun: true, text: "25% chance enemy loses energy." },
    ],
  },
  {
    id: 6,
    name: "GOLDGRILL BEAST",
    short: "GOLDGRILL",
    rarity: "Mythic",
    hp: 170,
    maxHp: 170,
    atk: 74,
    armor: 4,
    type: "gold",
    cost: 6,
    color: "from-black via-yellow-950 to-black",
    glow: "shadow-yellow-500/50",
    border: "border-yellow-500/80",
    face: "👑",
    edition: "Flex #006",
    holder: "0xCYMC...GOLD",
    moves: [
      { name: "Rich Bite", power: 25, cost: 2, coins: 40, text: "Earn arena coins." },
      { name: "Diamond Flex", power: 17, cost: 3, shield: 25, text: "Big shield, small damage." },
    ],
  },
  {
    id: 3,
    name: "TOXICSLIME CYMC",
    short: "TOXICSLIME",
    rarity: "Legendary",
    hp: 160,
    maxHp: 160,
    atk: 76,
    armor: 1,
    type: "slime",
    cost: 3,
    color: "from-black via-lime-950 to-green-950",
    glow: "shadow-lime-500/50",
    border: "border-lime-500/80",
    face: "🧪",
    edition: "Mutant #003",
    holder: "0xDARK...SLME",
    moves: [
      { name: "Toxic Splash", power: 24, cost: 2, poison: 8, text: "Poisons enemy." },
      { name: "Slime Shield", power: 10, cost: 2, shield: 22, text: "Defend and chip." },
    ],
  },
  {
    id: 8,
    name: "CRYPTOROT CYMC",
    short: "CRYPTOROT",
    rarity: "Rare",
    hp: 145,
    maxHp: 145,
    atk: 62,
    armor: 2,
    type: "slime",
    cost: 2,
    color: "from-black via-emerald-950 to-zinc-950",
    glow: "shadow-emerald-500/40",
    border: "border-emerald-500/80",
    face: "🦠",
    edition: "Rot #008",
    holder: "0xDARK...R0T",
    moves: [
      { name: "Rot Bite", power: 21, cost: 1, poison: 5, text: "Cheap poison bite." },
      { name: "Grave Mist", power: 18, cost: 3, shield: 18, text: "Mist defence." },
    ],
  },
];

const MARKET = [
  { id: "m1", name: "VOIDKING CYMC", price: "2.8 SOL", floor: "+14%", rarity: "Legendary", img: "◉" },
  { id: "m2", name: "GOLDGRILL BEAST", price: "1.9 SOL", floor: "+9%", rarity: "Mythic", img: "◍" },
  { id: "m3", name: "TOXICSLIME CYMC", price: "1.3 SOL", floor: "+21%", rarity: "Legendary", img: "☣" },
  { id: "m4", name: "CYBERCLAW CYMC", price: "0.72 SOL", floor: "-3%", rarity: "Epic", img: "⚙" },
];

const MISSIONS = [
  ["Win 3 ranked battles", "2/3", 250],
  ["Deal 500 void damage", "380/500", 150],
  ["Open 1 Genesis pack", "0/1", 1],
  ["Stake a CYMC holder NFT", "1/1", 400],
];

const NAV = [
  ["BATTLE", Swords],
  ["MY MONSTERS", Skull],
  ["COLLECTION", Boxes],
  ["MARKETPLACE", Home],
  ["LEADERBOARD", BarChart3],
  ["MISSIONS", CheckSquare],
  ["SHOP", ShoppingCart],
  ["STAKING", Shield],
  ["PROFILE", User],
  ["SETTINGS", Settings],
];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function elementBonus(attacker, defender) {
  const el = ELEMENTS[attacker.type];
  if (el.beat === defender.type) return 1.25;
  if (el.weak === defender.type) return 0.82;
  return 1;
}

function useSound() {
  const ctx = useRef(null);
  return (kind = "tap") => {
    try {
      ctx.current ||= new (window.AudioContext || window.webkitAudioContext)();
      const audio = ctx.current;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.connect(gain);
      gain.connect(audio.destination);
      const freq = kind === "hit" ? 80 : kind === "coin" ? 680 : kind === "win" ? 440 : 220;
      osc.frequency.setValueAtTime(freq, audio.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, audio.currentTime + 0.08);
      gain.gain.setValueAtTime(0.045, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.14);
      osc.start();
      osc.stop(audio.currentTime + 0.15);
    } catch {}
  };
}

function Logo() { return <div className="mb-5 select-none"><div className="relative inline-block"><h1 className="text-5xl font-black tracking-tighter text-yellow-400 drop-shadow-[0_4px_0_rgba(0,0,0,1)]">CYMC</h1><div className="absolute -bottom-1 left-2 h-2 w-28 rounded-full bg-orange-500/60 blur-md" /></div><div className="-mt-1 text-2xl font-black italic text-white drop-shadow-lg">BATTLE ARENA</div></div>; }
function MenuItem({ icon: Icon, label, active, onClick }) { return <motion.button whileHover={{ x: 5, scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={onClick} className={cx("flex w-full items-center gap-3 rounded-sm border px-3 py-2 text-left text-sm font-black tracking-wide transition", active ? "border-purple-500 bg-purple-700/80 text-white shadow-lg shadow-purple-700/40" : "border-white/10 bg-black/35 text-zinc-300 hover:border-purple-500/70 hover:text-white")}><Icon size={21} /><span>{label}</span></motion.button>; }
function PlayerPanel({ side = "left", name, elo, rank, trophy, avatar, shield }) { const left = side === "left"; return <div className={cx("absolute top-10 z-20 w-[23rem]", left ? "left-[16.5rem]" : "right-[16.5rem]")}><div className={cx("relative overflow-hidden rounded-xl border bg-black/65 p-4 shadow-2xl backdrop-blur-md", left ? "border-purple-500/50" : "border-red-500/50")}><div className={cx("absolute inset-0 opacity-20", left ? "bg-purple-700" : "bg-red-700")} /><div className="absolute -top-3 right-4 rounded border border-purple-500 bg-black px-3 py-1 text-xs font-black text-purple-300">CYMC HOLDER</div><div className="relative flex items-center gap-4"><div className={cx("grid h-20 w-20 place-items-center rounded-full border-4 bg-black text-3xl font-black shadow-xl", left ? "border-purple-500 shadow-purple-600/50 text-yellow-300" : "border-red-600 shadow-red-600/50 text-red-100")}>{avatar}</div><div><div className="flex items-center gap-2 text-xl font-black text-zinc-100">{name}<Shield className="text-purple-400" size={18}/></div><div className="mt-1 text-sm font-bold text-zinc-400">ELO {elo.toLocaleString()} <span className="ml-4">RANK #{rank}</span></div><div className="mt-2 flex items-center gap-2 text-yellow-400"><Trophy size={18}/><span className="text-xl font-black">{trophy.toLocaleString()}</span>{shield > 0 && <span className="ml-2 rounded bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-200">SHIELD {shield}</span>}</div></div></div></div></div>; }
function HealthBar({ hp, maxHp, tone = "purple" }) { const pct = clamp((hp / maxHp) * 100, 0, 100); return <div className="mt-2 h-3 overflow-hidden rounded-full border border-white/15 bg-black/70"><motion.div animate={{ width: `${pct}%` }} className={cx("h-full rounded-full", tone === "lime" ? "bg-lime-400" : tone === "orange" ? "bg-orange-400" : "bg-purple-500")} /></div>; }
function CreatureSvg({ monster, size = "big" }) { const big = size === "big"; const tone = ELEMENTS[monster.type].main; const colors = { purple: ["#c084fc", "#581c87", "#1b062e"], lime: ["#a3e635", "#365314", "#071302"], orange: ["#fb923c", "#7c2d12", "#160501"], amber: ["#facc15", "#713f12", "#120904"], cyan: ["#22d3ee", "#164e63", "#021016"], yellow: ["#fde047", "#854d0e", "#120904"], }[tone]; const [bright, mid, dark] = colors; const isVoid = monster.type === "void"; const isSlime = monster.type === "slime"; const isFire = monster.type === "fire"; const isBone = monster.type === "bone"; const isCyber = monster.type === "cyber"; const isGold = monster.type === "gold"; return <svg viewBox="0 0 260 260" className={cx(big ? "h-64 w-64" : "h-28 w-28", "drop-shadow-[0_0_22px_currentColor]")} style={{ color: bright }}><defs><radialGradient id={`body-${monster.id}`} cx="50%" cy="35%" r="70%"><stop offset="0%" stopColor={bright} stopOpacity=".95" /><stop offset="45%" stopColor={mid} stopOpacity=".95" /><stop offset="100%" stopColor={dark} stopOpacity="1" /></radialGradient><filter id={`glow-${monster.id}`}><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><ellipse cx="130" cy="224" rx="74" ry="12" fill={bright} opacity=".28" />{isVoid && <><path d="M72 65 C35 20 39 98 84 105" fill="none" stroke={bright} strokeWidth="10" strokeLinecap="round"/><path d="M188 65 C225 20 221 98 176 105" fill="none" stroke={bright} strokeWidth="10" strokeLinecap="round"/></>}{isFire && <><path d="M84 82 C73 45 106 26 111 58 C125 25 159 39 151 75 C178 52 199 91 171 112 Z" fill={bright} opacity=".8"/></>}{isGold && <path d="M87 68 L105 36 L130 64 L154 36 L173 68 L164 91 L96 91 Z" fill={bright} stroke="#fff7ad" strokeWidth="3"/>}<path d="M68 139 C58 89 91 62 130 62 C169 62 202 89 192 139 C211 157 202 210 163 214 C149 225 111 225 97 214 C58 210 49 157 68 139 Z" fill={`url(#body-${monster.id})`} stroke={bright} strokeWidth="5" filter={`url(#glow-${monster.id})`} /><circle cx="100" cy="124" r="20" fill="#08030d" stroke={bright} strokeWidth="5"/><circle cx="160" cy="124" r="20" fill="#08030d" stroke={bright} strokeWidth="5"/>{isVoid ? <><circle cx="130" cy="132" r="36" fill="#090012" stroke={bright} strokeWidth="6"/><circle cx="130" cy="132" r="18" fill="#f5f3ff"/><circle cx="130" cy="132" r="9" fill="#111"/></> : <><circle cx="104" cy="124" r="7" fill="#fff"/><circle cx="156" cy="124" r="7" fill="#fff"/></>}<path d="M92 162 C112 182 148 182 168 162" fill="#050505" stroke={bright} strokeWidth="4" />{[102,118,134,150,162].map((x)=><path key={x} d={`M${x} 164 l6 18 l7 -18`} fill="#fff" opacity=".95"/>)}{isSlime && <><circle cx="68" cy="104" r="11" fill={bright}/><circle cx="199" cy="143" r="8" fill={bright}/><path d="M77 190 C49 203 44 225 73 229" fill="none" stroke={bright} strokeWidth="9" strokeLinecap="round"/></>}{isBone && <><path d="M57 93 L35 68 M203 93 L225 68" stroke="#f5f5dc" strokeWidth="9" strokeLinecap="round"/><circle cx="34" cy="66" r="8" fill="#f5f5dc"/><circle cx="226" cy="66" r="8" fill="#f5f5dc"/></>}{isCyber && <><circle cx="130" cy="63" r="12" fill={bright}/><path d="M130 50 V25 M75 139 H39 M185 139 H221" stroke={bright} strokeWidth="7" strokeLinecap="round"/></>}<path d="M83 214 C72 229 45 225 48 207 C59 198 74 201 83 214 Z" fill="#111" stroke={bright} strokeWidth="4"/><path d="M177 214 C188 229 215 225 212 207 C201 198 186 201 177 214 Z" fill="#111" stroke={bright} strokeWidth="4"/></svg>; }
function MonsterArt({ monster, active, size = "big" }) { const isBig = size === "big"; const tone = ELEMENTS[monster.type].main; const ring = { purple: "from-purple-950 to-black shadow-purple-500/60 border-purple-400/50 text-purple-300", lime: "from-lime-950 to-black shadow-lime-500/50 border-lime-400/50 text-lime-300", orange: "from-orange-950 to-black shadow-orange-500/50 border-orange-400/50 text-orange-300", amber: "from-amber-950 to-black shadow-amber-500/50 border-amber-400/50 text-amber-300", cyan: "from-cyan-950 to-black shadow-cyan-500/50 border-cyan-400/50 text-cyan-300", yellow: "from-yellow-950 to-black shadow-yellow-500/50 border-yellow-400/50 text-yellow-300", }[tone]; return <motion.div animate={{ y: active ? [0, -7, 0] : [0, -3, 0], scale: active ? [1, 1.025, 1] : [1, 1.01, 1] }} transition={{ repeat: Infinity, duration: active ? 2.4 : 3.3 }} className={cx("relative grid place-items-center rounded-full bg-gradient-to-br shadow-2xl", ring, isBig ? "h-64 w-64" : "h-28 w-28")}><div className={cx("absolute rounded-full border", ring, isBig ? "inset-8" : "inset-4")} /><div className="absolute -inset-8 rounded-full border border-white/10 blur-sm" /><CreatureSvg monster={monster} size={size} />{isBig && <div className={cx("absolute bottom-7 text-4xl", ring)}>▴▴▴</div>}</motion.div>; }
function BigMonsterCard({ monster, side, shield, status, lastHit }) { const tone = ELEMENTS[monster.type].main; const isEnemy = side === "enemy"; return <motion.div key={monster.id} initial={{ scale: 0.92, opacity: 0, x: isEnemy ? 40 : -40 }} animate={{ scale: 1, opacity: 1, x: lastHit ? [0, isEnemy ? 16 : -16, 0] : 0 }} transition={{ duration: 0.55 }} className={cx("relative w-[23rem] overflow-hidden rounded-xl border-2 bg-black/80 p-3 shadow-2xl", monster.border, monster.glow)}><div className={cx("absolute inset-0 bg-gradient-to-br opacity-80", monster.color)} /><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,.16),transparent_36%)]" /><div className="relative z-10 flex items-start justify-between"><div className="flex gap-2 text-4xl font-black text-white"><span>{monster.id}.</span><span className="mt-2 text-lg italic">{monster.name}</span></div><div className={cx("text-2xl font-black", tone === "lime" ? "text-lime-300" : tone === "orange" ? "text-orange-300" : tone === "cyan" ? "text-cyan-300" : tone === "yellow" ? "text-yellow-300" : tone === "amber" ? "text-amber-300" : "text-purple-200")}>HP {monster.hp}</div></div><div className="relative z-10 mt-2"><HealthBar hp={monster.hp} maxHp={monster.maxHp} tone={tone} /><div className="mt-2 flex gap-2 text-xs font-black uppercase"><span className="rounded bg-black/60 px-2 py-1 text-zinc-300">{monster.rarity}</span><span className="rounded bg-black/60 px-2 py-1 text-zinc-300">{ELEMENTS[monster.type].label}</span>{shield > 0 && <span className="rounded bg-cyan-500/20 px-2 py-1 text-cyan-200">Shield {shield}</span>}{status.poison > 0 && <span className="rounded bg-lime-500/20 px-2 py-1 text-lime-200">Poison</span>}{status.burn > 0 && <span className="rounded bg-orange-500/20 px-2 py-1 text-orange-200">Burn</span>}</div></div><div className="relative z-10 mt-3 grid h-64 place-items-center"><MonsterArt monster={monster} active /><div className={cx("absolute bottom-0 h-8 w-80 rounded-full blur-xl", tone === "lime" ? "bg-lime-500/60" : tone === "orange" ? "bg-orange-500/60" : tone === "cyan" ? "bg-cyan-500/60" : tone === "yellow" ? "bg-yellow-500/60" : tone === "amber" ? "bg-amber-500/60" : "bg-purple-500/60")} /></div><div className="relative z-10 mt-5 flex justify-center gap-3">{[1,2,3,4,5].map((i)=><div key={i} className={cx("grid h-9 w-9 place-items-center rounded-full border bg-black/70", tone === "lime" ? "border-lime-400 text-lime-300" : tone === "orange" ? "border-orange-400 text-orange-300" : tone === "cyan" ? "border-cyan-400 text-cyan-300" : tone === "yellow" ? "border-yellow-400 text-yellow-300" : tone === "amber" ? "border-amber-400 text-amber-300" : "border-purple-400 text-purple-300")}>{i % 2 ? "◉" : "✕"}</div>)}</div></motion.div>; }
function SmallCard({ m, selected, onClick, locked }) { const Icon = ELEMENTS[m.type].icon; return <motion.button whileHover={{ y: locked ? 0 : -10, scale: locked ? 1 : 1.03 }} whileTap={{ scale: locked ? 1 : 0.98 }} onClick={locked ? undefined : onClick} className={cx("relative h-60 w-44 overflow-hidden rounded-xl border-2 bg-gradient-to-br p-3 text-left shadow-2xl", m.border, m.color, m.glow, selected ? "ring-4 ring-purple-400" : "", locked && "grayscale opacity-50")}>{locked && <div className="absolute inset-0 z-20 grid place-items-center bg-black/50"><Lock size={34}/></div>}<div className="flex items-center justify-between text-yellow-300"><span className="font-black">{m.id}. <span className="text-xs text-white">{m.name}</span></span><span className="font-black">{m.hp}</span></div><div className="mt-2 text-[10px] font-black text-zinc-300">{m.edition}</div><div className="mt-2 grid h-28 place-items-center rounded-2xl bg-black/30 shadow-inner"><MonsterArt monster={m} active={false} size="small" /></div><div className="mt-3 space-y-1">{m.moves.map((move) => <div key={move.name} className="flex items-center gap-2 rounded bg-black/55 px-2 py-1 text-[10px] font-black uppercase text-zinc-100"><Icon size={13}/>{move.name}</div>)}</div></motion.button>; }
function MoveButton({ move, disabled, onClick }) { return <motion.button whileHover={disabled ? {} : { scale: 1.03, y: -2 }} whileTap={disabled ? {} : { scale: 0.98 }} disabled={disabled} onClick={onClick} className={cx("rounded-lg border px-4 py-3 text-left transition", disabled ? "border-white/10 bg-zinc-900/70 text-zinc-600" : "border-purple-400/70 bg-purple-800/60 text-white shadow-lg shadow-purple-600/30 hover:bg-purple-700")}><div className="flex items-center justify-between gap-5 text-sm font-black"><span>{move.name}</span><span className="text-yellow-300">{move.cost} ⚡</span></div><div className="mt-1 text-[11px] font-bold text-zinc-300">{move.text}</div></motion.button>; }
function Sidebar({ screen, setScreen, stats }) { return <aside className="absolute left-4 top-4 z-30 w-52"><Logo /><nav className="space-y-2 rounded-xl border border-white/10 bg-black/65 p-3 backdrop-blur-md">{NAV.map(([label, Icon]) => <MenuItem key={label} active={screen === label} icon={Icon} label={label} onClick={() => setScreen(label)} />)}</nav><div className="mt-3 rounded-xl border border-white/10 bg-black/70 p-3"><h3 className="mb-2 text-sm font-black text-purple-400">YOUR STATS</h3>{[["WINS",stats.wins],["LOSSES",stats.losses],["RANK",`#${stats.rank}`],["ELO",stats.elo.toLocaleString()]].map(([a,b]) => <div key={a} className="flex justify-between border-b border-white/10 py-1 text-xs font-bold text-zinc-300"><span>{a}</span><span>{b}</span></div>)}<div className="mt-4 rounded-lg border border-yellow-500/70 p-3 text-center"><div className="text-2xl font-black italic text-purple-400">SEASON 1</div><div className="text-xs font-black text-purple-200">ENDS IN: 12D 14H 32M</div></div></div></aside>; }
function TopBar({ gems, coins }) { return <><div className="absolute left-0 right-0 top-4 z-20 flex items-center justify-center"><div className="text-center"><div className="text-4xl font-black italic text-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,.8)]">RANKED BATTLE</div><div className="text-2xl font-black">SEASON 1</div></div></div><div className="absolute right-5 top-4 z-40 flex gap-3"><div className="flex items-center gap-3 rounded-lg border border-purple-500/50 bg-black/70 px-5 py-2 text-xl font-black"><Gem className="text-purple-400"/>{gems.toLocaleString()}</div><div className="flex items-center gap-3 rounded-lg border border-yellow-500/50 bg-black/70 px-5 py-2 text-xl font-black"><Coins className="text-yellow-400"/>{coins >= 1000 ? `${(coins/1000).toFixed(1)}K` : coins}</div><div className="rounded-lg border border-white/15 bg-black/70 px-5 py-2 text-xl font-black text-zinc-300">0xCYMC...7BeA</div></div></>; }
function RightPanel({ timeLeft, turn, maxTurns, log, onSurrender, selectedMonster, energy, onMove, playerTurn }) { return <aside className="absolute right-4 top-20 z-30 w-64 space-y-4"><div className="rounded-xl border border-white/10 bg-black/75 p-5 backdrop-blur-md"><h3 className="mb-4 text-center text-xl font-black italic text-purple-400">BATTLE INFO</h3><div className="space-y-4 text-sm font-bold"><div><div className="text-zinc-500">MODE</div><div>RANKED 1v1</div></div><div><div className="text-yellow-400">TIME LEFT</div><div className="flex items-center gap-2 text-3xl"><Clock className="text-yellow-400"/>{timeLeft}</div></div><div><div className="text-zinc-500">TURN</div><div className="text-3xl">{turn} / {maxTurns}</div></div><button onClick={onSurrender} className="w-full rounded-lg border border-purple-500 bg-purple-700/60 py-3 text-lg font-black hover:bg-purple-600">SURRENDER</button></div></div><div className="rounded-xl border border-white/10 bg-black/75 p-4 backdrop-blur-md"><h3 className="mb-3 text-center text-xl font-black italic text-purple-400">MOVES</h3><div className="space-y-2">{selectedMonster.moves.map((move) => <MoveButton key={move.name} move={move} disabled={!playerTurn || energy < move.cost} onClick={() => onMove(move)} />)}</div></div><div className="rounded-xl border border-white/10 bg-black/75 p-5 backdrop-blur-md"><h3 className="mb-4 text-center text-xl font-black italic text-purple-400">BATTLE LOG</h3><div className="max-h-60 space-y-3 overflow-auto pr-1">{log.map((l, i)=><div key={i} className="border-b border-white/10 pb-3 text-xs">{l.turn && <div className="mb-1 font-black text-zinc-300">{l.turn}</div>}<div className={cx("font-black", l.color)}>{l.player}</div><div className="text-zinc-300">{l.action}</div><div className="font-black text-white">{l.move}</div></div>)}</div></div></aside>; }
function ArenaFloor() { return <><div className="absolute bottom-64 left-1/2 h-[24rem] w-[55rem] -translate-x-1/2 rounded-full border border-purple-500/30 bg-purple-500/10 blur-3xl" /><div className="absolute bottom-60 left-1/2 h-3 w-[64rem] -translate-x-1/2 rounded-full bg-white/20 blur-xl" /><div className="absolute bottom-52 left-1/2 h-[20rem] w-[72rem] -translate-x-1/2 rounded-[50%] border-2 border-purple-400/30" /><div className="absolute bottom-36 left-1/2 h-[31rem] w-[82rem] -translate-x-1/2 rounded-[50%] border border-orange-500/20" /><div className="absolute left-1/2 top-32 -translate-x-1/2 text-center text-5xl font-black text-white/20">CYMC<br/>ARENA</div></>; }
function BattleScreen({ game, actions }) { const { player, enemy, selected, energy, maxEnergy } = game; const selectedMonster = player.team.find((m) => m.id === selected) || player.team[0]; const playerTurn = game.phase === "player" && !game.winner; return <main className="relative z-10 ml-56 h-[864px] pr-72 overflow-hidden"><TopBar gems={game.wallet.gems} coins={game.wallet.coins} /><PlayerPanel side="left" name="CYMCLEGEND" elo={game.stats.elo} rank={game.stats.rank} trophy={game.stats.elo} avatar="CYMC" shield={player.shield} /><PlayerPanel side="right" name="DARKHUNTER" elo={1689} rank={532} trophy={1689} avatar="☠" shield={enemy.shield} /><section className="relative flex h-[864px] items-center justify-center pb-[250px] pt-20"><ArenaFloor /><div className="relative z-10 -mt-8 flex items-center gap-10"><BigMonsterCard monster={selectedMonster} side="player" shield={player.shield} status={player.status} lastHit={game.lastHit === "player"} /><motion.div animate={{ scale: [1,1.16,1], rotate: [-2,2,-2] }} transition={{ repeat: Infinity, duration: 1.8 }} className="text-8xl font-black italic text-purple-300 drop-shadow-[0_0_25px_rgba(168,85,247,1)]">VS</motion.div><BigMonsterCard monster={enemy.active} side="enemy" shield={enemy.shield} status={enemy.status} lastHit={game.lastHit === "enemy"} /></div><AnimatePresence>{game.floatText && <motion.div initial={{ opacity: 0, y: 20, scale: 0.7 }} animate={{ opacity: 1, y: -70, scale: 1.2 }} exit={{ opacity: 0 }} className="absolute left-1/2 top-[45%] z-50 -translate-x-1/2 rounded-xl border border-purple-400 bg-black/80 px-8 py-4 text-4xl font-black text-white shadow-2xl shadow-purple-600/60">{game.floatText}</motion.div>}</AnimatePresence></section><section className="absolute bottom-[78px] left-0 right-0 z-30"><div className="mx-auto mb-2 flex w-fit items-center gap-4 rounded-lg border border-purple-500/50 bg-black/85 px-5 py-2 text-xl font-black shadow-xl shadow-purple-500/30"><Zap className="text-purple-400" /> <span>{energy} / {maxEnergy}</span><div className="flex gap-1">{Array.from({ length: 10 }).map((_, i)=><Gem key={i} size={20} className={i < energy ? "text-purple-400" : "text-zinc-700"}/>)}</div></div><div className="relative mx-auto flex max-w-[1050px] items-end justify-center gap-3 px-2"><div className="absolute -bottom-1 left-0 text-center"><div className="mb-2 rounded bg-black/80 px-5 py-2 text-sm font-black">DECK</div><div className="grid h-36 w-24 place-items-center rounded-lg border border-white/30 bg-black text-4xl">☠</div><div className="text-xl font-black">22</div></div><div className="flex items-end justify-center gap-3 px-28">{player.team.map((m) => <SmallCard key={m.id} m={m} selected={selected === m.id} onClick={() => actions.selectMonster(m.id)} />)}</div><div className="absolute -bottom-1 right-0 text-center"><div className="mb-2 rounded bg-black/80 px-5 py-2 text-sm font-black">DISCARD</div><div className="grid h-36 w-24 place-items-center rounded-lg border border-white/30 bg-black text-4xl">☠</div><div className="text-xl font-black">8</div></div></div><div className="absolute -top-2 right-[7.8rem] flex gap-3"><button disabled={!playerTurn} onClick={actions.endTurn} className="rounded-lg border border-purple-500 bg-purple-800/80 px-12 py-3 font-black shadow-xl shadow-purple-700/40 hover:bg-purple-700 disabled:opacity-40">END TURN</button><button onClick={actions.newMatch} className="rounded-lg border border-white/20 bg-black/80 px-8 py-3 font-black hover:border-purple-400"><RefreshCw className="mr-2 inline" size={16}/>NEW MATCH</button></div></section><RightPanel timeLeft={game.timeLeft} turn={game.turn} maxTurns={50} log={game.log} onSurrender={actions.surrender} selectedMonster={selectedMonster} energy={energy} onMove={actions.useMove} playerTurn={playerTurn} />{game.winner && <ResultModal winner={game.winner} onClose={actions.newMatch} rewards={game.rewards} />}</main>; }
function ResultModal({ winner, onClose, rewards }) { const won = winner === "player"; return <div className="absolute inset-0 z-[100] grid place-items-center bg-black/70 backdrop-blur-sm"><motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-[34rem] rounded-2xl border border-purple-500/70 bg-black p-7 text-center shadow-2xl shadow-purple-700/50"><div className="text-5xl font-black italic text-purple-300">{won ? "VICTORY" : "DEFEAT"}</div><div className="mt-2 text-zinc-300">{won ? "Your CYMC NFT squad climbed the ranked ladder." : "Darkhunter took the arena. Upgrade and run it back."}</div><div className="mt-6 grid grid-cols-3 gap-3"><div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4"><Coins className="mx-auto text-yellow-400"/><div className="mt-2 font-black">+{rewards.coins}</div></div><div className="rounded-xl border border-purple-500/40 bg-purple-500/10 p-4"><Gem className="mx-auto text-purple-400"/><div className="mt-2 font-black">+{rewards.gems}</div></div><div className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-4"><Trophy className="mx-auto text-cyan-300"/><div className="mt-2 font-black">{won ? "+18" : "-12"} ELO</div></div></div><button onClick={onClose} className="mt-6 rounded-lg border border-purple-400 bg-purple-700 px-10 py-3 font-black hover:bg-purple-600">CREATE NEXT MATCH</button></motion.div></div>; }
function Panel({ title, children }) { return <div className="rounded-2xl border border-white/10 bg-black/72 p-6 shadow-2xl shadow-purple-900/20 backdrop-blur-md"><h2 className="mb-5 text-3xl font-black italic text-purple-300">{title}</h2>{children}</div>; }
function OtherScreens({ screen, game, actions }) { return <main className="relative z-10 ml-60 min-h-screen pr-6 pt-24"><TopBar gems={game.wallet.gems} coins={game.wallet.coins} /><div className="mx-auto max-w-6xl space-y-6">{screen === "MY MONSTERS" && <Panel title="MY MONSTERS"><div className="grid grid-cols-5 gap-4">{ALL_MONSTERS.map((m, idx) => <SmallCard key={m.id} m={m} selected={idx < 5 && game.player.team.some(x=>x.id===m.id)} locked={idx >= 5} onClick={() => actions.selectMonster(m.id)} />)}</div></Panel>}{screen === "COLLECTION" && <Panel title="NFT COLLECTION"><div className="grid grid-cols-4 gap-4">{ALL_MONSTERS.map((m) => <div key={m.id} className="rounded-xl border border-white/10 bg-white/5 p-4"><div className="flex items-center justify-between"><span className="font-black">{m.edition}</span><span className="text-xs text-purple-300">{m.rarity}</span></div><div className="my-4 grid place-items-center text-7xl">{m.face}</div><div className="font-black">{m.name}</div><div className="mt-1 text-xs text-zinc-400">Holder: {m.holder}</div><div className="mt-3 flex justify-between text-sm"><span>HP {m.maxHp}</span><span>ATK {m.atk}</span></div></div>)}</div></Panel>}{screen === "MARKETPLACE" && <Panel title="MARKETPLACE"><div className="grid grid-cols-4 gap-4">{MARKET.map(item => <div key={item.id} className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-5"><div className="grid h-32 place-items-center rounded-xl bg-black/50 text-7xl">{item.img}</div><div className="mt-4 font-black">{item.name}</div><div className="text-xs text-zinc-400">{item.rarity}</div><div className="mt-4 flex items-center justify-between"><span className="text-xl font-black text-yellow-300">{item.price}</span><span className="text-lime-300">{item.floor}</span></div><button className="mt-4 w-full rounded-lg border border-purple-400 bg-purple-700/70 py-2 font-black">BUY NFT</button></div>)}</div></Panel>}{screen === "LEADERBOARD" && <Panel title="LEADERBOARD"><div className="overflow-hidden rounded-xl border border-white/10"><table className="w-full text-left"><thead className="bg-purple-900/40 text-purple-200"><tr><th className="p-3">Rank</th><th>Player</th><th>ELO</th><th>Wins</th><th>Holder</th></tr></thead><tbody>{["VOIDWHALE","CYMCLEGEND","DARKHUNTER","SLIMEKING","BONEBOSS","DRIPMASTER"].map((p,i)=><tr key={p} className="border-t border-white/10 bg-black/30"><td className="p-3 font-black">#{i+1}</td><td className="font-black">{p}</td><td>{2050-i*104}</td><td>{220-i*17}</td><td className="text-purple-300">Verified</td></tr>)}</tbody></table></div></Panel>}{screen === "MISSIONS" && <Panel title="MISSIONS"><div className="grid grid-cols-2 gap-4">{MISSIONS.map(([name, prog, reward]) => <div key={name} className="rounded-xl border border-white/10 bg-white/5 p-5"><div className="flex items-center justify-between"><div className="font-black">{name}</div><Star className="text-yellow-300"/></div><div className="mt-3 h-3 rounded-full bg-black"><div className="h-3 rounded-full bg-purple-500" style={{width: prog.includes("/") ? `${Number(prog.split('/')[0]) / Number(prog.split('/')[1]) * 100}%` : '100%'}} /></div><div className="mt-2 flex justify-between text-sm text-zinc-300"><span>{prog}</span><span>{reward} reward</span></div></div>)}</div></Panel>}{screen === "SHOP" && <Panel title="SHOP"><div className="grid grid-cols-3 gap-4">{[["Genesis Pack","5 NFT cards",450,"🎁"],["Arena Gems","2,500 gems",999,"💎"],["Battle Pass","Season 1 premium",1200,"🏆"],["Void Skin","Animated void aura",750,"🟣"],["Gold Skin","Golden flex aura",800,"🟡"],["Name Tag","Custom arena title",300,"🏷️"]].map(([a,b,c,d])=><div key={a} className="rounded-xl border border-white/10 bg-white/5 p-5"><div className="grid h-24 place-items-center text-6xl">{d}</div><div className="font-black">{a}</div><div className="text-sm text-zinc-400">{b}</div><button className="mt-4 w-full rounded-lg border border-yellow-500/50 bg-yellow-500/20 py-2 font-black text-yellow-200">{c} coins</button></div>)}</div></Panel>}{screen === "STAKING" && <Panel title="STAKING"><div className="grid grid-cols-2 gap-5"><div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-6"><Shield className="text-purple-300" size={42}/><div className="mt-4 text-2xl font-black">CYMC Holder Pool</div><p className="mt-2 text-zinc-300">Stake arena NFTs to earn gems, season XP, and whitelist tickets.</p><button className="mt-5 rounded-lg bg-purple-700 px-8 py-3 font-black">STAKE NFT</button></div><div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-6"><BadgeDollarSign className="text-yellow-300" size={42}/><div className="mt-4 text-2xl font-black">Estimated APY</div><div className="mt-3 text-5xl font-black text-yellow-300">38%</div><p className="mt-2 text-zinc-300">Boosted by ranked wins and holder badges.</p></div></div></Panel>}{(screen === "PROFILE" || screen === "SETTINGS") && <Panel title={screen}><div className="grid grid-cols-2 gap-4"><div className="rounded-xl border border-white/10 bg-white/5 p-5"><User size={36}/><div className="mt-3 text-xl font-black">CYMCLEGEND</div><div className="text-zinc-400">0xCYMC...7BeA</div></div><div className="rounded-xl border border-white/10 bg-white/5 p-5"><Settings size={36}/><div className="mt-3 text-xl font-black">Game Settings</div><div className="mt-3 space-y-2 text-sm text-zinc-300"><div>Sound FX: ON</div><div>Ranked Mode: ON</div><div>Animations: MAX</div></div></div></div></Panel>}</div></main>; }
function Footer({ setScreen }) { return <footer className="absolute bottom-0 left-0 right-0 z-20 flex h-14 items-center justify-between border-t border-white/10 bg-black/85 px-8 backdrop-blur-md"><div className="flex items-center gap-5"><span className="text-3xl font-black text-yellow-400">CYMC</span><span className="font-black italic text-zinc-400">THE FIGHT. THE FLEX. THE FUTURE.</span></div><div className="flex gap-12 font-black text-zinc-400"><button onClick={()=>setScreen("MISSIONS")}>EVENTS</button><button onClick={()=>setScreen("LEADERBOARD")}>TOURNAMENTS</button><button onClick={()=>setScreen("PROFILE")}>CLANS</button></div><button onClick={()=>setScreen("BATTLE")} className="rounded-lg border border-purple-500 bg-purple-800/60 px-10 py-3 font-black text-purple-100 shadow-xl shadow-purple-700/40 hover:bg-purple-700">CREATE MATCH</button></footer>; }
function initialGame() { const team = STARTING_HAND.map((id) => ({ ...ALL_MONSTERS.find((m) => m.id === id) })); const enemyActive = { ...ALL_MONSTERS.find((m) => m.id === 3) }; return { screen: "BATTLE", phase: "player", selected: 7, energy: 3, maxEnergy: 10, turn: 3, timeLeft: 18, lastHit: null, floatText: null, winner: null, rewards: { coins: 0, gems: 0 }, wallet: { gems: 2450, coins: 18600 }, stats: { wins: 128, losses: 34, rank: 247, elo: 1842 }, player: { shield: 0, status: { poison: 0, burn: 0 }, team }, enemy: { shield: 0, status: { poison: 0, burn: 0 }, active: enemyActive }, log: [{ turn: "Turn 1", player: "CYMCLEGEND", action: "played", move: "Void Crush", color: "text-purple-400" }, { turn: "", player: "DARKHUNTER", action: "played", move: "Toxic Splash", color: "text-lime-400" }, { turn: "Turn 2", player: "CYMCLEGEND", action: "played", move: "Dark Eclipse", color: "text-purple-400" }, { turn: "", player: "DARKHUNTER", action: "played", move: "Slime Shield", color: "text-lime-400" }, { turn: "Turn 3", player: "CYMCLEGEND", action: "is", move: "thinking...", color: "text-purple-400" }], }; }
function applyDamage(targetHp, shield, amount) { const blocked = Math.min(shield, amount); return { hp: Math.max(0, targetHp - (amount - blocked)), shield: Math.max(0, shield - blocked), dealt: amount - blocked, blocked }; }
export default function CYMCBattleArena() { const [game, setGame] = useState(initialGame); const playSound = useSound(); useEffect(() => { if (game.screen !== "BATTLE" || game.winner) return; const t = setInterval(() => { setGame((g) => ({ ...g, timeLeft: g.timeLeft <= 0 ? 18 : g.timeLeft - 1 })); }, 1000); return () => clearInterval(t); }, [game.screen, game.winner]); const finishIfDead = (g) => { const selectedMonster = g.player.team.find((m) => m.id === g.selected) || g.player.team[0]; if (g.enemy.active.hp <= 0) { playSound("win"); return { ...g, winner: "player", rewards: { coins: 320, gems: 25 }, wallet: { gems: g.wallet.gems + 25, coins: g.wallet.coins + 320 }, stats: { ...g.stats, wins: g.stats.wins + 1, elo: g.stats.elo + 18 }, floatText: "VICTORY +320 COINS", }; } if (selectedMonster.hp <= 0) { return { ...g, winner: "enemy", rewards: { coins: 40, gems: 0 }, wallet: { ...g.wallet, coins: g.wallet.coins + 40 }, stats: { ...g.stats, losses: g.stats.losses + 1, elo: Math.max(0, g.stats.elo - 12) }, floatText: "DEFEAT", }; } return g; }; const enemyTurn = () => { setTimeout(() => { setGame((g) => { if (g.winner || g.screen !== "BATTLE") return g; const enemy = g.enemy.active; const move = enemy.moves[Math.floor(Math.random() * enemy.moves.length)]; const playerTeam = [...g.player.team]; const idx = playerTeam.findIndex((m) => m.id === g.selected); const target = { ...playerTeam[idx] }; const base = move.power + Math.floor(enemy.atk * 0.12); const mult = elementBonus(enemy, target); const total = Math.round(base * mult + Math.random() * 8); const res = applyDamage(target.hp, g.player.shield, total); target.hp = res.hp; playerTeam[idx] = target; const status = { ...g.player.status }; if (move.poison) status.poison = move.poison; if (move.burn) status.burn = move.burn; const next = { ...g, phase: "player", turn: g.turn + 1, timeLeft: 18, energy: clamp(g.energy + 3, 0, g.maxEnergy), lastHit: "player", floatText: `-${res.dealt}${res.blocked ? ` / ${res.blocked} BLOCK` : ""}`, player: { ...g.player, team: playerTeam, shield: res.shield, status }, enemy: { ...g.enemy, shield: Math.max(0, g.enemy.shield + (move.shield || 0)) }, log: [{ turn: `Turn ${g.turn}`, player: "DARKHUNTER", action: "played", move: move.name, color: "text-lime-400" }, ...g.log].slice(0, 20), }; playSound("hit"); return finishIfDead(next); }); setTimeout(() => setGame((g) => ({ ...g, lastHit: null, floatText: null })), 900); }, 850); }; const actions = useMemo(() => ({ setScreen: (screen) => setGame((g) => ({ ...g, screen })), selectMonster: (id) => { playSound("tap"); setGame((g) => ({ ...g, selected: id, screen: g.screen === "BATTLE" ? g.screen : g.screen })); }, useMove: (move) => { setGame((g) => { if (g.phase !== "player" || g.energy < move.cost || g.winner) return g; const playerTeam = [...g.player.team]; const idx = playerTeam.findIndex((m) => m.id === g.selected); const attacker = { ...playerTeam[idx] }; const enemy = { ...g.enemy.active }; const base = move.power + Math.floor(attacker.atk * 0.14); const mult = elementBonus(attacker, enemy); const crit = Math.random() < 0.16 ? 1.5 : 1; const total = Math.round(base * mult * crit + Math.random() * 8); const res = applyDamage(enemy.hp, g.enemy.shield, total); enemy.hp = res.hp; if (move.leech) attacker.hp = Math.min(attacker.maxHp, attacker.hp + move.leech); playerTeam[idx] = attacker; const eStatus = { ...g.enemy.status }; if (move.poison) eStatus.poison = move.poison; if (move.burn) eStatus.burn = move.burn; const next = { ...g, phase: "enemy", energy: g.energy - move.cost, lastHit: "enemy", floatText: `${crit > 1 ? "CRIT " : ""}-${res.dealt}${res.blocked ? ` / ${res.blocked} BLOCK` : ""}`, player: { ...g.player, team: playerTeam, shield: g.player.shield + (move.shield || 0) }, enemy: { ...g.enemy, active: enemy, shield: res.shield, status: eStatus }, wallet: { ...g.wallet, coins: g.wallet.coins + (move.coins || 0) }, log: [{ turn: `Turn ${g.turn}`, player: "CYMCLEGEND", action: "played", move: move.name, color: "text-purple-400" }, ...g.log].slice(0, 20), }; playSound(move.coins ? "coin" : "hit"); const checked = finishIfDead(next); if (!checked.winner) enemyTurn(checked); return checked; }); setTimeout(() => setGame((g) => ({ ...g, lastHit: null, floatText: null })), 900); }, endTurn: () => { setGame((g) => { if (g.phase !== "player" || g.winner) return g; const next = { ...g, phase: "enemy", log: [{ turn: `Turn ${g.turn}`, player: "CYMCLEGEND", action: "ended", move: "Turn", color: "text-purple-400" }, ...g.log].slice(0,20) }; enemyTurn(next); return next; }); }, surrender: () => setGame((g) => ({ ...g, winner: "enemy", rewards: { coins: 0, gems: 0 }, floatText: "SURRENDERED" })), newMatch: () => setGame((g) => ({ ...initialGame(), wallet: g.wallet, stats: g.stats, screen: "BATTLE" })), }), []);

  return <div className="h-screen w-screen overflow-hidden bg-black font-sans text-white"><div className="relative origin-top-left" style={{ width: 1536, height: 864, transform: "scale(min(calc(100vw / 1536), calc(100vh / 864)))" }}><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,.35),transparent_30%),radial-gradient(circle_at_70%_40%,rgba(249,115,22,.24),transparent_30%),linear-gradient(180deg,#050008,#050505)]" /><div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)", backgroundSize: "44px 44px" }} /><div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_50%_10%,rgba(168,85,247,.45),transparent_42%)]" /><Sidebar screen={game.screen} setScreen={actions.setScreen} stats={game.stats} />{game.screen === "BATTLE" ? <BattleScreen game={game} actions={actions} /> : <OtherScreens screen={game.screen} game={game} actions={actions} />}<Footer setScreen={actions.setScreen} /></div></div>;
}
