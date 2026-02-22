let alarms = []; // { level: number, sound: string }
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
