# TaskFlow — Project Documentation & Reflection

## 1. Project Overview
TaskFlow is a simple and responsive task-management web application created for the Week 5 JavaScript Project. Its purpose is to help students and other users organize everyday tasks in one place. Users can create tasks, assign a category, mark work as complete, and review their progress.

## 2. Target Users
The main target users are students and individuals who want a straightforward way to track study, personal, and work-related tasks.

## 3. Features Implemented
The application supports adding, editing, deleting, and completing tasks. It provides title search, status filters (All, Active, Completed), category filtering, duplicate-title validation, and a Clear Completed action. A live counter displays the number of tasks and tasks remaining. A progress bar shows the completion percentage. Tasks are saved in browser local storage, so they remain after a page refresh in the same browser.

## 4. Technologies Used
HTML5 provides the semantic page structure and form controls. CSS3 is used for the visual design, responsive layout, and mobile support. Vanilla JavaScript manages application logic and user interactions without requiring an external framework.

## 5. JavaScript Concepts Used
The project uses variables, functions, arrays, objects, conditional statements, loops, and array methods such as `filter()`, `map()`, `some()`, `find()`, and `forEach()`. DOM methods select elements, create task rows, update counters, and display messages. Form submission, input, click, and change events make the page interactive. JSON and `localStorage` are used to save and load tasks.

## 6. Screenshots
Open `index.html` in a browser and capture screenshots of the initial page, a list containing tasks, and the search/filter controls. Save the images in the `screenshots` folder before submitting if your instructor requires screenshot evidence.

## 7. Challenges Faced and Solutions
One challenge was keeping the task list and counters synchronized after every action. A single `renderTasks()` function updates the visible list, empty state, counts, and progress bar. Another challenge was preserving tasks after refreshing the page. The application uses `localStorage` and JSON to store and restore task data. Input validation also prevents blank and duplicate task titles.

## 8. What I Learned
I learned how HTML, CSS, and JavaScript work together to create a functional web application. I practiced DOM manipulation, event handling, array operations, form validation, responsive design, and browser storage. I also learned the importance of testing different user actions and organizing code into readable functions.

## 9. Future Improvements
Possible improvements include due dates, priority levels, sorting, task export, and optional cloud synchronization. These additions could make the application more useful for larger projects.
