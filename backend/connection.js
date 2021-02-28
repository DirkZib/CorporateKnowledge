const mongoUri = 'mongodb+srv://USER:PW@corporateknowledge.mexm6.mongodb.net/corporateknowledge?retryWrites=true&w=majority'
const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log('db connected :-) ')
}

module.exports = connectDB;
