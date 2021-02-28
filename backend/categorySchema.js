const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    id: Object,
    categoryName: Object,
    mandant: String


}, {collection: 'category'})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category