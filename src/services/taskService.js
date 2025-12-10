const taskModel = require('../models/taskModel');
const { calculatePriorityForAll } = require('../utils/priorityCalc');
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs');

const VALID_CATEGORIES = ['bug', 'feature', 'maintenance', 'research'];

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    const e = new Error('Invalid payload');
    e.status = 400;
    throw e;
  }

  const { title, dueDate, effort, category, dependencies } = payload;

  if (!title || title.toString().trim() === '') {
    const e = new Error('Title is required');
    e.status = 400;
    throw e;
  }

  if (!dueDate) {
    const e = new Error('dueDate is required (YYYY-MM-DD)');
    e.status = 400;
    throw e;
  }

  // dayjs para validar formato de data
  const d = dayjs(dueDate, 'YYYY-MM-DD', true);
  if (!d.isValid()) {
    const e = new Error('dueDate must be a valid date in format YYYY-MM-DD');
    e.status = 400;
    throw e;
  }

  if (effort === undefined || effort === null || isNaN(Number(effort))) {
    const e = new Error('effort is required and must be a number');
    e.status = 400;
    throw e;
  }

  const effortNum = Number(effort);
  if (effortNum < 0.5 || effortNum > 40) {
    const e = new Error('effort must be between 0.5 and 40 hours');
    e.status = 400;
    throw e;
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    const e = new Error(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
    e.status = 400;
    throw e;
  }

  if (dependencies) {
    if (!Array.isArray(dependencies)) {
      const e = new Error('dependencies must be an array of task IDs');
      e.status = 400;
      throw e;
    }
  }
}

module.exports = {
  async createTask(payload) {
    validatePayload(payload);

    const tasks = await taskModel.readAll();

    // validar se dependências existem
    const deps = payload.dependencies || [];
    for (const depId of deps) {
      if (!tasks.some(t => t.id === depId)) {
        const e = new Error(`Dependency not found: ${depId}`);
        e.status = 400;
        throw e;
      }
    }

    const newTask = {
      id: uuidv4(),
      title: payload.title,
      description: payload.description || '',
      dueDate: payload.dueDate,
      effort: Number(payload.effort),
      category: payload.category,
      dependencies: deps,
      status: 'pending',
      createdAt: new Date().toISOString(),
      priorityScore: 0 
    };

    tasks.push(newTask);

    // recalcular prioridades para todas as tasks 
    const updated = calculatePriorityForAll(tasks);

    await taskModel.writeAll(updated);

    // devolver a nova task já com prioridade
    return updated.find(t => t.id === newTask.id);
  },

  async listTasks({ showCompleted = false } = {}) {
    const tasks = await taskModel.readAll();
    
    // recalcular prioridade sempre que listar 
    const updated = calculatePriorityForAll(tasks);

    // por padrão, só incompletas
    const filtered = showCompleted ? updated : updated.filter(t => t.status !== 'completed');

    filtered.sort((a, b) => b.priorityScore - a.priorityScore);

    const result = filtered.map(t => {
      const blockers = (t.dependencies || []).map(depId => updated.find(x => x.id === depId)).filter(Boolean).filter(x => x.status !== 'completed');
      return {
        id: t.id,
        title: t.title,
        dueDate: t.dueDate,
        category: t.category,
        effort: t.effort,
        status: t.status,
        priorityScore: t.priorityScore,
        blocked: blockers.length > 0,
        blockers: blockers.map(b => ({ id: b.id, title: b.title }))
      };
    });

    return result;
  },

  async getTaskById(id) {
    const tasks = await taskModel.readAll();
    return tasks.find(t => t.id === id) || null;
  },

  async completeTask(id) {
    const tasks = await taskModel.readAll();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;

    tasks[idx].status = 'completed';
    tasks[idx].completedAt = new Date().toISOString();

    // recalcular prioridades
    const updated = calculatePriorityForAll(tasks);
    await taskModel.writeAll(updated);

    return updated[idx];
  },

  async deleteTask(id) {
    let tasks = await taskModel.readAll();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return false;

    
    tasks = tasks.filter(t => t.id !== id);
    for (const t of tasks) {
      if (Array.isArray(t.dependencies) && t.dependencies.includes(id)) {
        t.dependencies = t.dependencies.filter(d => d !== id);
      }
    }

    const updated = calculatePriorityForAll(tasks);
    await taskModel.writeAll(updated);
    return true;
  }
};
