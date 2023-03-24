import { useState } from "react";
import Popup from 'reactjs-popup';
import "./App.css";

function App() {
  //liste(map) des tâches à faire
  const [todos, setTodos] = useState([
    { id: 1, text: "tâche 1", isDone: false, date: "05/01" },
    { id: 2, text: "tâche 2", isDone: false, date: "05/01" },
    { id: 3, text: "tâche 3", isDone: false, date: "05/01" },
  ]);

  // État pour le nouvel élément à faire et sa date
  const [newTodo, setNewTodo] = useState("");
  const [newDate, setNewDate] = useState("");

  // État pour filtrer les éléments à faire
  const [filter, setFilter] = useState("all");

  // État pour la requête de recherche
  const [searchQuery, setSearchQuery] = useState("");

  // État pour contrôler la modal
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // État pour les valeurs du formulaire dans la modal
  const [formValues, setFormValues] = useState({ name: "", date: "" });

  // État pour contrôler le popup
  const [showPopup, setShowPopup] = useState(false);

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "all") {
        return true;
      } else if (filter === "checked") {
        return todo.isDone;
      } else if (filter === "unchecked") {
        return !todo.isDone;
      }
    })
    .filter((todo) => {
      return todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleAddTodo = () => {
      // on crée un nouvel objet en utilisant la valeur de newTodo et newDate
      const newId = todos.length + 1;
      const newTodoItem = { id: newId, text: newTodo, date: newDate };
      setTodos([...todos, newTodoItem]);
      // on réinitialise le champ de saisie et la date et on ferme le pup-up
      setNewTodo("");
      setNewDate("");
      closePopup();
    };

  const handleToggleTodo = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isDone: !todo.isDone };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const handleMoveTodo = (id, direction) => {
    const index = todos.findIndex((todo) => todo.id === id);
    const lastIndex = todos.length - 1;
    if (direction === "up" && index > 0) {
      const updatedTodos = [
        ...todos.slice(0, index - 1),
        todos[index],
        todos[index - 1],
        ...todos.slice(index + 1),
      ];
      setTodos(updatedTodos);
    } else if (direction === "down" && index < lastIndex) {
      const updatedTodos = [
        ...todos.slice(0, index),
        todos[index + 1],
        todos[index],
        ...todos.slice(index + 2),
      ];
      setTodos(updatedTodos);
    }
  };

  // fonction pour ouvrir le pop-up
  const openModal = () => {
    setModalIsOpen(true);
  };

  // fonction pour fermer le pop-up
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // fonction pour soumettre le formulaire
  const handleSubmit = (event) => {
    event.preventDefault();
    const newTodoItem = {
      id: todos.length + 1,
      text: formValues.name,
      date: formValues.date,
      isDone: false,
    };
    setTodos([...todos, newTodoItem]);
    setFormValues({ name: "", date: "" });
    closeModal();
  };


  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="app">

      <Popup open={showPopup} onClose={closePopup}>
        <div className="popUpAdd">
      <h2>Ajouter une tache</h2>          

      <button onClick={closePopup} className="popup-close">X</button>
      <div >
        <label htmlFor="task" className="popup-label">Tâche :</label>    
        <input
            type="text"
            value={newTodo} // valeur du champ de saisie
            onChange={(e) => setNewTodo(e.target.value)} // mise à jour de la valeur du champ de saisie
            className="add-todo-input"
          />
        <label htmlFor="date" className="popup-label">Date :</label>
        <input
          type="date"
          className="todo-date"
          min="2023-01-01"
          max="2025-12-31"
          onChange={(e) => {
            const dateValue = e.target.value;
            const month = dateValue.substring(5, 7);
            const day = dateValue.substring(8, 10);
            const formattedDate = `${day}/${month}`;
            setNewDate(formattedDate);
          }}
          placeholder="JJ/MM/AAAA"
        />

        <button onClick={handleAddTodo} className="popup-submit"> Envoyer </button>

      </div>
      </div>
      </Popup>


      <h1>Ma liste de tâches</h1>

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">Toutes</option>
        <option value="checked">Terminées</option>
        <option value="unchecked">Non terminées</option>
      </select>

      {/* Header */}
      <ul className="todo-list">
        {filteredTodos.map((todo, index) => (
          <li key={todo.id} className={todo.isDone ? "done" : ""}>
            <div className="todo-buttons">
              <button
                className="todo-move-up-button"
                disabled={index === 0}
                onClick={() => handleMoveTodo(todo.id, "up")}
              >
                ↑
              </button>
              <button
                className="todo-move-down-button"
                disabled={index === filteredTodos.length - 1}
                onClick={() => handleMoveTodo(todo.id, "down")}
              >
                ↓
              </button>
            </div>
            <div className="todo-item">
              <input
                type="checkbox"
                checked={todo.isDone}
                onChange={() => handleToggleTodo(todo.id)}
                className="todo-checkbox"
              />
              <span className="todo-text">{todo.text}</span>
              <span className="todo-date"> {todo.date} </span>
            </div>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="todo-delete-button"
            >
              <span className="todo-delete-icon">X</span>
            </button>
          </li>
        ))}
      </ul>
      {/* Footer */}
      <div className="footer">
        <div className="add-todo">
          <button onClick={openPopup} className="add-todo-button">
          <span className="add-todo-icon">+</span>
          </button>
        </div>

        {/* espace */}

        <div className="search-todo-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Recherche rapide..."
            className="search-todo-input"
          />
        </div>
        <span>
          {filteredTodos.filter((todo) => !todo.isDone).length} Tâches restantes
        </span>
      </div>
    </div>
  );
}

export default App;
