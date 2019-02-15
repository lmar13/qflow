const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const log = require('./src/dev-logger.js');
const cors = require('cors');
const session = require('express-session');
// const backup = require('mongodb-backup');
// const restore = require('mongodb-restore');
const {
  nodeEnv,
  serverPort,
  clientUrl,
  secretKey,
  mongoUri,
} = require('./config/env.config');
const {
  backup,
  restore
} = require('./config/db.config');
// , errorHandler = require('errorhandler');

const corsOption = {
  origin: clientUrl || 'http://localhost:4200',
  credentials: true,
};

app.use(cors(corsOption));

const server = require('http').createServer(app);

// const ws = require('./ws.js')(server, true);

app.use(express.static(__dirname + '/dist')); // set the static files location for the static html
// app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

if (nodeEnv === 'production') {
  app.use(morgan('common', {
    skip: (req, res) => res.statusCode < 400,
    stream: __dirname + '/../morgan.log'
  }));
} else {
  app.use(morgan('dev', {
    skip: (req, res) => res.statusCode < 400,
  }));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(session({
  secret: secretKey || 'qflow',
  cookie: {
    maxAge: 60000,
  },
  resave: false,
  saveUninitialized: false,
}));

app.get('/test', (req, res) => {
  log('GET /test');
  res.status(200).json({
    info: 'Test completed successfully'
  });
});

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(mongoUri, {
  useNewUrlParser: true
}).then((db) => {
  mongoose.connection.db.listCollections({
    name: 'users'
  }).next((err, collinfo) => {
    if (!collinfo) {
      restore()
    }
    backup()
  });
}).catch((err) => {
  log('Unabled to connect to mongodb err:', err);
  log('Check if MongoDB Server is running and available.');
});
mongoose.set('useCreateIndex', true);

const ws = require('./src/ws.js')(server, true);
const cardRoutes = require('./src/routes/card.routes.js')(app);
const subcardRoutes = require('./src/routes/subcard.routes.js')(app);
const columnRoutes = require('./src/routes/column.routes.js')(app);
const boardRoutes = require('./src/routes/board.routes.js')(app);
const userRoutes = require('./src/routes/user.routes.js')(app);
const statRoutes = require('./src/routes/stat.routes.js')(app);
const authRoutes = require('./src/routes/auth.routes.js')(app);
const passport = require('./src/auth-config/passport.js');

router.get('/*', (req, res) => res.sendFile(__dirname + '/dist/index.html'));

app.use('/', router);

server.listen(serverPort, () => log('App running on port', serverPort));