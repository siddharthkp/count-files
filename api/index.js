const check = require('./_check');

module.exports = async (req, res) => {
  const data = req.body;
  if (!data) {
    res.json({ message: 'okay' });
    return;
  }

  try {
    await check(data);
    res.json({ message: 'done' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'error' });
  }
};
