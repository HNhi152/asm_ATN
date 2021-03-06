const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Category');
require('../models/Sales');
const Category = mongoose.model('category');
const Sales = mongoose.model('sales');

router.get('/', (req, res) => {
    Promise.all([
        Category.find().lean().exec(),
        Sales.find().lean().exec()
    ])
        .then(data => res.render('stats/statistics', { categories: data[0], sales: data[1] }))
        .catch(err => console.log(err));
});

router.post('/api', (req, res) => {
    let year = req.body.year;
    Sales.find({ category: req.body.category, date: {
        $gte: new Date(year, 0, 0),
        $lte: new Date(year, 12, 0)
    }})
        .then(data => {
            let dataArr = Array.from({length: 12}, (v, k) => null);
            data.forEach(item => dataArr[item.date.getMonth()] = parseFloat(item.totalSales.toString()));
            res.send(JSON.stringify({ data: dataArr }))
        })
        .catch(err => console.log(err));
});

module.exports = router;