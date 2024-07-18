import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import './App.css';
import { getMeetingSummary } from './components/FireFlies/FireFlies';
import ClickUpTaskForm from './components/ClickUp/ClickUpTaskForm';
import axios from 'axios';

const theme = {
	electricBlue: '#0B52E1',
	navy: '#083796',
	deepBlue: '#07235C',
	white: '#FFFFFF',
	lightBlue: '#E4EEFC',
};

const AppContainer = styled.div`
	width: 100%;
	min-height: 100vh;
	margin: 0;
	padding: 20px;
	background-color: ${(props) => props.theme.lightBlue};
	box-sizing: border-box;
`;

const ContentWrapper = styled.div`
	max-width: 800px;
	margin: 0 auto;
`;

const CenteredSection = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 20px;
`;

const Title = styled.h1`
	color: ${(props) => props.theme.navy};
	font-size: 24px;
	margin-bottom: 20px;
	text-align: center;
`;

const Form = styled.form`
	margin-bottom: 20px;
	width: 100%;
	max-width: 400px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Input = styled.input`
	width: 100%;
	padding: 10px;
	margin-bottom: 10px;
	border: 1px solid ${(props) => props.theme.deepBlue};
	border-radius: 4px;
	font-size: 14px;
`;

const Button = styled.button`
	background-color: ${(props) => props.theme.electricBlue};
	color: ${(props) => props.theme.white};
	padding: 10px 15px;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 16px;

	&:hover {
		background-color: ${(props) => props.theme.navy};
	}
`;

const SummaryContainer = styled.div`
	background-color: ${(props) => props.theme.white};
	border: 1px solid ${(props) => props.theme.deepBlue};
	border-radius: 4px;
	padding: 15px;
	margin-bottom: 20px;
	width: 100%;
	max-width: 600px;
`;

const Pre = styled.pre`
	white-space: pre-wrap;
	word-wrap: break-word;
	text-align: left;
`;

const Message = styled.p`
	text-align: center;
	color: ${(props) => props.theme.deepBlue};
`;

function App() {
	const [meetingSummary, setMeetingSummary] = useState(null);
	const [meetingId, setMeetingId] = useState('');
	const [response, setResponse] = useState(null);
	const [editableResponse, setEditableResponse] = useState('');
	const teamId = 'YOUR_TEAM_ID';
	const apiKey = 'YOUR_API_KEY';

	const fetchMeetingSummaryAndSendToClaude = async () => {
		if (!meetingId) return;
		try {
			let summary = await getMeetingSummary(meetingId);
			summary.formattedText = `I have the entire meeting summary in the following lines. Please make todo lists for each of the people who we mention have action items. I would like you to format it as the Persons name and a bulleted list below and if necessary sub bullets for a specific task ${summary.formattedText}`;
			setMeetingSummary(summary);

			// Send to Claude
			try {
				const res = await axios.post(
					'http://localhost:5000/api/sendMessage',
					{ messageContent: summary.formattedText },
					{ responseType: 'text' }
				);
				setResponse(res.data);
				setEditableResponse(res.data);
			} catch (error) {
				console.error('Error sending message to Claude:', error);
				setResponse('Error: Failed to get response from Claude');
				setEditableResponse(
					'Error: Failed to get response from Claude'
				);
			}
		} catch (error) {
			console.error('Error fetching meeting summary:', error);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		fetchMeetingSummaryAndSendToClaude();
	};

	return (
		<ThemeProvider theme={theme}>
			<AppContainer>
				<ContentWrapper>
					<CenteredSection>
						<Title>Meeting Summary and Todo List</Title>
						<Form onSubmit={handleSubmit}>
							<Input
								type='text'
								value={meetingId}
								onChange={(e) => setMeetingId(e.target.value)}
								placeholder='Enter FireFlies meeting ID'
							/>
							<Button type='submit'>
								Fetch Summary and Generate Todo List
							</Button>
						</Form>
						{meetingSummary ? (
							<SummaryContainer>
								<h3>Meeting Summary:</h3>
								<Pre>{meetingSummary.formattedText}</Pre>
							</SummaryContainer>
						) : (
							<Message>
								No summary available. Please fetch a meeting
								summary.
							</Message>
						)}
						{response && (
							<SummaryContainer>
								<h3>Todo List:</h3>
								<Pre>{response}</Pre>
							</SummaryContainer>
						)}
					</CenteredSection>

					<CenteredSection>
						<Title>Create ClickUp Task</Title>
						<ClickUpTaskForm
							teamId={teamId}
							apiKey={apiKey}
						/>
					</CenteredSection>
				</ContentWrapper>
			</AppContainer>
		</ThemeProvider>
	);
}

export default App;
