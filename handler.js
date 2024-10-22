import any from './command/any.js';
import start from './command/start.js';
import balance from './command/balance.js';
import order from './command/order.js';
export default function (bot) {
  start(bot);
  balance(bot);
  order(bot);
  any(bot);
}
