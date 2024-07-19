const https = require('https');

// Your ClickUp API token
const API_TOKEN = 'Ypk_75474330_J8BUV2X6XJMPYVKQMHILKCF129HIOU0J';

function makeRequest(options) {
	return new Promise((resolve, reject) => {
		const req = https.request(options, (res) => {
			let data = '';
			res.on('data', (chunk) => {
				data += chunk;
			});
			res.on('end', () => {
				try {
					resolve(JSON.parse(data));
				} catch (error) {
					reject(new Error(`Error parsing JSON: ${error.message}`));
				}
			});
		});
		req.on('error', (error) =>
			reject(new Error(`Request error: ${error.message}`))
		);
		req.end();
	});
}

async function getTeamsAndMembers() {
	const teamOptions = {
		hostname: 'api.clickup.com',
		path: '/api/v2/team',
		method: 'GET',
		headers: { Authorization: API_TOKEN },
	};

	try {
		const teamsData = await makeRequest(teamOptions);
		console.log('Teams API Response:');
		console.log(JSON.stringify(teamsData, null, 2));

		if (teamsData.teams && Array.isArray(teamsData.teams)) {
			for (const team of teamsData.teams) {
				console.log(`\nFetching members for Team ID: ${team.id}`);

				const memberOptions = {
					hostname: 'api.clickup.com',
					path: `/api/v2/team/${team.id}/member`,
					method: 'GET',
					headers: { Authorization: API_TOKEN },
				};

				try {
					const membersData = await makeRequest(memberOptions);
					console.log(`Members API Response for Team ID ${team.id}:`);
					console.log(JSON.stringify(membersData, null, 2));
				} catch (memberError) {
					console.error(
						`Error fetching members for team ${team.id}:`,
						memberError.message
					);
				}
			}
		} else {
			console.log(
				'No teams found or teams data is not in the expected format.'
			);
		}
	} catch (error) {
		console.error('Error:', error.message);
	}
}

getTeamsAndMembers();
