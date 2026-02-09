let alarms = []; // { level: number, sound: string }
let alertedLevels = new Set();

const statusText = document.getElementById("battery-status");
const message = document.getElementById("message");
