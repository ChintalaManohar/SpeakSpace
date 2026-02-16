const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../debug_log.txt');

const log = (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n`;
    fs.appendFileSync(logFile, logMessage);
};

module.exports = log;
