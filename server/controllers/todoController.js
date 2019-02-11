const Todo = require('../models/todo.js');
const getJWT = require('../helpers/getJWT.js');

class TodoController {

  static read(req, res){
    const {data} = getJWT(req.headers.token, 'verify');
    Todo
      .find({
        userId: data._id
      })
      .then(allTodo => {
        res.status(200).json(allTodo);
      })
      .catch(err => {
        res.status(500).json({err: err.message});
      })
  }

  static create(req, res){
    const {data} = getJWT(req.headers.token, 'verify');
    Todo
      .create({
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
        dueDate: req.body.dueDate,
        userId: data._id
      })
      .then(todo => {
        res.status(201).json(todo);
      })
      .catch(err => {
        res.status(500).json({err: err.message});
      })
  }

  static update(req, res){
    Todo
      .findOne({
        _id: req.body.id
      })
      .then(todo => {
        if(todo) {
          todo.name = req.body.name;
          todo.description = req.body.description;
          todo.status = req.body.status;
          todo.dueDate = req.body.dueDate;
          todo.save();
          res.status(200).json(todo);
        }
        else {
          res.status(404).json({err: `This Todo isn't available anymore`});
        }
      })
      .catch(err => {
        res.status(500).json({err: err.message});
      })
  }

  static delete(req, res){
    Todo
      .findOne({
        _id: req.body.id
      })
      .then(todo => {
        if(todo) {
          const successDeleteName = `Your To Do ${todo.name} Have Been Sucessfully Deleted`;
          todo.remove();
          res.status(200).json(successDeleteName);
        }
        else {
          res.status(404).json({err: `This Todo isn't available anymore`});
        }
      })
      .catch(err => {
        res.status(500).json({err: err.message});
      })
  }

}

module.exports = TodoController;