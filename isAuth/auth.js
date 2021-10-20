const jwt = require("jsonwebtoken")
const User = require("../model/user")
const Admin = require("../model/admin")

const createAccessToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: '7d'
  })
}
const requireCookie = (req, res, next) => {
  const cookie = req.cookies.admin
  if (cookie) {
    jwt.verify(cookie, process.env.SECRET_ACCESS_TOKEN, (err, decodedToken) => {
      if(err) {
        throw Error("Bad request")
      } else {
        res.redirect("/panel/admin/dashboard")
      }
    })
  } else {
    next();
  }
}
const checkUser = (req, res, next) => {
  const cookie = req.cookies.admin

  if (cookie) {
    jwt.verify(cookie, process.env.SECRET_ACCESS_TOKEN, async (err, decodedToken) => {
      if(err) {
        throw Error("Bad request")
      } else {
        const user = await Admin.findById(decodedToken.id)
        res.locals.user = user
        next();
      }
    })
  } else {
    res.redirect("/panel/admin")
  }
}
const checkLogger = (req, res, next) => {
  const cookie = req.cookies.jid

  if (cookie) {
    jwt.verify(cookie, process.env.SECRET_ACCESS_TOKEN, async (err, decodedToken) => {
      if(err) {
        throw Error("Bad request")
      } else {
        const user = await User.findById(decodedToken.id)
        res.locals.user = user
        next();
      }
    })
  } else {
    res.redirect("/login")
  }
}
const checkStatus = (req, res, next) => {
  const cookie = req.cookies.jid

  if (cookie) {
    jwt.verify(cookie, process.env.SECRET_ACCESS_TOKEN, async (err, decodedToken) => {
      if(err) {
        throw Error("Bad request")
      } else {
        const user = await User.findById(decodedToken.id)
        if(!user.blocked) {
          next();
        } else {
          res.cookie('jid', '', {
            maxAge: 1
          })
          res.redirect('/login')
        }
      }
    })
  } else {
    res.redirect("/login")
  }
}

module.exports = {
  createAccessToken,
  requireCookie,
  checkUser,
  checkLogger,
  checkStatus
}