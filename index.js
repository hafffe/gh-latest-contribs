'use strict';
const graphqlGot = require('graphql-got');
const controlAccess = require('control-access');

const ONE_DAY = 60 * 60 * 24;
const {
	GITHUB_TOKEN,
	GITHUB_USERNAME,
	ACCESS_ALLOW_ORIGIN,
	ACCESS_MAX_COUNT = 5
} = process.env;

if (!GITHUB_TOKEN) {
	throw new Error('Please set your GitHub token in the `GITHUB_TOKEN` environment variable');
}

if (!GITHUB_USERNAME) {
	throw new Error('Please set your GitHub username in the `GITHUB_USERNAME` environment variable');
}

if (!ACCESS_ALLOW_ORIGIN) {
	throw new Error('Please set the `access-control-allow-origin` you want in the `ACCESS_ALLOW_ORIGIN` environment variable');
}

const query = `
	query {
		user(login: "${GITHUB_USERNAME}") {
			pullRequests(
				last: ${ACCESS_MAX_COUNT},
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

const fetchRepos = async () => {
	const {body} = await graphqlGot('api.github.com/graphql', {
		query,
		token: GITHUB_TOKEN
	});

	return body.user.pullRequests.edges;
};

module.exports = async (request, response) => {
	controlAccess()(request, response);

	try {
		const repos = await fetchRepos();

		response.setHeader('content-type', 'application/json');
		response.setHeader('cache-control', `s-maxage=${ONE_DAY}, max-age=0`);
		response.end(JSON.stringify(repos));
	} catch (error) {
		console.error(error);

		response.statusCode = 500;
		response.setHeader('content-type', 'text/plain');
		response.end('Internal server error');
	}
};
