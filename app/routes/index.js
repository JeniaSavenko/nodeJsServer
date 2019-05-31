module.exports = (app) => {
    const notes = require('../controllers/note.controller.js');

    app.post('/', notes.create);

    app.get('/', notes.findAll);

    app.get('/:noteId', notes.findOne);

    app.put('/:noteId', notes.update);

    app.delete('/:noteId', notes.delete);
}
