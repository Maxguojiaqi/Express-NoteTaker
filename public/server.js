// Dependencies
// =============================================================
const express = require('express')
const path = require('path')
const fs = require('fs')
const uuid = require('uuid')



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
        return res.json(data)
    })
})


// Create New Notes
app.post('/api/notes', function (req, res) {

    const newNotes = req.body
  
    console.log(newNotes)

    fs.readFile(DB_Path,'utf8',(error,data)=>{
        if(error) console.log(error)
        console.log('line55' + data)
        console.log(JSON.parse(data))
        let dataObj = JSON.parse(data)
        console.log('The new Notes type is: ' + typeof(newNotes))
        console.log(dataObj)
        newNotes.id = uuid.v4()
        dataObj.push(newNotes)
        console.log(newNotes)
        console.log(uuid.v4())
        fs.writeFile(DB_Path, JSON.stringify(dataObj), (err) => {
            if (err) throw err;
            else return res.json(dataObj)
        });
    })
    
  })


app.delete('/api/delete', function (req, res) {

    tables = [];
    console.log("this is the current state of table: "+tables)
})


app.delete('/api/notes/:id', function (req, res) {
    const noteID = req.params.id
    console.log(noteID)
  
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

// Starts the server to begin listening
// =============================================================
app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`))