const root = document.getElementById(`app`);

const clearWithinElement = (parentElement) => {
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
};

const render = (parentElement, template, position) => {
  clearWithinElement(parentElement);
  parentElement.insertAdjacentHTML(position, template);
};

const map = (fn) => (array) => array.map(fn);
const concat = (origin, ...newObjs) => [...newObjs].concat(origin);

const APPDATA = {
  title: `<span>TO</span>pomo<span>DO</span>ro`,
  initialtask: () => ({
    title: `This is a task!`,
    notes: `You would write your notes here!`,
    children: false,
  }),
};

const Header = () => `
  <header>
  <h1 class="title">${APPDATA.title}</h1>
  </header>
`;

const MobileFooter = () => `
  <footer>
  <ul class="menu">
    <li><button type="button">timer</button></li>
    <li><button type="button">add task/project</button></li>
    <li><button type="button">settings</button></li>
  </ul>
  </footer>
`;

const createToDoList = map(
  (todo) => `
    <li class="todo-card">
      <div class="todo-card-title">
        <input type="text" value="${todo.title}"/>
        <button type="button">&gt;</button>
      </div>
      <div class="todo-card-options">
        <ul><li>complete</li>
        <li>remove</li>
        <li>timespent</li></ul>
      </div>
    </li>
  `
);

const InitialPage = () => {
  return `
    ${Header()}
    <main>
      <div class="greet"><h1>Hello!</h1></div>
      <div class="todos-container">
        <ul class="todos">
          ${createToDoList(concat(APPDATA.initialtask()))}
        </ul>
      </div>
    </main>
    ${MobileFooter()}
`;
};

render(root, InitialPage(), `beforeend`);
