const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log("Ready!");
    client.user.setPresence({
      activities: [
        {
          name: `soc-league.com`,
          type: ActivityType.Watching,
          url: `https://soc-league.com/`,
        },
      ],
      status: "dnd",
    });
  },
};
