const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: String,
    branch: Array,
    password: String,
    mail: String,
    mandant: String,
    category: Array,
    questions: Array,
}, {collection: 'users'})
//let objectIdType = mongoose.Schema.ObjectId;

const User = mongoose.model('User', userSchema)

module.exports = User