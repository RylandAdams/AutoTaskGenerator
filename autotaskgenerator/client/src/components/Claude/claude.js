import React, { useState } from 'react';
import axios from 'axios';

const Claude = ({ messageContent }) => {
	const [response, setResponse] = useState(null);

	const sendMessage = async () => {
		try {
			const res = await axios.post(
				'http://localhost:5000/api/sendMessage',
				{
					messageContent,
				}
			);
			setResponse(res.data);
		} catch (error) {
			console.error('Error creating message:', error);
		}
	};

	return (
		<div>
			<button onClick={sendMessage}>Send Message</button>
			{response && <pre>{JSON.stringify(response, null, 2)}</pre>}
		</div>
	);
};

export default Claude;
