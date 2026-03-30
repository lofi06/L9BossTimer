import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, set, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;
const SERVER_TIMEZONE_OFFSET = 9; 

const BOSSES = [
    { id: 'venatus', name: 'Venatus', level: 60, interval: 10, location: 'Corrupted Basin' }, 
    { id: 'viorent', name: 'Viorent', level: 65, interval: 10, location: 'Crecent Lake' }, 
    { id: 'ego', name: 'Ego', level: 70, interval: 21, location: 'Ulan Canyon' }, 
    { id: 'clemantis', name: 'Clemantis', level: 70, interval: 24, fixedSchedule: [{ day: 1, hour: 12, minute: 30, str: "Monday 12:30 PM" }, { day: 4, hour: 20, minute: 0, str: "Thursday 08:00 PM" }], location: 'Corrupted Basin' }, 
    { id: 'livera', name: 'Livera', level: 75, interval: 24, location: "Protector's Ruin" }, 
    { id: 'araneo', name: 'Araneo', level: 75, interval: 24, location: 'Lower Tomb of Tyriosa 1F' }, 
    { id: 'undomiel', name: 'Undomiel', level: 80, interval: 24, location: 'Secret Laboratory' }, 
    { id: 'saphirus', name: 'Saphirus', level: 80, interval: 24, fixedSchedule: [{ day: 0, hour: 18, minute: 0, str: "Sunday 06:00 PM" }, { day: 2, hour: 12, minute: 30, str: "Tuesday 12:30 PM" }], location: 'Crecent Lake' }, 
    { id: 'neutro', name: 'Neutro', level: 80, interval: 24, fixedSchedule: [{ day: 2, hour: 20, minute: 0, str: "Tuesday 08:00 PM" }, { day: 4, hour: 12, minute: 30, str: "Thursday 12:30 PM" }], location: 'Desert of the Screaming' }, 
    { id: 'ladydalia', name: 'Lady Dalia', level: 85, interval: 18, location: 'Twilight Hill' }, 
    { id: 'generalaquleus', name: 'General Aquleus', level: 85, interval: 29, location: 'Lower Tomb of Tyriosa 2F' }, 
    { id: 'thymele', name: 'Thymele', level: 85, interval: 24, fixedSchedule: [{ day: 1, hour: 20, minute: 0, str: "Monday 08:00 PM" }, { day: 3, hour: 12, minute: 30, str: "Wednesday 12:30 PM" }], location: 'Twilight Hill' }, 
    { id: 'ringor', name: 'Ringor', level: 85, interval: 24, fixedSchedule: [{ day: 6, hour: 18, minute: 0, str: "Saturday 06:00 PM" }], location: 'Battlefield of Templar' }, 
    { id: 'amentis', name: 'Amentis', level: 88, interval: 29, location: 'Land of Glory' }, 
    { id: 'baronbraudmore', name: 'Baron Braudmore', level: 88, interval: 32, location: 'Battlefield of Templar' }, 
    { id: 'milavy', name: 'Milavy', level: 90, interval: 24, fixedSchedule: [{ day: 6, hour: 16, minute: 0, str: "Saturday 04:00 PM" }], location: 'Lower Tomb of Tyriosa 3F' }, 
    { id: 'wannitas', name: 'Wannitas', level: 93, interval: 48, location: 'Plateau of Revolution' }, 
    { id: 'metus', name: 'Metus', level: 93, interval: 48, location: 'Plateau of Revolution' }, 
    { id: 'duplican', name: 'Duplican', level: 93, interval: 48, location: 'Plateau of Revolution' }, 
    { id: 'shuliar', name: 'Shuliar', level: 95, interval: 35, location: 'Ruins of the War' }, 
    { id: 'roderick', name: 'Roderick', level: 95, interval: 24, fixedSchedule: [{ day: 5, hour: 20, minute: 0, str: "Friday 08:00 PM" }], location: 'Garbana Underground Waterway 1' }, 
    { id: 'gareth', name: 'Gareth', level: 98, interval: 32, location: "Deadman's Land District 1" }, 
    { id: 'titore', name: 'Titore', level: 98, interval: 37, location: "Deadman's Land District 2" }, 
    { id: 'larba', name: 'Larba', level: 98, interval: 35, location: 'Ruins of the War' }, 
    { id: 'catena', name: 'Catena', level: 100, interval: 35, location: "Deadman's Land District 3" }, 
    { id: 'secreta', name: 'Secreta', level: 100, interval: 62, location: 'Silvergrass Field' }, 
    { id: 'ordo', name: 'Ordo', level: 100, interval: 62, location: 'Silvergrass Field' }, 
    { id: 'asta', name: 'Asta', level: 100, interval: 62, location: 'Silvergrass Field' }, 
    { id: 'supore', name: 'Supore', level: 100, interval: 62, location: 'Silvergrass Field' }, 
    { id: 'auraq', name: 'Auraq', level: 100, interval: 24, fixedSchedule: [{ day: 5, hour: 23, minute: 0, str: "Friday 11:00 PM" }, { day: 3, hour: 22, minute: 0, str: "Wednesday 10:00 PM" }], location: 'Garbana Underground Waterway 2' }, 
    { id: 'chaiflock', name: 'Chaiflock', level: 120, interval: 24, fixedSchedule: [{ day: 6, hour: 23, minute: 0, str: "Saturday 11:00 PM" }], location: 'Silvergrass Field' }, 
    { id: 'benji', name: 'Benji', level: 120, interval: 24, fixedSchedule: [{ day: 0, hour: 22, minute: 0, str: "Sunday 10:00 PM" }], location: 'Barbas' },
    { id: 'libitina', name: 'Libitina', level: 130, interval: 24, fixedSchedule: [{ day: 1, hour: 22, minute: 0, str: "Monday 10:00 PM" }, { day: 6, hour: 22, minute: 0, str: "Saturday 10:00 PM" }], location: 'Volcano Dracas' },
    { id: 'rakajeth', name: 'Rakajeth', level: 130, interval: 24, fixedSchedule: [{ day: 2, hour: 23, minute: 0, str: "Tuesday 11:00 PM" }, { day: 0, hour: 20, minute: 0, str: "Sunday 08:00 PM" }], location: 'Volcano Dracas' },
    { id: 'icaruthia', name: 'Icaruthia', level: 135, interval: 24, fixedSchedule: [{ day: 2, hour: 22, minute: 0, str: "Tuesday 10:00 PM" }, { day: 5, hour: 22, minute: 0, str: "Friday 10:00 PM" }], location: 'Kransia' },
    { id: 'motti', name: 'Motti', level: 135, interval: 24, fixedSchedule: [{ day: 3, hour: 20, minute: 0, str: "Wednesday 08:00 PM" }, { day: 6, hour: 20, minute: 0, str: "Saturday 08:00 PM" }], location: 'Kransia' },
    { id: 'nevaeh', name: 'Nevaeh', level: 140, interval: 24, fixedSchedule: [{ day: 0, hour: 23, minute: 0, str: "Sunday 11:00 PM" }], location: 'Kransia' },
    { id: 'tumier', name: 'Tumier', level: 140, interval: 24, fixedSchedule: [{ day: 0, hour: 20, minute: 0, str: "Sunday 08:00 PM" }], location: 'Kransia' },
];

let activeTimers = [];
let userRole = localStorage.getItem('lordnine_role') || null;

// --- ACCESO Y SEGURIDAD ---
window.askAdminPassword = () => {
    const pass = prompt("Enter Admin Password:");
    if (pass === "1234") { 
        window.setRole('admin');
    } else if (pass !== null) {
        alert("Incorrect password.");
    }
};

window.setRole = (role) => {
    userRole = role;
    localStorage.setItem('lordnine_role', role);
    const overlay = document.getElementById('role-selection-overlay');
    if (overlay) overlay.style.display = 'none';
    document.getElementById('role-status').textContent = "Mode: " + role.toUpperCase();
    updateActivePanel();
};

window.logout = () => {
    localStorage.removeItem('lordnine_role');
    location.reload();
};

// --- SINCRONIZACIÓN FIREBASE ---
onValue(ref(db, 'bosses'), (snapshot) => {
    const data = snapshot.val() || {};
    activeTimers = [];
    BOSSES.filter(b => b.fixedSchedule).forEach(boss => {
        activeTimers.push({ id: boss.id, name: boss.name, targetTime: calculateNextFixedTarget(boss), isFixed: true });
    });
    for (let id in data) {
        const boss = BOSSES.find(b => b.id === id);
        if (boss && data[id].deathTime) {
            const next = calculateNextSpawn(new Date(data[id].deathTime).getTime(), boss.interval * HOUR_IN_MS);
            activeTimers.push({ id: boss.id, name: boss.name, targetTime: next, isFixed: false });
        }
    }
    updateActivePanel();
});

// --- ACCIONES DE BOTONES ---
window.handleMarkDead = (id) => set(ref(db, 'bosses/' + id), { deathTime: new Date().toISOString() });
window.clearTimer = (id) => remove(ref(db, 'bosses/' + id));
window.openSetModal = (id) => {
    const input = document.getElementById(`time-input-${id}`);
    const btn = document.querySelector(`#tracker-${id} .set-btn`);
    if (input.style.display === 'none' || !input.style.display) {
        input.style.display = 'block';
        btn.textContent = 'Confirm';
    } else if (input.value) {
        set(ref(db, 'bosses/' + id), { deathTime: new Date(input.value).toISOString() });
        input.style.display = 'none';
        btn.textContent = 'Set';
    }
};

// --- LÓGICA DE INTERFAZ ---
function updateActivePanel() {
    const panel = document.getElementById('active-timers-display');
    const now = Date.now();
    activeTimers.sort((a, b) => a.targetTime - b.targetTime);
    
    panel.innerHTML = activeTimers.map(t => {
        const diff = t.targetTime - now;
        let countdown = diff < 0 ? "ALIVE" : formatTime(diff);
        const nextSpawnStr = new Date(t.targetTime).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true });

        return `
            <div class="active-timer-card ${diff < 0 ? 'boss-alive' : ''}">
                <div class="timer-info">
                    <h3>${t.name.toUpperCase()}</h3>
                    <p>Next Spawn: ${nextSpawnStr}</p>
                </div>
                <div class="timer-countdown">
                    <span class="countdown-value" style="color: #4caf50; font-weight: bold; font-family: monospace; font-size: 1.2em;">${countdown}</span>
                    ${(userRole === 'admin' && !t.isFixed) ? `<button class="clear-btn" onclick="window.clearTimer('${t.id}')">CLEAR</button>` : ''}
                </div>
            </div>`;
    }).join('');
}

function generateBossUI() {
    const container = document.getElementById('bosses-container');
    container.innerHTML = [...BOSSES].sort((a, b) => a.level - b.level).map(boss => {
        const scheduleHTML = boss.fixedSchedule 
            ? `<div class="fixed-schedule-list">${boss.fixedSchedule.map(s => `<div>${s.str}</div>`).join('')}</div>`
            : `<div class="respawn-text">RESPAWN EVERY: ${boss.interval}H</div>`;

        return `
        <div class="boss-tracker" id="tracker-${boss.id}">
            <img src="images/${boss.id}.png" class="boss-image" onerror="this.src='images/placeholder.png';">
            <div class="boss-info">
                <h2>${boss.name}</h2>
                <div class="subtitle-group">
                    <span class="boss-level">LVL ${boss.level}</span>
                    <span class="location-text">${boss.location}</span>
                </div>
                ${scheduleHTML}
                <input type="datetime-local" id="time-input-${boss.id}" class="manual-time-input" style="display:none;">
            </div>
            <div class="action-column">
                ${!boss.fixedSchedule ? `
                    <div class="button-group">
                        <button class="mark-dead-btn" onclick="window.handleMarkDead('${boss.id}')">Mark Dead</button>
                        <button class="set-btn" onclick="window.openSetModal('${boss.id}')">Set</button>
                    </div>` : '<span class="fixed-badge">BASE SCHEDULE (UTC+8)</span>'}
            </div>
        </div>`;
    }).join('');
}

// --- AUXILIARES ---
function formatTime(ms) {
    const h = Math.floor(ms / HOUR_IN_MS);
    const m = Math.floor((ms % HOUR_IN_MS) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    if (h >= 24) {
        const d = Math.floor(h / 24);
        return `${d}d ${h % 24}h ${m}m ${s}s`;
    }
    return `${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
}

function calculateNextSpawn(deathMs, intervalMs) {
    let target = deathMs + intervalMs;
    const now = Date.now();
    while (target < now) target += intervalMs;
    return target;
}

function calculateNextFixedTarget(boss) {
    const now = Date.now();
    const nowServer = new Date(now + (SERVER_TIMEZONE_OFFSET * HOUR_IN_MS));
    const currentTimeOfWeekMs = (nowServer.getUTCDay() * DAY_IN_MS) + (nowServer.getUTCHours() * HOUR_IN_MS) + (nowServer.getUTCMinutes() * 60000);
    let nextTarget = Infinity;
    boss.fixedSchedule.forEach(sch => {
        let diff = ((sch.day * DAY_IN_MS) + (sch.hour * HOUR_IN_MS) + (sch.minute * 60000)) - currentTimeOfWeekMs;
        if (diff <= 0) diff += 7 * DAY_IN_MS;
        if (now + diff < nextTarget) nextTarget = now + diff;
    });
    return nextTarget;
}

window.filterBosses = () => {
    const val = document.getElementById('search-boss').value.toLowerCase();
    document.querySelectorAll('.boss-tracker').forEach(c => c.style.display = c.innerText.toLowerCase().includes(val) ? 'flex' : 'none');
};
document.getElementById('search-boss').addEventListener('keyup', window.filterBosses);

document.addEventListener('DOMContentLoaded', () => {
    if (!userRole) {
        document.getElementById('role-selection-overlay').style.display = 'flex';
    } else {
        window.setRole(userRole);
    }
    generateBossUI();
    setInterval(() => {
        document.getElementById('local-time-display').textContent = "Local Time: " + new Date().toLocaleTimeString();
        updateActivePanel();
    }, 1000);
});
