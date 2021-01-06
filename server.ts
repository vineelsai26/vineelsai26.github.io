import express from 'express'
var favicon = require('serve-favicon')
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from "path"
require('dotenv').config()

const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use(favicon(path.join(__dirname + '/public/img/profile-no-bg.png')))

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/github', (req, res) => {
    res.redirect('https://github.com/vineelsai26')
})

app.get('/resume', function(req, res, next) {
  let stream = fs.createReadStream('resume/resume.pdf')
  let filename = "resume.pdf"

  filename = encodeURIComponent(filename)

  res.setHeader('Content-disposition', 'inline; filename="' + filename + '"')
  res.setHeader('Content-type', 'application/pdf')

  stream.pipe(res)
})

app.get('/playstore', (req, res) => {
    res.redirect('https://play.google.com/store/apps/dev?id=7899749311611474057')
})

app.post('/mail', (req,res) => {
    const transporter = nodemailer.createTransport({
    service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })

    const name = req.body.name
    const email = req.body.email
    const subject = req.body.subject

    const mailOptions = {
        from: email,
        to: 'vineelsai26@gmail.com',
        subject: 'From Website Contact Form By : ' + name,
        text: subject + '\n\n\n' + email
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
            res.render('mail', {success: false})
        } else {
            console.log('Email sent')
            res.render('mail', {success: true})
        }
    })
})

app.use((req, res) => {
    res.status(404).render('404')
})

const port = process.env.PORT || 5000

app.listen(port)