import React, { useState, useRef, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import './App.css';
import {
	getMeetingSummary,
	getRecentMeetings,
} from './components/FireFlies/FireFlies';
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

const Button = styled.button`
	background-color: ${(props) => props.theme.electricBlue};
	color: ${(props) => props.theme.white};
	padding: 12px 20px;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 16px;
	min-width: 150px;
	white-space: nowrap;

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

const MeetingListContainer = styled.div`
	width: 100%;
	max-width: 800px;
	height: 400px;
	overflow-y: auto;
	border: 1px solid ${(props) => props.theme.deepBlue};
	border-radius: 4px;
	background-color: ${(props) => props.theme.white};
`;

const MeetingList = styled.ul`
	list-style-type: none;
	padding: 0;
	margin: 0;
`;

const MeetingItem = styled.li`
	padding: 15px;
	border-bottom: 1px solid ${(props) => props.theme.lightBlue};
	display: flex;
	justify-content: space-between;
	align-items: center;
	min-height: 80px;

	&:last-child {
		border-bottom: none;
	}
`;

const MeetingTitle = styled.span`
	flex-grow: 1;
	margin-right: 15px;
	font-size: 16px;
	line-height: 1.4;
`;

const ErrorMessage = styled.div`
	color: red;
	margin-bottom: 10px;
	text-align: center;
`;

const RetryButton = styled(Button)`
	margin-top: 10px;
`;

const ListSelect = styled.select`
	width: 100%;
	padding: 8px;
	margin-bottom: 20px;
	border: 1px solid ${(props) => props.theme.deepBlue};
	border-radius: 4px;
	font-size: 14px;
	background-color: ${(props) => props.theme.white};
`;

const CustomPromptInput = styled.textarea`
	width: 100%;
	height: 100px;
	margin-bottom: 20px;
	padding: 10px;
	border: 1px solid ${(props) => props.theme.deepBlue};
	border-radius: 4px;
	font-size: 14px;
	resize: vertical;
`;

const InputForm = styled.form`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 15px;
	border-bottom: 1px solid ${(props) => props.theme.lightBlue};
	min-height: 80px;
`;

const Input = styled.input`
	width: 60%;
	padding: 8px;
	margin-right: 15px;
	border: 1px solid ${(props) => props.theme.deepBlue};
	border-radius: 4px;
	font-size: 14px;
`;

function App() {
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState('home');
	const claudeRef = useRef(null);
	const [selectedListId, setSelectedListId] = useState(
		process.env.REACT_APP_DEFAULT_CLICKUP_LIST_ID
	);
	const apiKey = process.env.REACT_APP_CLICKUP_API_KEY;
	const [recentMeetings, setRecentMeetings] = useState([]);
	const [error, setError] = useState(null);
	const [todoList, setTodoList] = useState('');
	const [customPrompt, setCustomPrompt] = useState('');
	const [manualMeetingId, setManualMeetingId] = useState('');

	const clickUpLists = [
		{
			name: '(AI) Agent - Geometry Search & Synthesis',
			id: '901102697145',
		},
		{ name: 'Agent - Virtual World', id: '901102697244' },
		{ name: '(Architecture) Infrastructure', id: '901102789542' },
		{ name: '(SELF) Learning Engine', id: '901102790411' },
		{ name: '(Front End) UI', id: '901102790765' },
		{ name: 'Parameterized Geometries', id: '901103664000' },
		{ name: 'ArkPad', id: '901102681271' },
	];

	useEffect(() => {
		fetchRecentMeetings();
	}, []);

	const fetchRecentMeetings = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const meetings = await getRecentMeetings();
			setRecentMeetings(meetings);
		} catch (error) {
			console.error('Error fetching recent meetings:', error);
			setError(
				'Failed to fetch recent meetings. Please try again later.'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchMeetingSummaryAndSendToClaude = async (selectedMeetingId) => {
		setIsLoading(true);
		setError(null);
		try {
			let summary = await getMeetingSummary(selectedMeetingId);
			const defaultPrompt = `Please create todo lists for each person mentioned in the meeting summary who has action items. Format each person's todos as a bulleted list, using sub-bullets for specific tasks if necessary. Also try to give a sentence or 2 extra of detail around a todo if possible? Here's the meeting summary:`;

			const promptToUse = customPrompt.trim() || defaultPrompt;
			const formattedText = `${promptToUse} ${summary.formattedText}`;

			if (claudeRef.current) {
				const response = await claudeRef.current.sendMessage(
					formattedText
				);
				setTodoList(response);
				console.log('Response from Claude:', response);
			}
		} catch (error) {
			console.error(
				'Error fetching meeting summary or generating todos:',
				error
			);
			setError('Failed to generate todos. Please try again later.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleListChange = (e) => {
		setSelectedListId(e.target.value);
		console.log('Selected List ID:', e.target.value);
	};

	const handleManualSubmit = (e) => {
		e.preventDefault();
		if (manualMeetingId.trim()) {
			fetchMeetingSummaryAndSendToClaude(manualMeetingId.trim());
			setManualMeetingId('');
		}
	};

	const renderContent = () => {
		switch (currentPage) {
			case 'home':
				return (
					<>
						<CenteredSection>
							<Title>Meeting Todo List Generator</Title>
							<CustomPromptInput
								value={customPrompt}
								onChange={(e) =>
									setCustomPrompt(e.target.value)
								}
								placeholder='Enter a custom prompt for generating todos (optional)'
							/>
							{error && (
								<>
									<ErrorMessage>{error}</ErrorMessage>
									<RetryButton onClick={fetchRecentMeetings}>
										Retry Fetching Meetings
									</RetryButton>
								</>
							)}
							{isLoading ? (
								<p>Loading meetings...</p>
							) : (
								<MeetingListContainer>
									<MeetingList>
										<MeetingItem>
											<InputForm
												onSubmit={handleManualSubmit}
											>
												<Input
													type='text'
													value={manualMeetingId}
													onChange={(e) =>
														setManualMeetingId(
															e.target.value
														)
													}
													placeholder='Enter meeting ID'
												/>
												<Button
													type='submit'
													disabled={isLoading}
												>
													Generate Todos
												</Button>
											</InputForm>
										</MeetingItem>
										{recentMeetings.map((meeting) => (
											<MeetingItem key={meeting.id}>
												<MeetingTitle>
													{meeting.title}
													{meeting.date &&
														` (${new Date(
															meeting.date
														).toLocaleDateString()})`}
												</MeetingTitle>
												<Button
													onClick={() =>
														fetchMeetingSummaryAndSendToClaude(
															meeting.id
														)
													}
													disabled={isLoading}
												>
													Generate Todos
												</Button>
											</MeetingItem>
										))}
									</MeetingList>
								</MeetingListContainer>
							)}
						</CenteredSection>
						<SplitSection>
							<Column>
								<Claude
									ref={claudeRef}
									todoList={todoList}
									setTodoList={setTodoList}
									width='100%'
								/>
							</Column>
							<Column>
								<ListSelect
									onChange={handleListChange}
									value={selectedListId}
								>
									{clickUpLists.map((list) => (
										<option
											key={list.id}
											value={list.id}
										>
											{list.name}
										</option>
									))}
								</ListSelect>
								<ClickUpTaskForm
									listId={selectedListId}
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
