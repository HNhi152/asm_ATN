const LocalStrategy = require('passport-local')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

require('../models/User')
const User = mongoose.model('user')

module.exports = passport => {
    passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
        User.findOne({ username: username })
            .then(user => {
                if (!user)
                    return done(null, false, { message: 'Account not found' })

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err
                    if (isMatch)
                        return done(null, user)
                    else
                        return done(null, false, { message: 'Password is incorrect' })
                })
            })
    }))

    passport.serializeUser((user, done) => done(null, user.id))

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            passport.username = user.username
            done(err, user)
        })
    })
}