const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

require('../models/Category');
const Category = mongoose.model('category');

router.get('/', (req, res) => {
    Category.find({}).lean().exec((err, categories) => {
        if (err) throw err;
        res.render('products/category', { categories: categories });
    })
});

router.post('/', (req, res) => {
    Category(req.body).save().then(data => {
        res.redirect('/category');
    });
});

router.get('/delete/:id', async (req, res) => {
    await Category.findByIdAndRemove(req.params.id)
    res.redirect('/category');
})

router.get('/edit/:id', async (req, res) => {
    let category = await Category.findById(req.params.id)
    res.render('categories/edit', {
        category
    })
})

router.post('/edit', async (req, res) => {
    await Category.findByIdAndUpdate(req.body.id, {
        name: req.body.name
    })
    res.redirect('/category')
})

module.exports = router;