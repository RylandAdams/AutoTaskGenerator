import axios from 'axios';
import config from './../../app.json';

const FIREFLIES_API_BASE_URL = config.REACT_APP_FIREFLIES_API_BASE_URL;
const FIREFLIES_API_KEY = config.REACT_APP_FIREFLIES_API_KEY;

export const getMeetingSummary = async (transcriptId) => {
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${FIREFLIES_API_KEY}`,
	};

	const data = {
		query: `
        query Transcript($transcriptId: String!) {
            transcript(id: $transcriptId) {
                id
                title
                sentences {
                    speaker_name
                    raw_text
                }
            }
        }`,
		variables: { transcriptId: transcriptId },
	};

	try {
		const response = await axios.post(FIREFLIES_API_BASE_URL, data, {
			headers,
		});
		if (response.data.errors) {
			console.error('GraphQL errors:', response.data.errors);
			throw new Error('GraphQL error occurred');
		}

		const transcript = response.data.data.transcript;
		console.log(transcript);

		const formattedSentences = transcript.sentences.map(
			(sentence) =>
				`Then ${sentence.speaker_name} said "${sentence.raw_text}"`
		);

		return {
			id: transcript.id,
			title: transcript.title,
			formattedText: formattedSentences.join(' '),
		};
	} catch (error) {
		console.error('Error fetching meeting transcript:', error);
		throw error;
	}
};

export const getRecentMeetings = async (limit = 25) => {
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${FIREFLIES_API_KEY}`,
	};

	const data = {
		query: `
        query RecentTranscripts($limit: Int!) {
            transcripts(limit: $limit) {
                id
                title
                date
            }
        }`,
		variables: { limit },
	};

	console.log('Request headers:', headers);
	console.log('Request data:', JSON.stringify(data, null, 2));

	try {
		console.log('Fetching recent meetings...');
		const response = await axios.post(FIREFLIES_API_BASE_URL, data, {
			headers,
		});

		console.log('Response status:', response.status);
		console.log('Response data:', JSON.stringify(response.data, null, 2));

		if (response.data.errors) {
			console.error('GraphQL errors:', response.data.errors);
			throw new Error('GraphQL error occurred');
		}

		return response.data.data.transcripts;
	} catch (error) {
		console.error('Error fetching recent meetings:', error);
		if (error.response) {
			console.error('Error status:', error.response.status);
			console.error('Error data:', error.response.data);
		}
		throw error;
	}
};
