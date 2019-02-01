const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const log = require('./dev-logger.js');
const cors = require('cors');
const session = require('express-session');
const backup = require('mongodb-backup');
const restore = require('mongodb-restore');
const {
  nodeEnv,
  serverPort,
  clientUrl,
  secretKey,
  mongoUri,
  mongoBackupPath
} = require('./config');
// , errorHandler = require('errorhandler');

var corsOption = {
  origin: clientUrl || 'http://localhost:4200',
  credentials: true,
};

app.use(cors(corsOption));

var server = require('http').createServer(app);

// var ws = require('./ws.js')(server, true);

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

router.get('/', (req, res) => res.sendFile(__dirname + '/dist/index.html'));

app.use('/', router);

app.get('/test', (req, res) => {
  log('GET /test');
  res.status(200).json({
    info: 'Test completed successfully'
  });
});

// mongoUri = mongoUri || 'mongodb://localhost/qflow';
// mongodb://root:example@10.218.75.164:9028/qflow
const backupUrl = mongoBackupPath || __dirname + '\\mongo-backup';

console.log(mongoUri);
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(mongoUri, {
  useNewUrlParser: true
}).then((db) => {
  mongoose.connection.db.listCollections({
    name: 'users'
  }).next((err, collinfo) => {
    if (!collinfo) {
      restore({
        uri: mongoUri,
        root: backupUrl,
        // metadata: true,
        tar: 'dump.tar',
        callback: (err) => err ? log(err) : log(`Database has been successfully restored. Path: ${backupUrl}`),
      });
    } else {
      backup({
        uri: mongoUri,
        root: backupUrl,
        // metadata: true,
        tar: 'dump.tar',
        callback: (err) => err ? log(err) : log(`Database has been successfully backed up. Path: ${backupUrl}`),
      });
    }
  });
}).catch((err) => {
  log('Unabled to connect to mongodb err:', err);
  log('Check if MongoDB Server is running and available.');
});
mongoose.set('useCreateIndex', true);

var ws = require('./ws.js')(server, true);
var cardRoutes = require('./routes/card.routes.js')(app);
var columnRoutes = require('./routes/column.routes.js')(app);
var boardRoutes = require('./routes/board.routes.js')(app);
var userRoutes = require('./routes/user.routes.js')(app);
var authRoutes = require('./routes/auth.routes.js')(app);
var passport = require('./auth-config/passport.js');

server.listen(serverPort, () => log('App running on port', serverPort));