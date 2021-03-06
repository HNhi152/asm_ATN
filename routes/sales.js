const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Category');
require('../models/Sales');
const Category = mongoose.model('category');
const Sales = mongoose.model('sales');

router.get('/', (req, res) => {
    Category.find().lean().exec((err, categories) => {
        if (err) throw err;
        res.render('stats/sales', {categories: categories});
    })
});

router.post('/', (req, res) => {
    Sales(req.body).save()
    .then(data => {
        res.redirect('/sales');
    })   
})

module.exports = router;