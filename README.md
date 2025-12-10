Task Priority Manager  //Nova funcionalidade em desenvolvimento - Branch: Feature

Backend application built with Node.js as part of a technical assessment. It provides task management (create, list, delete, complete) and 
automatic priority scoring based on urgency, effort, category, and task dependencies. Data is persisted locally using a JSON file.


The tasks have been created with:
- Title
- Description
- Due date
- Estimated effort (0.5–40h)
- Category (bug, feature, maintenance, research)
- Dependencies

OTHER FEATURES:
- List tasks sorted by priority
- Automatic priority calculation
- Mark tasks as complete
- Delete tasks
- Persistent storage in local JSON file (data/tasks.json)
- Validation for invalid input


HOW TO RUN THE APPLICATION:

1. Install dependencies
   npm install

2. Start the server
   npm run dev

- The API will run on:
http://localhost:3000

API ENDPOINTS: 
List tasks (incomplete only)
- GET /tasks

. Example body: 
{ 
"title": "Implement authentication", 
"description": "Add login feature", 
"dueDate": "2025-02-10", 
"effort": 4, 
"category": "feature", 
"dependencies": [] 
} 

List all tasks (including completed)
- GET /tasks?showCompleted=true

Create a task
- POST /tasks

Delete a task
- DELETE /tasks/:id

Mark task as complete
- PATCH /tasks/:id/complete


PROJECT STRUCTURE:

data/ 
    tasks.json 
src/ 
   app.js 
   controllers/ 
   services/ 
   utils/ 
   routes/ 
index.js


ASSUMPTIONS I HAVE MADE: 
-> Tasks are stored in a local JSON file instead of a database 
-> Task IDs are generated automatically using UUID, ensuring global uniqueness 
-> When a task is deleted, its ID is not reused 
-> Only incomplete tasks are shown by default (as required) 
-> Task dependencies must reference existing task IDs


TECHNOLOGY CHOICES:
--> Node.js + Express 
    = Fast to develop 
    = Simple, lightweight, and widely used 
    = Great for small backend APIs 
    = Also it was on my list as the next technology to study and practice

--> Local JSON Persistence 
    = Chosen to keep the project simple and self-contained 
    = No database setup required 
    = Easy to run and test 
    = Fully meets the test requirements for persistence

HOW TO TEST:
You can test the API using:

- Thunder Client (VS Code)
- Postman
