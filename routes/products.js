const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../models/Product');
require('../models/Category');
require('../models/User');
const Product = mongoose.model('product');
const Category = mongoose.model('category');
const User = mongoose.model('user')

router.get('/', (req, res) => {
    Promise.all([
        Product.find({
            userId: req.user._id
        }).lean().exec(),
        Category.find().lean().exec()
    ])
        .then(data => res.render('products/products', { products: data[0], categories: data[1] }))
        .catch(err => console.log(err));
});

router.get('/add', async (req, res) => {
    let categories = await Category.find()
    res.render('products/add', {
        categories
    })
})

router.post('/add', (req, res) => {
    let data = {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        quantity: req.body.quantity,
        userId: req.user._id
    }

    Product(data).save().then(data => {
        res.redirect('/products');
    });
})

router.post('/', (req, res) => {
    Product(req.body).save().then(data => {
        res.redirect('/products');
    });
})

router.get('/delete/:id', async (req, res) => {
    await Product.findByIdAndRemove(req.params.id)
    res.redirect('/products');
})

router.get('/edit/:id', async (req, res) => {
    let product = await Product.findById(req.params.id)
    let categories = await Category.find()
    let newCategories = categories.map(x => ({ name: x.name }))
    newCategories.forEach(x => {
        if (x.name == product.category)
            x.isSelected = true
    })

    res.render('products/edit', {
        product,
        categories: newCategories
    })
})

router.post('/edit', async (req, res) => {
    await Product.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        quantity: req.body.quantity
    })
    res.redirect('/products')
})

router.get('/data/:id', async (req, res) => {
    let user = await User.findById(req.params.id)
    let products = await Product.find({ userId: user._id })
    res.render('products/data', {
        user,
        products
    })
})

module.exports = router;