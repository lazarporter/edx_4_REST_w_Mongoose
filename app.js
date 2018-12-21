const express = require('express')
const logger = require('morgan')
const errorhandler = require('errorhandler')
const mongoose = require("mongoose")
mongoose.Promise = global.Promise
const bodyParser = require('body-parser')
const path = require('path')

const routes = require('./routes')

const url = 'mongodb://localhost:27017/edx-course-db'
mongoose.connect(url)

let app = express();
app.use(logger('dev'))
app.use(bodyParser.json())

const Account = mongoose.model('Account', {
    name: String,
    balance: Number
})


app.get('/accounts', (req, res) => {

    Account.find((err, results) => {
        //inform the user if there is an error, send details
        if (err) return res.status(500).send(`Couldn't GET accounts: ${err}`)

        //if succesfully queried the DB, send the results back with success code
        res.status(200).send(results)
    })
})

app.post('/accounts', (req, res) => {
    //create an Account document
    let tempAccount = new Account({
        name: req.body.name,
        balance: req.body.balance
    })

    //try to save it:
    tempAccount.save((err, results) => {
        //inform the user if there is an error, send details and exit the function
        if (err) return res.status(500).send(`Couldn't save the account: ${err}`)

        //if succesful, confirm
        res.status(200).send(`Saved: ${results}`)
    })

})

app.put('/accounts/:id', (req, res) => {
    Account.update({
        _id: req.params.id
    }, req.body, (err, results) => {
        //inform the user if there is an error, send details and exit the function
        if (err) return res.status(500).send(`Couldn't update the account: ${err}`)

        //if succesful, confirm 
        res.status(200).send(results)

    })
})

app.delete('/accounts/:id', (req, res) => {
    Account.findByIdAndRemove({
        _id: req.params.id
    },(err,results)=>{
        //inform the user if there is an error, send details and exit the function
        if (err) return res.status(500).send(`Couldn't delete that account: ${err}`)   

        res.status(200).send(`Successfully removed ${results}`)
    })
})
app.listen(3000, ()=>{
    console.log(`App listening on port 3000`)
})