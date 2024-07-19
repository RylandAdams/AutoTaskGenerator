import React, { createContext, useState, useEffect, useContext } from 'react';

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
	const [todos, setTodos] = useState(() => {
		const savedTodos = localStorage.getItem('todos');
		return savedTodos ? JSON.parse(savedTodos) : '';
	});

	useEffect(() => {
		localStorage.setItem('todos', JSON.stringify(todos));
	}, [todos]);

	const updateTodos = (newTodos) => {
		setTodos(newTodos);
	};

	return (
		<TodoContext.Provider value={{ todos, updateTodos }}>
			{children}
		</TodoContext.Provider>
	);
};

export const useTodos = () => useContext(TodoContext);
