import React, { useState, forwardRef, useImperativeHandle } from 'react';
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
	const [todos, setTodos] = useState(todoList);

	useImperativeHandle(ref, () => ({
		sendMessage: async (messageContent) => {
			try {
				const response = await axios.post(
					'http://localhost:5000/api/sendMessage',
					{ messageContent },
					{ responseType: 'text' }
				);
				setTodos(response.data);
				return response.data;
			} catch (error) {
				console.error('Error creating message:', error);
				throw error;
			}
		},
	}));

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
