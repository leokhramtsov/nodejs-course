const fs = require('fs');
const chalk = require('chalk');

const addNote = newNote => {
  const notes = loadNotes();
  const duplicateNote = matchByTitle(notes, newNote.title);

  if (!duplicateNote) {
    saveNotes([...notes, newNote]);
    console.log(chalk.green.inverse('New note added.'));
  } else {
    console.log(chalk.red.inverse('Note title taken.'));
  }
};

const removeNote = title => {
  const notes = loadNotes();
  const filterByTitle = note => note.title !== title;
  const notesToKeep = notes.filter(filterByTitle);

  if (notes.length === notesToKeep.length) {
    console.log(chalk.red.inverse('No note found!'));
  } else {
    saveNotes(notesToKeep);
    console.log(chalk.green.inverse('Note Removed!'));
  }
};

const listNotes = () => {
  const notes = loadNotes();

  if (!notes.length) {
    console.log(chalk.red('No notes available.'));
  } else {
    console.log(chalk.green('Your notes'));
    notes.forEach(note => {
      console.log(`- ${note.title}`);
    });
  }
};

const readNote = title => {
  const notes = loadNotes();
  const note = matchByTitle(notes, title);

  if (!note) {
    console.log(chalk.red.inverse('No note found!'));
  } else {
    console.log(chalk.inverse(note.title));
    console.log(note.body);
  }
};

const matchByTitle = (notes, title) => notes.find(note => note.title === title);

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync('notes.json');
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

const saveNotes = notes => {
  fs.writeFileSync('notes.json', JSON.stringify(notes));
};

module.exports = { addNote, removeNote, listNotes, readNote };
