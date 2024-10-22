import { checkIsExist } from './query.js';

const checkUser = async (userid) => {
  try {
    const user = await checkIsExist('tele_id', userid);
    if (user.rowCount > 0) {
      if (user.rows[0].api_key) {
        return {
          status: true,
          data: user.rows[0],
        };
      } else {
        return {
          status: false,
          message: 'user not set api key please /apikey first',
        };
      }
    } else {
      return {
        status: false,
        message: 'user not registered please /start first',
      };
    }
  } catch (error) {
    return {
      status: false,
      message: error.message || 'fatal error',
    };
  }
};
export { checkUser };
