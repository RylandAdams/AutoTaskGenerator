import React, { useState } from 'react';
import './App.css';
import { getMeetingSummary } from './components/Fireflies/fireflies';
import Claude from './components/Claude/claude';

function App() {
	const [meetingSummary, setMeetingSummary] = useState(null);
	const [message, setMessage] = useState('Hello, Claude');
	const [meetingId, setMeetingId] = useState('');

	const fetchMeetingSummary = async () => {
		if (!meetingId) return;
		try {
			let summary = await getMeetingSummary(meetingId);
			summary.formattedText = `I have the entire meeting summary in the following lines. Please make detailed todo lists for each of the people who we mention have action items: I would like you to format it as the Persons name and a bulleted list below and if neccary sub bullets for a specific task ${summary.formattedText}`;
			setMeetingSummary(summary);
		} catch (error) {
			console.error('Error fetching meeting summary:', error);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		fetchMeetingSummary();
	};

	return (
		<div className='App'>
			<h1>Meeting Summary</h1>
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					value={meetingId}
					onChange={(e) => setMeetingId(e.target.value)}
					placeholder='Enter FireFlies meeting ID'
				/>
				<button type='submit'>Fetch Summary</button>
			</form>
			{meetingSummary ? (
				<div>
					<pre>{meetingSummary.formattedText}</pre>
				</div>
			) : (
				<p>No summary available. Please fetch a meeting summary.</p>
			)}

			<h1>Send Message to Claude</h1>
			<Claude
				messageContent={
					meetingSummary ? meetingSummary.formattedText : message
				}
			/>
		</div>
	);
}

export default App;
