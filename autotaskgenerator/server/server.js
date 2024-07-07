import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/sendMessage', async (req, res) => {
	const { messageContent } = req.body;
	try {
		const response = await axios.post(
			'https://api.anthropic.com/v1/messages',
			{
				model: 'claude-3-5-sonnet-20240620',
				max_tokens: 1024,
				messages: [{ role: 'user', content: messageContent }],
			},
			{
				headers: {
					'x-api-key':
						'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',
					'Content-Type': 'application/json',
				},
			}
		);
		res.json(response.data);
	} catch (error) {
		console.error('Error creating message:', error);
		res.status(500).json({ error: 'Error creating message' });
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
