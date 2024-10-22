export default function (bot) {
  bot.on('text', (ctx) => {
    ctx.reply('hello world');
  });
}
