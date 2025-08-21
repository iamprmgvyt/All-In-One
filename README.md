# All In One 🌏

A multipurpose Discord bot with slash commands, ticket system, and more.  
Built with **Node.js** and **discord.js v14**.

---

## 📌 Features
- 🎟 Ticket system (support role required)
- 🌐 Domain Checker(soon)
- 📊 User Info
- 🤖 Bot Info with GitHub repo
- 🔧 Moderation & Utilities
- 🛠 And more...

---

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/iamprmgvyt/All-In-One.git
   cd All-In-One

2. Install dependencies:
   ```bash
npm i aio-discord-bot

3. Create a file named .env in the root directory and add your credentials (see below 👇).


4. Deploy slash commands:

node deploy-commands.js


5. Run the bot:

node index.js




---

🔑 Environment Variables

Inside your .env file you will need to configure the following:

# Bot Informations
TOKEN=your-bot-token
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret

# Bot Prefix
PREFIX=/

# Ticket System
SUPPORT_ROLE_ID=your-support-role-id

# Database
MONGODB=your-mongodb-connection-string

# Search API Key
SERP_API_KEY=your-serp-api-key

Explanation

TOKEN → Your bot token from [Discord Developer Portal]{https://discord.com/developers/applications}

CLIENT_ID → Your bot’s client ID.

CLIENT_SECRET → Your bot’s client secret (only needed for OAuth2).

PREFIX → Default command prefix (for message commands, default /).

SUPPORT_ROLE_ID → The role ID allowed to claim tickets.

MONGODB → Connection string for MongoDB (if you use database features).

SERP_API_KEY → API key for Search/Domain Checker commands.



---

🚀 Usage

/userinfo → Show information about a user.

/botinfo → Show bot info

/ticket → Create and manage support tickets.

/domain → Check if a domain is available(soon)



---

📝 Notes

Make sure to deploy commands again (node deploy-commands.js) whenever you add or modify a slash command.

Keep your .env file private and never commit it to GitHub.
