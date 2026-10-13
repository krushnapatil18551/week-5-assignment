/* TaskFlow — Week 5 JavaScript Project
   Features: add, edit, delete, complete, search, filters, category filter,
   clear completed, validation, progress tracking, and localStorage persistence. */

"use strict";

const STORAGE_KEY = "taskflow-week5-tasks";
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const categoryInput = document.querySelector("#category-input");
const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const formMessage = document.querySelector("#form-message");
const taskCount = document.querySelector("#task-count");
const remainingCount = document.querySelector("#remaining-count");
const completedCount = document.querySelector("#completed-count");
const progressLabel = document.querySelector("#progress-label");
const progressBar = document.querySelector("#progress-bar");
const clearCompletedButton = document.querySelector("#clear-completed");
const filterButtons = document.querySelectorAll("[data-filter]");

let currentFilter = "all";
let editingTaskId = null;
let tasks = loadTasks();

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    const parsed = savedTasks ? JSON.parse(savedTasks) : [];
    return Array.isArray(parsed) ? parsed.filter(isValidTask) : [];
  } catch (error) {
    console.warn("Saved tasks could not be loaded.", error);
    return [];
  }
}

function isValidTask(task) {
  return task && typeof task.id === "string" &&
    typeof task.title === "string" && typeof task.completed === "boolean" &&
    typeof task.category === "string";
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.warn("Tasks could not be saved in this browser.", error);
    showMessage("Browser storage is unavailable. Your tasks may not persist after refresh.", true);
  }
}

function showMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.style.color = isError ? "#c04455" : "#2c9b72";
}

function createTask(title, category) {
  return {
    id: (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: title.trim(),
    category,
    completed: false,
    createdAt: new Date().toLocaleDateString()
  };
}

function addTask(title, category) {
  const cleanTitle = title.trim();
  if (!cleanTitle) {
    showMessage("Please enter a task title.", true);
    taskInput.focus();
    return;
  }
  if (cleanTitle.length > 100) {
    showMessage("Task title must be 100 characters or fewer.", true);
    return;
  }
  const duplicate = tasks.some(task => task.title.toLowerCase() === cleanTitle.toLowerCase());
  if (duplicate) {
    showMessage("A task with this title already exists. Try a different title.", true);
    taskInput.focus();
    return;
  }
  tasks.unshift(createTask(cleanTitle, category));
  saveTasks();
  renderTasks();
  showMessage("Task added successfully.");
}

function updateTask(id, newTitle) {
  const cleanTitle = newTitle.trim();
  if (!cleanTitle) {
    showMessage("Task title cannot be empty.", true);
    return false;
  }
  const duplicate = tasks.some(task => task.id !== id && task.title.toLowerCase() === cleanTitle.toLowerCase());
  if (duplicate) {
    showMessage("Another task already uses this title.", true);
    return false;
  }
  tasks = tasks.map(task => task.id === id ? { ...task, title: cleanTitle } : task);
  saveTasks();
  renderTasks();
  showMessage("Task updated successfully.");
  return true;
}

function deleteTask(id) {
  const task = tasks.find(item => item.id === id);
  if (!task) return;
  tasks = tasks.filter(item => item.id !== id);
  if (editingTaskId === id) editingTaskId = null;
  saveTasks();
  renderTasks();
  showMessage("Task deleted.");
}

function toggleTask(id, completed) {
  tasks = tasks.map(task => task.id === id ? { ...task, completed } : task);
  saveTasks();
  renderTasks();
}

function getVisibleTasks() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  return tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === "all" || task.category === selectedCategory;
    const matchesStatus = currentFilter === "all" ||
      (currentFilter === "active" && !task.completed) ||
      (currentFilter === "completed" && task.completed);
    return matchesSearch && matchesCategory && matchesStatus;
  });
}

function makeActionButton(label, symbol, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `icon-btn ${className || ""}`.trim();
  button.textContent = symbol;
  button.setAttribute("aria-label", label);
  button.title = label;
  button.addEventListener("click", onClick);
  return button;
}

function renderTask(task) {
  const item = document.createElement("li");
  item.className = `task-item${task.completed ? " is-completed" : ""}`;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-check";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", `Mark ${task.title} as ${task.completed ? "active" : "completed"}`);
  checkbox.addEventListener("change", () => toggleTask(task.id, checkbox.checked));

  const content = document.createElement("div");
  content.className = "task-content";
  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = task.title;

  const meta = document.createElement("div");
  meta.className = "task-meta";
  const category = document.createElement("span");
  category.className = `category-tag ${task.category.toLowerCase()}`;
  category.textContent = task.category;
  const date = document.createElement("span");
  date.textContent = `Added ${task.createdAt}`;
  meta.append(category, date);
  content.append(title, meta);

  const actions = document.createElement("div");
  actions.className = "item-actions";
  actions.append(
    makeActionButton("Edit task", "✎", "edit", () => beginEdit(task)),
    makeActionButton("Delete task", "×", "delete", () => deleteTask(task.id))
  );
  item.append(checkbox, content, actions);
  return item;
}

function beginEdit(task) {
  const nextTitle = window.prompt("Edit task title:", task.title);
  if (nextTitle === null) return;
  if (updateTask(task.id, nextTitle)) taskInput.focus();
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  taskList.replaceChildren();
  visibleTasks.forEach(task => taskList.appendChild(renderTask(task)));

  emptyState.hidden = visibleTasks.length > 0;
  if (tasks.length > 0 && visibleTasks.length === 0) {
    emptyState.querySelector("h3").textContent = "No matching tasks";
    emptyState.querySelector("p").textContent = "Try another search or filter.";
  } else {
    emptyState.querySelector("h3").textContent = "No tasks here yet";
    emptyState.querySelector("p").textContent = "Add a task above and start building momentum.";
  }

  const completed = tasks.filter(task => task.completed).length;
  const remaining = tasks.length - completed;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
  remainingCount.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} remaining`;
  completedCount.textContent = String(completed);
  progressLabel.textContent = tasks.length ? `${progress}% complete` : "Keep going — you've got this!";
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute("aria-label", `${progress}% of tasks completed`);
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();
  addTask(taskInput.value, categoryInput.value);
  if (formMessage.style.color !== "rgb(192, 68, 85)") {
    taskInput.value = "";
    taskInput.focus();
  }
});

taskInput.addEventListener("input", () => {
  if (taskInput.value.trim()) formMessage.textContent = "";
});

searchInput.addEventListener("input", renderTasks);
categoryFilter.addEventListener("change", renderTasks);

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    renderTasks();
  });
});

clearCompletedButton.addEventListener("click", () => {
  const completedCountNow = tasks.filter(task => task.completed).length;
  if (completedCountNow === 0) {
    showMessage("There are no completed tasks to clear.", true);
    return;
  }
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
  showMessage(`${completedCountNow} completed ${completedCountNow === 1 ? "task" : "tasks"} cleared.`);
});

renderTasks();
