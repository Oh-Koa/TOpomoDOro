const root = document.getElementById(`app`);

const LOCAL_STORAGE_LIST_KEY = `tpdrTasks.list`;
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = `tpdrTasks.selectedListId`;
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);
const selectedList = () => lists.find((list) => list.id === selectedListId);

const saveLists = () =>
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));

const saveSelectedListId = () =>
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);

const clearWithinElement = (parentElement) => {
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
};

const render = (template, container = root) => {
  clearWithinElement(container);
  container.insertAdjacentHTML(`beforeend`, template);
};

const returnLists = (listsArray) => {
  const list = ({ id, name }) => `
    <li class="list-name${
      id === selectedListId ? ` active-list` : ``
    }" data-list-id="${id}">${name}</li>
  `;
  return listsArray.map((item) => list(item)).join(``);
};
const selectList = (e) => {
  if (!e.target.matches(`.list-name`)) return;

  selectedListId = e.target.dataset.listId;
  saveSelectedListId();
  render(AppBody());
};

const ListsContainer = (listsArray) => `
  <ul class="lists-container" id="lists-container">${returnLists(
    listsArray
  )}</ul>
`;

const NewListForm = () => `
  <form action="" id="new-list-form">
    <input type="text" class="new list" aria-label="new list name" placeholder="new list name" id="new-list-input"/>
    <button class="btn create" aria-label="create-new-list">+</button>
  </form>
`;
const createList = (name) => ({
  id: Date.now().toString(16),
  name: name,
  tasks: [],
});
const submitNewList = (e) => {
  if (!e.target.matches(`#new-list-form`)) return;

  e.preventDefault();
  const listName = document.getElementById(`new-list-input`).value;
  if (listName.trim().length !== 0) {
    const newList = createList(listName);
    lists = lists.concat(newList);
    selectedListId = newList.id;
    saveLists();
    saveSelectedListId();
    render(AppBody());
    e.target.reset();
  }
};

const TaskLists = () => `
  <aside class="task-lists" id="task-lists">
    ${ListsContainer(lists)}
    ${NewListForm()}
  </aside>
`;

const taskCounter = (tasks) => {
  const taskCount = tasks.filter((task) => !task.completed).length;
  return taskCount === 0 ? `none` : taskCount;
};
const TaskListHeader = ({ name, tasks }) => {
  return `
    <div class="task-list-header">
      <h2>${name}</h2>
      <p>Tasks Remaining: <span id="task-count">${taskCounter(tasks)}</span></p>
    </div>
  `;
};

const ListItems = ({ tasks }) => `
  <ul class="list-items">${tasks
    .map(
      ({ name, id, completed }, i) => `
    <li class="task">
      <input type="checkbox" name="task-checkbox" class="task-name" id="task-${i}" data-task-id="${id}"${
        completed ? ` checked` : ``
      }/>
      <label for="task-${i}"><span class="custom-checkbox"></span>${name}</label>
    </li>
  `
    )
    .join(``)}</ul>
`;
const toggleTaskCheckbox = (e) => {
  if (!e.target.matches(`.task-name`)) return;

  const selectedTask = selectedList().tasks.find(
    ({ id }) => id === e.target.dataset.taskId
  );
  selectedTask.completed = !selectedTask.completed;
  saveLists();
  render(
    taskCounter(selectedList().tasks),
    document.getElementById(`task-count`)
  );
};

const TaskListItems = (list) => `
  ${TaskListHeader(list)}
  ${ListItems(list)}
`;

const NewTaskForm = () => `
  <form action="" id="new-task-form">
    <input type="text" class="new-task-input" aria-label="new task name" placeholder="new task name" id="new-task-input"/>
    <button class="btn create" aria-label="create-new-task">+</button>
  </form>
`;
const createTask = (name) => ({
  id: Date.now().toString(16),
  name: name,
  completed: false,
});
const submitNewTask = (e) => {
  if (!e.target.matches(`#new-task-form`)) return;

  e.preventDefault();
  const taskName = document.getElementById(`new-task-input`).value;
  if (taskName.trim().length !== 0) {
    selectedList().tasks = selectedList().tasks.concat(createTask(taskName));
    saveLists();
    render(
      TaskListItems(selectedList()),
      document.getElementById(`task-list-items-container`)
    );
    e.target.reset();
  }
};

const ListOptions = () => `
  <div class="list-options">
    <button id="delete-list-btn" type="button">delete list</button>
    <button id="delete-completed-btn" type="button">delete completed tasks</button>
  </div>
`;
const deleteCompleted = (e) => {
  if (!e.target.matches(`#delete-completed-btn`)) return;

  selectedList().tasks = selectedList().tasks.filter(
    ({ completed }) => !completed
  );
  saveLists();
  render(
    TaskListItems(selectedList()),
    document.getElementById(`task-list-items-container`)
  );
};
const deleteList = (e) => {
  if (!e.target.matches(`#delete-list-btn`)) return;

  lists = lists.filter((list) => list.id !== selectedListId);
  selectedListId = null;
  saveLists();
  saveSelectedListId();
  render(AppBody());
};

const TaskList = (list) => `
  <main class="task-list">
    ${
      !list
        ? `
    <h1 class="no-list-selected">no list selected</h1>
    `
        : `
      <div class="task-list-items-container" id="task-list-items-container">
        ${TaskListItems(list)}
      </div>
      ${NewTaskForm()}
      ${ListOptions()}
    `
    }
  </main>
`;

const Header = () => `
  <header>
    <h1>Todo App</h1>
    <div class="lists-toggle" id="lists-toggle" data-menu-active="false"><span class="toggle-lines"></span></div>
  </header>
`;
const toggleListsMenu = (e) => {
  if (!e.target.closest(`#lists-toggle`)) return;

  document.getElementById(`task-lists`).classList.toggle(`active`);
};

const AppBody = () => `
    ${Header()}
    ${TaskLists()}
    ${TaskList(selectedList())}
`;

root.addEventListener(`click`, (e) => {
  selectList(e);
  deleteList(e);
  toggleTaskCheckbox(e);
  deleteCompleted(e);
  toggleListsMenu(e);
});
root.addEventListener(`submit`, (e) => {
  submitNewList(e);
  submitNewTask(e);
});

render(AppBody());
