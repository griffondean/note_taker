// Require
const express = require('express');
const path = require('path');
const fs = require('fs');
var PORT = 3001;
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Directs to correct url for index page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Directs to correct url for notes page
app.get("/notes", (req, res) => {
   res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Notes json
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error,notes) => {
      if (error) {
          return console.log(error);
      }
      res.json(JSON.parse(notes));
  })
});

// Adding and saving notes
app.post("/api/notes", (req, res) => {
    // Declare the note that is being used by the user
    const thisNote = req.body;
    // Retrieve notes from db.json, get id of last note, add 1 to it to create 
    // New id, save current note with new id
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error, notes) => {
      if (error) {
          return console.log(error);
      }
      notes = JSON.parse(notes);
      // Assign unique id to each new note depending on last id
      // If there are no items in the notes array, id is set to 10
      if (notes.length > 0) {
      let lastId = notes[notes.length - 1].id;
      var id =  parseInt(lastId) + 1;
      } else {
        var id = 10;
      }
      // Creates new note and updates the id
      let newNote = { 
        title: thisNote.title, 
        text: thisNote.text, 
        id: id 
        }
      // Combines/adds new note into existing array of notes
      var newNotesList = notes.concat(newNote);

      // Writes a new array to db.json file 
      fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(newNotesList), (error, data) => {
        if (error) {
          return error
        }
        console.log(newNotesList)
        res.json(newNotesList);
      })
  });
 
});

// Deletes note
app.delete("/api/notes/:id", (req, res) => {
  let deleteId = JSON.parse(req.params.id);
  console.log("ID to be deleted: " ,deleteId);
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error,notes) => {
    if (error) {
        return console.log(error);
    }
   let notesArray = JSON.parse(notes);
   //loop through notes array and remove note with id matching deleteId
   for (var i=0; i < notesArray.length; i++){
     if(deleteId == notesArray[i].id) {
       notesArray.splice(i,1);

       fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notesArray), (error, data) => {
        if (error) {
          return error;
        }
        console.log(notesArray);
        res.json(notesArray);
      })
     }
  }
  
}); 
});

// Initialize PORT to run app
app.listen(PORT, () => console.log(`App listening on http://localhost:${PORT}`));