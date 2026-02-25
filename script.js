e        let alarms = []; // { level: number, sound: string }
let alertedLevels = new Set();

const statusText = document.getElementById("battery-status");
const message = document.getElementById("message");
const alarmsList = document.getElementById("alarms-list");
const batteryCircle = document.getElementById("battery-circle");
const batteryPercentage = document.getElementById("battery-percentage");

const alarmSounds = {
    beep: document.getElementById("alarm-beep"),
    ring: document.getElementById("alarm-ring"),
    alarm: document.getElementById("alarm-alarm"),
    chime: document.getElementById("alarm-chime"),
    siren: document.getElementById("alarm-siren")
};

function stopAllSounds() {
    Object.values(alarmSounds).forEach(a => {
        try { a.pause(); a.currentTime = 0; } catch (e) {}
    });
}

function playSoundByKey(key) {
    stopAllSounds();
    const a = alarmSounds[key];
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(e => console.log('play failed', e));
    // animate doll when any sound plays
    animateDoll();
}
 
function playPreview() {
    const sel = document.getElementById('alarm-sound').value;
    playSoundByKey(sel);
    message.textContent = `▶ Playing preview: ${sel}`;
    setTimeout(() => { message.textContent = ''; }, 1500);
}
 
function addAlert() {
    const levelInput = document.getElementById('level').value;
    const level = parseInt(levelInput);
    const sound = document.getElementById('alarm-sound').value;
    if (isNaN(level) || level < 1 || level > 100) {
        message.textContent = '❌ Please enter a valid battery percentage.';
        return;
    }
    if (alarms.some(a => a.level === level)) {
        message.textContent = `⚠️ Alert for ${level}% already exists.`;
        return;
    }
    alarms.push({ level, sound });
    alarms.sort((a,b)=>b.level-a.level);
    document.getElementById('level').value = '';
    message.textContent = `✅ Alert added for ${level}% (${sound})`;
    renderAlarms();
}  

function removeAlert(level) {
    alarms = alarms.filter(a => a.level !== level);
    alertedLevels.delete(level);
    renderAlarms();
    message.textContent = `🗑️ Alert for ${level}% removed`;
}

function playAlarmFor(alarmObj) {
    playSoundByKey(alarmObj.sound);
    // doll jump for real alarm
    animateDoll();
}

function animateDoll() {
    const doll = document.getElementById('doll');
    if (!doll) return;
    doll.classList.remove('jump');
    // force reflow to restart animation
    void doll.offsetWidth;
    doll.classList.add('jump');
    // remove class after animation ends
    setTimeout(() => { doll.classList.remove('jump'); }, 900);
}

function renderAlarms() {
    alarmsList.innerHTML = '';
    if (alarms.length === 0) {
        alarmsList.innerHTML = "<p class='no-alarms'>No alarms set</p>";
        return;
    }
    
function renderAlarms() {
    alarmsList.innerHTML = '';
    if (alarms.length === 0) {
        alarmsList.innerHTML = "<p class='no-alarms'>No alarms set</p>";
        return;
    }
alarms.forEach(a => {
        const div = document.createElement('div');
        div.className = 'alarm-item';
        div.innerHTML = `
            <div>
                <span class='alarm-level'>${a.level}%</span>
                <div class='alarm-sound-label'>${a.sound}</div>
            </div>
            <div class='alarm-actions'>
                <button class='small' onclick="(function(){ window.playSoundByKey && window.playSoundByKey('${a.sound}') })()">▶</button>
                <button class='remove-btn' onclick="(function(){ window.removeAlert && window.removeAlert(${a.level}) })()">✕</button>
            </div>
        `;
        alarmsList.appendChild(div);
    });
}
window.playSoundByKey = playSoundByKey;
window.removeAlert = removeAlert;

navigator.getBattery().then(function(battery){
    function updateBatteryInfo(){
        const level = Math.round(battery.level * 100);
        statusText.textContent = `Battery Level: ${level}%`;
        if (batteryPercentage) batteryPercentage.textContent = level + '%';
        if (batteryCircle) {
            const circumference = 2 * Math.PI * 40; // r=40
            const offset = circumference - (level / 100) * circumference;
            batteryCircle.style.strokeDasharray = `${circumference}`;
            batteryCircle.style.strokeDashoffset = offset;
            let color = '#a78bfa';
            if (level <= 20) color = '#4c1d95'; else if (level <=50) color = '#7c3aed';
            batteryCircle.style.stroke = color;
        }

        alarms.forEach(al => {
            if (level <= al.level && !alertedLevels.has(al.level)) {
                playAlarmFor(al);
                alertedLevels.add(al.level);
                if (Notification.permission === 'granted') {
                    new Notification('🔋 Battery Alert', { body: `Battery level is ${level}%` });
                }
            }
            if (level > al.level && alertedLevels.has(al.level)) {
                alertedLevels.delete(al.level);
            }
        });
    }
    updateBatteryInfo();
    battery.addEventListener('levelchange', updateBatteryInfo);
});
