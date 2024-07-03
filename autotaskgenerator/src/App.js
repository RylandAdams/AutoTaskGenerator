// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import { getMeetingSummary } from './components/Fireflies/fireflies';

function App() {
	const [meetingSummary, setMeetingSummary] = useState(null);

	useEffect(() => {
		const fetchMeetingSummary = async () => {
			try {
				const summary = await getMeetingSummary('cLbK4e0Ph9VfZJ2f'); // replace with
				setMeetingSummary(summary);
			} catch (error) {
				console.error('Error fetching meeting summary:', error);
			}
		};

		fetchMeetingSummary();
	}, []);

	return (
		<div className='App'>
			<h1>Meeting Summary</h1>
			{meetingSummary ? (
				<pre>{JSON.stringify(meetingSummary, null, 2)}</pre>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}

export default App;
