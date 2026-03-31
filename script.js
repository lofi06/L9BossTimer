import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, set, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// --- CONFIGURACIÓN FIREBASE ---
const _k = ["AIzaSyB3oUOk", "KBUpLYdPVpt5", "i2LJdJ1lqEs3HIM"];
const firebaseConfig = {
    apiKey: _k.join(""),
    authDomain: "lordnine-tracker-e3a97.firebaseapp.com",
    databaseURL: "https://lordnine-tracker-e3a97-default-rtdb.firebaseio.com",
    projectId: "lordnine-tracker-e3a97",
    storageBucket: "lordnine-tracker-e3a97.firebasestorage.app",
    appId: "1:923786523326:web:45eb3278eef5851b2524ef"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- VARIABLES GLOBALES ---
const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;
const WEEK_IN_MS = 7 * DAY_IN_MS;
// --- ALIVE DURATIONS ---
const ALIVE_1MIN = ['venatus', 'viorent'];

const ALIVE_2MIN = [
    'livera', 'undomiel', 'araneo', 'ego',
    'ladydalia', 'wannitas', 'metus', 'duplican', 'baronbraudmore'
];

const DEFAULT_ALIVE_MS = 3 * 60 * 1000;
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

// --- FUNCIONES DE TIEMPO (JST UTC+9) ---
function getAliveDuration(bossId) {
    if (ALIVE_1MIN.includes(bossId)) return 1 * 60 * 1000;
    if (ALIVE_2MIN.includes(bossId)) return 2 * 60 * 1000;
    return DEFAULT_ALIVE_MS;
}
function getNow() {
    return Date.now();
}

function calculateNextFixedTarget(boss) {
    const now = Date.now();

    const nowDate = new Date(now);

    // Convertir a JST SOLO para obtener día/hora
    const jst = new Date(nowDate.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));

    const day = jst.getDay();
    const hour = jst.getHours();
    const minute = jst.getMinutes();

    const currentTimeOfWeekMs =
        (day * DAY_IN_MS) +
        (hour * HOUR_IN_MS) +
        (minute * 60000);

    let nextTarget = Infinity;

    boss.fixedSchedule.forEach(sch => {
        const targetMs =
            (sch.day * DAY_IN_MS) +
            (sch.hour * HOUR_IN_MS) +
            (sch.minute * 60000);

        let diff = targetMs - currentTimeOfWeekMs;
        if (diff <= 0) diff += WEEK_IN_MS;

        const candidate = now + diff;

        if (candidate < nextTarget) nextTarget = candidate;
    });

    return nextTarget;
}

function formatTime(ms) {
    if (ms <= 0) return "ALIVE";

    const totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const days = Math.floor(totalHours / 24);

    //  CASO 1: más de 24h → días, horas, minutos
    if (days > 0) {
        return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
    }

    //  CASO 2: menos de 24h → horas, minutos, segundos
    return `${String(totalHours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

// --- FIREBASE LOGIC ---
onValue(ref(db, 'bosses'), (snapshot) => {
    const data = snapshot.val();
    activeTimers = [];
    const now = getNow();

    // --- Bosses con horario fijo ---
    BOSSES.filter(b => b.fixedSchedule).forEach(boss => {
        activeTimers.push({ 
            id: boss.id, 
            name: boss.name, 
            targetTime: calculateNextFixedTarget(boss), 
            isFixed: true 
        });
    });

    // --- Bosses por intervalo ---
    if (data) {
        for (let id in data) {
            const boss = BOSSES.find(b => b.id === id);
            if (boss && data[id].deathTime) {
                const deathTime = Date.parse(data[id].deathTime);
                const aliveDuration = getAliveDuration(boss.id);
                const intervalMs = boss.interval * HOUR_IN_MS;

                // Calcular el próximo spawn después de la ventana ALIVE
                let spawnTime = deathTime + aliveDuration;
                while (spawnTime < now) {
                    spawnTime += intervalMs;
                }

                activeTimers.push({
                    id: boss.id,
                    name: boss.name,
                    deathTime: deathTime,
                    interval: boss.interval,
                    isFixed: false,
                    targetTime: spawnTime
                });
            }
        }
    }

    renderActivePanel();
});

// ACCIONES
window.markDead = (id) => {
    const boss = BOSSES.find(b => b.id === id);
    if (!boss) return;

    const now = getNow();
    const aliveDuration = getAliveDuration(boss.id);
    const intervalMs = boss.interval * HOUR_IN_MS;

    // Establecer deathTime como "ahora - aliveDuration" para que al sumarle aliveDuration quede el spawn correcto
    const deathTime = now - aliveDuration;

    set(ref(db, 'bosses/' + id), { deathTime: new Date(deathTime).toISOString() });
};

window.setManualTime = (id) => {
    const input = document.getElementById(`time-input-${id}`);
    
    if (input.style.display === "none") {
        const nowJST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
        const year = nowJST.getFullYear();
        const month = String(nowJST.getMonth() + 1).padStart(2, '0');
        const day = String(nowJST.getDate()).padStart(2, '0');
        const hours = String(nowJST.getHours()).padStart(2, '0');
        const minutes = String(nowJST.getMinutes()).padStart(2, '0');
        
        input.value = `${year}-${month}-${day}T${hours}:${minutes}`;
        input.style.display = "block";
        input.focus();
    } else {
        if (input.value) {
            const [datePart, timePart] = input.value.split("T");
            const [year, month, day] = datePart.split("-").map(Number);
            const [hour, minute] = timePart.split(":").map(Number);

            const boss = BOSSES.find(b => b.id === id);
            if (!boss) return;

            const aliveDuration = getAliveDuration(boss.id);

            // Crear fecha JST
            const jstTime = new Date(year, month - 1, day, hour, minute);

            // Guardar deathTime como "hora indicada - ALIVE duration"
            const deathTime = jstTime.getTime() - aliveDuration;

            set(ref(db, 'bosses/' + id), { deathTime: new Date(deathTime).toISOString() });
            input.style.display = "none";
        } else {
            input.style.display = "none";
        }
    }
};

window.clearTimer = (id) => {
    if(confirm("¿Eliminar timer?")) remove(ref(db, 'bosses/' + id));
};

// --- RENDERIZADO ---
function renderBossList(filter = "") {
    const container = document.getElementById('bosses-container');
    container.innerHTML = BOSSES
        .filter(b => b.name.toLowerCase().includes(filter) || b.location.toLowerCase().includes(filter))
        .map(b => {
            // Generar texto de horarios si es FIXED
            let scheduleText = "";
            if (b.fixedSchedule) {
                const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                scheduleText = b.fixedSchedule.map(s => 
                    `${days[s.day]} ${String(s.hour).padStart(2,'0')}:${String(s.minute).padStart(2,'0')}`
                ).join(" | ");
            }

            return `
            <div class="boss-tracker">
                <img src="images/${b.id}.png" class="boss-image" onerror="this.src='https://via.placeholder.com/50/161b22/d4af37?text=B';">
                <div class="boss-info">
                    <h2>${b.name.toUpperCase()}</h2>
                    <div class="subtitle-group">
                        <span class="boss-level">LVL ${b.level}</span> | <span class="location-text">${b.location}</span>
                    </div>
                    ${b.fixedSchedule ? 
                        `<span class="fixed-schedule-list" style="color: #d4af37;">${scheduleText}</span>` : 
                        `<span class="interval-text">Re-Spawn Every ${b.interval}H</span>`
                    }
                    <input type="datetime-local" id="time-input-${b.id}" class="manual-input" style="display:none; margin-top:5px;">
                </div>
                <div class="action-column">
                    ${!b.fixedSchedule ? `
                        <button class="mark-dead-btn" onclick="window.markDead('${b.id}')">DEAD</button>
                        <button class="set-btn" onclick="window.setManualTime('${b.id}')">SET</button>
                    ` : '<span class="fixed-badge" style="font-weight:bold; color:#d4af37; font-size:0.8em;">AUTO</span>'}
                </div>
            </div>
        `}).join('');
}

function renderActivePanel() {
    const panel = document.getElementById('active-timers-display');
    const now = getNow();
    
    const map = new Map();
    activeTimers.forEach(t => map.set(t.id, t));
    const sorted = Array.from(map.values()).sort((a, b) => {
        const tA = a.targetTime ?? 0;
        const tB = b.targetTime ?? 0;
        return tA - tB;
    });

    if (sorted.length === 0) {
        panel.innerHTML = '<p class="no-timers">No active timers.</p>';
        return;
    }

    panel.innerHTML = sorted.map(t => {
        let targetTime;
        const boss = BOSSES.find(b => b.id === t.id);
        const aliveDuration = boss ? getAliveDuration(boss.id) : DEFAULT_ALIVE_MS;
        const intervalMs = boss ? boss.interval * HOUR_IN_MS : 3 * HOUR_IN_MS;

        if (t.isFixed) {
            targetTime = t.targetTime;
        } else {
            // Spawn inicial + ALIVE
            let spawnTime = t.deathTime + aliveDuration;

            if (now < spawnTime) {
                // Aún no apareció, timer hasta spawn
                targetTime = spawnTime;
            } else if (now < spawnTime + aliveDuration) {
                // Dentro de la ventana ALIVE
                targetTime = now; // Mostramos ALIVE
            } else {
                // Después de ALIVE, calcular siguiente spawn
                while (spawnTime < now) {
                    spawnTime += intervalMs;
                }
                targetTime = spawnTime;
            }
        }

        const diff = targetTime - now;
        const isUrgent = diff < 300000 && diff > 0;

        return `
            <div class="active-timer-card ${diff <= 0 ? 'boss-alive' : isUrgent ? 'boss-imminent' : ''}">
                <div class="timer-info">
                    <h3>${t.name}</h3>
                    <p>Next Spawn: ${diff <= 0 ? 'ALIVE' : new Date(targetTime).toLocaleString('en-US', {
                        timeZone: 'Asia/Tokyo',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    })}</p>
                </div>
                <div class="timer-values" style="text-align:right">
                    <span class="countdown-value ${diff <= 0 ? 'urgent' : ''}" style="color:${diff < 0 ? '#ff4444' : '#4CAF50'}">
                        ${diff <= 0 ? 'ALIVE' : formatTime(diff)}
                    </span>
                    ${!t.isFixed ? `<button class="clear-btn" onclick="window.clearTimer('${t.id}')">X</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderBossList();
    setInterval(() => {
        const clock = document.getElementById('jst-time-display');
        if(clock) clock.textContent = "Server Time (JST): " + new Date().toLocaleTimeString('en-US', {
    timeZone: 'Asia/Tokyo',
    hour12: false
});
        renderActivePanel();
    }, 1000);
});

document.getElementById('search-boss').addEventListener('input', (e) => renderBossList(e.target.value.toLowerCase()));
