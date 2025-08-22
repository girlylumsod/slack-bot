const { App } = require("@slack/bolt");

// Initialize the app with your credentials
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const ALLOWED_CHANNEL = "C099LC2V2QN";

app.event("reaction_added", async ({ event, client }) => {
  try {
    if (event.item.channel !== ALLOWED_CHANNEL) return;
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
          text: `:wave: Hi Sir <@${originalUser}>, thanks for posting! Can you please add buyer's name?`
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
