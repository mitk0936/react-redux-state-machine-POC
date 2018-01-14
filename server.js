const fs = require('fs')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const bodyParser = require('body-parser').json()
const config = require('./webpack.config.js')
const port = 3002
const app = express()
const compiler = webpack(config)

const middleware = webpackMiddleware(compiler, {
	publicPath: config.output.publicPath,
	contentBase: 'src',
	stats: {
		colors: true,
		hash: false,
		timings: true,
		chunks: false,
		chunkModules: false,
		modules: false
	}
})

app.use(middleware)
app.use(webpackHotMiddleware(compiler))

const defaultCancellation = {
	cancellation: []
}

const loadCancellation = function (onReady) {
	fs.readFile('mocked-cancellation.json', 'utf8', function (err, data) {
		if (data) {
			try {
				onReady(JSON.parse(data))
			} catch (e) {
				onReady(defaultCancellation)
			}
		} else {
			onReady(defaultCancellation)
		}
	})
}

app.get('/cancellation', (req, res) => {
	// delay
	setTimeout(() => {
		loadCancellation((cancellation) => {
			res.json(cancellation)
			res.end()
		})
	}, 3000);
});

app.get('/', function response(req, res) {
	res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
	res.end();
});

app.listen(port, '0.0.0.0', function onStart(err) {
	if (err) {
		console.log(err)
	}

	console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port)
})
