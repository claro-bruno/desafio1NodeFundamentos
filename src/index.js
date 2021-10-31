const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

let users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(({ username: current }) => current === username);
  if(!user) {
    return response.status(404).json({ error: 'User Already Exists!' }); 
  }
  request.user = user;
  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const checksExistsUserAccount = users.some(({username: current}) => ( current === username ));

  if(checksExistsUserAccount) {
    return response.status(400).json({ error: 'User already exists! '});
  }
  
  let user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users = [...users, user];
  // customers.push(customer);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.status(201).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const idUser = users.findIndex(({ username: currency }) => currency === user.username);
  const task = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  const todoList = [...user.todos, task]
  users[idUser].todos = todoList;

  // users.todos.push(todoList);
  return response.status(201).json(task);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { id: param } = request.params;
  const { user } = request;
  
  const task = user.todos.find(({ id: current }) => current === param);

  if(!task) {
    return response.status(404).json({ error: 'Task Not Found' });
  }

  task.title = title;
  task.deadline = new Date(deadline);

  return response.status(200).json(task);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  let task = user.todos.find(({ id: current }) => current === id);
  if (!task) {
    return response.status(404).json({ error: 'todo not exists' });
  }
  
  task.done = true;
 
    
  return response.status(200).json(task);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  let task = user.todos.findIndex(({ id: current }) => current === id);

  if (task === -1) {
    return response.status(404).json({ error: 'todo not exists' });
  }

  user.todos.splice(task, 1);
  return response.status(204).json();
});

module.exports = app;