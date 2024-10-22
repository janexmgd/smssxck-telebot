import { Markup } from 'telegraf';
import { checkUser } from '../utils/any.js';
import { changeStatus, getCode, orderNum } from '../utils/smshub.js';

let sessions = {};

export default function (bot) {
  try {
    bot.command('order', async (ctx) => {
      const userId = ctx.from.id;
      const check = await checkUser(userId);

      if (check.status) {
        sessions[userId] = sessions[userId] || {
          waitingOrderNum: true,
          action: 'ORDERNUM',
        };
        ctx.reply(
          'Order format\nservice country operator maxPrice',
          Markup.inlineKeyboard([
            [Markup.button.callback('any id any', 'callbackAnyOtherService')],
            [Markup.button.callback('fore id any', 'callbackForeService')],
          ])
        );
      } else {
        ctx.reply(check.message);
      }
    });

    bot.on('text', async (ctx, next) => {
      const userId = ctx.from.id;
      if (sessions[userId]?.waitingOrderNum) {
        await handleOrder(ctx, userId, ctx.message.text);
      } else {
        next();
      }
    });

    bot.action('callbackForeService', async (ctx) => {
      await handleCallbackForeService(ctx);
    });
    bot.action('callbackAnyOtherService', async (ctx) => {
      await handleCallbackAnyOtherService(ctx);
    });
    bot.action('checkOtp', async (ctx) => {
      const userId = ctx.from.id;
      if (sessions[userId]?.ORDER_ID) {
        await checkOtp(ctx, sessions[userId].ORDER_ID, userId);
      } else {
        ctx.reply('No order found.');
      }
    });
  } catch (error) {
    console.error(error);
  }
}
const handleOrder = async (ctx, userId, orderFormat) => {
  const userData = await checkUser(userId);
  const [service, country, operator, maxPrice] = orderFormat.split(' ');
  const orderingNumber = await orderNum(
    userData.data.api_key,
    service,
    country,
    operator,
    maxPrice
  );
  if (orderingNumber.status) {
    sessions[userId].ORDER_ID = orderingNumber.data.ORDER_ID;
    ctx.reply(
      `Your phone number is: ${orderingNumber.data.PHONE_NUMBER}. Click the button below to check the OTP.`,
      Markup.inlineKeyboard([[Markup.button.callback('Check OTP', 'checkOtp')]])
    );
  } else {
    ctx.reply(orderingNumber.message);
  }
};
const checkOtp = async (ctx, ORDER_ID, userId) => {
  const userData = await checkUser(userId);

  //   await waitForOtp(ctx, userData.data.api_key, ORDER_ID);
  await waitForOtp(ctx, userData.data.api_key, ORDER_ID);
};

const waitForOtp = async (ctx, apiKey, ORDER_ID) => {
  const MAX_WAIT_TIME = 60000;
  const CHECK_INTERVAL = 3000;
  let totalTimeWaited = 0;

  ctx.reply(`Waiting OTP at ${ORDER_ID}`);

  while (totalTimeWaited <= MAX_WAIT_TIME) {
    await new Promise((resolve) => setTimeout(resolve, CHECK_INTERVAL));

    const checkCode = await getCode(apiKey, ORDER_ID);
    console.log(checkCode);

    if (checkCode != undefined) {
      ctx.reply(`Code obtained\nCODE: ${checkCode}`);
      await changeStatus(apiKey, ORDER_ID, 6);
      ctx.reply(`Success change status ${ORDER_ID} to accept`);
      break;
    }

    totalTimeWaited += CHECK_INTERVAL;

    if (totalTimeWaited >= MAX_WAIT_TIME) {
      ctx.reply('No OTP obtained, waiting time exceeded');
      await changeStatus(apiKey, ORDER_ID, 8);
      ctx.reply(`Success change status ${ORDER_ID} to cancel`);
      break;
    }
    continue;
  }
};

const handleCallbackForeService = async (ctx) => {
  const userId = ctx.from.id;
  ctx.reply('Ordering service fore');

  if (sessions[userId]?.action === 'ORDERNUM') {
    const service = 'asy';
    const country = '6';
    const operator = 'any';
    const maxPrice = '0.112';

    const userData = await checkUser(userId);
    const orderingNumber = await orderNum(
      userData.data.api_key,
      service,
      country,
      operator,
      maxPrice
    );
    console.log(orderingNumber);

    if (orderingNumber.status) {
      sessions[userId].ORDER_ID = orderingNumber.data.ORDER_ID;
      ctx.reply(
        `Your PHONE NUMBER is: ${orderingNumber.data.PHONE_NUMBER}.\n Click the button below to check the OTP.`,
        Markup.inlineKeyboard([
          [Markup.button.callback('Check OTP', 'checkOtp')],
        ])
      );
    } else {
      ctx.reply(orderingNumber.message);
    }
  } else {
    ctx.reply('Oops! Something went wrong.');
  }
};
const handleCallbackAnyOtherService = async (ctx) => {
  const userId = ctx.from.id;
  ctx.reply('Ordering service any other');

  if (sessions[userId]?.action === 'ORDERNUM') {
    const service = 'ot';
    const country = '6';
    const operator = 'any';
    const maxPrice = '0.112';

    const userData = await checkUser(userId);
    const orderingNumber = await orderNum(
      userData.data.api_key,
      service,
      country,
      operator,
      maxPrice
    );
    console.log(orderingNumber);

    if (orderingNumber.status) {
      sessions[userId].ORDER_ID = orderingNumber.data.ORDER_ID;
      ctx.reply(
        `Your PHONE NUMBER is: ${orderingNumber.data.PHONE_NUMBER}.\n Click the button below to check the OTP.`,
        Markup.inlineKeyboard([
          [Markup.button.callback('Check OTP', 'checkOtp')],
        ])
      );
    } else {
      ctx.reply(orderingNumber.message);
    }
  } else {
    ctx.reply('Oops! Something went wrong.');
  }
};
