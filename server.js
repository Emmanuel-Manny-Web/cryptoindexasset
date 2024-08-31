require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const enforce = require('express-sslify')
const cookieParser = require('cookie-parser')
const csrf = require('csurf');
const Routes = require('./routes/routes')
const Router = require('./routes/router')
const API = require('./controller/homeController')

const app = express();
const port = process.env.PORT || 3000
if (process.env.NODE_ENV === 'production' ) {
  app.use(enforce.HTTPS({ trustProtoHeader: true }))
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const csrfProtection = csrf({ cookie: true });

app.set('view engine', 'ejs')
app.use(cookieParser())

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to the database')
})
.catch(err => console.log(err));

app.get('/', API.getHome)

app.get('/login', csrfProtection, (req, res) => {
  const token = req.cookies.jid
  if(!token) {
    res.render('login', { title: 'Login', csrfToken: req.csrfToken() })
  } else {
    res.redirect('/user/dashboard')
  }
})

app.get('/register', csrfProtection, (req, res) => {
  res.render('register', { title: 'Crypto Index Asset || Cryptocurrency Copy Trading Platform', csrfToken: req.csrfToken() })
})
app.get('/about', (req, res) => {
  res.render("about", { title: 'About' })
})
app.get('/investors', (req, res) => {
  res.render("investors", { title: 'Investors' })
})
app.get('/contact', (req, res) => {
  res.render("contact", { title: 'Contact' })
})
app.get('/terms', (req, res) => {
  res.render("terms", { title: 'Terms' })
})
app.get('/policy', (req, res) => {
  res.render("policy", { title: 'Policy' })
})
app.get('/forgotpassword', csrfProtection, (req, res) => {
  res.render("forgotpassword", { title: 'Forgotten Password', csrfToken: req.csrfToken() })
})

app.use('/user', Routes)
app.use('/panel/admin', Router)

// 404 page
// app.use((req, res) => {
//   res.redirect("/")
// })

app.listen(port, () => console.log(`Server running at port:${port}`))