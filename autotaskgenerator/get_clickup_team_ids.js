const https = require('https');

// Your ClickUp API token
const API_TOKEN = 'pk_75474330_J8BUV2X6XJMPYVKQMHILKCF129HIOU0J';

// Your Workspace ID (Team ID)
const WORKSPACE_ID = '20115771'; // Replace with your actual Workspace ID

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

async function getCustomFields() {
	try {
		// Step 1: Get all spaces in the workspace
		const spacesOptions = {
			hostname: 'api.clickup.com',
			path: `/api/v2/team/${WORKSPACE_ID}/space?archived=false`,
			method: 'GET',
			headers: { Authorization: API_TOKEN },
		};

		const spacesData = await makeRequest(spacesOptions);
		console.log('Spaces in the workspace:');
		console.log(JSON.stringify(spacesData, null, 2));

		if (spacesData.spaces && Array.isArray(spacesData.spaces)) {
			for (const space of spacesData.spaces) {
				console.log(
					`\nFetching lists for Space: ${space.name} (ID: ${space.id})`
				);

				// Step 2: Get folderless lists in the space
				const listsOptions = {
					hostname: 'api.clickup.com',
					path: `/api/v2/space/${space.id}/list?archived=false`,
					method: 'GET',
					headers: { Authorization: API_TOKEN },
				};

				const listsData = await makeRequest(listsOptions);
				console.log(`Lists in Space ${space.name}:`);
				console.log(JSON.stringify(listsData, null, 2));

				if (listsData.lists && Array.isArray(listsData.lists)) {
					for (const list of listsData.lists) {
						console.log(
							`\nFetching custom fields for List: ${list.name} (ID: ${list.id})`
						);

						// Step 3: Get custom fields for the list
						const fieldsOptions = {
							hostname: 'api.clickup.com',
							path: `/api/v2/list/${list.id}/field`,
							method: 'GET',
							headers: { Authorization: API_TOKEN },
						};

						try {
							const fieldsData = await makeRequest(fieldsOptions);
							console.log(`Custom Fields for List ${list.name}:`);
							console.log(JSON.stringify(fieldsData, null, 2));

							if (
								fieldsData.fields &&
								Array.isArray(fieldsData.fields)
							) {
								fieldsData.fields.forEach((field) => {
									console.log(
										`Field Name: ${field.name}, ID: ${field.id}, Type: ${field.type}`
									);
								});
							} else {
								console.log(
									'No custom fields found for this list.'
								);
							}
						} catch (fieldError) {
							console.error(
								`Error fetching custom fields for list ${list.id}:`,
								fieldError.message
							);
						}
					}
				} else {
					console.log('No lists found in this space.');
				}
			}
		} else {
			console.log('No spaces found in the workspace.');
		}
	} catch (error) {
		console.error('Error:', error.message);
	}
}

getCustomFields();
