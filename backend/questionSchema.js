const mongoose = require('mongoose')

const questionsSchema = new mongoose.Schema({
    id: Object,
    question: String,
    answer1: String,
    isTrue1: Boolean,
    answer2: String,
    isTrue2: Boolean,
    answer3: String,
    isTrue3: Boolean,
    answer4: String,
    isTrue4: Boolean,
    category: Array,
    mandant: String,
    counterWrongAnswers: Number

}, {collection: 'questions'})

const Questions = mongoose.model('Questions', questionsSchema)

module.exports = Questions