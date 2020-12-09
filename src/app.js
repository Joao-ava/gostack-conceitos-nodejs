const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const repository = {
    ...request.body,
    id: uuid(),
    likes: 0,
  };
  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  if (!isUuid(id)) return response.status(400).json({ message: 'id is not valid' });

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  const { likes } = repositories[repositoryIndex];

  const repository = {
    ...repositories[repositoryIndex],
    ...request.body,
    likes,
  };
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  if (!isUuid(id)) return response.status(400).json({ message: 'id is not valid' });

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  repositories.pop(repositoryIndex);
  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  if (!isUuid(id)) return response.status(400).json({ message: 'id is not valid' });

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  const { likes } = repositories[repositoryIndex];
  const repository = {
    ...repositories[repositoryIndex],
    likes: likes + 1,
  };
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;
