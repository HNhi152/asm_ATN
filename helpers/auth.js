const mongoose = require("mongoose");

require('../models/User');
const User = mongoose.model('user')

async function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.isAuthenticated = true
        if (req.user.role == 'admin') {
            res.locals.isAdminRole = true

            let users = await User.find({ role: 'staff' })
            res.locals.users = users
        }
        return next()
    }

    res.redirect('/user/login')
}

function checkNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated())
        return next()

    res.redirect('/user/home')
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
}