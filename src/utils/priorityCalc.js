const dayjs = require('dayjs');

const CATEGORY_WEIGHT = {
  bug: 8,
  feature: 5,
  maintenance: 3,
  research: 2
};

function urgencyPoints(dueDateStr) {
  const today = dayjs().startOf('day');
  const due = dayjs(dueDateStr, 'YYYY-MM-DD');
  const diff = due.diff(today, 'day'); 
  if (diff <= 0) return 10; 
  if (diff >= 1 && diff <= 3) return 7;
  if (diff >= 4 && diff <= 7) return 5;
  if (diff >= 8 && diff <= 14) return 3;
  return 1; // + 14 dias
}

function effortPoints(effort) {
  if (effort >= 0.5 && effort <= 2) return 5;
  if (effort > 2 && effort <= 8) return 3;
  if (effort > 8 && effort <= 16) return 2;
  return 1; // + 16 dias
}

// Bônus de dependência
function dependencyBonus(task, allTasks) {
  
  const dependents = allTasks.filter(t => Array.isArray(t.dependencies) && t.dependencies.includes(task.id));
  const incompleteDependents = dependents.filter(d => d.status !== 'completed');
  return incompleteDependents.length * 4;
}

function calculatePriority(task, allTasks) {
  const u = urgencyPoints(task.dueDate);
  const e = effortPoints(task.effort);
  const c = CATEGORY_WEIGHT[task.category] || 0;
  const d = dependencyBonus(task, allTasks);
  const total = u + e + c + d;
  return Number(total);
}

function calculatePriorityForAll(allTasks) {
  // Retorna um novo array com prioridade de Score atualizada
  const cloned = allTasks.map(t => ({ ...t }));
  for (const t of cloned) {
    t.priorityScore = calculatePriority(t, cloned);
  }
  return cloned;
}

module.exports = { calculatePriorityForAll, calculatePriority };
