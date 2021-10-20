const bcrypt = require("bcryptjs")
const User = require('../model/user')
const Admin = require('../model/admin')
const Finance = require('../model/finance')
const Currency = require('../model/currency')
const Paid = require('../model/paid')
const Withdrawal = require('../model/withdraw')
const Request = require('../model/request')
const Wallet = require('../model/wallet')
const Traders = require('../model/traders')
const LastLogin = require('../model/lastLogin')
const { createAccessToken } = require('../isAuth/auth')
const jwt = require("jsonwebtoken")

const maxAge = 6 * 24 * 60 * 60

module.exports = class API {
  static async registerUser(req, res) {
    const body = req.body
    const { name, email, number, password } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashpwd = bcrypt.hashSync(password, salt)
    try {
      const user = await User.create({ name, email, number, password: hashpwd })
      const token = createAccessToken(user._id)
      await Finance.insertMany([
        {_id: user._id, email: user.email }
      ])
      await Currency.insertMany([
        { _id: user._id, email: user.email }
      ])
      await Paid.insertMany([
        { _id: user._id, email: user.email }
      ])
      await LastLogin.insertMany([
        { tok: token }
      ])
      res.cookie('jid', token, {
        httpOnly: true
      })
      res.redirect('/user/dashboard')
    } catch(err) {
      res.redirect('/register')
      console.log(err)
    }
  }
  static async loginUser(req, res) {
    const { email, password } = req.body
    try {
      const user = await User.login(email, password)
      const token = createAccessToken(user._id)
      res.cookie('jid', token, { httpOnly: true })
      await LastLogin.insertMany([
        { tok: token }
      ])
      res.status(200).json({ user })
    } catch(err) {
      res.status(200).json({ error: "Invalid email/password" })
    }
  }
  static async userDashboard(req, res) {
    const token = req.cookies.jid
    if (!token) {
      res.redirect('/login')
    }
    try {
      const payload = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN)
      const id = payload.id
      const profile = await User.findById(id)
      const email = profile.email
      const currency = await Currency.findOne({ email })
      const user = await User.findById(id)
      if(!user) {
        res.redirect('/login')
      }
      res.render('dashboard', { title: 'Dashboard', user: user, csrfToken: req.csrfToken(), currency: currency })
    } catch(err) {
      console.log(err)
    }
  }
  static async userAddress(req, res) {
    const token = req.cookies.jid
    try {
      const payload = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN)
      const id = payload.id
      const profile = await User.findById(id)
      const email = profile.email
      const currency = await Currency.findOne({ email })
      const wallet = await Wallet.findOne()
      res.render('address', { title: "Address", currency: currency, wallet: wallet })
    } catch(err) {
      console.log(err)
      res.redirect('/login')
    }
  }
  static async getuserWithdraw(req, res) {
    const token = req.cookies.jid
    try {
      const payload = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN)
      const id = payload.id
      const profile = await User.findById(id)
      const email = profile.email
      const currency = await Currency.findOne({ email })
      res.render("withdraw", { title: "Withdraw", csrfToken: req.csrfToken(), currency: currency, email: email })
    } catch(err) {
      console.log(err)
      res.redirect('/login')
    }
  }
  static async userWithdraw(req, res) {
    const body = req.body
    const { amount, currencytype, email, withdrawaltype, walletaddress, bankname, bankaccountnumber, city, country } = req.body
    try {
      let payload
      const token = req.cookies.jid
      payload = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN)
      const id = payload.id

      const user = await Currency.findOne({ email })
      if (amount === 0) {
        res.status(200).json({ error: "You cannot request a withdrawal of $0" })
      }
      if (amount > user[currencytype]) {
        res.status(200).json({ message: "Insufficient funds" })
      } else {
        await Withdrawal.create(body)
        if (withdrawaltype === "wallet") {
          await Request.insertMany([
            { email: user.email, requestedAmount: amount, withdrawaltype: withdrawaltype, walletaddress: walletaddress }
          ])
        } else if (withdrawaltype === "bank") {
          await Request.insertMany([
            { email: user.email, requestedAmount: amount, withdrawaltype: withdrawaltype, bankname, bankaccountnumber, city, country }
          ])
        }
        await Finance.findByIdAndUpdate(id, { $inc: { numberofRequest: 1 }})
        res.status(200).json({ message: "Your withdrawal request has been successfully sent" })
      }
    } catch(err) {
      res.status(200).json({ error: "Error sending request" })
    }
  }
  static async userProfile(req, res) {
    const token = req.cookies.jid
    try {
      const payload = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN)
      const id = payload.id
      const profile = await User.findById(id)
      const email = profile.email
      const currency = await Currency.findOne({ email })
      const lastlogin = await LastLogin.findOne({ tok: token })
      res.render("profile", { title: "Profile", currency: currency, profile, lastlogin })
    } catch(err) {
      console.log(err)
      res.redirect('/login')
    }
  }
  static async twoFactor(req, res) {
    const token = req.cookies.jid
    try {
      const payload = await jwt.verify(token, process.env.SECRET_ACCESS_TOKEN)
      const id = payload.id
      await User.findByIdAndUpdate(id, { twoFA: true })
      res.redirect('/user/profile')
    } catch(err) {
      res.redirect('/user/profile')
    }
  }
  static async turnOffTwoFactor(req, res) {
    const token = req.cookies.jid
    try {
      const payload = await jwt.verify(token, process.env.SECRET_ACCESS_TOKEN)
      const id = payload.id
      await User.findByIdAndUpdate(id, { twoFA: false })
      res.redirect('/user/profile')
    } catch(err) {
      res.redirect('/user/profile')
    }
  }
  static async userSupport(req, res) {
    const token = req.cookies.jid
    try {
      const payload = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN)
      const id = payload.id
      const profile = await User.findById(id)
      const email = profile.email
      const currency = await Currency.findOne({ email })
      res.render("support", { title: "Support", currency: currency })
    } catch(err) {
      console.log(err)
      res.redirect('/login')
    }
  }
  static async getAdminLogin(req, res) {
    const cookie = req.cookies.admin
    try {
      if (cookie) {
        const token = jwt.verify(cookie, process.env.SECRET_ACCESS_TOKEN)
        if (token) {
          res.redirect("/panel/admin/dashboard")
        } else {
          const admin = await Admin.find();
          res.render("panel/adminLogin", { title: "Login", admin: admin })
        }
      } else {
        const admin = await Admin.find();
        res.render("panel/adminLogin", { title: "Login", admin: admin })
      }
    } catch(err) {
      console.log(err)
    }
  }
  static async loginAdmin(req, res) {
    const { username, password } = req.body
    try {
      const user = await Admin.login(username, password)
      const id = user._id
      const token = jwt.sign({ id }, process.env.SECRET_ACCESS_TOKEN, {
        expiresIn: '7d'
      })
      res.cookie('admin', token, {
        httpOnly: true
      })
      res.status(200).json({ message: "Success" })
    } catch(err) {
      console.log(err)
      res.status(200).json({ error: "Invalid username/password" })
    }
  }
  static async getAdminRegister (req, res) {
    res.render("panel/adminRegister", { title: "Register Admin" })
  }
  static async registerAdmin(req, res) {
    const body = req.body;
    const { username, password } = req.body
    const salt = bcrypt.genSaltSync(10);
    const hashpwd = bcrypt.hashSync(password, salt)
    try {
      const admin = await Admin.create({ username, password: hashpwd })
      res.cookie('admin', createAccessToken(admin._id), {
        httpOnly: true
      })
      res.status(200).json({ message: "Success" })
    } catch(err) {
      res.status(200).json({ error: "Invalid username/password" })
    }
  }
  static async getAdminDashboard(req, res) {
    const wallet = await Wallet.find()
    res.render("panel/adminDashboard", { title: "Admin Dashboard", message: "Welcome", wallet: wallet })
  }
  static async getUsers(req, res) {
    const user = await User.find().sort({ createdAt: -1 });
    res.render("panel/adminUsers", { title: "Users", data: user })
  }
  static async manageUser(req, res) {
    const id = req.params.id

    const user = await User.findById(id)
    res.render("panel/manageUser", { user: user, title: user.email })
  }
  static async getTopTraders(req, res) {
    const traders = await Traders.find()
    res.render("panel/toptraders", { title: 'Top traders', traders })
  }
  static async getTraderForm(req, res) {
    res.render("panel/traderForm", { title: 'Top traders' })
  }
  static async createTopTrader(req, res) {
    const body = req.body
    try {
      await Traders.create(body)
      res.redirect('/panel/admin/traders')
    } catch(err) {
      res.redirect('/panel/admin/traders?error=trader')
    }
  }
  static async getupdateTrader(req, res) {
    const id = req.params.id

    const trader = await Traders.findById(id)
    res.render("panel/updatetrader", { title: "Update Trader", trader })
  }
  static async updateTrader(req, res) {
    const id = req.params.id
    const body = req.body

    try {
      await Traders.findByIdAndUpdate(id, body)
      res.redirect('/panel/admin/traders')
    } catch(err) {
      res.redirect('/panel/admin/traders?failedupdate')
    }
  }
  static async createWalletAddress(req, res) {
    const body = req.body
    try {
      await Wallet.create(body)
      res.redirect('/panel/admin/dashboard')
    }  catch(err) {
      res.status(200).json({ error: "Error creating addresses!" })
    }
  }
  static async changeWalletAddress(req, res) {
    const body = req.body
    const { id } = req.body

    try {
      await Wallet.findByIdAndUpdate(id, body)
      res.status(200).json({ message: "Successfully updated wallet" })
    } catch(err) {
      res.status(200).json({ error: "Error updating wallets" })
    }
  }
  static async manageSignal(req, res) {
    const id = req.params.id

    const profile = await User.findById(id)
    if (profile.showSignal) {
      const user = await User.findByIdAndUpdate(id, { showSignal: false })
      res.status(200).json({ user: user, redirect: `/panel/admin/manage/${id}`})
    } else {
      const user = await User.findByIdAndUpdate(id, { showSignal: true })
      res.status(200).json({ user: user, redirect: `/panel/admin/manage/${id}`})
    }
  }
  static async editUser(req, res) {
    const id = req.params.id

    try {
      const user = await User.findById(id)
      res.render("panel/editUser", { title: "Edit User", user })
    } catch(err) {
      console.log(err)
    }
  }
  static async updateUser(req, res) {
    const id = req.params.id
    const body = req.body
    try {
      await User.findByIdAndUpdate(id, body)
      res.redirect(`/panel/admin/manage/${id}`)
    } catch(err) {
      console.log(err)
    }
  }
  static async getUserFinance(req, res) {
    const id = req.params.id
    
    const user = await User.findById(id)
    res.render("panel/finance", { title: "Finance" })
  }
  static async creditUserForm(req, res) {
    const id = req.params.id
    try {
      const profile = await User.findById(id)
      const coins = await Currency.findOne({ email: profile.email })
      res.render("panel/credit", { profile: profile, coins: coins })
    } catch(err) {
      res.redirect(`/panel/admin/manage/${id}`)
    }
  }
  static async credit(req, res) {
    const { email, amount, currencytype } = req.body
    try {
      if (currencytype === "btc") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "btc" : amount }})
      }
      if (currencytype === "eth") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "eth" : amount }})
      }
      if (currencytype === "bch") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "bch" : amount }})
      }
      if (currencytype === "ltc") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "ltc" : amount }})
      }
      if (currencytype === "xrp") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "xrp" : amount }})
      }
      if (currencytype === "usdt") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "usdt" : amount }})
      }
      res.status(200).json({ message: "User has been successfully credited" })
    } catch(err) {
      res.status(200).json({ error: "Unable to credit user account" })
    }
  }
  static async debit(req, res) {
    const { email, amount, currencytype } = req.body
    try {
      if (currencytype === "btc") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "btc": -amount }})
      }
      if (currencytype === "eth") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "eth" : -amount }})
      }
      if (currencytype === "bch") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "bch" : -amount }})
      }
      if (currencytype === "ltc") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "ltc" : -amount }})
      }
      if (currencytype === "xrp") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "xrp" : -amount }})
      }
      if (currencytype === "usdt") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "usdt" : -amount }})
      }
      res.status(200).json({ message: "User has been successfully debited" })
    } catch(err) {
      res.status(200).json({ message: "Error debiting user" })
    }
  }
  static async getUserCreditForm(req, res) {
    const token = req.cookies.jid
    const paymentid = req.params.paymentid
    try {
      const payload = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN)
      const id = req.params.id
      const profile = await User.findById(id)
      const coins = await Currency.findOne({ email: profile.email })
      const payid = await Request.findById(paymentid)

      res.render("panel/creditUser", { profile: profile, coins: coins, payid: payid })
    } catch(err) {
      console.log(err)
    }
  }
  static async creditUser(req, res) {
    const id = req.params.paymentid
    const { email, amount, currencytype } = req.body
    try {
      if (currencytype === "btc") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "btc" : amount }})
      }
      if (currencytype === "eth") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "eth" : amount }})
      }
      if (currencytype === "bch") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "bch" : amount }})
      }
      if (currencytype === "ltc") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "ltc" : amount }})
      }
      if (currencytype === "xrp") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "xrp" : amount }})
      }
      if (currencytype === "usdt") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "usdt" : amount }})
      }
      await Request.findByIdAndUpdate(id, { status: "paid" })
      res.status(200).json({ message: "User has been successfully credited" })
    } catch(err) {
      res.status(200).json({ error: "Unable to credit user account" })
    }
  }
  static async debitUser(req, res) {
    const id = req.params.paymentid
    const { email, amount, currencytype } = req.body
    try {
      if (currencytype === "btc") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "btc": -amount }})
      }
      if (currencytype === "eth") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "eth" : -amount }})
      }
      if (currencytype === "bch") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "bch" : -amount }})
      }
      if (currencytype === "ltc") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "ltc" : -amount }})
      }
      if (currencytype === "xrp") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "xrp" : -amount }})
      }
      if (currencytype === "usdt") {
        await Currency.findOneAndUpdate({ email }, { $inc: { "usdt" : -amount }})
      }
      await Request.findByIdAndUpdate(id, { status: "paid" })
      res.status(200).json({ message: "User has been successfully debited" })
    } catch(err) {
      res.status(200).json({ message: "Error debiting user" })
    }
  }
  static async getNotification(req, res) {
    const id = req.params.id
    try {
      const user = await User.findById(id)

      const withdrawReq = await Request.find({ email: user.email }).sort({ requestDate: -1 })
      res.render("panel/notification", { requests: withdrawReq, user: user })
    } catch(err) {
      console.log(err)
    }
  }
  static async approvePayment(req, res) {
    const id = req.params.id
    let email
    try {
      const user = await Request.findById(id)
      email = user.email
      await Request.findByIdAndUpdate(id, { status: "approved" })
      res.status(200).json({ message: `Payment for ${email} has been successfully approved!` })
    } catch(err) {
      res.status(200).json({ error: `Error approving ${email} request` })
    }
  }
  static async declinePayment(req, res) {
    const id = req.params.id
    const user = await Request.findById(id)
    const email = user.email
    try {
      await Request.findByIdAndUpdate(id, { status: "declined" })
      res.status(200).json({ message: `Payment for ${email} has been successfully declined!` })
    } catch(err) {
      res.status(200).json({ error: `Error declining ${email} request` })
    }
  }
  static async logout(req, res) {
    res.cookie('jid', '', {
      maxAge: 1
    })
    res.redirect('/')
  }
  static async blockUser(req, res) {
    const id = req.params.id
    const user = await User.findById(id)
    try {
      await User.findByIdAndUpdate(id, { blocked: true })
      res.status(200).json({ message: `User with email address: ${user.email} has been blocked` })
    } catch(err) {
      res.status(200).json({ message: `Failed to block ${user.email}` })
    }
  }
  static async unblockUser(req, res) {
    const id = req.params.id
    const user = await User.findById(id)
    try {
      await User.findByIdAndUpdate(id, { blocked: false })
      res.redirect(`/panel/admin/manage/${id}`)
    } catch(err) {
      res.redirect(`/panel/admin/manage/${id}?error=unblock`)
    }
  }
  static async deleteUser(req, res) {
    const id = req.params.id
    try {
      await User.findByIdAndUpdate(id, { status: false, blocked: true })
      res.redirect('/panel/admin/user')
    } catch(err) {
      console.log(err)
    }
  }
  static async userPaid(req, res) {
    const id = req.params.id
    const { email, amount } = req.body
    await Paid.create({ email, amount})
    res.redirect(`/panel/admin/manage/finance/${id}`)
  }
}