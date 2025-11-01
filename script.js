// =======================================================
// 1. BOSS CONFIGURATION AND GLOBAL VARIABLES
// =======================================================

const HOUR_IN_MS = 60 * 60 * 1000;
const SERVER_TIMEZONE_OFFSET = 8; 

// IMPORTANT! Level and Location added.
const BOSSES = [
    // --- Bosses Level 60-85 ---
    { id: 'venatus', name: 'Venatus', level: 60, interval: 10, location: 'Corrupted Basin' }, 
    { id: 'viorent', name: 'Vioret', level: 65, interval: 10, location: 'Crecent Lake' }, 
    { id: 'ego', name: 'Ego', level: 70, interval: 21, location: 'Ulan Canyon' }, 
    { id: 'clemantis', name: 'Clemantis', level: 70, interval: 24, fixedSchedule: [
        { day: 1, hour: 11, minute: 30 }, 
        { day: 4, hour: 19, minute: 0 } 
    ], location: 'Corrupted Basin' }, 
    { id: 'livera', name: 'Livera', level: 75, interval: 24, location: "Protector's Ruin" }, 
    { id: 'araneo', name: 'Araneo', level: 75, interval: 24, location: 'Lower Tomb of Tyriosa 1F' }, 
    { id: 'undomiel', name: 'Undomiel', level: 80, interval: 24, location: 'Secret Laboratory' }, 
    { id: 'saphirus', name: 'Saphirus', level: 80, interval: 24, fixedSchedule: [
        { day: 0, hour: 17, minute: 0 }, 
        { day: 2, hour: 11, minute: 30 } 
    ], location: 'Crecent Lake' }, 
    { id: 'neutro', name: 'Neutro', level: 80, interval: 24, fixedSchedule: [
        { day: 2, hour: 19, minute: 0 }, 
        { day: 4, hour: 11, minute: 30 } 
    ], location: 'Desert of the Screaming' }, 
    { id: 'ladydalia', name: 'Lady Dalia', level: 85, interval: 18, location: 'Twilight Hill' }, 
    { id: 'generalaquleus', name: 'General Aquleus', level: 85, interval: 29, location: 'Lower Tomb of Tyriosa 2F' }, 
    { id: 'thymele', name: 'Thymele', level: 85, interval: 24, fixedSchedule: [
        { day: 1, hour: 19, minute: 0 }, 
        { day: 3, hour: 11, minute: 30 } 
    ], location: 'Twilight Hill' }, 
    { id: 'amentis', name: 'Amentis', level: 88, interval: 29, location: 'Land of Glory' }, 
    { id: 'baronbraudmore', name: 'Baron Braudmore', level: 88, interval: 32, location: 'Battlefield of Templar' }, 
    { id: 'milavy', name: 'Milavy', level: 90, interval: 24, fixedSchedule: [
        { day: 6, hour: 15, minute: 0 } 
    ], location: 'Lower Tomb of Tyriosa 3F' }, 
    
    // --- Bosses Level 93-120 ---
    { id: 'wannitas', name: 'Wannitas', level: 93, interval: 48, location: 'Plateau of Revolution' }, 
    { id: 'metus', name: 'Metus', level: 93, interval: 48, location: 'Plateau of Revolution' }, 
    { id: 'duplican', name: 'Duplican', level: 93, interval: 48, location: 'Plateau of Revolution' }, 
    { id: 'shuliar', name: 'Shuliar', level: 95, interval: 35, location: 'Ruins of the War' }, 
    { id: 'ringor', name: 'Ringor', level: 95, interval: 24, fixedSchedule: [
        { day: 6, hour: 17, minute: 0 } 
    ], location: 'Battlefield of Templar' }, 
    { id: 'roderick', name: 'Roderick', level: 95, interval: 24, fixedSchedule: [
        { day: 5, hour: 19, minute: 0 } 
    ], location: 'Garbana Underground Waterway 1' }, 
    { id: 'gareth', name: 'Gareth', level: 98, interval: 32, location: "Deadman's Land District 1" }, 
    { id: 'titore', name: 'Titore', level: 98, interval: 37, location: "Deadman's Land District 2" }, 
    { id: 'larba', name: 'Larba', level: 98, interval: 35, location: 'Ruins of the War' }, 
    { id: 'catena', name: 'Catena', level: 100, interval: 35, location: "Deadman's Land District 3" }, 
    { id: 'auraq', name: 'Auraq', level: 100, interval: 62, fixedSchedule: [
        { day: 5, hour: 22, minute: 0 }, 
        { day: 3, hour: 21, minute: 0 }  
    ], location: 'Garbana Underground Waterway 2' }, 
    { id: 'secreta', name: 'Secreta', level: 100, interval: 62, location: 'Silvergrass Field' }, 
    { id: 'ordo', name: 'Ordo', level: 100, interval: 62, location: 'Silvergrass Field' }, 
    { id: 'asta', name: 'Asta', level: 100, interval: 62, location: 'Silvergrass Field' }, 
    { id: 'supore', name: 'Supore', level: 100, interval: 62, location: 'Silvergrass Field' }, 
    
    { id: 'chaiflock', name: 'Chaiflock', level: 120, interval: 24, fixedSchedule: [
        { day: 6, hour: 22, minute: 0 } 
    ], location: 'Silvergrass Field' }, 
    { id: 'benji', name: 'Benji', level: 120, interval: 24, fixedSchedule: [
        { day: 0, hour: 21, minute: 0 } 
    ], location: 'Barbas' }, 
];

const container = document.getElementById('bosses-container');
let countdownIntervals = {};
let activeTimers = [];

// =======================================================
// 2. PERSISTENCE AND UTILITIES
// =======================================================

function saveDeathTime(bossId, timeValue) {
    if (timeValue) {
        localStorage.setItem(`lordnine-death-time-${bossId}`, timeValue);
    } else {
        localStorage.removeItem(`lordnine-death-time-${bossId}`);
    }
}

function loadDeathTime(bossId) {
    return localStorage.getItem(`lordnine-death-time-${bossId}`) || '';
}

function saveAllData() {
    BOSSES.forEach(boss => {
        if (typeof boss.interval === 'number' && !boss.fixedSchedule) { 
            const input = document.getElementById(`time-input-${boss.id}`);
            if (input && input.value) {
                saveDeathTime(boss.id, input.value);
                startTimer(boss, input.value);
            }
        }
    });
    alert("Times saved and timers updated!");
    updateActivePanel();
}

function clearTimer(bossId) {
    saveDeathTime(bossId, '');
    
    // Clear interval
    if (countdownIntervals[bossId]) {
        clearInterval(countdownIntervals[bossId]);
        delete countdownIntervals[bossId];
    }
    
    // Find boss to check if it's fixed
    const boss = BOSSES.find(b => b.id === bossId);
    
    // Remove from the active panel list (unless it's a fixed boss, which should reload)
    activeTimers = activeTimers.filter(t => t.id !== bossId);

    // If it was a variable boss, reset the card UI
    if (boss && !boss.fixedSchedule) {
        const input = document.getElementById(`time-input-${bossId}`);
        if (input) input.value = '';
        const nextSpawnDisplay = document.getElementById(`next-spawn-display-${bossId}`);
        if (nextSpawnDisplay) nextSpawnDisplay.textContent = "Next Spawn: N/A";
    }

    // Re-initialize fixed timer if it was a fixed boss
    if (boss && boss.fixedSchedule) {
         startFixedScheduleTimer(boss); 
    }
    
    updateActivePanel();
}

// =======================================================
// 3. FIXED SCHEDULE UTILITIES (NEW)
// =======================================================

/**
 * Calculates the next UTC+8 fixed spawn time in milliseconds (Local Time).
 */
function calculateNextFixedTarget(boss) {
    if (!boss.fixedSchedule) return null;

    const now = new Date().getTime();
    let nextTarget = Infinity; 
    
    // Check this week and next week to find the nearest future time
    for (let weekOffset = 0; weekOffset <= 1; weekOffset++) { 
        boss.fixedSchedule.forEach(schedule => {
            let date = new Date();
            
            // Set the day of the week, adjusted for the current week or next week (weekOffset * 7)
            date.setDate(date.getDate() - date.getDay() + schedule.day + (weekOffset * 7));

            // Set the UTC time based on the server time (UTC+8). 
            // We subtract the offset to get the correct absolute UTC time.
            date.setUTCHours(schedule.hour - SERVER_TIMEZONE_OFFSET, schedule.minute, 0, 0);
            const targetTimeMs = date.getTime();

            if (targetTimeMs > now && targetTimeMs < nextTarget) {
                nextTarget = targetTimeMs;
            }
        });
    }

    return (nextTarget !== Infinity) ? nextTarget : null; 
}


/**
 * Converts a server schedule (UTC+8) to the user's local time string,
 * respecting the 12h (AM/PM) format for UI display in the boss list.
 */
function convertFixedSchedule(schedule) {
    const now = new Date();
    // Create a temporary date and set the UTC time based on the schedule
    const tempDate = new Date();
    tempDate.setUTCHours(schedule.hour - SERVER_TIMEZONE_OFFSET, schedule.minute, 0, 0);

    // Get the difference in days from now to the scheduled day
    let diff = schedule.day - now.getDay();
    // Adjust the date to the correct day of the week
    tempDate.setDate(now.getDate() + diff);

    // Use 'en-US' for English day/time format
    const dayOfWeek = tempDate.toLocaleDateString('en-US', { weekday: 'long' });
    const time = tempDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    });
    
    return `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)} ${time}`;
}

// =======================================================
// 4. TIMER LOGIC AND ACTIVE PANEL
// =======================================================

function calculateNextSpawn(deathTimeMs, intervalMs) {
    let nextSpawnTarget = deathTimeMs + intervalMs;
    const now = new Date().getTime();
    while (nextSpawnTarget < now) {
        nextSpawnTarget += intervalMs;
    }
    return nextSpawnTarget;
}


function startTimer(boss, timeValue) {
    if (typeof boss.interval !== 'number' || boss.fixedSchedule) return; 
    
    const lastKilledInput = timeValue || document.getElementById(`time-input-${boss.id}`).value;
    
    if (!lastKilledInput) return;
    
    saveDeathTime(boss.id, lastKilledInput);

    const deathTime = new Date(lastKilledInput).getTime(); 
    const intervalMs = boss.interval * HOUR_IN_MS;
    let nextSpawnTarget = calculateNextSpawn(deathTime, intervalMs);
    
    // 1. Update the active timers list
    let timerIndex = activeTimers.findIndex(t => t.id === boss.id);
    if (timerIndex > -1) {
        activeTimers[timerIndex].targetTime = nextSpawnTarget;
        activeTimers[timerIndex].intervalMs = intervalMs;
        activeTimers[timerIndex].isFixed = false; // Ensure it's marked as variable
    } else {
        activeTimers.push({
            id: boss.id,
            name: boss.name,
            targetTime: nextSpawnTarget,
            intervalMs: intervalMs,
            isFixed: false
        });
    }
    
    // 2. Clear previous interval and set new one
    if (countdownIntervals[boss.id]) {
        clearInterval(countdownIntervals[boss.id]);
    }
    
    countdownIntervals[boss.id] = setInterval(() => {
        updateCountdown(boss.id, intervalMs);
    }, 1000);

    // Execute immediately to update the UI
    updateCountdown(boss.id, intervalMs);
    updateActivePanel();
}


/**
 * NEW: Starts the automatic timer for fixed schedule bosses.
 */
function startFixedScheduleTimer(boss) {
    if (!boss.fixedSchedule) return;

    const nextSpawnTarget = calculateNextFixedTarget(boss);
    if (!nextSpawnTarget) return;

    // 1. Update the active timers list
    let timerIndex = activeTimers.findIndex(t => t.id === boss.id);
    if (timerIndex > -1) {
        activeTimers[timerIndex].targetTime = nextSpawnTarget;
        activeTimers[timerIndex].intervalMs = 7 * 24 * HOUR_IN_MS; // Use 7 days for recurrence check
        activeTimers[timerIndex].isFixed = true;
    } else {
        activeTimers.push({
            id: boss.id,
            name: boss.name,
            targetTime: nextSpawnTarget,
            intervalMs: 7 * 24 * HOUR_IN_MS,
            isFixed: true
        });
    }

    // 2. Clear previous interval and set new one. Fixed timers only need to update the panel.
    if (countdownIntervals[boss.id]) {
        clearInterval(countdownIntervals[boss.id]);
    }
    
    countdownIntervals[boss.id] = setInterval(updateActivePanel, 1000); 

    updateActivePanel();
}


function updateCountdown(bossId, intervalMs) {
    const now = new Date().getTime();
    let timer = activeTimers.find(t => t.id === bossId);

    // Only update the main card countdown for VARIABLE bosses
    if (!timer || timer.isFixed) return; 

    let difference = timer.targetTime - now;
    const displayCard = document.getElementById(`countdown-display-${bossId}`);
    const nextSpawnDisplayCard = document.getElementById(`next-spawn-display-${bossId}`);
    
    if (difference < 0) {
        // Reset to the next spawn for variable boss
        timer.targetTime = calculateNextSpawn(timer.targetTime, timer.intervalMs);
        difference = timer.targetTime - now; 
        
        if (displayCard) displayCard.classList.add('active'); 
        setTimeout(() => {
            if (displayCard) displayCard.classList.remove('active');
        }, 3000); 
    }
    
    const nextSpawnDate = new Date(timer.targetTime);
    const nextSpawnTimeString = nextSpawnDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    });
    
    // Update the main card
    if (nextSpawnDisplayCard) {
        nextSpawnDisplayCard.textContent = nextSpawnTimeString + " (Local)";
    }
    
    const hours = Math.floor(difference / HOUR_IN_MS);
    const minutes = Math.floor((difference % HOUR_IN_MS) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    const formatTime = (n) => (n < 10 ? "0" + n : n);
    const countdownText = `${formatTime(hours)}h ${formatTime(minutes)}m ${formatTime(seconds)}s`; 
    
    if (displayCard) {
        displayCard.textContent = countdownText;
    }

    // Update the active panel every time (this call is actually redundant as the setInterval does it)
    // But keeping it for instant update on click.
    updateActivePanel();
}


function updateActivePanel() {
    const panel = document.getElementById('active-timers-display');
    if (!panel) return;

    // 1. Recalculate remaining time for all active timers
    const now = new Date().getTime();
    activeTimers.forEach(timer => {
        let difference = timer.targetTime - now;
        
        // --- CHECK FOR EXPIRED TIMER ---
        if (difference < 0) {
            const boss = BOSSES.find(b => b.id === timer.id);
            
            if (timer.isFixed) {
                // For Fixed Bosses: Recalculate the next target time from scratch
                if (boss) {
                    const newTarget = calculateNextFixedTarget(boss);
                    if (newTarget) {
                        timer.targetTime = newTarget;
                    } else {
                        // Fallback: This should ideally not happen for fixed bosses
                        timer.targetTime += timer.intervalMs; 
                    }
                }
            } else {
                // For Variable Bosses: Use the regular interval logic
                timer.targetTime = calculateNextSpawn(timer.targetTime, timer.intervalMs);
            }
            difference = timer.targetTime - now; 
        }

        const hours = Math.floor(difference / HOUR_IN_MS);
        const minutes = Math.floor((difference % HOUR_IN_MS) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        const formatTime = (n) => (n < 10 ? "0" + n : n);
        timer.countdown = `${formatTime(hours)}h ${formatTime(minutes)}m ${formatTime(seconds)}s`;

        const nextSpawnDate = new Date(timer.targetTime);
        timer.nextSpawnTime = nextSpawnDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true,
            day: 'numeric',
            month: 'short'
        });
        
        // This is used for sorting: we want the nearest spawn first
        timer.sortTime = timer.targetTime; 
    });
    
    // 2. Sort by nearest spawn time and build HTML
    activeTimers.sort((a, b) => a.sortTime - b.sortTime);

    if (activeTimers.length === 0) {
        panel.innerHTML = '<p class="no-timers">No active timers.</p>';
        return;
    }

    panel.innerHTML = activeTimers.map(timer => `
        <div class="active-timer-card">
            <div class="timer-info">
                <h3>${timer.name}</h3>
                <p>Next Spawn: ${timer.nextSpawnTime}</p>
            </div>
            <div class="timer-countdown">
                <span class="countdown-value">${timer.countdown}</span>
                <button class="clear-btn" onclick="clearTimer('${timer.id}')">Clear</button>
            </div>
        </div>
    `).join('');
}

// =======================================================
// 5. UI GENERATION AND SEARCH
// =======================================================

function generateBossUI() {
    if (!container) return; 

    container.innerHTML = ''; 

    BOSSES.forEach(boss => {
        const storedTime = loadDeathTime(boss.id);
        const isFixedSchedule = boss.fixedSchedule && boss.fixedSchedule.length > 0;
        
        // Conditional HTML for location
        const locationHtml = boss.location ? `<p class="location-text">${boss.location}</p>` : '';
        // New: HTML for Level
        const levelHtml = boss.level ? `<p class="boss-level">LVL ${boss.level}</p>` : '';

        // New: Container for Level and Location (Subtitle Group)
        const subtitleGroupHtml = `<div class="subtitle-group">${levelHtml}${locationHtml}</div>`;
        
        let bossCard; 
        
        // --- HTML for Fixed Schedules (no inputs or Mark Dead) ---
        if (isFixedSchedule) {
            const convertedTimes = boss.fixedSchedule.map(schedule => convertFixedSchedule(schedule));
            const fixedScheduleHtml = convertedTimes.map(time => 
                `<p class="fixed-time-display">${time}</p>`
            ).join('');

            bossCard = document.createElement('div');
            bossCard.className = 'boss-tracker fixed-schedule';
            bossCard.id = `tracker-${boss.id}`;
            bossCard.innerHTML = `
                <img src="images/${boss.id}.png" alt="${boss.name}" class="boss-image" onerror="this.onerror=null; this.src='images/placeholder.png';">
                <div class="boss-info">
                    <h2>${boss.name}</h2>
                    ${subtitleGroupHtml}
                    <p class="interval-text">Base Schedule (UTC+8)</p>
                </div>
                <div class="action-column fixed-time-col">
                    ${fixedScheduleHtml}
                </div>
            `;
            container.appendChild(bossCard);
            
            // --- NEW: Start fixed schedule timer automatically ---
            startFixedScheduleTimer(boss); 
            return; 
        }


        // --- HTML for Variable Time Bosses ---
        
        bossCard = document.createElement('div');
        bossCard.className = 'boss-tracker variable-schedule';
        bossCard.id = `tracker-${boss.id}`;
        
        bossCard.innerHTML = `
            <img src="images/${boss.id}.png" alt="${boss.name}" class="boss-image" onerror="this.onerror=null; this.src='images/placeholder.png';">
            
            <div class="boss-info">
                <h2>${boss.name}</h2>
                ${subtitleGroupHtml}
                <p class="interval-text">Respawn every: ${boss.interval}h</p>
                <input type="datetime-local" id="time-input-${boss.id}" value="${storedTime}" style="display:none;" step="1">
            </div>
            
            <div class="action-column">
                <p class="next-spawn-time" id="next-spawn-display-${boss.id}">Next Spawn: N/A</p>
                <div class="countdown" id="countdown-display-${boss.id}">--:--:--</div>
                
                <div class="button-group">
                    <button class="mark-dead-btn" onclick="startTimer(BOSSES.find(b => b.id === '${boss.id}'), new Date().toISOString().slice(0, 19))">
                        Mark Dead (Now)
                    </button>
                    <button class="set-btn" onclick="openSetModal('${boss.id}')">
                        Set
                    </button>
                </div>
                
            </div>
        `;
        
        container.appendChild(bossCard);
        
        if (storedTime) {
            startTimer(boss, storedTime);
        }
    });

    updateActivePanel(); 
}

// Search Function
function filterBosses() {
    const searchValue = document.getElementById('search-boss').value.toLowerCase();
    const bossCards = document.querySelectorAll('.boss-tracker');
    
    bossCards.forEach(card => {
        // Search by name, level and location
        const bossName = card.querySelector('h2').textContent.toLowerCase();
        const bossLocation = card.querySelector('.location-text')?.textContent.toLowerCase() || '';
        const bossLevel = card.querySelector('.boss-level')?.textContent.toLowerCase() || '';

        if (bossName.includes(searchValue) || bossLocation.includes(searchValue) || bossLevel.includes(searchValue)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}


// Set/Time Input Logic
function openSetModal(bossId) {
    const input = document.getElementById(`time-input-${bossId}`);
    const boss = BOSSES.find(b => b.id === bossId);

    const setButton = document.querySelector(`#tracker-${bossId} .set-btn`);

    if (input.style.display === 'none' || input.style.display === '') {
        // State 1: The user wants to set the time. Show the input.
        input.style.display = 'block';
        if (setButton) setButton.textContent = 'Confirm Set';
        
        alert("Please enter the exact death time and then press 'Confirm Set'.");

    } else {
        // State 2: The user has entered the time and presses "Confirm Set".
        const newTime = input.value;
        if (newTime) {
            startTimer(boss, newTime);
            
            // Hide the input and revert the button text
            input.style.display = 'none';
            if (setButton) setButton.textContent = 'Set';
            
        } else {
            alert("You must enter a date and time before confirming.");
        }
    }
}


// =======================================================
// 6. INITIALIZATION AND LOCAL TIME
// =======================================================

function updateLocalTime() {
    const now = new Date();
    const options = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
    };
    
    document.getElementById('local-time-display').textContent = 
        "Local Time: " + now.toLocaleTimeString('en-US', options) + 
        " (" + now.toLocaleTimeString(undefined, { timeZoneName: 'short' }).split(' ')[2] + ")";
}

setInterval(updateLocalTime, 1000); 
document.addEventListener('DOMContentLoaded', generateBossUI);