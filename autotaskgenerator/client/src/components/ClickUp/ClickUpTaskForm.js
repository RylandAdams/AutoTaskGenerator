import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const peopleList = [
	{ name: 'Abdul', listId: 'ABDUL_LIST_ID' },
	{ name: 'Anton', listId: 'ANTON_LIST_ID' },
	{ name: 'Vahonga', listId: 'VAHONGA_LIST_ID' },
	{ name: 'Nadeem', listId: 'NADEEM_LIST_ID' },
	{ name: 'Coca', listId: 'COCA_LIST_ID' },
	{ name: 'Daniel', listId: 'DANIEL_LIST_ID' },
];

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
`;

const ClickUpTaskForm = ({ teamId, apiKey }) => {
	const [taskData, setTaskData] = useState({
		name: '',
		description: '',
		assignee: '',
		status: 'Open',
		priority: 3,
		due_date: '',
		tags: '',
	});

	const [selectedListId, setSelectedListId] = useState('');

	useEffect(() => {
		const person = peopleList.find(
			(p) => p.name.toLowerCase() === taskData.assignee.toLowerCase()
		);
		setSelectedListId(person ? person.listId : '');
	}, [taskData.assignee]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setTaskData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!selectedListId) {
			alert('Please enter a valid assignee name');
			return;
		}

		const url = `https://api.clickup.com/api/v2/list/${selectedListId}/task`;
		const queryParams = new URLSearchParams({
			custom_task_ids: 'true',
			team_id: teamId,
		}).toString();

		const assigneePerson = peopleList.find(
			(p) => p.name.toLowerCase() === taskData.assignee.toLowerCase()
		);
		const assigneeId = assigneePerson ? [assigneePerson.listId] : [];

		const dataToSubmit = {
			...taskData,
			assignees: assigneeId,
			tags: taskData.tags.split(',').map((tag) => tag.trim()),
		};

		try {
			const response = await axios.post(
				`${url}?${queryParams}`,
				dataToSubmit,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: apiKey,
					},
				}
			);
			console.log('Task created:', response.data);
			alert('Task created successfully!');
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
			alert('Error creating task. Please try again.');
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
				<Input
					id='assignee'
					type='text'
					name='assignee'
					value={taskData.assignee}
					onChange={handleChange}
					list='peopleList'
				/>
				<datalist id='peopleList'>
					{peopleList.map((person) => (
						<option
							key={person.listId}
							value={person.name}
						/>
					))}
				</datalist>
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

			<SubmitButton type='submit'>Create Task</SubmitButton>
		</FormContainer>
	);
};

export default ClickUpTaskForm;
