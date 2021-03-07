const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const mongoose = require('mongoose');

const router = express.Router();

require('../models/User');
const User = mongoose.model('user')

const { checkAuthenticated, checkNotAuthenticated } = require('../helpers/auth')

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login')
})

router.get('/logout', checkAuthenticated, (req, res) => {
    req.logOut()
    res.redirect('/user/login')
})

router.post('/login', checkNotAuthenticated, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login'
    })(req, res, next)
})
router.post('/register', checkNotAuthenticated, (req, res) => {
    let errors = [],
        username = req.body.username,
        password = req.body.password

    if (username === '' || password === '')
        errors.push({ text: 'Please type both your username and password' })

    User.findOne({ username: username }).then(user => {
        if (user)
            errors.push({ text: "Username is available" })

        if (errors.length > 0)
            return res.status(400).send({ errors })

        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err
            bcrypt.hash(password, salt, (err, hash) => {
                User({
                    username,
                    password: hash,
                    name: req.body.name,
                    role: req.body.role
                }).save().then(user => {
                    res.status(200).send('ok')
                }).catch(err => {
                    if (error) console.log(err)
                })
            })
        })
    })
})

module.exports = router