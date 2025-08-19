const assert = require('assert');
const fs = require('fs');
const path = require('path');
const LogWatcher = require('../tail'); 

describe('LogWatcher Class Tests', function () {
    let logWatcher;
    const testLogFile = path.join(__dirname, 'test-log.txt');

    beforeEach(() => {
        fs.writeFileSync(testLogFile, ''); 
        logWatcher = new LogWatcher(testLogFile);
    });

    afterEach(() => {
        if (fs.existsSync(testLogFile)) {
            fs.unlinkSync(testLogFile);
        }
    });

    it('should return an empty array when log file is empty', async () => {
        const logs = await logWatcher.getLastNLines();
        assert.deepStrictEqual(logs, []);
    });

    it('should read the last 10 log lines from the log file', async () => {
        const testLogs = Array.from({ length: 15 }, (_, i) => `Log ${i + 1}`).join('\n');
        fs.writeFileSync(testLogFile, testLogs);

        const logs = await logWatcher.getLastNLines(10);
        const expectedLogs = Array.from({ length: 10 }, (_, i) => `Log ${i + 6}`);
        assert.deepStrictEqual(logs, expectedLogs);
    });

    it('should return all logs if fewer than 10 lines', async () => {
        const testLogs = Array.from({ length: 5 }, (_, i) => `Log ${i + 1}`).join('\n');
        fs.writeFileSync(testLogFile, testLogs);

        const logs = await logWatcher.getLastNLines();
        const expectedLogs = ['Log 1', 'Log 2', 'Log 3', 'Log 4', 'Log 5'];
        assert.deepStrictEqual(logs, expectedLogs);
    });

    it('should emit new logs when file grows', function (done) {
        this.timeout(5000);
        logWatcher.start();

        logWatcher.once('log-update', (newLog) => {
            assert.strictEqual(newLog, 'New log');
            done();
        });

        setTimeout(() => {
            fs.appendFileSync(testLogFile, 'New log\n');
            fs.utimesSync(testLogFile, new Date(), new Date()); 
        }, 1000);
    });

    it('should not emit when file does not grow', function (done) {
        this.timeout(3000);
        let emitted = false;

        logWatcher.start();
        logWatcher.on('log-update', () => {
            emitted = true;
        });

        setTimeout(() => {
            assert.strictEqual(emitted, false);
            done();
        }, 2000);
    });

    it('should correctly handle logs with trailing newline', async () => {
        const testLogs = "Log 1\nLog 2\nLog 3\n";
        fs.writeFileSync(testLogFile, testLogs);

        const logs = await logWatcher.getLastNLines(10);
        assert.deepStrictEqual(logs, ['Log 1', 'Log 2', 'Log 3']);
    });

    it('should not crash on special characters', async () => {
        const testLogs = "Log 1\nLog $pec!@l Ch@rs\nAnother Line\n";
        fs.writeFileSync(testLogFile, testLogs);

        const logs = await logWatcher.getLastNLines(10);
        assert.deepStrictEqual(logs, ['Log 1', 'Log $pec!@l Ch@rs', 'Another Line']);
    });
});
