// Dependencies
// =============================================================
const express = require('express')
const path = require('path')
const fs = require('fs')
const uuid = require('uuid')


const DB_DIR = path.resolve(__dirname, "./db");
const DB_Path = path.join(DB_DIR, "db.json");

// Sets up the Express App
// =============================================================
const app = express()
const PORT = process.env.PORT || 3080

// Sets up the Express app to handle data parsing and middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(__dirname + "/public"));

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'))
})

app.get('/notes', function (req, res) {
  res.sendFile(path.join(__dirname, './public/notes.html'))
})

// Displays all Notes
app.get('/api/notes', function (req, res) {
    fs.readFile(DB_Path,'utf8',(error,data)=>{
        if(error) console.log(error)
        return res.json(data)
    })
})

// Create New Notes and write it back to the file
app.post('/api/notes', function (req, res) {

    const newNotes = req.body
    fs.readFile(DB_Path,'utf8',(error,data)=>{
        if(error) console.log(error)
        let dataObj = JSON.parse(data)
        newNotes.id = uuid.v4()
        dataObj.push(newNotes)
        fs.writeFile(DB_Path, JSON.stringify(dataObj), (err) => {
            if (err) throw err;
            else return res.json(dataObj)
        });
    })
    
  })

// Delete notes based on the id
app.delete('/api/notes/:id', function (req, res) {
    const noteID = req.params.id
    fs.readFile(DB_Path,'utf8',(error,data)=>{
        if(error) console.log(error)
        let dataObj = JSON.parse(data)
        for (let note of dataObj) {
            if (note.id === noteID) {
                dataObj.splice( dataObj.indexOf(note), 1 )
            }
        }
        fs.writeFile(DB_Path, JSON.stringify(dataObj), (err) => {
            if (err) throw err;
            else return res.json(dataObj)
        });
    })
  })

// default route when none matching
app.get('*', (req, res) => {
    res.redirect('/');
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`))