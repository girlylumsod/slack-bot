const { App } = require("@slack/bolt");

// Initialize the app with your credentials
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// List of allowed channels (add more IDs as needed)
const ALLOWED_CHANNELS = ["C08JKA33JD8", "C099LC2V2QN"]; 

app.event("reaction_added", async ({ event, client }) => {
  try {
    // Ignore events outside of allowed channels
    if (!ALLOWED_CHANNELS.includes(event.item.channel)) return;
    if (event.reaction === "accountingchecked") return;

    if (event.reaction === "slack") {
      const messageInfo = await client.conversations.history({
        channel: event.item.channel,
        latest: event.item.ts,
        inclusive: true,
        limit: 1
      });

      const originalUser = messageInfo.messages[0]?.user;

      if (originalUser) {
        await client.chat.postMessage({
          channel: event.item.channel,
          thread_ts: event.item.ts,
          text: `:wave: Hi Sir <@${originalUser}>, thank you for posting! Can you please add the buyer's name?`
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Auto Reply Bot is running!");
})();
