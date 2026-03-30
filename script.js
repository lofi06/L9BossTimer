import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, set, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// --- CONFIGURACIÓN FIREBASE ---
const _k = ["AIzaSyB3oUOk", "KBUpLYdPVpt5", "i2LJdJ1lqEs3HIM"];
const firebaseConfig = {
    apiKey: _k.join(""),
    authDomain: "lordnine-tracker-e3a97.firebaseapp.com",
    databaseURL: "https://lordnine-tracker-e3a97-default-rtdb.firebaseio.com",
    projectId: "lordnine-tracker-e3a97",
    appId: "1:923786523326:web:45eb3278eef5851b2524ef"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- VARIABLES GLOBALES ---
const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;

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

let activeTimers = [];

// --- JST HELPERS ---
function getJST() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
}

function calculateNextFixedTarget(boss) {
    const nowJST = getJST();
    const WEEK_IN_MS = 7 * DAY_IN_MS; 
    const currentTimeOfWeekMs = (nowJST.getDay() * DAY_IN_MS) + (nowJST.getHours() * HOUR_IN_MS) + (nowJST.getMinutes() * 60000);

    let nextTarget = Infinity;
    boss.fixedSchedule.forEach(sch => {
        const targetMs = (sch.day * DAY_IN_MS) + (sch.hour * HOUR_IN_MS) + (sch.minute * 60000);
        let diff = targetMs - currentTimeOfWeekMs;
        if (diff <= 0) diff += WEEK_IN_MS;
        if (nowJST.getTime() + diff < nextTarget) nextTarget = nowJST.getTime() + diff;
    });
    return nextTarget;
}

function formatTime(ms) {
    if (ms <= 0) return "ALIVE";
    const s = Math.floor((ms / 1000) % 60);
    const m = Math.floor((ms / 60000) % 60);
    const h = Math.floor((ms / 3600000) % 24);
    const d = Math.floor(ms / (24 * 3600000));

    let parts = [];
    if (d > 0) parts.push(`${d}d`);
    parts.push(`${String(h).padStart(2, '0')}h`);
    parts.push(`${String(m).padStart(2, '0')}m`);
    parts.push(`${String(s).padStart(2, '0')}s`);
    return parts.join(' ');
}

// --- FIREBASE SYNC ---
onValue(ref(db, 'bosses'), (snapshot) => {
    const data = snapshot.val();
    activeTimers = [];

    BOSSES.filter(b => b.fixedSchedule).forEach(boss => {
        activeTimers.push({ id: boss.id, name: boss.name, targetTime: calculateNextFixedTarget(boss), isFixed: true });
    });

    if (data) {
        for (let id in data) {
            const boss = BOSSES.find(b => b.id === id);
            if (boss && data[id].deathTime) {
                const deathTime = new Date(data[id].deathTime).getTime();
                let target = deathTime + (boss.interval * HOUR_IN_MS);
                const now = getJST().getTime();
                while (target < now) { target += (boss.interval * HOUR_IN_MS); }
                activeTimers.push({ id: boss.id, name: boss.name, targetTime: target, isFixed: false });
            }
        }
    }
    renderActivePanel();
});

// --- ACCIONES ---
window.markDead = (id) => {
    set(ref(db, 'bosses/' + id), { deathTime: getJST().toISOString() });
};

window.setManualTime = (id) => {
    const input = document.getElementById(`time-input-${id}`);
    if (input.style.display === "none") {
        const nowJST = getJST();
        const offset = nowJST.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(nowJST - offset)).toISOString().slice(0, 16);
        input.value = localISOTime;
        input.style.display = "block";
        input.focus();
    } else {
        if (input.value) {
            set(ref(db, 'bosses/' + id), { deathTime: new Date(input.value).toISOString() });
            input.style.display = "none";
        } else {
            input.style.display = "none";
        }
    }
};

window.clearTimer = (id) => {
    if(confirm("¿Eliminar timer?")) remove(ref(db, 'bosses/' + id));
};

// --- RENDERIZADO (CON TIPOGRAFÍA UNIFICADA) ---
function renderBossList(filter = "") {
    const container = document.getElementById('bosses-container');
    container.innerHTML = BOSSES
        .filter(b => b.name.toLowerCase().includes(filter) || b.location.toLowerCase().includes(filter))
        .map(b => `
            <div class="boss-tracker" style="font-family: 'Cinzel', serif;">
                <img src="images/${b.id}.png" class="boss-image" onerror="this.src='https://via.placeholder.com/60/161b22/d4af37?text=BOSS';">
                <div class="boss-info">
                    <h2 class="boss-name-gradient" style="font-family: 'Cinzel', serif; letter-spacing: 1px;">${b.name.toUpperCase()}</h2>
                    <div class="subtitle-group" style="font-family: 'Cinzel', serif;">
                        <span class="boss-level">LVL ${b.level}</span> | <span class="location-text">${b.location}</span>
                    </div>
                    ${b.fixedSchedule ? 
                        `<span class="fixed-schedule-list" style="font-family: 'Cinzel', serif; color: #d4af37;">📅 FIXED SCHEDULE</span>` : 
                        `<span class="interval-text" style="font-family: 'Cinzel', serif;">⏳ RESP. EVERY ${b.interval}H</span>`
                    }
                    <input type="datetime-local" id="time-input-${b.id}" class="manual-input" style="display:none; margin-top:8px; font-family: 'Cinzel', serif;">
                </div>
                <div class="action-column">
                    ${!b.fixedSchedule ? `
                        <button class="mark-dead-btn" onclick="window.markDead('${b.id}')" style="font-family: 'Cinzel', serif;">DEAD</button>
                        <button class="set-btn" onclick="window.setManualTime('${b.id}')" style="font-family: 'Cinzel', serif;">SET</button>
                    ` : '<span class="fixed-badge" style="font-family: 'Cinzel', serif;">AUTO</span>'}
                </div>
            </div>
        `).join('');
}

function renderActivePanel() {
    const panel = document.getElementById('active-timers-display');
    const now = getJST().getTime();
    
    const map = new Map();
    activeTimers.forEach(t => map.set(t.id, t));
    const sorted = Array.from(map.values()).sort((a, b) => a.targetTime - b.targetTime);

    panel.innerHTML = sorted.length === 0 ? '<p style="text-align:center; color:#8b949e; font-family: \'Cinzel\', serif;">No active timers.</p>' : sorted.map(t => {
        const diff = t.targetTime - now;
        const isUrgent = diff < 300000 && diff > 0;
        return `
            <div class="active-timer-card ${isUrgent ? 'boss-imminent' : ''}" style="font-family: 'Cinzel', serif;">
                <div class="timer-info">
                    <h3 style="font-family: 'Cinzel', serif; letter-spacing: 1px;">${t.name.toUpperCase()}</h3>
                    <p style="font-family: 'Cinzel', serif;">Next: ${new Date(t.targetTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', hour12:false})}</p>
                </div>
                <div class="timer-values" style="text-align:right">
                    <span class="countdown-value ${isUrgent ? 'urgent' : ''}" style="font-family: 'Cinzel', serif; color:${diff < 0 ? '#ff4444' : '#4CAF50'}">
                        ${diff < 0 ? 'ALIVE' : formatTime(diff)}
                    </span>
                    ${!t.isFixed ? `<br><button class="clear-btn" onclick="window.clearTimer('${t.id}')">X</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    renderBossList();
    setInterval(() => {
        const clock = document.getElementById('jst-time-display');
        if(clock) {
            clock.textContent = "SERVER TIME (JST): " + getJST().toLocaleTimeString('en-US', {hour12:false});
            clock.style.fontFamily = "'Cinzel', serif";
        }
        renderActivePanel();
    }, 1000);
});

document.getElementById('search-boss').addEventListener('input', (e) => renderBossList(e.target.value.toLowerCase()));
