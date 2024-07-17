import React, { useState } from 'react';
import axios from 'axios';

const Claude = ({ messageContent }) => {
	const [response, setResponse] = useState(null);
	const [editableResponse, setEditableResponse] = useState('');

	const sendMessage = async () => {
		try {
			const res = await axios.post(
				'http://localhost:5000/api/sendMessage',
				{ messageContent },
				{ responseType: 'text' }
			);
			setResponse(res.data);
			setEditableResponse(res.data);
		} catch (error) {
			console.error('Error creating message:', error);
			setResponse('Error: Failed to get response from Claude');
			setEditableResponse('Error: Failed to get response from Claude');
		}
	};

	const saveChanges = () => {
		setResponse(editableResponse);
	};

	return (
		<div>
			<button onClick={sendMessage}>Send Message</button>
			{response && (
				<div>
					<textarea
						value={editableResponse}
						onChange={(e) => setEditableResponse(e.target.value)}
						rows={10}
						cols={50}
					/>
					<button onClick={saveChanges}>Save Changes</button>
				</div>
			)}
		</div>
	);
};

export default Claude;
