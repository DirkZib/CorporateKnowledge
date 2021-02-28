const mongoose = require('mongoose')

const branchSchema = new mongoose.Schema({
    branchName: String,
    branchId: Array,
    mandant: String


}, {collection: 'branch'})

const Branch = mongoose.model('Branch', branchSchema)

module.exports = Branch