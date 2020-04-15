const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const id = uuid();

  const project = {
    id,
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(project);

  return response.json(project);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ Error: "Invalid project ID" });
  }

  const { title, url, techs } = request.body;

  const projectIndex = repositories.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ Error: "Project ID does not exists" });
  }

  const project = {
    title,
    url,
    techs,
  };

  Object.assign(repositories[projectIndex], project);

  return response.json(repositories[projectIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ Error: "Invalid project ID" });
  }

  const projectIndex = repositories.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ Error: "Project ID does not exists" });
  }

  repositories.splice(projectIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ Error: "Invalid project ID" });
  }

  const projectIndex = repositories.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ Error: "Project ID does not exists" });
  }

  repositories[projectIndex].likes += 1;

  return response.json(repositories[projectIndex]);
});

module.exports = app;
