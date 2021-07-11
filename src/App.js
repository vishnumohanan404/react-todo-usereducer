import * as React from 'react';
import './styles.css';

// type definitions
type TodoType = {
  idx?: number;
  text?: string;
  completed?: boolean;
};

type StateType = {
  todos: Array<any>;
  totalTodos: number;
};

type ActionType = {
  type: string;
  payload: any;
};

// action types
const AddTodo = 'add-todo';
const MarkCompleted = 'mark-completed';
const MarkIncompleted = 'mark-incompleted';
const Reset = 'reset';

// reducer
const reducer = (state: StateType, action: ActionType): StateType => {
  const { payload } = action;
  switch (action.type) {
    case AddTodo:
      return {
        todos: [...state.todos, { text: payload.text, completed: false }],
        totalTodos: state.totalTodos + 1,
      };
    case MarkCompleted:
      return {
        todos: state.todos.map((todo, idx) => {
          return idx === payload.idx ? { ...todo, completed: true } : todo;
        }),
        totalTodos:
          [...state.todos.filter((todo) => !todo.completed)].length - 1,
      };
    case MarkIncompleted:
      return {
        todos: state.todos.map((todo, idx) => {
          return idx === payload.idx ? { ...todo, completed: false } : todo;
        }),
        totalTodos:
          [...state.todos.filter((todo) => !todo.completed)].length + 1,
      };
    case Reset:
      return init(action.payload);

    default:
      throw new Error('Not compatible action');
  }
};

// initial state
const intialState = {
  todos: [],
  totalTodos: 0,
};

// init function
const init = (initialState: StateType) => initialState;

const App = () => {
  const [{ todos, totalTodos }, dispatch] = React.useReducer(
    reducer,
    intialState,
    init
  );
  const [itemName, setItemName] = React.useState('');
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: AddTodo,
      payload: {
        text: itemName,
      },
    });
    setItemName('');
  };
  return (
    <div className="app">
      <h1>Todo List</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Add a item name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <button type="submit">Add item</button>
      </form>

      <div className="number">
        <button onClick={() => dispatch({ type: Reset, payload: intialState })}>
          Reset
        </button>
        Total Todos: {totalTodos}
      </div>

      <ol className="list">
        {todos.map((todo, idx) => {
          return (
            <li
              key={idx}
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
              onClick={() =>
                todo.completed
                  ? dispatch({
                      type: MarkIncompleted,
                      payload: { ...todo, idx: idx },
                    })
                  : dispatch({
                      type: MarkCompleted,
                      payload: { ...todo, idx: idx },
                    })
              }
            >
              {todo.text}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default App;
