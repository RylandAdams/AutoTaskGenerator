import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { readFile } from 'fs/promises';

const app = express();

// Load config asynchronously
const loadConfig = async () => {
	try {
		const configFile = await readFile(
			new URL('./app.json', import.meta.url)
		);
		return JSON.parse(configFile);
	} catch (error) {
		console.error('Error loading config:', error);
		process.exit(1);
	}
};

// Wrap the server setup in an async function
const setupServer = async () => {
	const config = await loadConfig();

	const port = config.PORT || 5000;

	app.use(cors());
	app.use(express.json());

	app.post('/api/sendMessage', async (req, res) => {
		const { messageContent } = req.body;
		try {
			const response = await axios.post(
				'https://api.anthropic.com/v1/messages',
				{
					model: config.ANTHROPIC_MODEL,
					max_tokens: parseInt(config.ANTHROPIC_MAX_TOKENS),
					messages: [{ role: 'user', content: messageContent }],
				},
				{
					headers: {
						'x-api-key': config.ANTHROPIC_API_KEY,
						'Content-Type': 'application/json',
						'anthropic-version': config.ANTHROPIC_API_VERSION,
					},
				}
			);

			const assistantMessage = response.data.content[0].text;
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
};

// Run the server
setupServer();
