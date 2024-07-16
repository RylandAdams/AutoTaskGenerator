import React, { useEffect, useState } from 'react';
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
			const summary = await getMeetingSummary(meetingId);
			setMeetingSummary(summary);
			console.log(summary.id); // The original ID
			console.log(summary.title); // The original title
			console.log(summary.formattedText); // The formatted text of all sentences
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
				<pre>{JSON.stringify(meetingSummary, null, 2)}</pre>
			) : (
				<p>Loading...</p>
			)}

			<h1>Send Message to Claude</h1>
			<Claude messageContent={message} />
		</div>
	);
}

export default App;
