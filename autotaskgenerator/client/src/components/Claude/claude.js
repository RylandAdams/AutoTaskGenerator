import React, {
	useState,
	forwardRef,
	useImperativeHandle,
	useEffect,
} from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ClaudeContainer = styled.div`
	margin-bottom: 20px;
	font-family: Arial, sans-serif;
`;

const TodoBox = styled.div`
	display: flex;
	flex-direction: column;
`;

const TextContainer = styled.div`
	border: 2px solid #e4eefc;
	border-radius: 4px;
	background-color: #07235c;
`;

const TextArea = styled.textarea`
	width: 100%;
	height: 400px;
	padding: 10px;
	background-color: transparent;
	color: #ffffff;
	border: none;
	resize: vertical;
	font-size: 14px;
	line-height: 1.5;

	&:focus {
		outline: none;
	}

	&::placeholder {
		color: #e4eefc;
	}
`;

const Claude = forwardRef(({ todoList, width }, ref) => {
	const [todos, setTodos] = useState('');

	useImperativeHandle(ref, () => ({
		sendMessage: async (messageContent) => {
			try {
				const response = await axios.post(
					'http://localhost:5000/api/sendMessage',
					{ messageContent },
					{ responseType: 'text' }
				);
				const formattedTodos = formatTodos(response.data);
				setTodos(formattedTodos);
				return response.data;
			} catch (error) {
				console.error('Error creating message:', error);
				throw error;
			}
		},
	}));

	useEffect(() => {
		if (todoList) {
			const formattedTodos = formatTodos(todoList);
			setTodos(formattedTodos);
		}
	}, [todoList]);

	const formatTodos = (rawTodos) => {
		try {
			const parsedTodos = JSON.parse(rawTodos);
			const messageContent = parsedTodos.message;

			// Split the content by lines
			const lines = messageContent.split('\n');

			let currentPerson = '';
			let currentTodos = [];
			const formattedSections = [];

			lines.forEach((line) => {
				line = line.trim();
				if (line === '') return; // Skip empty lines

				// Check if the line is a name (ends with a colon or is a single word)
				if (line.endsWith(':') || !line.includes(' ')) {
					// If we have a current person, add their section to the formatted sections
					if (currentPerson && currentTodos.length > 0) {
						formattedSections.push(
							`${currentPerson}:\n${currentTodos.join('\n')}`
						);
					}
					// Start a new person section
					currentPerson = line.replace(':', '').trim();
					currentTodos = [];
				} else if (line.match(/^[a-z]:$/)) {
					// Skip single letter lines
					return;
				} else {
					// This is a todo item
					currentTodos.push(line);
				}
			});

			// Add the last person's section if it exists
			if (currentPerson && currentTodos.length > 0) {
				formattedSections.push(
					`${currentPerson}:\n${currentTodos.join('\n')}`
				);
			}

			return formattedSections.join('\n\n');
		} catch (error) {
			console.error('Error formatting todos:', error);
			return rawTodos; // Return original text if parsing fails
		}
	};

	const handleTodoChange = (e) => {
		setTodos(e.target.value);
	};

	return (
		<ClaudeContainer style={{ width }}>
			<TodoBox>
				<TextContainer>
					<TextArea
						value={todos}
						onChange={handleTodoChange}
						placeholder='Todo list will appear here...'
					/>
				</TextContainer>
			</TodoBox>
		</ClaudeContainer>
	);
});

export default Claude;
