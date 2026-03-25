'use strict';

// ════════════════════════════════════════════
//  STARFIELD
// ════════════════════════════════════════════
(function () {
    const sc = document.getElementById('stars');
    const sx = sc.getContext('2d');
    function resize() { sc.width = innerWidth; sc.height = innerHeight; }
    resize(); window.addEventListener('resize', resize);
    const stars = Array.from({ length: 130 }, () => ({
        x: Math.random() * innerWidth, y: Math.random() * innerHeight,
        r: Math.random() * 1.3 + 0.2, p: Math.random() * Math.PI * 2
    }));
    (function frame() {
        sx.clearRect(0, 0, sc.width, sc.height);
        for (const s of stars) {
            s.p += 0.012;
            sx.beginPath(); sx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            sx.fillStyle = `rgba(200,220,255,${0.08 + Math.abs(Math.sin(s.p)) * 0.38})`;
            sx.fill();
        }
        requestAnimationFrame(frame);
    })();
})();

// ════════════════════════════════════════════
//  SCREEN ROUTING
// ════════════════════════════════════════════
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const sc = document.getElementById(id);
    sc.classList.add('active');
    sc.scrollTop = 0;
    if (id === 'screen-levels') buildLevelGrid();
}

// ════════════════════════════════════════════
//  GAME CANVAS + SCALING
// ════════════════════════════════════════════
const canvas = document.getElementById('gc');
const ctx = canvas.getContext('2d');

const SZ = 26, COLS = 21, ROWS = 21;
const GAME_W = COLS * SZ;   // 546
const GAME_H = ROWS * SZ;   // 546
const HUD_H = 54;        // approximate hud height
canvas.width = GAME_W; canvas.height = GAME_H;

// Scale game to fit viewport without clipping
function scaleGame() {
    const scaler = document.getElementById('game-scaler');
    const hud = document.getElementById('hud');
    hud.style.width = GAME_W + 'px';
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const totalH = GAME_H + HUD_H + 8;
    const scale = Math.min(vw / GAME_W, vh / totalH, 1);
    scaler.style.transform = `scale(${scale})`;
    scaler.style.transformOrigin = 'top center';
    // Shift down so it's centred vertically
    const scaledH = totalH * scale;
    const topOffset = Math.max(0, (vh - scaledH) / 2);
    scaler.style.marginTop = topOffset + 'px';
}
window.addEventListener('resize', scaleGame);

// ════════════════════════════════════════════
//  LEVEL SELECT
// ════════════════════════════════════════════
const LEVEL_NAMES = [
    'SOLAR DAWN', 'CLOUDY DAY', 'STORM FRONT',
    'ACID RAIN', 'THUNDER', 'BLIZZARD',
    'TOXIC SKY', 'ECLIPSE', 'SOLAR STORM'
];
const BASE_SPD = 1.1, SPD_INC = 0.20;

function buildLevelGrid() {
    const g = document.getElementById('levels-grid');
    g.innerHTML = '';
    for (let i = 1; i <= 9; i++) {
        const spd = (BASE_SPD + (i - 1) * SPD_INC).toFixed(1);
        const d = document.createElement('div');
        d.className = 'lcard';
        d.innerHTML = `<span class="lnum">${String(i).padStart(2, '0')}</span>
         <span class="lname">${LEVEL_NAMES[i - 1]}</span>
         <span class="lspd">VEL ${spd}</span>`;
        d.onclick = () => goGame(i);
        g.appendChild(d);
    }
}

// ════════════════════════════════════════════
//  MAP
// ════════════════════════════════════════════
const MAP0 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 2, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
    [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
    [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 3, 2, 1, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 1, 2, 3, 1],
    [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// ════════════════════════════════════════════
//  GAME STATE
// ════════════════════════════════════════════
let map, score, lives, level, totalDots, eaten, player, enemies, pTimer, running, raf, tick;
let overlayAction = null;
const keys = {};

const wrapC = x => ((x % COLS) + COLS) % COLS;
const isWall = (c, r) => { if (r < 0 || r >= ROWS) return true; return MAP0[r][wrapC(c)] === 1; };
const D4 = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
const md = (ax, ay, bx, by) => Math.abs(ax - bx) + Math.abs(ay - by);

// Speed constants
const P_BASE = 2.2, P_BOOST = 0.08, P_MAX = 3.9, P_DECAY = 0.004, P_PWR_BONUS = 0.5;

// ── START GAME ─────────────────────────────
function goGame(startLv) {
    score = 0; lives = 3; level = startLv || 1;
    showScreen('screen-game');
    scaleGame();               // ← apply scale immediately
    running = false;             // stop any previous loop
    cancelAnimationFrame(raf);
    initLevel();               // build map, spawn entities
    running = true;              // ← NOW allow loop
    tick = 0;
    raf = requestAnimationFrame(loop); // ← start loop HERE
}

function initLevel() {
    map = MAP0.map(r => [...r]);
    totalDots = 0;
    for (const r of map) for (const v of r) if (v === 2 || v === 3) totalDots++;
    eaten = 0; pTimer = 0;
    spawnPlayer();
    spawnEnemies();
    updateHUD();
}

// ── PLAYER ─────────────────────────────────
function spawnPlayer() {
    player = {
        tx: 10, ty: 16,
        px: 10 * SZ + SZ / 2, py: 16 * SZ + SZ / 2,
        dx: 0, dy: 0, ndx: 1, ndy: 0,
        curSpd: P_BASE, powered: false,
        boosted: false, boostTick: 0
    };
}

// ── ENEMIES ────────────────────────────────
const ECFG = [
    { tx: 9, ty: 10, type: 'cloud', ai: 'chase', rel: 40 },
    { tx: 11, ty: 10, type: 'hail', ai: 'random', rel: 140 },
    { tx: 10, ty: 9, type: 'smoke', ai: 'ambush', rel: 240 },
    { tx: 10, ty: 11, type: 'lightning', ai: 'patrol', rel: 340 },
];

function spawnEnemies() {
    const spd = BASE_SPD + (level - 1) * SPD_INC;
    enemies = ECFG.map(c => ({
        tx: c.tx, ty: c.ty,
        px: c.tx * SZ + SZ / 2, py: c.ty * SZ + SZ / 2,
        dx: 0, dy: -1, type: c.type, ai: c.ai,
        speed: spd, rel: c.rel,
        inHouse: true, scared: false, dead: false,
        wobble: Math.random() * Math.PI * 2
    }));
}

// ── PLAYER STEP ────────────────────────────
function stepPlayer() {
    // speed decay
    if (player.curSpd > P_BASE) player.curSpd = Math.max(P_BASE, player.curSpd - P_DECAY);

    const actualSpd = Math.min(player.curSpd + (player.powered ? P_PWR_BONUS : 0), P_MAX + (player.powered ? P_PWR_BONUS : 0));

    // direction change
    if (!isWall(player.tx + player.ndx, player.ty + player.ndy)) {
        player.dx = player.ndx; player.dy = player.ndy;
    }

    const nb = wrapC(player.tx + player.dx), nr = player.ty + player.dy;
    if (!isWall(nb, nr)) {
        player.px += player.dx * actualSpd;
        player.py += player.dy * actualSpd;
        if (player.px < 0) player.px += COLS * SZ;
        if (player.px > COLS * SZ) player.px -= COLS * SZ;
    } else {
        player.px = player.tx * SZ + SZ / 2;
        player.py = player.ty * SZ + SZ / 2;
    }

    player.tx = wrapC(Math.floor(player.px / SZ));
    player.ty = Math.min(ROWS - 1, Math.max(0, Math.floor(player.py / SZ)));

    // collect
    const cell = map[player.ty][player.tx];
    if (cell === 2) {
        map[player.ty][player.tx] = 0; score += 10; eaten++;
        player.curSpd = Math.min(player.curSpd + P_BOOST, P_MAX);
        player.boosted = true; player.boostTick = 10;
    } else if (cell === 3) {
        map[player.ty][player.tx] = 0; score += 50; eaten++;
        pTimer = 420; player.powered = true;
        player.curSpd = Math.min(player.curSpd + P_BOOST * 4, P_MAX);
        enemies.forEach(e => { if (!e.inHouse && !e.dead) e.scared = true; });
    }

    if (player.boostTick > 0) { player.boostTick--; }
    else player.boosted = false;

    updateHUD();
}

// ── ENEMY STEP ─────────────────────────────
function stepEnemy(e) {
    if (e.dead) return;
    if (e.inHouse) {
        e.rel--;
        if (e.rel <= 0) {
            e.tx = 10; e.ty = 8; e.px = e.tx * SZ + SZ / 2; e.py = e.ty * SZ + SZ / 2;
            e.dx = -1; e.dy = 0; e.inHouse = false;
        }
        return;
    }
    const spd = e.scared ? e.speed * 0.42 : e.speed;
    e.px += e.dx * spd; e.py += e.dy * spd;
    if (e.px < 0) e.px += COLS * SZ;
    if (e.px > COLS * SZ) e.px -= COLS * SZ;
    const ntx = wrapC(Math.floor(e.px / SZ)), nty = Math.floor(e.py / SZ);
    if (ntx !== e.tx || nty !== e.ty) {
        e.tx = ntx; e.ty = Math.min(ROWS - 1, Math.max(0, nty));
        e.px = e.tx * SZ + SZ / 2; e.py = e.ty * SZ + SZ / 2;
        pickDir(e);
    }
}

function pickDir(e) {
    const px = player.tx, py = player.ty;
    const opts = D4.filter(d => {
        if (d.x === -e.dx && d.y === -e.dy) return false;
        return !isWall(wrapC(e.tx + d.x), e.ty + d.y);
    });
    if (!opts.length) { e.dx = -e.dx; e.dy = -e.dy; return; }
    if (e.scared) { const p = opts[Math.floor(Math.random() * opts.length)]; e.dx = p.x; e.dy = p.y; return; }
    let tgt;
    switch (e.ai) {
        case 'chase': tgt = { x: px, y: py }; break;
        case 'ambush': tgt = { x: px + player.dx * 4, y: py + player.dy * 4 }; break;
        case 'random': tgt = Math.random() < 0.65 ? { x: px, y: py } : { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; break;
        default: tgt = md(e.tx, e.ty, px, py) > 8 ? { x: px, y: py } : { x: 2, y: 19 }; break;
    }
    opts.sort((a, b) => md(wrapC(e.tx + a.x), e.ty + a.y, tgt.x, tgt.y) - md(wrapC(e.tx + b.x), e.ty + b.y, tgt.x, tgt.y));
    e.dx = opts[0].x; e.dy = opts[0].y;
}

// ── COLLISIONS ─────────────────────────────
function checkHits() {
    for (const e of enemies) {
        if (e.inHouse || e.dead) continue;
        if (Math.abs(player.px - e.px) < SZ * .65 && Math.abs(player.py - e.py) < SZ * .65) {
            if (e.scared) {
                e.dead = true; e.scared = false; score += 200;
                setTimeout(() => {
                    e.dead = false; e.inHouse = true; e.rel = 120;
                    e.tx = 10; e.ty = 10; e.px = e.tx * SZ + SZ / 2; e.py = e.ty * SZ + SZ / 2; e.dx = 0; e.dy = -1;
                }, 2000);
            } else { hitPlayer(); return; }
        }
    }
}

function hitPlayer() {
    lives--; player.curSpd = P_BASE; updateHUD();
    if (lives <= 0) {
        running = false;
        showGameOverlay('PAINEL DESTRUIDO!', `SCORE FINAL: ${score}`, 'TENTAR NOVAMENTE', () => goGame(level));
    } else {
        spawnPlayer(); spawnEnemies();
    }
}

function checkWin() {
    if (eaten >= totalDots) {
        running = false;
        const nl = level + 1;
        showGameOverlay(
            `FASE ${level} COMPLETA!`,
            `INIMIGOS MAIS RAPIDOS\nINICIANDO FASE ${nl}`,
            'PROXIMA FASE',
            () => { level = nl; initLevel(); running = true; tick = 0; raf = requestAnimationFrame(loop); }
        );
    }
}

function tickPower() {
    if (pTimer > 0) { pTimer--; if (pTimer === 0) { player.powered = false; enemies.forEach(e => e.scared = false); } }
}

// ── HUD ────────────────────────────────────
function updateHUD() {
    document.getElementById('sval').textContent = score;
    document.getElementById('lval').textContent = level;
    const pct = totalDots > 0 ? Math.round(eaten / totalDots * 100) : 0;
    document.getElementById('eval').textContent = pct + '%';
    const ld = document.getElementById('lives-display');
    ld.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const ic = document.createElement('canvas'); ic.width = 22; ic.height = 16;
        drawPanelIcon(ic.getContext('2d'), 11, 8, 11, 7);
        ld.appendChild(ic);
    }
}

// ── GAME OVERLAY ───────────────────────────
function showGameOverlay(title, sub, btnTxt, action) {
    const ov = document.getElementById('game-overlay');
    document.getElementById('go-title').innerHTML = title;
    document.getElementById('go-sub').innerHTML = sub.replace(/\n/g, '<br>');
    document.getElementById('go-btn').textContent = '▶ ' + btnTxt;
    overlayAction = action;
    ov.classList.add('show');
}

function resumeOverlay() {
    document.getElementById('game-overlay').classList.remove('show');
    if (overlayAction) { overlayAction(); overlayAction = null; }
}

// ════════════════════════════════════════════
//  DRAW
// ════════════════════════════════════════════
function drawMap() {
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const v = map[r][c], x = c * SZ, y = r * SZ;
        if (v === 1) {
            ctx.fillStyle = '#111820'; ctx.fillRect(x, y, SZ, SZ);
            ctx.strokeStyle = 'rgba(30,120,200,0.44)'; ctx.lineWidth = 1.5;
            ctx.strokeRect(x + 1, y + 1, SZ - 2, SZ - 2);
            ctx.fillStyle = 'rgba(0,28,80,0.16)'; ctx.fillRect(x + 3, y + 3, SZ - 6, SZ - 6);
        } else {
            ctx.fillStyle = '#080f0b'; ctx.fillRect(x, y, SZ, SZ);
            if (v === 2) drawEnergy(x + SZ / 2, y + SZ / 2);
            else if (v === 3) drawBattery(x + SZ / 2, y + SZ / 2);
        }
    }
}

function drawEnergy(cx, cy) {
    ctx.save();
    ctx.shadowColor = '#ffe44d'; ctx.shadowBlur = 7; ctx.fillStyle = '#ffe44d';
    ctx.beginPath();
    ctx.moveTo(cx + 2, cy - 4); ctx.lineTo(cx - 1, cy + 0.5); ctx.lineTo(cx + 1, cy + 0.5);
    ctx.lineTo(cx - 2, cy + 4); ctx.lineTo(cx + 1, cy - 0.5); ctx.lineTo(cx - 1, cy - 0.5);
    ctx.closePath(); ctx.fill(); ctx.restore();
}

function drawBattery(cx, cy) {
    const t = tick / 8, pulse = 1 + Math.sin(t) * 0.3;
    ctx.save();
    ctx.shadowColor = '#00ffaa'; ctx.shadowBlur = 10 * pulse;
    ctx.strokeStyle = '#00ffaa'; ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - 5, cy - 3.5, 10, 7);
    ctx.fillStyle = '#00ffaa'; ctx.fillRect(cx + 5, cy - 2, 2, 4);
    ctx.fillRect(cx - 4, cy - 2.5, (0.4 + 0.4 * Math.sin(t)) * 8, 5);
    ctx.restore();
}

function drawPlayer() {
    const cx = player.px, cy = player.py, pw = SZ - 4, ph = SZ - 8;
    let rot = 0;
    if (player.dx === 1) rot = 0;
    if (player.dx === -1) rot = Math.PI;
    if (player.dy === -1) rot = -Math.PI / 2;
    if (player.dy === 1) rot = Math.PI / 2;

    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot + Math.sin(tick / 8) * 0.04);

    if (player.boosted) {
        ctx.shadowColor = 'rgba(255,220,0,0.8)'; ctx.shadowBlur = 18 + player.boostTick;
    } else {
        ctx.shadowColor = player.powered ? '#00ffee' : '#ffe44d';
        ctx.shadowBlur = player.powered ? 20 : 10;
    }

    // frame
    ctx.fillStyle = player.powered ? '#006688' : player.boosted ? '#3a3000' : '#1a2a3a';
    ctx.fillRect(-pw / 2 - 1, -ph / 2 - 1, pw + 2, ph + 2);

    // cells
    const cols = 3, rows = 2, cw = pw / cols, ch = ph / rows;
    for (let ro = 0; ro < rows; ro++) for (let co = 0; co < cols; co++) {
        const x2 = -pw / 2 + co * cw, y2 = -ph / 2 + ro * ch;
        ctx.fillStyle = player.powered
            ? `hsl(${185 + co * 20},90%,${48 + Math.sin(tick / 5 + co + ro) * 11}%)`
            : player.boosted
                ? `hsl(${48 + co * 6},88%,${36 + Math.sin(tick / 4 + co) * 9}%)`
                : `hsl(${210 + co * 7},58%,${20 + Math.sin(tick / 7 + co * .7) * 5}%)`;
        ctx.fillRect(x2 + 1, y2 + 1, cw - 2, ch - 2);
        ctx.strokeStyle = player.powered ? 'rgba(0,255,220,0.35)' : player.boosted ? 'rgba(255,220,0,0.45)' : 'rgba(100,160,220,0.28)';
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(x2 + 2, y2 + 2); ctx.lineTo(x2 + cw - 3, y2 + 2); ctx.stroke();
    }
    ctx.strokeStyle = player.powered ? '#00ffee' : player.boosted ? '#ffee00' : '#4488aa';
    ctx.lineWidth = 1; ctx.strokeRect(-pw / 2, -ph / 2, pw, ph);
    ctx.strokeStyle = '#334455'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, ph / 2); ctx.lineTo(0, ph / 2 + 4); ctx.stroke();
    ctx.shadowBlur = 0; ctx.restore();

    // shield ring
    if (player.powered) {
        ctx.beginPath(); ctx.arc(cx, cy, SZ / 2 + 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,255,200,${0.22 + 0.18 * Math.sin(tick / 4)})`;
        ctx.lineWidth = 2; ctx.stroke();
    }

    // boost trail
    if (player.boosted && player.boostTick > 2) {
        ctx.save(); ctx.globalAlpha = player.boostTick / 10 * 0.65;
        ctx.strokeStyle = '#ffee00'; ctx.lineWidth = 2;
        ctx.shadowColor = '#ffee00'; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.lineTo(cx - player.dx * 14, cy - player.dy * 14); ctx.stroke();
        ctx.restore();
    }
}

function drawPanelIcon(c, cx, cy, pw, ph) {
    c.fillStyle = '#1a2a3a'; c.fillRect(cx - pw / 2 - 1, cy - ph / 2 - 1, pw + 2, ph + 2);
    const cw = pw / 3, ch = ph / 2;
    for (let r = 0; r < 2; r++) for (let co = 0; co < 3; co++) {
        c.fillStyle = 'hsl(210,55%,27%)';
        c.fillRect(cx - pw / 2 + co * cw + 1, cy - ph / 2 + r * ch + 1, cw - 2, ch - 2);
    }
    c.strokeStyle = '#4488aa'; c.lineWidth = 1; c.strokeRect(cx - pw / 2, cy - ph / 2, pw, ph);
}

function drawEnemy(e) {
    if (e.dead || (e.inHouse && e.rel > 0)) return;
    const cx = e.px, cy = e.py, t = tick + e.wobble * 10;
    if (e.scared) { drawScared(cx, cy, t); return; }
    switch (e.type) {
        case 'cloud': drawCloud(cx, cy, t); break;
        case 'hail': drawHail(cx, cy, t); break;
        case 'smoke': drawSmoke(cx, cy, t); break;
        case 'lightning': drawLightning(cx, cy, t); break;
    }
}

function drawCloud(cx, cy, t) {
    const b = Math.sin(t / 12) * 2;
    ctx.save(); ctx.translate(cx, cy + b); ctx.shadowColor = '#aabbcc'; ctx.shadowBlur = 8;
    const P = [{ x: 0, y: 0, r: 7 }, { x: -6, y: 3, r: 5 }, { x: 6, y: 3, r: 5 }, { x: -3, y: 4, r: 4 }, { x: 3, y: 4, r: 4 }];
    ctx.fillStyle = '#8899aa';
    for (const p of P) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#bfcfdf'; ctx.beginPath(); ctx.arc(-1, -2, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#334455'; ctx.fillRect(-4, -1, 3, 2); ctx.fillRect(2, -1, 3, 2);
    ctx.beginPath(); ctx.arc(0, 3, 3, 0.3, Math.PI - 0.3); ctx.strokeStyle = '#334455'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.shadowBlur = 0; ctx.restore();
}

function drawHail(cx, cy, t) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.06);
    ctx.shadowColor = '#88ddff'; ctx.shadowBlur = 10;
    ctx.fillStyle = '#5599cc'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#aaddff';
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2; ctx.save(); ctx.rotate(a);
        ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(-2, -9); ctx.lineTo(2, -9); ctx.closePath(); ctx.fill();
        ctx.restore();
    }
    ctx.fillStyle = 'rgba(200,240,255,0.6)'; ctx.beginPath(); ctx.arc(-2, -2, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0; ctx.restore();
}

function drawSmoke(cx, cy, t) {
    ctx.save(); ctx.translate(cx + Math.sin(t / 10) * 2, cy); ctx.globalAlpha = 0.88;
    ctx.shadowColor = '#556633'; ctx.shadowBlur = 6;
    const P = [{ x: 0, y: 0, r: 7 }, { x: -5, y: 2, r: 6 }, { x: 5, y: 2, r: 5 }, { x: 0, y: -2, r: 5.5 }];
    ctx.fillStyle = '#445533';
    for (const p of P) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = 'rgba(80,160,40,0.35)'; ctx.beginPath(); ctx.arc(1, -1, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#aabb44';
    ctx.beginPath(); ctx.arc(-3, -1, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(3, -1, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#223322';
    ctx.beginPath(); ctx.arc(-3, -1, 1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(3, -1, 1, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1; ctx.shadowBlur = 0; ctx.restore();
}

function drawLightning(cx, cy, t) {
    const fl = Math.sin(t * 0.7) > 0.3;
    ctx.save(); ctx.translate(cx, cy);
    ctx.shadowColor = '#ffee00'; ctx.shadowBlur = fl ? 16 : 6;
    ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(60,40,0,${fl ? 0.7 : 0.4})`; ctx.fill();
    ctx.strokeStyle = `rgba(255,200,0,${fl ? 0.9 : 0.3})`; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = fl ? '#ffff44' : '#ccaa00';
    ctx.beginPath();
    ctx.moveTo(3, -9); ctx.lineTo(-2, -1); ctx.lineTo(1, -1);
    ctx.lineTo(-3, 9); ctx.lineTo(2, 1); ctx.lineTo(-1, 1);
    ctx.closePath(); ctx.fill();
    if (fl) { ctx.fillStyle = '#fff'; for (let i = 0; i < 3; i++) { const a = Math.random() * Math.PI * 2, r = 8 + Math.random() * 3; ctx.beginPath(); ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 1, 0, Math.PI * 2); ctx.fill(); } }
    ctx.shadowBlur = 0; ctx.restore();
}

function drawScared(cx, cy, t) {
    const fl = pTimer < 100 && Math.floor(t / 8) % 2 === 0;
    const sh = (Math.random() - 0.5) * 2;
    ctx.save(); ctx.translate(cx + sh, cy + sh); ctx.globalAlpha = 0.82;
    ctx.shadowColor = fl ? '#fff' : '#4466ff'; ctx.shadowBlur = 8;
    ctx.fillStyle = fl ? '#ddeeff' : '#2244bb';
    for (const p of [{ x: 0, y: 0, r: 7 }, { x: -5, y: 3, r: 5 }, { x: 5, y: 3, r: 5 }]) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#88aaff'; ctx.lineWidth = 1.5;
    for (const ox of [-3.5, 3.5]) {
        ctx.beginPath(); ctx.moveTo(ox - 2, -1); ctx.lineTo(ox + 2, 3); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox + 2, -1); ctx.lineTo(ox - 2, 3); ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0; ctx.restore();
}

function drawPowerBar() {
    if (!player.powered) return;
    const bw = 100, bh = 5, bx = GAME_W / 2 - 50, by = GAME_H - 9;
    ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
    const g = ctx.createLinearGradient(bx, 0, bx + bw, 0);
    g.addColorStop(0, '#00ffaa'); g.addColorStop(1, '#00aaff');
    ctx.fillStyle = g; ctx.fillRect(bx, by, bw * (pTimer / 420), bh);
    ctx.strokeStyle = 'rgba(0,255,180,.28)'; ctx.lineWidth = 1; ctx.strokeRect(bx, by, bw, bh);
}

function drawSpeedBar() {
    const ratio = (player.curSpd - P_BASE) / (P_MAX - P_BASE);
    if (ratio <= 0.01) return;
    const bw = 72, bh = 3, bx = GAME_W - bw - 5, by = 7;
    ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
    const g = ctx.createLinearGradient(bx, 0, bx + bw, 0);
    g.addColorStop(0, '#ffdd00'); g.addColorStop(1, '#ff8800');
    ctx.fillStyle = g; ctx.fillRect(bx, by, bw * ratio, bh);
}

// ── MAIN LOOP ──────────────────────────────
function loop() {
    if (!running) { raf = null; return; }
    tick++;

    if (keys['ArrowUp'] || keys['w'] || keys['W']) { player.ndx = 0; player.ndy = -1; }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) { player.ndx = 0; player.ndy = 1; }
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) { player.ndx = -1; player.ndy = 0; }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) { player.ndx = 1; player.ndy = 0; }

    tickPower();
    stepPlayer();
    enemies.forEach(stepEnemy);
    checkHits();
    checkWin();

    ctx.clearRect(0, 0, GAME_W, GAME_H);
    drawMap();
    enemies.forEach(drawEnemy);
    drawPlayer();
    drawPowerBar();
    drawSpeedBar();

    raf = requestAnimationFrame(loop);
}

// ── INPUT ──────────────────────────────────
document.addEventListener('keydown', e => {
    keys[e.key] = true;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
});
document.addEventListener('keyup', e => { keys[e.key] = false; });