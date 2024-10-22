import { Markup } from 'telegraf';
import { checkIsExist, registUser, updateApikey } from '../utils/query.js';
let sessions = {};
export default function (bot) {
  bot.command('start', async (ctx) => {
    const userid = ctx.from.id;
    const isExistUser = await checkIsExist('tele_id', userid);
    if (isExistUser.rowCount == 0) {
      ctx.reply(
        'hello im smshub bot',
        Markup.inlineKeyboard([
          [Markup.button.callback('SET API KEY', 'setApiKey')],
        ])
      );
    } else {
      ctx.reply(
        'hello im smshub bot',
        Markup.inlineKeyboard([
          [Markup.button.callback('EDIT API KEY', 'editApiKey')],
        ])
      );
    }
  });
  bot.action('setApiKey', (ctx) => {
    ctx.reply('Insert your api key');
    const userId = ctx.from.id;
    if (!sessions[userId]) {
      sessions[userId] = {};
    }
    sessions[userId].waitingForApiKey = true;
    sessions[userId].action = 'SETAPIKEY';
  });

  bot.on('text', async (ctx, next) => {
    const userId = ctx.from.id;
    if (sessions[userId] && sessions[userId].waitingForApiKey) {
      const apiKey = ctx.message.text;
      const data = {
        telegram_id: userId.toString(),
        api_key: apiKey,
      };
      if (sessions[userId].action == 'SETAPIKEY') {
        await registUser(data);
        ctx.reply('success save apikey');
        sessions = {};
      } else {
        await updateApikey(apiKey, userId.toString());
        ctx.reply('success save apikey');
        sessions = {};
      }
    } else {
      next();
    }
  });
  bot.action('editApiKey', (ctx) => {
    ctx.reply('insert your api key');
    const userId = ctx.from.id;
    if (!sessions[userId]) {
      sessions[userId] = {};
    }
    sessions[userId].waitingForApiKey = true;
    sessions[userId].action = 'EDITAPIKEY';
  });
}
