const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../data/tasks.json');

function readAllSync() {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8');
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse tasks.json', err);
    return [];
  }
}

function writeAllSync(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), 'utf8');
}

module.exports = {
  async readAll() {
    
    return Promise.resolve(readAllSync());
  },

  async writeAll(tasks) {
    writeAllSync(tasks);
    return Promise.resolve();
  }
};
