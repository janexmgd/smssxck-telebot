import smssxck from 'smssxck';
const checkBalance = async (apikey) => {
  try {
    const smshub = new smssxck(apikey, 'smshub');
    const { ACCESS_BALANCE } = await smshub.getBalance();
    return {
      status: true,
      data: {
        ACCESS_BALANCE,
      },
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || 'fail check balance',
    };
  }
};
const orderNum = async (apikey, service, country, operator, maxPrice) => {
  try {
    const smshub = new smssxck(apikey, 'smshub');
    const { ORDER_ID, PHONE_NUMBER } = await smshub.getNumber(
      service,
      country,
      operator,
      maxPrice
    );
    return {
      status: true,
      data: {
        ORDER_ID,
        PHONE_NUMBER,
      },
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || 'fail order number',
    };
  }
};
const getCode = async (apikey, orderid) => {
  try {
    const smshub = new smssxck(apikey, 'smshub');
    const { CODE } = await smshub.getCode(orderid);
    return CODE;
  } catch (error) {
    return {
      status: false,
      message: error.message || 'fail order number',
    };
  }
};
const changeStatus = async (apikey, orderid, status) => {
  try {
    const smshub = new smssxck(apikey, 'smshub');
    const { STATUS } = await smshub.changeStatus(orderid, status);
    return {
      status: true,
      data: {
        STATUS,
      },
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || 'FAIL CHANGE STATUS',
    };
  }
};

export { checkBalance, orderNum, getCode, changeStatus };
