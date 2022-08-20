require("dotenv").config();

const express = require('express');
const cors    = require('cors');
const app     = express();
const morgan  = require('morgan');
const route   = require('./api/routes')
const { globalErrorHandler } = require('./api/utils/error')

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(route)

app.all('*', (req, res, next) => {
	const err = new Error(`Can't fine ${req.originalUrl} on this server!`)

	err.statusCode = 404;

	next(err)
})

app.use(globalErrorHandler)

app.listen(8000, () => {
  console.log(`Listening to request on 127.0.0.1:8000`);
});
