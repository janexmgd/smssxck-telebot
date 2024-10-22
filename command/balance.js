import { checkUser } from '../utils/any.js';
import { checkBalance } from '../utils/smshub.js';

export default function (bot) {
  bot.command('balance', async (ctx) => {
    const userId = ctx.from.id;
    const check = await checkUser(userId);
    if (check.status == true) {
      const balance = await checkBalance(check.data.api_key);
      if (balance.status == true) {
        ctx.reply(`BALANCE : ${balance.data.ACCESS_BALANCE}`);
      } else {
        ctx.reply(balance.message);
      }
    } else {
      const msg = check.message;
      console.log(check);
      ctx.reply(msg);
    }
  });
}
