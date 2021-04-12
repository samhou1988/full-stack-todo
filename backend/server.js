const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const respond = require('koa-respond');
const koaStatic = require('koa-static');
const mongoose = require('mongoose');

const app = new Koa();
const router = new Router();

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
if (process.env.NODE_ENV === 'development') {
  app.use(logger());
}

app.use(cors());
app.use(
  bodyParser({
    enableTypes: ['json'],
    jsonLimit: '5mb',
    strict: true,
    onerror(err, ctx) {
      ctx.throw('body parse error', 422);
    },
  }),
);

app.use(respond());

// API routes
require('./routes')(router);
app.use(router.routes());
app.use(router.allowedMethods());
// api has high priority
app.use(koaStatic('./build'));

mongoose.connect('mongodb://localhost:27017/todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = app;
