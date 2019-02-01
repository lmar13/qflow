var express = require('express')
    , morgan = require('morgan')
    , bodyParser = require('body-parser')
    , app = express()
    , router = express.Router()
    , log = require('./dev-logger.js')
    , cors = require('cors')
    , session = require('express-session')
    , backup = require('mongodb-backup')
    , restore = require('mongodb-restore')
    , { nodeEnv, port, clientUrl, secretKey, mongoUri, mongoBackupPath } = require('./config');
    // , errorHandler = require('errorhandler');

var corsOption = {
  origin: clientUrl || 'http://localhost:4200',
  credentials: true,
}

app.use(cors(corsOption));

var server = require('http').createServer(app);

// var ws = require('./ws.js')(server, true);

app.use(express.static(__dirname + '/dist')); // set the static files location for the static html
// app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

if (nodeEnv === 'production') {
  app.use(morgan('common', { skip: function(req, res) { return res.statusCode < 400 }, stream: __dirname + '/../morgan.log' }));
} else {
  app.use(morgan('dev', {skip: function(req, res) { return res.statusCode < 400 }}));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: secretKey || 'qflow',
    cookie: {
      maxAge: 60000
    },
    resave: false,
    saveUninitialized: false,
  })
);

router.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/dist/index.html');
});

app.use('/', router);

mongoUri = mongoUri || 'mongodb://localhost/qflow';
// mongodb://root:example@10.218.75.164:9028/qflow
const backupUrl = mongoBackupPath || __dirname + '\\mongo-backup';

console.log(mongoUri);
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(mongoUri, { useNewUrlParser: true }).then(function (db){
  mongoose.connection.db.listCollections({name: 'users'}).next(function(err, collinfo) {
    if(!collinfo) {
      // restore({
      //   uri: mongoUri,
      //   root: backupUrl,
      //   // metadata: true,
      //   tar: 'dump.tar',
      //   callback: function(err) {
      //     if(err) {
      //       console.log(err);
      //     } else {
      //       console.log(`Database has been successfully restored. Path: ${backupUrl}`);
      //     }
      //   },
      // });
    } else {
      backup({
        uri: mongoUri,
        root: backupUrl,
        // metadata: true,
        tar: 'dump.tar',
        callback: function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log(`Database has been successfully backed up. Path: ${backupUrl}`);
          }
        },
      });
    }
  })
}).catch(function(err){
    log('Unabled to connect to mongodb err:', err);
    log('Check if MongoDB Server is running and available.');
});
mongoose.set('useCreateIndex', true);

var ws = require('./ws.js')(server, true);
var cardRoutes = require('./routes/card.routes.js')(app);
var columnRoutes = require('./routes/column.routes.js')(app);
var boardRoutes = require('./routes/board.routes.js')(app);
var userRoutes = require('./routes/user.routes.js')(app);
var passport = require('./auth-config/passport.js');

server.listen(port, function () {
  log('App running on port', port);
});
