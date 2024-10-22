import { Telegraf } from 'telegraf';
import botHandler from './handler.js';
import { configDotenv } from 'dotenv';
configDotenv();
(async () => {
  try {
    process.stdout.write('\x1Bc');
    const apikey = process.env.BOT_TOKEN;
    const bot = new Telegraf(apikey);

    bot.use((ctx, next) => {
      const userId = ctx.from?.id;
      console.log(`${userId} PONG PONG`);
      return next();
    });
    botHandler(bot);
    bot
      .launch()
      .then(() => console.log('Bot launched!'))
      .catch((error) => console.error('Error launching bot:', error));

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  } catch (error) {
    console.log(error);
  }
})();
