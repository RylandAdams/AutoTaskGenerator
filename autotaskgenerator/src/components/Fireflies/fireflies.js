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
                    speaker_id
                    raw_text
                    text
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
		return response.data.data.transcript.summary;
	} catch (error) {
		console.error('Error fetching meeting summary:', error);
		throw error;
	}
};
