/* ════════════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════════════ */
const CAT_LABEL = { work: 'Trabalho', personal: 'Pessoal', study: 'Estudo', health: 'Saúde', other: 'Outro' };
const CAT_ICON = { work: '💼', personal: '🏡', study: '📚', health: '💪', other: '✨' };
const PRIO_LABEL = { high: 'Alta', med: 'Média', low: 'Baixa' };
const PRIO_ICON = { high: '🔴', med: '🟡', low: '🟢' };
const CONF_CLRS = ['#a29bfe', '#00cec9', '#fdcb6e', '#fd79a8', '#74b9ff', '#55efc4'];

/* ════════════════════════════════════════════════
   STATE
════════════════════════════════════════════════ */
let tasks = [];
let filter = 'all';
let searchQ = '';
let selPrio = 'med';   // prioridade selecionada para nova tarefa
let toastTmr = null;

/* ════════════════════════════════════════════════
   STORAGE
════════════════════════════════════════════════ */
const save = () => { try { localStorage.setItem('agenda_v3', JSON.stringify(tasks)); } catch (e) { } };
const load = () => { try { return JSON.parse(localStorage.getItem('agenda_v3')) || []; } catch (e) { return []; } };

/* ════════════════════════════════════════════════
   UTILS
════════════════════════════════════════════════ */
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
function esc(s) { const d = document.createElement('div'); d.appendChild(document.createTextNode(s)); return d.innerHTML; }

/* ════════════════════════════════════════════════
   CLOCK
════════════════════════════════════════════════ */
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent =
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    document.getElementById('date-display').textContent =
        `${DAYS[now.getDay()]}, ${now.getDate()} de ${MONTHS[now.getMonth()]} de ${now.getFullYear()}`;
}
setInterval(updateClock, 1000);
updateClock();

/* ════════════════════════════════════════════════
   THEME
════════════════════════════════════════════════ */
let theme = localStorage.getItem('agenda_theme') || 'dark';

function applyTheme(t) {
    theme = t;
    document.documentElement.setAttribute('data-theme', t);
    document.getElementById('theme-icon').textContent = t === 'light' ? '🌙' : '☀️';
    document.getElementById('theme-label').textContent = t === 'light' ? 'Escuro' : 'Claro';
    localStorage.setItem('agenda_theme', t);
}

document.getElementById('theme-toggle').addEventListener('click', () => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
});

applyTheme(theme);

/* ════════════════════════════════════════════════
   PRIORITY BUTTONS
════════════════════════════════════════════════ */
function refreshPrioBtns() {
    document.querySelectorAll('.prio-btn').forEach(btn => {
        btn.classList.toggle('prio-active', btn.dataset.prio === selPrio);
    });
}

document.querySelectorAll('.prio-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        selPrio = btn.dataset.prio;
        refreshPrioBtns();
    });
});

/* ════════════════════════════════════════════════
   TOAST
════════════════════════════════════════════════ */
function showToast(msg, type = 'ok') {
    let t = document.querySelector('.toast');
    if (t) { clearTimeout(toastTmr); t.remove(); }
    t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span class="toast-dot ${type}"></span>${esc(msg)}`;
    document.body.appendChild(t);
    toastTmr = setTimeout(() => {
        t.classList.add('out');
        setTimeout(() => t.remove(), 320);
    }, 2800);
}

/* ════════════════════════════════════════════════
   CONFETTI
════════════════════════════════════════════════ */
function spawnConfetti(x, y) {
    for (let i = 0; i < 16; i++) {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        const color = CONF_CLRS[Math.floor(Math.random() * CONF_CLRS.length)];
        const dx = (Math.random() - .5) * 160;
        const dur = 550 + Math.random() * 650;
        el.style.cssText = `left:${x + dx}px;top:${y - 8}px;background:${color};animation-duration:${dur}ms;`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), dur + 60);
    }
}

/* ════════════════════════════════════════════════
   STATS & PROGRESS
════════════════════════════════════════════════ */
function updateStats() {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    const pct = total > 0 ? Math.round(done / total * 100) : 0;
    animCount('s-total', total);
    animCount('s-pend', total - done);
    animCount('s-done', done);
    document.getElementById('prog-fill').style.width = pct + '%';
    document.getElementById('prog-pct').textContent = pct + '%';
}

function animCount(id, target) {
    const el = document.getElementById(id);
    const cur = parseInt(el.textContent) || 0;
    if (cur === target) return;
    const step = target > cur ? 1 : -1;
    const delay = Math.abs(target - cur) > 5 ? 28 : 55;
    let v = cur;
    const iv = setInterval(() => { v += step; el.textContent = v; if (v === target) clearInterval(iv); }, delay);
}

/* ════════════════════════════════════════════════
   FILTER MATCH
════════════════════════════════════════════════ */
function matchFilter(task) {
    if (filter === 'pending' && task.done) return false;
    if (filter === 'high' && task.prio !== 'high') return false;
    if (['work', 'personal', 'study', 'health', 'other'].includes(filter) && task.cat !== filter) return false;
    if (searchQ && !task.name.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
}

function setFilter(f) {
    filter = f;
    document.querySelectorAll('.filter-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.f === f));
}

/* ════════════════════════════════════════════════
   MAKE TASK ELEMENT
════════════════════════════════════════════════ */
function makeTaskEl(task, delay) {
    const el = document.createElement('div');
    el.className = `task-item prio-${task.prio}${task.done ? ' done' : ''}`;
    el.dataset.id = task.id;
    el.style.animationDelay = (delay || 0) + 'ms';

    const dueBadge = task.due ? `<span class="tag tag-due">📅 ${esc(task.due)}</span>` : '';

    el.innerHTML = `
    <div class="check-wrap">
      <button class="check-btn" type="button"
        title="${task.done ? 'Reabrir tarefa' : 'Marcar como concluída'}"
        aria-pressed="${task.done}">
        <svg class="check-svg" width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
          <path d="M1.5 5L4.5 8.5L10.5 1.5"
            stroke="white" stroke-width="2.2"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <div class="task-body">
      <div class="task-name">${esc(task.name)}</div>
      <div class="task-meta">
        <span class="tag tag-cat-${task.cat}">${CAT_ICON[task.cat]} ${CAT_LABEL[task.cat]}</span>
        <span class="tag tag-prio-${task.prio}">${PRIO_ICON[task.prio]} ${PRIO_LABEL[task.prio]}</span>
        ${dueBadge}
      </div>
    </div>
    <div class="task-actions">
      ${task.done
            ? `<button class="action-btn undo-btn" type="button" title="Reabrir tarefa">↩</button>`
            : ''}
      <button class="action-btn del-btn" type="button" title="Excluir tarefa">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M1 1l8 8M9 1L1 9"
            stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  `;

    // ── Clique no check ──
    el.querySelector('.check-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        const r = this.getBoundingClientRect();
        toggleDone(task.id, el, r.left + r.width / 2, r.top + r.height / 2);
    });

    // ── Clique em excluir ──
    el.querySelector('.del-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        deleteTask(task.id, el);
    });

    // ── Clique em reabrir ──
    const undoBtn = el.querySelector('.undo-btn');
    if (undoBtn) {
        undoBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleDone(task.id, el, 0, 0);
        });
    }

    return el;
}

/* ════════════════════════════════════════════════
   TOGGLE DONE
════════════════════════════════════════════════ */
function toggleDone(id, el, cx, cy) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (!task.done) {
        // Concluir
        el.classList.add('completing');
        if (cx && cy) spawnConfetti(cx, cy);
        setTimeout(() => {
            task.done = true;
            task.doneAt = Date.now();
            save();
            render();
            showToast('Tarefa concluída! 🎉', 'ok');
        }, 380);
    } else {
        // Reabrir
        task.done = false;
        delete task.doneAt;
        save();
        render();
        showToast('Tarefa reaberta ↩', 'undo');
    }
}

/* ════════════════════════════════════════════════
   DELETE
════════════════════════════════════════════════ */
function deleteTask(id, el) {
    el.classList.add('removing');
    setTimeout(() => {
        tasks = tasks.filter(t => t.id !== id);
        save();
        render();
        showToast('Tarefa removida', 'del');
    }, 360);
}

/* ════════════════════════════════════════════════
   ADD TASK
════════════════════════════════════════════════ */
function addTask() {
    const inp = document.getElementById('task-input');
    const name = inp.value.trim();

    if (!name) {
        // Shake + borda vermelha
        inp.style.animation = 'none';
        inp.style.borderColor = 'var(--danger)';
        inp.offsetHeight;                           // força reflow
        inp.style.animation = 'shake .35s ease';
        setTimeout(() => { inp.style.animation = ''; inp.style.borderColor = ''; }, 450);
        inp.focus();
        return;
    }

    const task = {
        id: genId(),
        name,
        cat: document.getElementById('cat-sel').value,
        prio: selPrio,          // lê da variável de estado, não de um <select>
        due: document.getElementById('due-sel').value,
        done: false,
        created: Date.now()
    };

    tasks.unshift(task);
    save();

    inp.value = '';
    document.getElementById('due-sel').value = '';

    setFilter('all');
    render();
    showToast('Tarefa adicionada! ✨', 'ok');
    inp.focus();
}

/* ════════════════════════════════════════════════
   RENDER
════════════════════════════════════════════════ */
function render() {
    const pendList = document.getElementById('pend-list');
    const doneList = document.getElementById('done-list');
    const doneSection = document.getElementById('done-section');

    const visible = tasks.filter(matchFilter);
    const pend = visible.filter(t => !t.done);
    const doneAll = tasks.filter(t => t.done);
    const doneVis = visible.filter(t => t.done);

    pendList.innerHTML = '';
    doneList.innerHTML = '';

    if (pend.length === 0) {
        const el = document.createElement('div');
        el.className = 'empty-state';
        const MSGS = {
            all: ['✅', 'Tudo em dia! Nenhuma tarefa pendente.'],
            pending: ['🏖️', 'Sem tarefas pendentes. Aproveite!'],
        };
        const [icon, text] = MSGS[filter] || ['🔍', 'Nenhuma tarefa encontrada.'];
        el.innerHTML = `<span class="empty-icon">${icon}</span><p>${text}</p>`;
        pendList.appendChild(el);
    } else {
        pend.forEach((t, i) => pendList.appendChild(makeTaskEl(t, i * 36)));
    }

    if (doneAll.length > 0) {
        doneSection.style.display = 'block';
        doneVis.slice().reverse().forEach((t, i) =>
            doneList.appendChild(makeTaskEl(t, i * 28)));
    } else {
        doneSection.style.display = 'none';
    }

    updateStats();
}

/* ════════════════════════════════════════════════
   EVENTS
════════════════════════════════════════════════ */
document.getElementById('add-btn').addEventListener('click', addTask);
document.getElementById('task-input').addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
document.getElementById('search-input').addEventListener('input', e => { searchQ = e.target.value; render(); });
document.querySelectorAll('.filter-btn').forEach(btn =>
    btn.addEventListener('click', () => { setFilter(btn.dataset.f); render(); }));

/* ════════════════════════════════════════════════
   SEED DATA
════════════════════════════════════════════════ */
const SEED = [
    { id: genId(), name: 'Revisar relatório mensal de resultados', cat: 'work', prio: 'high', due: 'hoje', done: false, created: Date.now() - 6 },
    { id: genId(), name: 'Ir à academia — treino de força', cat: 'health', prio: 'med', due: 'hoje', done: false, created: Date.now() - 5 },
    { id: genId(), name: 'Estudar módulo 4 do curso de React', cat: 'study', prio: 'med', due: 'esta semana', done: false, created: Date.now() - 4 },
    { id: genId(), name: 'Comprar mantimentos no mercado', cat: 'personal', prio: 'low', due: 'amanhã', done: true, created: Date.now() - 3 },
    { id: genId(), name: 'Enviar proposta comercial para o cliente', cat: 'work', prio: 'high', due: 'hoje', done: false, created: Date.now() - 2 },
    { id: genId(), name: 'Médico — consulta de rotina agendada', cat: 'health', prio: 'low', due: 'este mês', done: false, created: Date.now() - 1 },
];

/* ════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════ */
tasks = load();
if (tasks.length === 0) tasks = SEED;
save();
render();