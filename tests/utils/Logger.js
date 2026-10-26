// ─── LOGGER ───────────────────────────────────────────────────────────────────
// Structured logging for tests. Writes to console AND saves to a JSON file
// per test so you can audit exactly what happened during a CI run.
//
// WHY: console.log is not structured. When a CI run has 54 tests all logging
// to the same terminal, it becomes noise. Logger prefixes every line with
// level + timestamp + test name.
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

class Logger {
    constructor(testName) {
        this.testName = testName;
        this.entries = [];
        this.logDir = path.join(process.cwd(), 'test-results', 'logs');

        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    _write(level, message, data) {
        const entry = {
            level,
            time: new Date().toISOString(),
            test: this.testName,
            message,
            ...(data !== undefined && { data }),
        };
        this.entries.push(entry);

        const prefix = `[${level}][${this.testName}]`;
        const dataStr = data !== undefined ? ` ${JSON.stringify(data)}` : '';

        if (level === 'ERROR') console.error(`${prefix} ${message}${dataStr}`);
        else if (level === 'WARN')  console.warn(`${prefix} ${message}${dataStr}`);
        else                        console.log(`${prefix} ${message}${dataStr}`);
    }

    info(message, data)  { this._write('INFO',  message, data); }
    warn(message, data)  { this._write('WARN',  message, data); }
    error(message, data) { this._write('ERROR', message, data); }

    // Call at the start of logical sections of a test
    step(name) {
        this._write('STEP', `▶ ${name}`);
    }

    // Call when an API call is made — logs method, url, status
    api(method, url, status) {
        this._write('API', `${method.toUpperCase()} ${url} → ${status}`);
    }

    // Save all log entries for this test to a JSON file
    save() {
        const safeName = this.testName.replace(/[^a-z0-9]/gi, '_').substring(0, 80);
        const filePath = path.join(this.logDir, `${safeName}_${Date.now()}.json`);
        fs.writeFileSync(filePath, JSON.stringify(this.entries, null, 2));
        return filePath;
    }
}

module.exports = Logger;
