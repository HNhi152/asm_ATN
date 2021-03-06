function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.isAuthenticated = true
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