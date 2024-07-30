import React, { useState, useEffect } from 'react';
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
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
`;

const Label = styled.label`
	display: block;
	margin-bottom: 5px;
	color: ${(props) => props.theme.deepBlue};
	font-weight: bold;
	align-self: flex-start;
	width: 100%;
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
	text-align: center;
	width: 100%;
`;

const ClickUpTaskForm = ({ listId, apiKey }) => {
	const { teamMembers } = useTeam();
	const [taskData, setTaskData] = useState({
		name: '',
		description: '',
		assignees: [''],
		priority: 3,
		due_date: '',
		subject: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const API_URL = 'https://api.clickup.com/api/v2';

	useEffect(() => {
		console.log('Current List ID:', listId);
	}, [listId]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setTaskData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleAssigneeChange = (index, value) => {
		setTaskData((prevData) => {
			const newAssignees = [...prevData.assignees];
			newAssignees[index] = value;
			if (value && index === newAssignees.length - 1) {
				newAssignees.push('');
			}
			return { ...prevData, assignees: newAssignees };
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const requestData = {
			name: taskData.name,
			description: taskData.description,
			assignees: taskData.assignees
				.filter((id) => id !== '')
				.map((id) => parseInt(id)),
			priority: parseInt(taskData.priority),
			due_date: taskData.due_date
				? new Date(taskData.due_date).getTime()
				: null,
			custom_fields: [
				{
					id: 'ab06fc9b-2d10-48b1-9c36-6b0910304487',
					value: true,
				},
			],
		};

		if (taskData.subject) {
			requestData.name = `${taskData.subject}: ${requestData.name}`;
		}

		try {
			console.log(
				'Sending request to URL:',
				`${API_URL}/list/${listId}/task`
			);
			console.log(
				'Sending request with data:',
				JSON.stringify(requestData, null, 2)
			);
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

			setTaskData({
				name: '',
				description: '',
				assignees: [''],
				priority: 3,
				due_date: '',
				subject: '',
			});
		} catch (error) {
			console.error('Error creating task:', error);
			let errorMessage = 'Failed to create task. ';
			if (error.response) {
				console.error('Error data:', error.response.data);
				console.error('Error status:', error.response.status);
				console.error('Error headers:', error.response.headers);

				if (error.response.status === 400) {
					errorMessage =
						'Bad request. There might be an issue with the data being sent. Details: ';
					if (error.response.data && error.response.data.err) {
						errorMessage += error.response.data.err;
					} else {
						errorMessage +=
							'No specific error details provided by the server.';
					}
				} else if (error.response.status === 404) {
					errorMessage = `List not found. Please check if the List ID (${listId}) is correct.`;
				} else {
					errorMessage += `Server responded with status ${error.response.status}. `;
					if (error.response.data && error.response.data.err) {
						errorMessage += error.response.data.err;
					}
				}
			} else if (error.request) {
				console.error('Error request:', error.request);
				errorMessage +=
					'No response received from the server. Please check your internet connection.';
			} else {
				console.error('Error message:', error.message);
				errorMessage += error.message;
			}
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const sortedTeamMembers = [...teamMembers].sort((a, b) =>
		a.name.split(' ')[0].localeCompare(b.name.split(' ')[0])
	);

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

			{/* <InputGroup>
				<Label htmlFor='subject'>Subject</Label>
				<Input
					id='subject'
					type='text'
					name='subject'
					value={taskData.subject}
					onChange={handleChange}
				/>
			</InputGroup> */}

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
				<Label>Assignees</Label>
				{taskData.assignees.map((assignee, index) => (
					<Select
						key={index}
						value={assignee}
						onChange={(e) =>
							handleAssigneeChange(index, e.target.value)
						}
						required={index === 0}
					>
						<option value=''>Select an assignee</option>
						{sortedTeamMembers.map((member) => (
							<option
								key={member.userId}
								value={member.userId}
							>
								{member.name}
							</option>
						))}
					</Select>
				))}
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
