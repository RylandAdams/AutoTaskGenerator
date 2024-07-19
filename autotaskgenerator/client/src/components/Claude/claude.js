import React, { forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useTodos } from '../../TodoContext';

const ClaudeContainer = styled.div`
	font-family: Arial, sans-serif;
	width: 100%;
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

const Claude = forwardRef((props, ref) => {
	const { todos, updateTodos } = useTodos();

	const sendMessage = async (messageContent) => {
		try {
			const res = await axios.post(
				'http://localhost:5000/api/sendMessage',
				{ messageContent },
				{ responseType: 'text' }
			);
			updateTodos(res.data);
		} catch (error) {
			console.error('Error creating message:', error);
			updateTodos('Failed to get response from Claude');
		}
	};

	useImperativeHandle(ref, () => ({
		sendMessage,
	}));

	const handleTodoChange = (e) => {
		updateTodos(e.target.value);
	};

	return (
		<ClaudeContainer>
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
