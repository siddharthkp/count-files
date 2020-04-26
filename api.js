const { json, send } = require('micro');
const check = require('./check');

module.exports = async (req, res) => {
  const data = await json(req);

  try {
    check(data);
    send(res, 200, { message: 'okay' });
  } catch (error) {
    console.log(error);
    send(res, 500, { message: 'error' });
  }
};
