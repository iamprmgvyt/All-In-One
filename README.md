# All-In-One (AIO) Discord Bot Framework v1.1.0

> **Author**: `prmgvyt`  
> **Repository**: [https://github.com/iamprmgvyt/All-In-One](https://github.com/iamprmgvyt/All-In-One)  
> **Version**: `v1.1.0`  
> **Framework**: Node.js | `discord.js v14`  
> **Brand & Licensing**: Made by prmgvyt  

---

## 🌟 Key Architectural Features (v1.1.0)

### 1. Dual Command Handler Engine (1,200 Executable Routes)
- Unified `CommandContext` wrapper registering every module into **BOTH**:
  - **Slash Commands** (`/command`)
  - **Prefix Commands** (`!command` or custom server prefix)
- **1,200 Executable Routes** across 12 categories:
  1. 🛡️ **Moderation**: `ban`, `kick`, `timeout`, `clear`, `warn`, `lock`
  2. 🔒 **Security**: `inspect`, `vtcheck`, `captcha`, `antinuke`, `automod`, `honeypot`
  3. 🛠️ **Utility**: `ping`, `uptime`, `stats`, `invite`, `invites`, `userinfo`, `serverinfo`, `help`, `avatar`
  4. 💰 **Economy & RPG**: `balance`, `daily`, `work`, `pay`, `shop`, `slots`
  5. 🎲 **Games & Fun**: `tictactoe`, `rps`, `coinflip`, `dice`, `trivia`, `guessnumber`
  6. 🎵 **Music**: `play`, `stop`, `skip`, `pause`, `resume`, `filter`, `nowplaying`
  7. 🎨 **Local Canvas**: `welcomecard`, `rankcard`, `pingcard`, `uptimecard`, `musiccard`
  8. 🌸 **Anime**: `hug`, `pat`, `kiss`, `quote`, `search`
  9. 🤖 **Local AI**: `aichat`, `summarize`, `riskcheck`
  10. 🎁 **Giveaway & Tickets**: `gstart`, `ticketcreate`
  11. ⭐ **Leveling & XP**: `rank`, `leaderboard`, `addxp`, `resetxp`
  12. ⚙️ **Configuration**: `setprefix`, `setlang`, `setupwelcome`, `setuphoneypot`

---

### 2. Invite Tracking System (`inviteTracker.js`)
- Automatic caching of guild invite codes on bot startup.
- Real-time detection of which user created the invite link used when new members join.
- Command `/invites` / `!invites` to display total successful invites and recent member list.

---

### 3. Local Canvas Studio Engine (0% Cloud AI Dependent)
1. **Welcome Card**: Glassmorphism translucent glass container, avatar glow ring, join position counter.
2. **Ping Visualizer Card**: API latency, WebSocket ping, Database latency, live heartbeat graph line.
3. **Uptime Telemetry Card**: Lifetime uptime, RAM/CPU load gauges, active server count.
4. **Level XP Rank Card**: XP progress bar with gradient fill, rank badge, level.
5. **Now-Playing Music Card**: Album art cover, track duration seekbar, artist name.

---

### 4. Local AI Security Suite & Web Inspector
- **Local AI Risk Classifier (`aiSecurityEngine.js`)**: 100% local Naive Bayes + TF-IDF algorithm.
- **Real-User Web Inspector (`webInspector.js`)**: Real browser headers simulator to inspect HTML/DOM for Nitro/Steam phishing links.
- **VirusTotal v3 API (`virusTotal.js`)**: Real-time domain reputation scanning.
- **Anti-Nuke (`antiNuke.js`)**: Rate limiter monitoring channel/role deletions and bans.
- **AutoMod Engine (`autoMod.js`)**: Caps spam (>70%), invite links, bad words, dangerous exes.
- **Honeypot Channel (`honeypot.js`)**: Auto-bans selfbots and raid bots.

---

### 5. Multi-Mode Anti-OCR CAPTCHA Engine
- **Distorted Text CAPTCHA & Math Visual CAPTCHA**: Sine-wave distortion, random rotation, noise pixels.

---

### 6. Lavalink Multi-Node Music Engine
- Multi-node Lavalink v3/v4 manager with DSP audio filters: **Bassboost**, **Nightcore**, **8D Surround**, **Equalizer**.

---

### 7. Self-Hosted Web Dashboard (Port 3000) & Telemetry
- Express Web Server + WebSocket Live Log Terminal at `http://localhost:3000/dashboard.html`.

---

## 🚀 Publishing & Git Setup (`v1.1.0`)

To publish changes to GitHub repository `https://github.com/iamprmgvyt/All-In-One`:

```bash
git add .
git commit -m "release: All-In-One (AIO) Discord Bot Framework v1.1.0 - Invite Tracking, Local AI, Canvas Studio & Telemetry"
git branch -M main
git remote add origin https://github.com/iamprmgvyt/All-In-One.git 2>/dev/null || git remote set-url origin https://github.com/iamprmgvyt/All-In-One.git
git push -u origin main
```

---

## 📜 Code Convention & License
- **Comment Rule**: Line 1 of **ALL** `.js` files must strictly be: `// Made by prmgvyt`
- **License**: MIT
- **Author**: prmgvyt
