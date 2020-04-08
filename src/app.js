const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const repository = { id: uuid(), title, url, techs, likes: 0 }
  repositories.push(repository)
  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repoIndex = repositories.findIndex(repo => repo.id === id)
  if (repoIndex < 0) {
    return response.status(400).json({ error: 'repository does not exist' })
  }

  const likes = repositories[repoIndex].likes

  const repo = { id, title, url, techs, likes }
  repositories[repoIndex] = repo
  return response.json(repo)
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params

  const repoIndex = repositories.findIndex(repo => repo.id === id)
  if (repoIndex < 0) {
    return res.status(400).json({ error: 'repository does not exist' })
  }
  repositories.splice(repoIndex, 1)
  return res.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repoIndex = repositories.findIndex(repo => repo.id === id)
  if (repoIndex < 0) {
    return response.status(400).json({ error: 'repository does not exist' })
  }
  repositories[repoIndex].likes++
  return response.json(repositories[repoIndex])
});

module.exports = app;
