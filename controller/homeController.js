const Traders = require('../model/traders')

module.exports = class API {
  static async getHome(req, res) {
    const traders = await Traders.find()
    res.render('home', { title: 'Home', traders });
  }
}