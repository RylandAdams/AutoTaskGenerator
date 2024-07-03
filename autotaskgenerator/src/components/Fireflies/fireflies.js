// src/components/Fireflies/fireflies.js
import axios from 'axios';

const FIRELIES_API_BASE_URL = 'https://api.fireflies.ai/graphql';
const FIRELIES_API_KEY = '41f64df0-8546-4e6d-854f-325c76cf555a'; // replace with your actual API key

export const getMeetingSummary = async (transcriptId) => {
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${FIRELIES_API_KEY}`,
	};

	const data = {
		query: `
        query Transcript($transcriptId: String!) {
            transcript(id: $transcriptId) {
                id
                title
                sentences {
                    index
                    speaker_name
                    text
                    raw_text
                    start_time
                    end_time
                }
            }
        }`,
		variables: { transcriptId: transcriptId },
	};

	try {
		const response = await axios.post(FIRELIES_API_BASE_URL, data, {
			headers,
		});
		// Check if response is structured as expected
		if (response.data.errors) {
			console.error('GraphQL errors:', response.data.errors);
			throw new Error('GraphQL error occurred');
		}

		// Extract transcript data
		const transcript = response.data.data.transcript;
		return transcript;
	} catch (error) {
		console.error('Error fetching meeting transcript:', error);
		throw error;
	}
};
