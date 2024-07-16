import React, { useState } from 'react';
import axios from 'axios';

const Claude = ({ messageContent }) => {
	const [response, setResponse] = useState(null);

	const sendMessage = async () => {
		try {
			const res = await axios.post(
				'http://localhost:5000/api/sendMessage',
				{ messageContent },
				{ responseType: 'text' } // Add this line to expect a text response
			);
			setResponse(res.data); // res.data will now be the plain text
		} catch (error) {
			console.error('Error creating message:', error);
			setResponse('Error: Failed to get response from Claude');
		}
	};

	return (
		<div>
			<button onClick={sendMessage}>Send Message</button>
			{response && <pre>{response}</pre>}
		</div>
	);
};

export default Claude;
