'use strict';
const graphqlGot = require('graphql-got');
const controlAccess = require('control-access');

const token = process.env.GITHUB_TOKEN;
const username = process.env.GITHUB_USERNAME;
const origin = process.env.ACCESS_ALLOW_ORIGIN;
const maxCount = process.env.ACCESS_MAX_COUNT || 5;
const ONE_DAY = 1000 * 60 * 60 * 24;

if (!token) {
	throw new Error('Please set your GitHub token in the `GITHUB_TOKEN` environment variable');
}

if (!username) {
	throw new Error('Please set your GitHub username in the `GITHUB_USERNAME` environment variable');
}

if (!origin) {
	throw new Error('Please set the `access-control-allow-origin` you want in the `ACCESS_ALLOW_ORIGIN` environment variable');
}

const query = `
	query {
		user(login: "${username}") {
			pullRequests(
				last: ${maxCount},
				orderBy: {
					field: CREATED_AT,
					direction: ASC
				}
			) {
				edges {
					node {
						author {
							login
						}
						url
						state
						publishedAt
						mergedAt
					}
				}
			}
		}
	}
`;

let responseText = '[]';

async function fetchRepos() {
	const {body} = await graphqlGot('api.github.com/graphql', {
		query,
		token
	});

	const res = body.user.pullRequests.edges;

	responseText = JSON.stringify(res);
}

setInterval(fetchRepos, ONE_DAY);
fetchRepos();

module.exports = (request, response) => {
	controlAccess()(request, response);
	response.end(responseText);
};
