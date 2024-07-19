import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useTeam } from '../../TeamContext';

const FormContainer = styled.form`
	width: 100%;
	max-width: 500px;
	margin: 0 auto;
	padding: 20px;
	background-color: ${(props) => props.theme.white};
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(7, 35, 92, 0.2);
	border: 1px solid ${(props) => props.theme.navy};
`;

const FormTitle = styled.h2`
	color: ${(props) => props.theme.navy};
	text-align: center;
	margin-bottom: 20px;
`;

const InputGroup = styled.div`
	margin-bottom: 15px;
`;

const Label = styled.label`
	display: block;
	margin-bottom: 5px;
	color: ${(props) => props.theme.deepBlue};
	font-weight: bold;
`;

const Input = styled.input`
	width: 100%;
	padding: 8px;
	border: 1px solid ${(props) => props.theme.deepBlue};
	border-radius: 4px;
	font-size: 14px;
	background-color: ${(props) => props.theme.white};
`;

const TextArea = styled.textarea`
	width: 100%;
	padding: 8px;
	border: 1px solid ${(props) => props.theme.deepBlue};
	border-radius: 4px;
	font-size: 14px;
	min-height: 100px;
	background-color: ${(props) => props.theme.white};
`;

const Select = styled.select`
	width: 100%;
	padding: 8px;
	border: 1px solid ${(props) => props.theme.deepBlue};
	border-radius: 4px;
	font-size: 14px;
	background-color: ${(props) => props.theme.white};
`;

const SubmitButton = styled.button`
	width: 100%;
	padding: 10px;
	background-color: ${(props) => props.theme.electricBlue};
	color: ${(props) => props.theme.white};
	border: none;
	border-radius: 4px;
	font-size: 16px;
	cursor: pointer;
	transition: background-color 0.3s;

	&:hover {
		background-color: ${(props) => props.theme.navy};
	}

	&:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
	}
`;

const ErrorMessage = styled.div`
	color: red;
	margin-bottom: 10px;
`;

const ClickUpTaskForm = ({ listId, apiKey }) => {
	const { teamMembers } = useTeam();
	const [taskData, setTaskData] = useState({
		name: '',
		description: '',
		assignee: '',
		status: 'Open',
		priority: 3,
		due_date: '',
		tags: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const API_URL = 'https://api.clickup.com/api/v2';

	const handleChange = (e) => {
		const { name, value } = e.target;
		setTaskData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		console.log('Using List ID:', listId);

		const requestData = {
			name: taskData.name,
			description: taskData.description,
			assignees: [taskData.assignee],
			status: taskData.status,
			priority: parseInt(taskData.priority),
			due_date: taskData.due_date
				? new Date(taskData.due_date).getTime()
				: null,
			tags: taskData.tags.split(',').map((tag) => tag.trim()),
		};

		console.log('Sending request to:', `${API_URL}/list/${listId}/task`);
		console.log('With data:', requestData);
		console.log('Headers:', {
			Authorization: apiKey,
			'Content-Type': 'application/json',
		});

		try {
			const response = await axios.post(
				`${API_URL}/list/${listId}/task`,
				requestData,
				{
					headers: {
						Authorization: apiKey,
						'Content-Type': 'application/json',
					},
				}
			);

			console.log('Task created:', response.data);
			alert('Task created successfully!');

			// Reset form
			setTaskData({
				name: '',
				description: '',
				assignee: '',
				status: 'Open',
				priority: 3,
				due_date: '',
				tags: '',
			});
		} catch (error) {
			console.error('Error creating task:', error);
			if (error.response) {
				console.error('Response data:', error.response.data);
				console.error('Response status:', error.response.status);
				console.error('Response headers:', error.response.headers);
			} else if (error.request) {
				console.error('No response received:', error.request);
			} else {
				console.error('Error message:', error.message);
			}
			setError(
				'Failed to create task. Please check the console for more details.'
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<FormContainer onSubmit={handleSubmit}>
			<FormTitle>Create ClickUp Task</FormTitle>

			<InputGroup>
				<Label htmlFor='name'>Task Name</Label>
				<Input
					id='name'
					type='text'
					name='name'
					value={taskData.name}
					onChange={handleChange}
					required
				/>
			</InputGroup>

			<InputGroup>
				<Label htmlFor='description'>Description</Label>
				<TextArea
					id='description'
					name='description'
					value={taskData.description}
					onChange={handleChange}
				/>
			</InputGroup>

			<InputGroup>
				<Label htmlFor='assignee'>Assignee</Label>
				<Select
					id='assignee'
					name='assignee'
					value={taskData.assignee}
					onChange={handleChange}
					required
				>
					<option value=''>Select an assignee</option>
					{teamMembers.map((member) => (
						<option
							key={member.id}
							value={member.id}
						>
							{member.name}
						</option>
					))}
				</Select>
			</InputGroup>

			<InputGroup>
				<Label htmlFor='priority'>Priority</Label>
				<Select
					id='priority'
					name='priority'
					value={taskData.priority}
					onChange={handleChange}
				>
					<option value={1}>Urgent</option>
					<option value={2}>High</option>
					<option value={3}>Normal</option>
					<option value={4}>Low</option>
				</Select>
			</InputGroup>

			<InputGroup>
				<Label htmlFor='due_date'>Due Date</Label>
				<Input
					id='due_date'
					type='date'
					name='due_date'
					value={taskData.due_date}
					onChange={handleChange}
				/>
			</InputGroup>

			<InputGroup>
				<Label htmlFor='tags'>Tags (comma-separated)</Label>
				<Input
					id='tags'
					type='text'
					name='tags'
					value={taskData.tags}
					onChange={handleChange}
				/>
			</InputGroup>

			{error && <ErrorMessage>{error}</ErrorMessage>}

			<SubmitButton
				type='submit'
				disabled={isLoading}
			>
				{isLoading ? 'Creating...' : 'Create Task'}
			</SubmitButton>
		</FormContainer>
	);
};

export default ClickUpTaskForm;
