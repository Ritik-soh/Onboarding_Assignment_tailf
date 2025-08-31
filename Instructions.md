# 📜 Log Watcher

A **Node.js + Express + WebSocket** project to **monitor logs in real-time**.  

With this tool, we can:
- Start a server on **localhost:3000**
- Watch a log file (`sample.log`) in real-time in the browser
- Append new lines to the log file and see them instantly without refresh
- Run **unit tests** on a separate `test.log` file (to keep real logs clean)

---

## 🛠️ What We Are Building

We are building a **real-time log monitoring system** where:
1. The backend watches a log file continuously.
2. Any new line added to the log file is **pushed instantly** to all connected clients via WebSockets.
3. A web interface (served by Express) displays these logs live.
4. Developers can test the core functionality (tailing logs + file watching) using unit tests.

---

## 📂 Project Structure
├── server.js                   # Main Express + WebSocket server
├── tail.js                     # Core logic: read last N lines, watch log file
├── sample.log                  # Default log file for running server
├── public/
│ └── index.html                # Frontend: displays live logs in browser
├── test/
│ └── tail.test.js              # Mocha + Chai unit tests
├── package.json                # Project dependencies and scripts
└── README.md                   # Documentation

---

## 📑 Role of Each File

- **`server.js`**
  - Entry point of the application.
  - Starts an **Express server** on port `3000`.
  - Serves the client page where logs are shown in real-time.
  - Uses WebSockets to push new log lines to connected browsers.
  - By default, watches `sample.log`.

- **`tail.js`**
  - Core utility functions:
    - `getLastNLines(n)` → Reads last `n` lines from the log file.
    - `watchFile(callback)` → Watches the log file for new appended lines and triggers the callback.

- **`sample.log`**
  - Default log file used when running the server.
  - You can write (`echo "text" >> sample.log`) and see updates live in the browser.

- **`public/index.html`**
  - The **web interface** where logs are shown.
  - Connects to the backend using a WebSocket:
    ```js
    const socket = new WebSocket('ws://localhost:3000');
    ```
  - Displays logs in green monospace font on a dark background.
  - Auto-scrolls so the latest log line is always visible.

- **`test/tail.test.js`**
  - Unit tests for `tail.js` using **Mocha + Chai**.
  - Uses a **separate `test.log`** to avoid polluting `sample.log`.

- **`package.json`**
  - Defines project dependencies (`express`, `ws`, `mocha`, `chai`).
  - Contains scripts for running the app and tests.

---

## 🚀 How to Run the Project

### 1. Install Dependencies
Make sure you have **Node.js** installed. Then run:
npm install


### 2. Start the Server

npm start

* The server runs on **[http://localhost:3000](http://localhost:3000)**
* It will serve logs from `sample.log` by default.

👉 Try appending text to `sample.log`:


echo "Hello Log Watcher!" >> sample.log

You’ll see the new line appear live in the browser without refresh.



## 🧪 Running Unit Tests

We use **Mocha + Chai** for testing.

Run:


npm test

This will:

* Run tests in `test/tail.test.js`
* Use `test.log` file (not `sample.log`)
* Verify:

  * Correct reading of last N lines
  * Behavior when file has fewer lines than requested
  * Watching a file for appended lines
  * Multiple appended lines handling

Example output:

```
  tail.js
    getLastNLines
      ✔ should return the last N lines
      ✔ should return fewer lines if file has less than N lines
    watchFile
      ✔ should call callback when a new line is appended
```

---

## ⚙️ Configuration (Environment Variables)

| Variable   | Default      | Description                         |
| ---------- | ------------ | ----------------------------------- |
| `LOG_FILE` | `sample.log` | Path of log file to watch/read      |
| `PORT`     | `3000`       | Port number for Express + WebSocket |

Example:


LOG_FILE=/var/log/system.log PORT=4000 npm start

---

## 📌 Example Use Cases

* Debugging applications by watching logs live.
* Monitoring error logs in real-time during development.
* Building real-time dashboards that react to log changes.

---

---

## 👨‍💻 Author

**Ritik Sohane**
Browserstack Tech Onboarding Assignment