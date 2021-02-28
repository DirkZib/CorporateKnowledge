const express = require("express")
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser')
const connectDB = require('./connection')
const routes = require('../api/userAPI')
const router = express.Router();
const User = require('./userSchema')
const Questions = require('./questionSchema')
const Category = require('./categorySchema')
const mongoose = require("mongoose");
const Branch = require('./branchesSchema')

connectDB();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
//app.use('/api/userModel', require('/api/user'))
app.use("/", router);
app.use('/test', routes)
app.post('/createNewUser', (req, res) => {
    let userData = req.body;
    console.log("looooog: " + JSON.stringify(userData))
    userData.category.forEach(object => {
        object.category = mongoose.Types.ObjectId(object.category);
    });

     userData.branch.forEach(object => {
         object.branchId = mongoose.Types.ObjectId(object.branchId);
     });
    console.log(userData);
    const newUser = new User(userData);
    newUser.save(err => {
        if (err) console.log("Error");
        console.log("Benutzer wurde erfolgreich erstellt.");
    });
    res.json(newUser)
})

app.post('/createNewQuestion', (req, res) => {
    let qData = req.body;
    qData.category.forEach(object => {
        object.category = mongoose.Types.ObjectId(object.category);
    });

    console.log(qData);
    const newQuestion = new Questions(qData);
    newQuestion.save(err => {
        if (err) console.log("Error");
        console.log("Frage wurde erfolgreich erstellt.");
    });
    res.json(newQuestion)
})

app.listen(5000, () =>
    console.log('Server Running')
)

app.get('/getUserData', function(req,res){
    User.find({}, function (err, users) {
        if(err){
            console.log('Error: ' + err)
        }
      // console.log("Users:" + users)
       let maxUser = users.length
      // console.log('MaxUser: ' + maxUser)
       
       for (let index = 0; index < maxUser; index++) {
        //    console.log('Log Username: ' + users[index].userName)
        //    console.log('Log Passwort: ' + users[index].password)
           
       }
        res.json(users)
    })
})

app.get('/getQuestionsData', function(req,res){
    Questions.find({}, function (err, questions) {
        if(err){
            console.log('Error: ' + err)
        }
      // console.log("Users:" + users)
       let maxQuestions = questions.length
      // console.log('MaxUser: ' + maxUser)
       
       for (let index = 0; index < maxQuestions; index++) {
        //    console.log('Log Username: ' + users[index].userName)
        //    console.log('Log Passwort: ' + users[index].password)
           
       }
        res.json(questions)
    })
})

app.get('/getCategoryData', function(req,res){
    Category.find({}, function (err, categorys) {
        if(err){
            console.log('Error: ' + err)
        }
      // console.log("Users:" + users)
       let maxCategorys = categorys.length
      // console.log('MaxUser: ' + maxUser)
       
       for (let index = 0; index < maxCategorys; index++) {
        //    console.log('Log Username: ' + users[index].userName)
        //    console.log('Log Passwort: ' + users[index].password)
           
       }
        res.json(categorys)
    })
})

app.get('/getBranchData', function(req,res){
    Branch.find({}, function (err, branch) {
        if(err){
            console.log('Error: ' + err)
        }
      // console.log("Users:" + users)
       let maxBranches = branch.length
      // console.log('MaxUser: ' + maxUser)
       
       for (let index = 0; index < maxBranches; index++) {
        //    console.log('Log Username: ' + users[index].userName)
        //    console.log('Log Passwort: ' + users[index].password)
           
       }
        res.json(branch)
    })
})

app.post('/setQuestionSolved/:questionId',function(req,res){
    let questionId = req.params.questionId;
    // hier logik für question solved in datenbank
    User.findOne({
        // hier später Bedigung für aktuellen User, grade nehmen wir den ersten
    },(err, user) => {
        user.questions.forEach((question,index)=>{
            if(question.question==questionId) {
                console.log("Setting",questionId,"to answered");
                user.questions[index].questionSolved = true;
                user.markModified('questions');
                user.save((err)=>{
                    if(err) {
                        res.json({'status':'error','error':err});
                    } else {
                        res.json({'status':'ok','questions':user.questions});
                    }
                });
            }
        })
        
    });


});