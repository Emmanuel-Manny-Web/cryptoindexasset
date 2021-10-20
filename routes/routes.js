const express = require('express')
const csrf = require('csurf')
const API = require('../controller/controller')
const router = express.Router()
const { checkLogger, checkStatus } = require("../isAuth/auth")

const csrfProtection = csrf({ cookie: true })

router.get('*', checkStatus)

router.post('/register', API.registerUser)
router.post('/login', API.loginUser)
router.get('/dashboard', csrfProtection, API.userDashboard)
router.get('/address', checkLogger, API.userAddress)
router.get('/withdraw', checkLogger, csrfProtection, API.getuserWithdraw)
router.post('/withdraw', checkLogger, API.userWithdraw)
router.get('/profile', checkLogger, API.userProfile)
router.post('/profile', checkLogger, API.twoFactor)
router.post('/turnoff', checkLogger, API.turnOffTwoFactor)
router.get('/support', checkLogger, csrfProtection, API.userSupport)
router.get('/logout', checkLogger, API.logout)

module.exports = router