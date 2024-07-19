import React, { useState, useRef } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import './App.css';
import { getMeetingSummary } from './components/FireFlies/FireFlies';
import Claude from './components/Claude/Claude';
import ClickUpTaskForm from './components/ClickUp/ClickUpTaskForm';
import Team from './components/Team/team';
import { TeamProvider } from './TeamContext';
import { TodoProvider } from './TodoContext';

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
	max-width: 1200px;
	margin: 0 auto;
`;

const CenteredSection = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 20px;
`;

const SplitSection = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 20px;
	width: 100%;
`;

const Column = styled.div`
	flex: 1;
	max-width: 48%;
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
	const teamId = '20115771';
	const listId = '901101977190';
	const apiKey = 'Ypk_75474330_J8BUV2X6XJMPYVKQMHILKCF129HIOU0J';

	const fetchMeetingSummaryAndSendToClaude = async () => {
		if (!meetingId) return;
		setIsLoading(true);
		try {
			let summary = await getMeetingSummary(meetingId);
			const formattedText = `Please create todo lists for each person mentioned in the meeting summary who has action items. Format each person's todos as a bulleted list, using sub-bullets for specific tasks if necessary. Also try to give a sentance or 2 extra of detail around a todo if possible? Here's the meeting summary: ${summary.formattedText}`;

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
						<SplitSection>
							<Column>
								<Claude
									ref={claudeRef}
									width='100%'
								/>
							</Column>
							<Column>
								<ClickUpTaskForm
									listId={listId}
									apiKey={apiKey}
								/>
							</Column>
						</SplitSection>
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
			<TeamProvider>
				<TodoProvider>
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
				</TodoProvider>
			</TeamProvider>
		</ThemeProvider>
	);
}

export default App;
