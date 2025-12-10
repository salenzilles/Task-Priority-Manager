const taskService = require("../services/taskService");

function parseBool(q) {
  if (q === undefined) return false;
  return q === 'true' || q === '1' || q === true;
}

module.exports = {
  async createTask(req, res) {
    try {
      const payload = req.body;
      const created = await taskService.createTask(payload);
      return res.status(201).json(created);
    } catch (err) {
      return res.status(err.status || 400).json({ error: err.message });
    }
  },

  async listTasks(req, res) {
    try {
      const showCompleted = parseBool(req.query.showCompleted);
      const tasks = await taskService.listTasks({ showCompleted });
      return res.json(tasks);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async getTask(req, res) {
    try {
      const t = await taskService.getTaskById(req.params.id);
      if (!t) return res.status(404).json({ error: 'Task not found' });
      return res.json(t);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async completeTask(req, res) {
    try {
      const updated = await taskService.completeTask(req.params.id);
      if (!updated) return res.status(404).json({ error: 'Task not found' });
      return res.json(updated);
    } catch (err) {
      return res.status(err.status || 400).json({ error: err.message });
    }
  },

  async deleteTask(req, res) {
    try {
      const removed = await taskService.deleteTask(req.params.id);
      if (!removed) return res.status(404).json({ error: 'Task not found' });
      return res.json({ message: 'Task deleted' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
