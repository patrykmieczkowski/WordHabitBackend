const packageJson = require('../package.json');
const config = require('../config.json');

const AppContext = require('./utils/AppContext');
const Address = require('./utils/Address');
const Logger = require('./utils/Logger');
const Cassandra = require('./utils/Cassandra');
const Template = require('./utils/Template');
const Router = require('./utils/Router');
const Server = require('./utils/Server');

const PushNotificationScheduler = require('./push-notification/PushNotificationScheduler');
const PushNotificationSender = require('./push-notification/PushNotificationSender');

const EmptyMiddleware = require('./middleware/EmptyMiddleware');
const MultipartMiddleware = require('./middleware/MultipartMiddleware');
const JsonMiddleware = require('./middleware/JsonMiddleware');
const UrlencodedMiddleware = require('./middleware/UrlencodedMiddleware');

const PanelLoginRoute = require('./routes/panel/PanelLoginRoute');
const PanelDashboardRoute = require('./routes/panel/PanelDashboardRoute');
const PanelWordRoute = require('./routes/panel/PanelWordRoute');


// setup global context
const appContext = AppContext.instance();
appContext.setAddress(new Address(`${config.cdn.url}/${config.cdn.media}`));
appContext.setLogger(new Logger());
appContext.setCassandra(new Cassandra(
  config.database.cassandra.host,
  config.database.cassandra.user,
  config.database.cassandra.password
));
appContext.setTemplate(new Template());

// start polling push notifications each minute
const pushNotificationSender = new PushNotificationSender();
const pushNotificationScheduler = new PushNotificationScheduler();
pushNotificationScheduler.setPushNotificationSender(pushNotificationSender);
pushNotificationScheduler.setInterval(60 * 1000);
pushNotificationScheduler.start();

// setup middleware for HTTP endpoints
const emptyMiddleware = new EmptyMiddleware();
const multipartMiddleware = new MultipartMiddleware(config.mediaDir);
const jsonMiddleware = new JsonMiddleware();
const urlencodedMiddleware = new UrlencodedMiddleware();

// setup HTTP endpoints
const panelLoginRoute = new PanelLoginRoute();
const panelDashboardRoute = new PanelDashboardRoute();
const panelWordRoute = new PanelWordRoute();

// populate router with HTTP endpoints
const router = new Router();
router.addEndpoint(Router.Method.GET, '/panel/login', panelLoginRoute, emptyMiddleware);
router.addEndpoint(Router.Method.POST, '/panel/login', panelLoginRoute, urlencodedMiddleware);
router.addEndpoint(Router.Method.GET, '/panel/dashboard', panelDashboardRoute, emptyMiddleware);
router.addEndpoint(Router.Method.GET, '/panel/word', panelWordRoute, emptyMiddleware);
router.addEndpoint(Router.Method.POST, '/panel/word', panelWordRoute, multipartMiddleware);

// setup server
const server = new Server();
server.setName(packageJson.name);
server.setVersion(packageJson.version);
server.setPort(config.port);
server.setRouter('/', router);

server.listen();
