import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/sendMessage', async (req, res) => {
	const { messageContent } = req.body;
	try {
		const response = await axios.post(
			'https://api.anthropic.com/v1/messages',
			{
				model: process.env.ANTHROPIC_MODEL,
				max_tokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS),
				messages: [{ role: 'user', content: messageContent }],
			},
			{
				headers: {
					'x-api-key': process.env.ANTHROPIC_API_KEY,
					'Content-Type': 'application/json',
					'anthropic-version': process.env.ANTHROPIC_API_VERSION,
				},
			}
		);

		// Extract only the text content from the response
		const assistantMessage = response.data.content[0].text;

		// Send only the text content as the response
		res.json({ message: assistantMessage });
	} catch (error) {
		console.error(
			'Error creating message:',
			error.response?.data || error.message
		);
		res.status(500).json({ error: 'Error creating message' });
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
