import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
// import Anthropic from '@anthropic-ai/sdk';

// const anthropic = new Anthropic();
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
					'anthropic-version': '2023-06-01',
				},
			}
		);
		// Extract only the text content from the response
		const assistantMessage = response.data.content[0].text;

		// Send only the text content as the response
		res.send(assistantMessage);
	} catch (error) {
		console.error('Error creating message:', error);
		res.status(500).send('Error creating message');
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
