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
    alarm: document.getElementById("alarm-alarm")
};
