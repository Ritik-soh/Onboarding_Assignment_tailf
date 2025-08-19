const fs = require('fs');
const events = require('events');

const NUM_LINES = 10;

class LogWatcher extends events.EventEmitter {
    constructor(file) {
        super();
        this.file = file;
        this.lastLog = null;
    }

    async getLastNLines(n = NUM_LINES) {
        try {
            const stats = await fs.promises.stat(this.file);
            let fileSize = stats.size;
            let chunkSize = 4096;
            let position = fileSize;
            let lines = [];

            const fd = await fs.promises.open(this.file, "r");

            while (lines.length < n && position > 0) {
                let readSize = Math.min(chunkSize, position);
                position -= readSize;
                const buffer = Buffer.alloc(readSize);

                await fd.read(buffer, 0, readSize, position);
                let chunkLines = buffer.toString("utf8").trim().split("\n");
                lines = [...chunkLines, ...lines];

                if (lines.length >= n) break;
            }

            await fd.close();
            return lines.slice(-n);
        } catch (err) {
            console.error("Error reading last lines:", err);
            return [];
        }
    }

    watch(curr, prev) {
        if (curr.size <= prev.size) return;

        const diff = curr.size - prev.size;
        const buffer = Buffer.alloc(diff);

        fs.open(this.file, "r", (err, fd) => {
            if (err) return console.error("Error opening file:", err);

            fs.read(fd, buffer, 0, buffer.length, prev.size, (err, bytesRead) => {
                if (err) return console.error("Error reading file:", err);

                if (bytesRead > 0) {
                    const newLogs = buffer.toString("utf8")
                        .split("\n")
                        .filter(l => l.trim() !== "");

                    if (newLogs.length > 0) {
                        if (this.lastLog !== newLogs[0]) {
    
                            newLogs.forEach(line => this.emit("log-update", line));
                        }
                        this.lastLog = newLogs[newLogs.length - 1];
                    }
                }
                fs.close(fd, () => {});
            });
        });
    }

    start() {
        fs.watchFile(this.file, { interval: 1000 }, (curr, prev) => {
            this.watch(curr, prev);
        });
    }
}

module.exports = LogWatcher;
