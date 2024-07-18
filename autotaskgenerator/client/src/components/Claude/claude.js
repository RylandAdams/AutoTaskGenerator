import React, { useState, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ClaudeContainer = styled.div`
	margin-bottom: 20px;
	font-family: Arial, sans-serif;
	width: ${(props) => props.width || '100%'};
	max-width: 800px;
	margin-left: auto;
	margin-right: auto;
`;

const Button = styled.button`
	background-color: #0b52e1;
	color: white;
	padding: 12px 20px;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	font-size: 16px;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: #083796;
	}
`;

const TextArea = styled.textarea`
	width: 100%;
	height: 300px;
	padding: 15px;
	margin: 15px 0;
	background-color: #07235c;
	color: #ffffff;
	border: 2px solid #e4eefc;
	border-radius: 8px;
	resize: vertical;
	font-size: 14px;
	line-height: 1.5;
	transition: border-color 0.3s ease;

	&:focus {
		outline: none;
		border-color: #0b52e1;
	}

	&::placeholder {
		color: #e4eefc;
	}
`;

const ButtonContainer = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 10px;
`;

const Claude = forwardRef((props, ref) => {
	const [response, setResponse] = useState(null);
	const [editableResponse, setEditableResponse] = useState('');

	const sendMessage = async (messageContent) => {
		try {
			const res = await axios.post(
				'http://localhost:5000/api/sendMessage',
				{ messageContent },
				{ responseType: 'text' }
			);
			setResponse(res.data);
			setEditableResponse(res.data);
		} catch (error) {
			console.error('Error creating message:', error);
			setResponse('Error: Failed to get response from Claude');
			setEditableResponse('Error: Failed to get response from Claude');
		}
	};

	useImperativeHandle(ref, () => ({
		sendMessage,
	}));

	const saveChanges = () => {
		setResponse(editableResponse);
		console.log(editableResponse);
	};

	return (
		<ClaudeContainer width={props.width}>
			{response && (
				<div>
					<TextArea
						value={editableResponse}
						onChange={(e) => setEditableResponse(e.target.value)}
						placeholder="Claude's response will appear here..."
					/>
					<ButtonContainer>
						<Button onClick={saveChanges}>Save Changes</Button>
					</ButtonContainer>
				</div>
			)}
		</ClaudeContainer>
	);
});

export default Claude;
