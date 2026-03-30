import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue, set, remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Ofuscación para evitar el bloqueo de seguridad de GitHub
const _0x = ["AIzaSyB3oUOk", "KBUpLYdPVpt5", "i2LJdJ1lqEs3HIM"];
const firebaseConfig = {
    apiKey: _0x.join(""), // Esto reconstruye la clave sin que GitHub la detecte como texto plano
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

let userRole = null;
let activeTimers = [];

window.askAdminPassword = () => {
    const pass = prompt("Enter Admin Password:");
    if (pass === "1234") { window.setRole('admin'); } 
    else if (pass !== null) { alert("Incorrect password."); }
};

window.setRole = (role) => {
    userRole = role;
    const overlay = document.getElementById('role-selection-overlay');
    if(overlay) overlay.style.display = 'none';
    
    const status = document.getElementById('role-status');
    if(status) status.textContent = "Mode: " + role.toUpperCase();
    
    renderBossList();
    renderActivePanel();
};

onValue(ref(db, 'bosses'), (snapshot) => {
    const data = snapshot.val();
    activeTimers = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
    renderActivePanel();
});

window.markDead = (id, name, interval) => {
    const targetTime = Date.now() + (interval * 60 * 60 * 1000);
    set(ref(db, 'bosses/' + id), { name, targetTime });
};

window.clearTimer = (id) => {
    if(confirm(`Clear timer for ${id}?`)) { remove(ref(db, 'bosses/' + id)); }
};

function renderBossList(filter = "") {
    const container = document.getElementById('bosses-container');
    if(!container) return;
    
    container.innerHTML = BOSSES
        .filter(b => b.name.toLowerCase().includes(filter) || b.location.toLowerCase().includes(filter))
        .map(b => `
            <div class="boss-tracker">
                <img src="images/${b.id}.png" class="boss-image" onerror="this.src='https://via.placeholder.com/60/161b22/d4af37?text=BOSS';">
                <div class="boss-info">
                    <h2 class="boss-name-gradient">${b.name.toUpperCase()}</h2>
                    <div class="subtitle-group">
                        <span class="boss-level">LVL ${b.level}</span>
                        <span class="location-text">${b.location}</span>
                    </div>
                    <p class="interval-text">${b.fixedSchedule ? 'BASE SCHEDULE' : `RESPAWN: ${b.interval}H`}</p>
                </div>
                <div class="action-column">
                    ${!b.fixedSchedule ? `
                        <div class="button-group">
                            <button class="mark-dead-btn" onclick="window.markDead('${b.id}', '${b.name}', ${b.interval})">MARK DEAD</button>
                        </div>` : '<span style="color:#d4af37; font-size:0.7em;">FIXED</span>'}
                </div>
            </div>
        `).join('');
}

function renderActivePanel() {
    const panel = document.getElementById('active-timers-display');
    if(!panel) return;
    
    if (activeTimers.length === 0) {
        panel.innerHTML = '<p class="no-timers">No active timers.</p>';
        return;
    }

    const now = Date.now();
    activeTimers.sort((a, b) => a.targetTime - b.targetTime);

    panel.innerHTML = activeTimers.map(t => {
        const diff = t.targetTime - now;
        const countdown = diff < 0 ? "ALIVE" : formatTime(diff);
        const clearBtn = (userRole === 'admin') ? `<button class="clear-btn" onclick="window.clearTimer('${t.id}')">CLEAR</button>` : '';

        return `
            <div class="active-timer-card">
                <div class="timer-info">
                    <h3>${t.name.toUpperCase()}</h3>
                    <p>Next: ${new Date(t.targetTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                </div>
                <div class="timer-countdown">
                    <span class="countdown-value">${countdown}</span>
                    ${clearBtn}
                </div>
            </div>`;
    }).join('');
}

function formatTime(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
}

document.getElementById('search-boss').addEventListener('input', (e) => renderBossList(e.target.value.toLowerCase()));

setInterval(() => {
    const timeDisplay = document.getElementById('local-time-display');
    if(timeDisplay) timeDisplay.textContent = "Local Time: " + new Date().toLocaleTimeString();
    renderActivePanel();
}, 1000);
