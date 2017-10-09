# gh-latest-contribs

> Get your latest contributions as microservice

Heavily inspired by [sindresorhus/gh-latest-repos](https://github.com/sindresorhus/gh-latest-repos)

## Usage
### With [`now`](https://now.sh)
[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/alonalon/gh-latest-contribs&env=GITHUB_TOKEN&env=GITHUB_USERNAME&env=ACCESS_ALLOW_ORIGIN&env=MAX_COUNTS)

or

```
$ now alonalon/gh-latest-contribs -e NODE_ENV=production -e GITHUB_TOKEN=xxx -e GITHUB_USERNAME=xxx -e ACCESS_ALLOW_ORIGIN=xxx -e MAX_COUNT=8
```

### Manual

Deploy to your hosting provider, set the below environment variables, and start it with `npm start`.


## Environment variables

Define the following environment variables:

- `GITHUB_TOKEN` - [Personal access token.](https://github.com/settings/tokens/new?description=gh-latest-repos)
- `GITHUB_USERNAME` - The username you like to get repos from.
- `ACCESS_ALLOW_ORIGIN` - The URL of your website or `*` if you want to allow any origin (not recommended), for the `Access-Control-Allow-Origin` header.
- `MAX_COUNT` - Amount of contributions you want to fetch, (defaults to 5).



## License

MIT © [alonalon](http://aronhafner.com)
