import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue, set, remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// --- SEGURIDAD OFUSCADA ---
const _k = ["AIzaSyB3oUOk", "KBUpLYdPVpt5", "i2LJdJ1lqEs3HIM"];
const firebaseConfig = {
    apiKey: _k.join(""),
    authDomain: "lordnine-tracker-e3a97.firebaseapp.com",
    databaseURL: "https://lordnine-tracker-e3a97-default-rtdb.firebaseio.com",
    projectId: "lordnine-tracker-e3a97",
    storageBucket: "lordnine-tracker-e3a97.firebasestorage.app",
    messagingSenderId: "923786523326",
    appId: "1:923786523326:web:45eb3278eef5851b2524ef"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- DATA ---
const BOSSES = [
    { id: 'venatus', name: 'Venatus', level: 60, interval: 10, location: 'Corrupted Basin' }, 
    { id: 'viorent', name: 'Viorent', level: 65, interval: 10, location: 'Crecent Lake' }, 
    { id: 'ego', name: 'Ego', level: 70, interval: 21, location: 'Ulan Canyon' }, 
    { id: 'clemantis', name: 'Clemantis', level: 70, interval: 24, fixedSchedule: true, location: 'Corrupted Basin' }, 
    { id: 'livera', name: 'Livera', level: 75, interval: 24, location: "Protector's Ruin" }, 
    { id: 'araneo', name: 'Araneo', level: 75, interval: 24, location: 'Lower Tomb of Tyriosa 1F' }, 
    { id: 'undomiel', name: 'Undomiel', level: 80, interval: 24, location: 'Secret Laboratory' }, 
    { id: 'saphirus', name: 'Saphirus', level: 80, interval: 24, fixedSchedule: true, location: 'Crecent Lake' }, 
    { id: 'neutro', name: 'Neutro', level: 80, interval: 24, fixedSchedule: true, location: 'Desert of the Screaming' }, 
    { id: 'ladydalia', name: 'Lady Dalia', level: 85, interval: 18, location: 'Twilight Hill' }, 
    { id: 'generalaquleus', name: 'General Aquleus', level: 85, interval: 29, location: 'Lower Tomb of Tyriosa 2F' }, 
    { id: 'thymele', name: 'Thymele', level: 85, interval: 24, fixedSchedule: true, location: 'Twilight Hill' }, 
    { id: 'ringor', name: 'Ringor', level: 85, interval: 24, fixedSchedule: true, location: 'Battlefield of Templar' }, 
    { id: 'amentis', name: 'Amentis', level: 88, interval: 29, location: 'Land of Glory' }, 
    { id: 'baronbraudmore', name: 'Baron Braudmore', level: 88, interval: 32, location: 'Battlefield of Templar' }, 
    { id: 'milavy', name: 'Milavy', level: 90, interval: 24, fixedSchedule: true, location: 'Lower Tomb of Tyriosa 3F' }, 
    { id: 'wannitas', name: 'Wannitas', level: 93, interval: 48, location: 'Plateau of Revolution' }, 
    { id: 'metus', name: 'Metus', level: 93, interval: 48, location: 'Plateau of Revolution' }, 
    { id: 'duplican', name: 'Duplican', level: 93, interval: 48, location: 'Plateau of Revolution' }, 
    { id: 'shuliar', name: 'Shuliar', level: 95, interval: 35, location: 'Ruins of the War' }, 
    { id: 'roderick', name: 'Roderick', level: 95, interval: 24, fixedSchedule: true, location: 'Garbana Underground Waterway 1' }, 
    { id: 'gareth', name: 'Gareth', level: 98, interval: 32, location: "Deadman's Land District 1" }, 
    { id: 'titore', name: 'Titore', level: 98, interval: 37, location: "Deadman's Land District 2" }, 
    { id: 'larba', name: 'Larba', level: 98, interval: 35, location: 'Ruins of the War' }, 
    { id: 'catena', name: 'Catena', level: 100, interval: 35, location: "Deadman's Land District 3" }, 
    { id: 'secreta', name: 'Secreta', level: 100, interval: 62, location: 'Silvergrass Field' }, 
    { id: 'ordo', name: 'Ordo', level: 100, interval: 62, location: 'Silvergrass Field' }, 
    { id: 'asta', name: 'Asta', level: 100, interval: 62, location: 'Silvergrass Field' }, 
    { id: 'supore', name: 'Supore', level: 100, interval: 62, location: 'Silvergrass Field' }, 
    { id: 'auraq', name: 'Auraq', level: 100, interval: 24, fixedSchedule: true, location: 'Garbana Underground Waterway 2' }, 
    { id: 'chaiflock', name: 'Chaiflock', level: 120, interval: 24, fixedSchedule: true, location: 'Silvergrass Field' }, 
    { id: 'benji', name: 'Benji', level: 120, interval: 24, fixedSchedule: true, location: 'Barbas' },
    { id: 'libitina', name: 'Libitina', level: 130, interval: 24, fixedSchedule: true, location: 'Volcano Dracas' },
    { id: 'rakajeth', name: 'Rakajeth', level: 130, interval: 24, fixedSchedule: true, location: 'Volcano Dracas' },
    { id: 'icaruthia', name: 'Icaruthia', level: 135, interval: 24, fixedSchedule: true, location: 'Kransia' },
    { id: 'motti', name: 'Motti', level: 135, interval: 24, fixedSchedule: true, location: 'Kransia' },
    { id: 'nevaeh', name: 'Nevaeh', level: 140, interval: 24, fixedSchedule: true, location: 'Kransia' },
    { id: 'tumier', name: 'Tumier', level: 140, interval: 24, fixedSchedule: true, location: 'Kransia' },
];

let userRole = null;
let activeTimers = [];

// --- HELPER JST (UTC+9) ---
function getJST() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
}

// --- LOGICA ---
window.askAdminPassword = () => {
    const pass = prompt("Enter Admin Password:");
    if (pass === "1234") window.setRole('admin');
    else if (pass !== null) alert("Wrong Password");
};

window.setRole = (role) => {
    userRole = role;
    document.getElementById('role-selection-overlay').style.display = 'none';
    document.getElementById('role-status').textContent = "Mode: " + role.toUpperCase();
    renderBossList();
};

window.markDead = (id, name, interval) => {
    const targetTime = getJST().getTime() + (interval * 60 * 60 * 1000);
    set(ref(db, 'bosses/' + id), { name, targetTime });
};

window.clearTimer = (id) => {
    if(confirm("Remove this timer?")) remove(ref(db, 'bosses/' + id));
};

onValue(ref(db, 'bosses'), (snapshot) => {
    const data = snapshot.val();
    activeTimers = data ? Object.keys(data).map(k => ({ id: k, ...data[k] })) : [];
    document.getElementById('loading-screen').style.display = 'none';
    renderActivePanel();
});

function renderBossList(filter = "") {
    const container = document.getElementById('bosses-container');
    container.innerHTML = BOSSES
        .filter(b => b.name.toLowerCase().includes(filter) || b.location.toLowerCase().includes(filter))
        .map(b => `
            <div class="boss-tracker">
                <img src="images/${b.id}.png" class="boss-image" onerror="this.src='https://via.placeholder.com/60/161b22/d4af37?text=BOSS';">
                <div class="boss-info">
                    <h2 class="boss-name-gradient">${b.name.toUpperCase()}</h2>
                    <div class="subtitle-group">
                        <span class="boss-level">LVL ${b.level}</span> - <span class="location-text">${b.location}</span>
                    </div>
                    <p style="font-size:0.8em; margin:5px 0;">${b.fixedSchedule ? 'FIXED SCHEDULE' : `INTERVAL: ${b.interval}H`}</p>
                </div>
                <div class="action-column" style="margin-left:auto;">
                    ${!b.fixedSchedule ? `<button class="mark-dead-btn" onclick="window.markDead('${b.id}', '${b.name}', ${b.interval})">DEAD</button>` : ''}
                </div>
            </div>
        `).join('');
}

function renderActivePanel() {
    const panel = document.getElementById('active-timers-display');
    const now = getJST().getTime();
    activeTimers.sort((a, b) => a.targetTime - b.targetTime);

    panel.innerHTML = activeTimers.map(t => {
        const diff = t.targetTime - now;
        const imminent = diff > 0 && diff < 300000;
        return `
            <div class="active-timer-card ${imminent ? 'boss-imminent' : ''}">
                <div>
                    <h3>${t.name}</h3>
                    <p>JST: ${new Date(t.targetTime).toLocaleTimeString('en-US', {hour12:false, timeZone:'Asia/Tokyo'})}</p>
                </div>
                <div style="text-align:right">
                    <span class="countdown-value">${diff < 0 ? 'ALIVE' : formatTime(diff)}</span>
                    <br>${userRole === 'admin' ? `<button class="clear-btn" onclick="window.clearTimer('${t.id}')">CLEAR</button>` : ''}
                </div>
            </div>
        `;
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
    document.getElementById('jst-time-display').textContent = "Server Time (JST): " + getJST().toLocaleTimeString('en-US', {hour12:false});
    renderActivePanel();
}, 1000);
