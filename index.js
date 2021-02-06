const express = require('express');

const server = express();

server.use(express.json());

//Query params = ?teste=1
//Route params = /users/1
//Request body = { "name": 'Larissa Pissurno' }

const RESPONSE_USERS = ['Larissa', 'Tawany', 'Thay', 'Anna'];

server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  
  next();

  console.timeEnd('Request');
})

function checkUserExists(req, res, next) {
  if (!req.body.name){
    return res.status(400).json({ error: 'Name is required' });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const { index } = req.params;
  const user = RESPONSE_USERS[index];
  if (!user) {
    return res.status(400).json({ error: 'User does not exists' });
  }

  req.user = user;

  return next();
}

server.get('/users', (req, res) => {
  return res.json(RESPONSE_USERS);
});

server.get('/users/:name', (req, res) => {
  const { name } = req.params;

  const userIndex = RESPONSE_USERS.findIndex(username => username === name)

  return res.json(RESPONSE_USERS[userIndex]);
  
});

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  RESPONSE_USERS.push(name);

  return res.json(RESPONSE_USERS);
});

server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  RESPONSE_USERS[index] = name;

  return res.json(RESPONSE_USERS);
});

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  RESPONSE_USERS.splice(index, 1);

  return res.send();
})

server.listen(3000);

module.exports = server;