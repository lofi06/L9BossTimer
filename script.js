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
let cachedFirebaseData = null;

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

// --- NOTIFICACIONES (NAVEGADOR + DISCORD) ---
const CLOUDFLARE_WORKER = 'https://lordnine-discord.lofialter.workers.dev/';

// Sets para evitar notificaciones duplicadas por evento y ciclo
const notifiedWarning = new Set();  // Avisó "5 min antes"
const notifiedAlive   = new Set();  // Avisó "spawneó"

function requestNotificationPermission() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// --- Envío a Discord vía Cloudflare Worker ---
function sendDiscord(embed) {
    fetch(CLOUDFLARE_WORKER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] })
    }).catch(() => {}); // Silenciar errores de red para no romper el tracker
}

// --- Notificación del navegador ---
function browserNotify(title, body, tag) {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    new Notification(title, { body, tag, silent: false });
}

// --- 5 minutos antes del spawn ---
function notifyWarning(boss, spawnTime) {
    if (notifiedWarning.has(boss.id)) return;
    notifiedWarning.add(boss.id);

    const spawnJST = new Date(spawnTime).toLocaleTimeString('en-US', {
        timeZone: 'Asia/Tokyo', hour: 'numeric', minute: '2-digit', hour12: true
    });

    // Navegador
    browserNotify(
        `⏰ ${boss.name} spawns in 5 min!`,
        `📍 ${boss.location}\n🕐 ${spawnJST} (JST)`,
        `warn-${boss.id}`
    );

    // Discord
    sendDiscord({
        title: `⏰ ${boss.name} — 5 minutes to spawn!`,
        color: 0xd4af37,
        fields: [
            { name: '📍 Location', value: boss.location, inline: true },
            { name: '🕐 Spawn Time (JST)', value: spawnJST, inline: true },
            { name: '⚔️ Level', value: `${boss.level}`, inline: true }
        ],
        footer: { text: 'LordNine Boss Tracker' }
    });
}

// --- Boss spawneó (entró en ventana ALIVE) ---
function notifySpawned(boss, spawnTime) {
    if (notifiedAlive.has(boss.id)) return;
    notifiedAlive.add(boss.id);

    const spawnJST = new Date(spawnTime).toLocaleTimeString('en-US', {
        timeZone: 'Asia/Tokyo', hour: 'numeric', minute: '2-digit', hour12: true
    });

    // Navegador
    browserNotify(
        `✅ ${boss.name} has spawned!`,
        `📍 ${boss.location}\n🕐 ${spawnJST} (JST)`,
        `alive-${boss.id}`
    );

    // Discord
    sendDiscord({
        title: `✅ ${boss.name} — SPAWNED!`,
        color: 0x2ecc71,
        fields: [
            { name: '📍 Location', value: boss.location, inline: true },
            { name: '🕐 Spawn Time (JST)', value: spawnJST, inline: true },
            { name: '⚔️ Level', value: `${boss.level}`, inline: true }
        ],
        footer: { text: 'LordNine Boss Tracker' }
    });
}

// --- Boss marcado como muerto manualmente ---
function notifyDead(bossId) {
    const boss = BOSSES.find(b => b.id === bossId);
    if (!boss) return;

    const nowJST = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Tokyo', hour: 'numeric', minute: '2-digit', hour12: true
    });

    // Navegador
    browserNotify(
        `💀 ${boss.name} was killed!`,
        `📍 ${boss.location}\n🕐 ${nowJST} (JST)`,
        `dead-${boss.id}`
    );

    // Discord
    sendDiscord({
        title: `💀 ${boss.name} — KILLED`,
        color: 0xc0392b,
        fields: [
            { name: '📍 Location', value: boss.location, inline: true },
            { name: '🕐 Killed at (JST)', value: nowJST, inline: true },
            { name: '⚔️ Level', value: `${boss.level}`, inline: true }
        ],
        footer: { text: 'LordNine Boss Tracker' }
    });
}

// --- Revisión cada segundo ---
function checkSpawnNotifications() {
    const now = getNow();
    const NOTIFY_MS = 5 * 60 * 1000;
    const WINDOW_MS = 10 * 1000;

    activeTimers.forEach(t => {
        const boss = BOSSES.find(b => b.id === t.id);
        if (!boss) return;

        if (t.phase === 'alive') {
            // Boss spawneó → notificar una sola vez
            notifySpawned(boss, t.targetTime);
        } else {
            // Revisar si está a 5 minutos
            const diff = t.targetTime - now;
            if (diff > 0 && diff <= NOTIFY_MS + WINDOW_MS && diff > NOTIFY_MS - WINDOW_MS) {
                notifyWarning(boss, t.targetTime);
            }
        }
    });
}

// --- AUTO-DEATH TRACKING ---
// Guarda los timeouts de auto-muerte para cancelarlos si el usuario interactúa
const autoDeathTimeouts = {};

function scheduleAutoDeath(bossId, spawnTime) {
    // Cancelar cualquier auto-muerte previa pendiente para este boss
    if (autoDeathTimeouts[bossId]) {
        clearTimeout(autoDeathTimeouts[bossId]);
        delete autoDeathTimeouts[bossId];
    }

    const boss = BOSSES.find(b => b.id === bossId);
    if (!boss) return;

    const aliveDuration = getAliveDuration(bossId);
    // El auto-death ocurre cuando termina la ventana ALIVE (spawn + aliveDuration)
    const autoDeathAt = spawnTime + aliveDuration;
    const delay = autoDeathAt - getNow();

    if (delay <= 0) {
        // Ya pasó la ventana ALIVE, registrar muerte inmediatamente
        set(ref(db, 'bosses/' + bossId), { deathTime: new Date(autoDeathAt).toISOString() });
        return;
    }

    autoDeathTimeouts[bossId] = setTimeout(() => {
        // Registrar la muerte en el momento exacto en que terminó la ventana ALIVE
        set(ref(db, 'bosses/' + bossId), { deathTime: new Date(autoDeathAt).toISOString() });
        delete autoDeathTimeouts[bossId];
    }, delay);
}

// --- CÁLCULO DE TIMERS (reutilizable desde onValue y desde setInterval) ---
function recomputeActiveTimers() {
    const data = cachedFirebaseData;
    activeTimers = [];
    const now = getNow();

    // Bosses Fijos
    BOSSES.filter(b => b.fixedSchedule).forEach(boss => {
        activeTimers.push({
            id: boss.id,
            name: boss.name,
            targetTime: calculateNextFixedTarget(boss),
            isFixed: true
        });
    });

    // Bosses por Intervalo
    if (data) {
        for (let id in data) {
            const boss = BOSSES.find(b => b.id === id);
            if (boss && data[id].deathTime) {
                const deathTime = Date.parse(data[id].deathTime);
                const aliveDuration = getAliveDuration(boss.id);
                const intervalMs = boss.interval * HOUR_IN_MS;

                // Spawn = muerte + interval
                let spawnTime = deathTime + intervalMs;

                // Avanzar ciclos hasta el actual
                while (spawnTime + aliveDuration < now) {
                    spawnTime += intervalMs;
                }

                // CASO A: El boss aún no ha spawneado → countdown normal
                if (spawnTime > now) {
                    activeTimers.push({
                        id: boss.id,
                        name: boss.name,
                        targetTime: spawnTime,
                        isFixed: false,
                        phase: 'countdown'
                    });
                }
                // CASO B: El boss spawneó y está en ventana ALIVE
                else if (spawnTime <= now && now < spawnTime + aliveDuration) {
                    const aliveEndsAt = spawnTime + aliveDuration;
                    activeTimers.push({
                        id: boss.id,
                        name: boss.name,
                        targetTime: spawnTime,
                        aliveEndsAt: aliveEndsAt,
                        isFixed: false,
                        phase: 'alive'
                    });
                    scheduleAutoDeath(boss.id, spawnTime);
                }
                // CASO C: ventana ALIVE terminó, scheduleAutoDeath se encarga
            }
        }
    }
}

// --- FIREBASE LOGIC ---
onValue(ref(db, 'bosses'), (snapshot) => {
    cachedFirebaseData = snapshot.val(); // Guardar en cache local
    recomputeActiveTimers();
    renderActivePanel();
});

// ACCIONES
window.markDead = (id) => {
    // Cancelar auto-muerte pendiente si el usuario marcó manualmente
    if (autoDeathTimeouts[id]) {
        clearTimeout(autoDeathTimeouts[id]);
        delete autoDeathTimeouts[id];
    }
    // Notificar muerte manual
    notifyDead(id);
    // Limpiar sets para que el próximo ciclo vuelva a notificar
    notifiedWarning.delete(id);
    notifiedAlive.delete(id);
    set(ref(db, 'bosses/' + id), { deathTime: new Date().toISOString() });
};

window.setManualTime = (id) => {
    const input = document.getElementById(`time-input-${id}`);
    
    // Si está oculto, lo mostramos y cargamos la hora de Japón actual
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
        // Si ya es visible y tiene valor, guardamos
        if (input.value) {
            
            // Crear fecha como JST y convertir a UTC correctamente
            const [datePart, timePart] = input.value.split("T");
            const [year, month, day] = datePart.split("-").map(Number);
            const [hour, minute] = timePart.split(":").map(Number);
            
            // Crear fecha en UTC equivalente a JST
            const utcTime = Date.UTC(year, month - 1, day, hour - 9, minute);
            
            // Cancelar auto-muerte pendiente si el usuario seteó manualmente
            if (autoDeathTimeouts[id]) {
                clearTimeout(autoDeathTimeouts[id]);
                delete autoDeathTimeouts[id];
            }
            // Limpiar sets para que el próximo ciclo vuelva a notificar
            notifiedWarning.delete(id);
            notifiedAlive.delete(id);

            // isManual: true → el spawn siguiente NO suma aliveDuration
            set(ref(db, 'bosses/' + id), { deathTime: new Date(utcTime).toISOString(), isManual: true });
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
function getBossRowClass(bossId) {
    const timer = activeTimers.find(t => t.id === bossId);
    if (!timer) return 'boss-row-inactive';
    if (timer.phase === 'alive') return 'boss-row-alive';
    return 'boss-row-active';
}

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
            const rowClass = getBossRowClass(b.id);

            return `
            <div class="boss-tracker ${rowClass}" data-id="${b.id}">
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
    const sorted = Array.from(map.values()).sort((a, b) => a.targetTime - b.targetTime);

    if (sorted.length === 0) {
        panel.innerHTML = '<p class="no-timers">No active timers.</p>';
        return;
    }

    panel.innerHTML = sorted.map(t => {
        const isAlive = t.phase === 'alive';
        const diff = t.targetTime - now;
        
        let countdownHtml = '';
        let spawnLabel = '';
        let cardClass = '';

        if (isAlive) {
            // Mostrar tiempo restante de ventana ALIVE
            const aliveRemaining = t.aliveEndsAt - now;
            const aliveSeconds = Math.max(0, Math.ceil(aliveRemaining / 1000));
            const aliveMin = String(Math.floor(aliveSeconds / 60)).padStart(2, '0');
            const aliveSec = String(aliveSeconds % 60).padStart(2, '0');

            cardClass = 'boss-alive';
            spawnLabel = `Auto-death in: ${aliveMin}:${aliveSec}`;
            countdownHtml = `<span class="countdown-value alive-blink" style="color:#2ecc71;">ALIVE</span>`;
        } else {
            const isUrgent = diff < 300000 && diff > 0;
            cardClass = isUrgent ? 'boss-imminent' : '';
            spawnLabel = `Next Spawn: ${new Date(t.targetTime).toLocaleString('en-US', {
                timeZone: 'Asia/Tokyo',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })}`;
            countdownHtml = `
                <span class="countdown-value ${isUrgent ? 'urgent' : ''}" style="color:#4CAF50;">
                    ${formatTime(diff)}
                </span>
            `;
        }

        return `
            <div class="active-timer-card ${cardClass}">
                <div class="timer-info">
                    <h3>${t.name}</h3>
                    <p>${spawnLabel}</p>
                </div>
                <div class="timer-values" style="text-align:right">
                    ${countdownHtml}
                    ${!t.isFixed ? `<button class="clear-btn" onclick="window.clearTimer('${t.id}')">X</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Actualiza SOLO las clases de borde de cada fila sin reconstruir el DOM
function updateBossRowClasses() {
    BOSSES.forEach(b => {
        const row = document.querySelector(`.boss-tracker[data-id="${b.id}"]`);
        if (!row) return;
        const newClass = getBossRowClass(b.id);
        // Solo tocar el DOM si cambió la clase
        ['boss-row-inactive', 'boss-row-active', 'boss-row-alive'].forEach(c => row.classList.remove(c));
        row.classList.add(newClass);
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    requestNotificationPermission();
    renderBossList();
    setInterval(() => {
        const clock = document.getElementById('jst-time-display');
        if(clock) clock.textContent = "Server Time (JST): " + new Date().toLocaleTimeString('en-US', {
    timeZone: 'Asia/Tokyo',
    hour12: false
});
        // Recalcular fases y actualizar bordes sin reconstruir el DOM completo
        recomputeActiveTimers();
        updateBossRowClasses();
        checkSpawnNotifications();
        renderActivePanel();
    }, 1000);
});

document.getElementById('search-boss').addEventListener('input', (e) => renderBossList(e.target.value.toLowerCase()));
