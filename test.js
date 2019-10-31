import test from 'ava';
import got from 'got';
import micro from 'micro';
import delay from 'delay';
import nock from 'nock';
import testListen from 'test-listen';
import fixture from './fixture/response.json';

let url;

const ORIGIN = process.env.ACCESS_ALLOW_ORIGIN;
const TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = process.env.GITHUB_USERNAME;

test.before(async () => {
	process.env.ACCESS_ALLOW_ORIGIN = '*';
	process.env.GITHUB_TOKEN = 'token';
	process.env.GITHUB_USERNAME = 'alonalon';

	const response = {
		data: {
			user: {
				pullRequests: {
					edges: fixture
				}
			}
		}
	};

	nock('https://api.github.com/graphql')
		.persist()
		.filteringPath(pth => `${pth}/`)
		.matchHeader('authorization', `bearer ${process.env.GITHUB_TOKEN}`)
		.post('/')
		.reply(200, response);

	url = await testListen(micro(require('.')));

	await delay(1000);
});

test.after(() => {
	process.env.ACCESS_ALLOW_ORIGIN = ORIGIN;
	process.env.GITHUB_TOKEN = TOKEN;
	process.env.GITHUB_USERNAME = USERNAME;
});

test('fetch latest pull request for user', async t => {
	const {body} = await got(url, {json: true});
	t.deepEqual(body, fixture);
});

test('set origin header', async t => {
	const {headers} = await got(url, {json: true});
	t.is(headers['access-control-allow-origin'], '*');
	t.is(headers['cache-control'], 's-maxage=86400, max-age=0');
});
