// Dependencies
// =============================================================
const express = require('express')
const path = require('path')
const fs = require('fs')
const util = require('util')


const DB_DIR = path.resolve(__dirname, "../db");
const DB_Path = path.join(DB_DIR, "db.json");
console.log(DB_Path)
// const readFilePromise = util.promisify(fs.readFile()

// Sets up the Express App
// =============================================================
const app = express()
const PORT = 3080

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static(__dirname));

// Tables Object
// =============================================================
let tables = [
  {
    customerName: 'Max',
    phoneNumber: '613-000-0000',
    customerEmail: 'max@fakemail.com',
    customerID: 'sa34fa'
  },
  {
    customerName: 'Dustin',
    phoneNumber: '613-000-0000',
    customerEmail: 'dustin@fakemail.com',
    customerID: 'bv97al'
  },
  {
    customerName: 'Mike',
    phoneNumber: '613-000-0000',
    customerEmail: 'mike@fakemail.com',
    customerID: 'ts21ja'
  },
  {
    customerName: 'Solomeneke',
    phoneNumber: '613-000-0000',
    customerEmail: 'solomeneke@fakemail.com',
    customerID: 'kq42ba'
  }
]

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/notes', function (req, res) {
  res.sendFile(path.join(__dirname, 'notes.html'))
})

// Displays all Notes
app.get('/api/notes', function (req, res) {
    fs.readFile(DB_Path,'utf8',(error,data)=>{
        if(error) console.log(error)
        // console.log(data)
        // console.log('this is the data' + data)
        return res.json(data)
    })
})

// Displays all Tabels
app.get('/api/tablesAll', function (req, res) {
  return res.json(tables)
})

// Displays waitlist Tabels
app.get('/api/waitlist', function (req, res) {

    if(tables.length<5) 
    {
        return res.json('Nobody on the waitlist!')
    }

    else return res.json(tables.slice(5))
})

// Create New Tabels - takes in JSON input
app.post('/api/tables', function (req, res) {

  const newTable = req.body

  console.log(newTable)

  tables.push(newTable)

  res.json(newTable)
})
// clear up all the tables
app.post('/api/clear', function (req, res) {

    tables = [];
    res.json(tables)
})

app.post('/api/delete', function (req, res) {

    tables = [];
    console.log("this is the current state of table: "+tables)
})

// Starts the server to begin listening
// =============================================================
app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`))