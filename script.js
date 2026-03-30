// =======================================================
// 1. CONFIGURACIÓN DE FIREBASE Y VARIABLES
// =======================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Tus credenciales de Firebase (Copiadas de tu imagen)
const firebaseConfig = {
  apiKey: "AIzaSyB3oUOkKBUplYdPVpt5i2LJdJ1lqEs3HIM",
  authDomain: "lordnine-tracker-e3a97.firebaseapp.com",
  databaseURL: "https://lordnine-tracker-e3a97-default-rtdb.firebaseio.com",
  projectId: "lordnine-tracker-e3a97",
  storageBucket: "lordnine-tracker-e3a97.firebasestorage.app",
  messagingSenderId: "923786523326",
  appId: "1:923786523326:web:45eb3278eef5851b2524ef",
  measurementId: "G-3ZVSYZ2G1T"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;
const SERVER_TIMEZONE_OFFSET = 9; // JAPÓN (UTC+9)

const BOSSES = [
    { id: 'venatus', name: 'Venatus', level: 60, interval: 10, location: 'Corrupted Basin' }, 
    { id: 'viorent', name: 'Viorent', level: 65, interval: 10, location: 'Crecent Lake' }, 
    { id: 'ego', name: 'Ego', level: 70, interval: 21, location: 'Ulan Canyon' }, 
    { id: 'clemantis', name: 'Clemantis', level: 70, interval: 24, fixedSchedule: [{ day: 1, hour: 12, minute: 30 }, { day: 4, hour: 20, minute: 0 }], location: 'Corrupted Basin' }, 
    { id: 'livera', name: 'Livera', level: 75, interval: 24, location: "Protector's Ruin" }, 
    { id: 'araneo', name: 'Araneo', level: 75, interval: 24, location: 'Lower Tomb of Tyriosa 1F' }, 
    { id: 'undomiel', name: 'Undomiel', level: 80, interval: 24, location: 'Secret Laboratory' }, 
    { id: 'saphirus', name: 'Saphirus', level: 80, interval: 24, fixedSchedule: [{ day: 0, hour: 18, minute: 0 }, { day: 2, hour: 12, minute: 30 }], location: 'Crecent Lake' }, 
    { id: 'neutro', name: 'Neutro', level: 80, interval: 24, fixedSchedule: [{ day: 2, hour: 20, minute: 0 }, { day: 4, hour: 12, minute: 30 }], location: 'Desert of the Screaming' }, 
    { id: 'ladydalia', name: 'Lady Dalia', level: 85, interval: 18, location: 'Twilight Hill' }, 
    { id: 'generalaquleus', name: 'General Aquleus', level: 85, interval: 29, location: 'Lower Tomb of Tyriosa 2F' }, 
    { id: 'thymele', name: 'Thymele', level: 85, interval: 24, fixedSchedule: [{ day: 1, hour: 20, minute: 0 }, { day: 3, hour: 12, minute: 30 }], location: 'Twilight Hill' }, 
    { id: 'ringor', name: 'Ringor', level: 85, interval: 24, fixedSchedule: [{ day: 6, hour: 18, minute: 0 }], location: 'Battlefield of Templar' }, 
    { id: 'amentis', name: 'Amentis', level: 88, interval: 29, location: 'Land of Glory' }, 
    { id: 'baronbraudmore', name: 'Baron Braudmore', level: 88, interval: 32, location: 'Battlefield of Templar' }, 
    { id: 'milavy', name: 'Milavy', level: 90, interval: 24, fixedSchedule: [{ day: 6, hour: 16, minute: 0 }], location: 'Lower Tomb of Tyriosa 3F' }, 
    { id: 'wannitas', name: 'Wannitas', level: 93, interval: 48, location: 'Plateau of Revolution' }, 
    { id: 'metus', name: 'Metus', level: 93, interval: 48, location: 'Plateau of Revolution' }, 
    { id: 'duplican', name: 'Duplican', level: 93, interval: 48, location: 'Plateau of Revolution' }, 
    { id: 'shuliar', name: 'Shuliar', level: 95, interval: 35, location: 'Ruins of the War' }, 
    { id: 'roderick', name: 'Roderick', level: 95, interval: 24, fixedSchedule: [{ day: 5, hour: 20, minute: 0 }], location: 'Garbana Underground Waterway 1' }, 
    { id: 'gareth', name: 'Gareth', level: 98, interval: 32, location: "Deadman's Land District 1" }, 
    { id: 'titore', name: 'Titore', level: 98, interval: 37, location: "Deadman's Land District 2" }, 
    { id: 'larba', name: 'Larba', level: 98, interval: 35, location: 'Ruins of the War' }, 
    { id: 'catena', name: 'Catena', level: 100, interval: 35, location: "Deadman's Land District 3" }, 
    { id: 'secreta', name: 'Secreta', level: 100, interval: 62, location: 'Silvergrass Field' }, 
    { id: 'ordo', name: 'Ordo', level: 100, interval: 62, location: 'Silvergrass Field' }, 
    { id: 'asta', name: 'Asta', level: 100, interval: 62, location: 'Silvergrass Field' }, 
    { id: 'supore', name: 'Supore', level: 100, interval: 62, location: 'Silvergrass Field' }, 
    { id: 'auraq', name: 'Auraq', level: 100, interval: 24, fixedSchedule: [{ day: 5, hour: 23, minute: 0 }, { day: 3, hour: 22, minute: 0 }], location: 'Garbana Underground Waterway 2' }, 
    { id: 'chaiflock', name: 'Chaiflock', level: 120, interval: 24, fixedSchedule: [{ day: 6, hour: 23, minute: 0 }], location: 'Silvergrass Field' }, 
    { id: 'benji', name: 'Benji', level: 120, interval: 24, fixedSchedule: [{ day: 0, hour: 22, minute: 0 }], location: 'Barbas' },
    { id: 'libitina', name: 'Libitina', level: 130, interval: 24, fixedSchedule: [{ day: 1, hour: 22, minute: 0 }, { day: 6, hour: 22, minute: 0 }], location: 'Volcano Dracas' },
    { id: 'rakajeth', name: 'Rakajeth', level: 130, interval: 24, fixedSchedule: [{ day: 2, hour: 23, minute: 0 }, { day: 0, hour: 20, minute: 0 }], location: 'Volcano Dracas' },
    { id: 'icaruthia', name: 'Icaruthia', level: 135, interval: 24, fixedSchedule: [{ day: 2, hour: 22, minute: 0 }, { day: 5, hour: 22, minute: 0 }], location: 'Kransia' },
    { id: 'motti', name: 'Motti', level: 135, interval: 24, fixedSchedule: [{ day: 3, hour: 20, minute: 0 }, { day: 6, hour: 20, minute: 0 }], location: 'Kransia' },
    { id: 'nevaeh', name: 'Nevaeh', level: 140, interval: 24, fixedSchedule: [{ day: 0, hour: 23, minute: 0 }], location: 'Kransia' },
    { id: 'tumier', name: 'Tumier', level: 140, interval: 24, fixedSchedule: [{ day: 0, hour: 20, minute: 0 }], location: 'Kransia' },
];

const container = document.getElementById('bosses-container');
let activeTimers = [];

// =======================================================
// 2. LÓGICA DE SINCRONIZACIÓN (FIREBASE)
// =======================================================

function saveDeathTimeToDB(bossId, timeValue) {
    set(ref(db, 'bosses/' + bossId), {
        deathTime: timeValue
    });
}

function clearTimerFromDB(bossId) {
    set(ref(db, 'bosses/' + bossId), null);
}

// Escuchar cambios en la base de datos en tiempo real
onValue(ref(db, 'bosses'), (snapshot) => {
    const data = snapshot.val();
    activeTimers = []; // Reset local para reconstruir con datos de la nube
    
    // Iniciar bosses fijos siempre
    BOSSES.filter(b => b.fixedSchedule).forEach(boss => startFixedScheduleTimer(boss));

    // Cargar muertes reales desde la nube
    if (data) {
        for (let bossId in data) {
            const boss = BOSSES.find(b => b.id === bossId);
            if (boss && data[bossId].deathTime) {
                startTimer(boss, data[bossId].deathTime);
            }
        }
    }
    updateActivePanel();
});

// =======================================================
// 3. UTILIDADES DE TIEMPO Y UI
// =======================================================

function calculateNextSpawn(deathTimeMs, intervalMs) {
    let nextSpawnTarget = deathTimeMs + intervalMs;
    const now = new Date().getTime();
    while (nextSpawnTarget < now) { nextSpawnTarget += intervalMs; }
    return nextSpawnTarget;
}

function calculateNextFixedTarget(boss) {
    const now = new Date().getTime();
    let nextTarget = Infinity;    
    const WEEK_IN_MS = 7 * DAY_IN_MS; 
    const nowServer = new Date(now + (SERVER_TIMEZONE_OFFSET * HOUR_IN_MS));
    const currentTimeOfWeekMs = (nowServer.getUTCDay() * DAY_IN_MS) + (nowServer.getUTCHours() * HOUR_IN_MS) + (nowServer.getUTCMinutes() * 60000) + (nowServer.getUTCSeconds() * 1000);

    boss.fixedSchedule.forEach(sch => {
        const targetMs = (sch.day * DAY_IN_MS) + (sch.hour * HOUR_IN_MS) + (sch.minute * 60000);
        let diff = targetMs - currentTimeOfWeekMs;
        if (diff <= 0) diff += WEEK_IN_MS;
        if (now + diff < nextTarget) nextTarget = now + diff;
    });
    return nextTarget;    
}

function startTimer(boss, timeValue) {
    const nextSpawnTarget = calculateNextSpawn(new Date(timeValue).getTime(), boss.interval * HOUR_IN_MS);
    const timerData = { id: boss.id, name: boss.name, targetTime: nextSpawnTarget, intervalMs: boss.interval * HOUR_IN_MS, isFixed: false };
    const idx = activeTimers.findIndex(t => t.id === boss.id);
    if (idx > -1) activeTimers[idx] = timerData; else activeTimers.push(timerData);
}

function startFixedScheduleTimer(boss) {
    const nextSpawnTarget = calculateNextFixedTarget(boss);
    const timerData = { id: boss.id, name: boss.name, targetTime: nextSpawnTarget, intervalMs: 7 * DAY_IN_MS, isFixed: true };
    const idx = activeTimers.findIndex(t => t.id === boss.id);
    if (idx > -1) activeTimers[idx] = timerData; else activeTimers.push(timerData);
}

function updateActivePanel() {
    const panel = document.getElementById('active-timers-display');
    if (!panel) return;
    const now = new Date().getTime();

    activeTimers.forEach(timer => {
        let diff = timer.targetTime - now;
        if (diff < 0) {
            timer.isAlive = true;
            timer.countdown = "ALIVE";
            timer.sortTime = 0;
        } else {
            timer.isAlive = false;
            timer.sortTime = timer.targetTime;
            if (diff > DAY_IN_MS) {
                const d = Math.floor(diff / DAY_IN_MS);
                const h = Math.floor((diff % DAY_IN_MS) / HOUR_IN_MS);
                const m = Math.floor((diff % HOUR_IN_MS) / 60000);
                timer.countdown = `${d}d ${h}h ${m}m`;
            } else {
                const h = Math.floor(diff / HOUR_IN_MS);
                const m = Math.floor((diff % HOUR_IN_MS) / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                timer.countdown = `${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
            }
        }
    });

    activeTimers.sort((a, b) => a.sortTime - b.sortTime);
    panel.innerHTML = activeTimers.map(t => `
        <div class="active-timer-card ${t.isAlive ? 'boss-alive' : ''}">
            <h3>${t.name}</h3>
            <span class="countdown-value">${t.countdown}</span>
            ${!t.isFixed ? `<button class="clear-btn" onclick="window.clearBoss('${t.id}')">Clear</button>` : ''}
        </div>
    `).join('');
}

// Exponer funciones globales para los botones de la UI
window.handleMarkDead = (id) => saveDeathTimeToDB(id, new Date().toISOString());
window.clearBoss = (id) => clearTimerFromDB(id);

function generateBossUI() {
    container.innerHTML = '';
    const sorted = [...BOSSES].sort((a, b) => a.level - b.level);
    sorted.forEach(boss => {
        const card = document.createElement('div');
        card.className = 'boss-tracker';
        card.innerHTML = `
            <div class="boss-info">
                <h2>${boss.name}</h2>
                <p>LVL ${boss.level} | ${boss.location}</p>
            </div>
            <div class="action-column">
                ${boss.fixedSchedule ? '<span class="fixed-badge">FIXED</span>' : `<button onclick="window.handleMarkDead('${boss.id}')">Mark Dead</button>`}
            </div>`;
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    generateBossUI();
    setInterval(updateActivePanel, 1000);
});
