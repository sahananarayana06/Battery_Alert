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
   
