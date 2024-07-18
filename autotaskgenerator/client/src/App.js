import React, { useState, useRef } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import './App.css';
import { getMeetingSummary } from './components/FireFlies/FireFlies';
import Claude from './components/Claude/Claude';
import ClickUpTaskForm from './components/ClickUp/ClickUpTaskForm';
import Team from './components/Team/team';

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

const NavContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-bottom: 20px;
`;

const NavButton = styled(Button)`
	margin-left: 10px;
	background-color: ${(props) =>
		props.active ? props.theme.navy : props.theme.electricBlue};
`;

function App() {
	const [meetingId, setMeetingId] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState('home');
	const claudeRef = useRef(null);
	const teamId = 'YOUR_TEAM_ID';
	const apiKey = 'YOUR_API_KEY';

	const fetchMeetingSummaryAndSendToClaude = async () => {
		if (!meetingId) return;
		setIsLoading(true);
		try {
			let summary = await getMeetingSummary(meetingId);
			const formattedText = `I have the entire meeting summary in the following lines. Please make todo lists for each of the people who we mention have action items. I would like you to format it as the Persons name and a bulleted list below and if necessary sub bullets for a specific task ${summary.formattedText}`;

			if (claudeRef.current) {
				claudeRef.current.sendMessage(formattedText);
			}
		} catch (error) {
			console.error('Error fetching meeting summary:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		fetchMeetingSummaryAndSendToClaude();
	};

	const renderContent = () => {
		switch (currentPage) {
			case 'home':
				return (
					<>
						<CenteredSection>
							<Title>Meeting Todo List Generator</Title>
							<Form onSubmit={handleSubmit}>
								<Input
									type='text'
									value={meetingId}
									onChange={(e) =>
										setMeetingId(e.target.value)
									}
									placeholder='Enter FireFlies meeting ID'
								/>
								<Button
									type='submit'
									disabled={isLoading}
								>
									{isLoading
										? 'Generating...'
										: 'Generate Todo List'}
								</Button>
							</Form>
						</CenteredSection>

						<CenteredSection>
							<Title>Todo List</Title>
							<Claude
								ref={claudeRef}
								width='80%'
							/>
						</CenteredSection>

						<CenteredSection>
							<ClickUpTaskForm
								teamId={teamId}
								apiKey={apiKey}
							/>
						</CenteredSection>
					</>
				);
			case 'team':
				return <Team />;
			default:
				return null;
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<AppContainer>
				<NavContainer>
					<NavButton
						active={currentPage === 'home'}
						onClick={() => setCurrentPage('home')}
					>
						Home
					</NavButton>
					<NavButton
						active={currentPage === 'team'}
						onClick={() => setCurrentPage('team')}
					>
						Team
					</NavButton>
				</NavContainer>
				<ContentWrapper>{renderContent()}</ContentWrapper>
			</AppContainer>
		</ThemeProvider>
	);
}

export default App;
