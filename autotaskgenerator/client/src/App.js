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
			summary.formattedText = `I have the entire meeting summary in the following lines. Please make detailed todo lists for each of the attendees ${summary.formattedText}`;
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
					placeholder='Enter Fireflies meeting ID'
				/>
				<button type='submit'>Fetch Summary</button>
			</form>
			{meetingSummary ? (
				<div>
					<p>
						<strong>ID:</strong> {meetingSummary.id}
					</p>
					<p>
						<strong>Title:</strong> {meetingSummary.title}
					</p>
					<p>
						<strong>Formatted Text:</strong>
					</p>
					<pre>{meetingSummary.formattedText}</pre>
				</div>
			) : (
				<p>No summary available. Please fetch a meeting summary.</p>
			)}

			<h1>Send Message to Claude</h1>
			<Claude messageContent={message} />
		</div>
	);
}

export default App;
