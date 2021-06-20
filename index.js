var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var cors = require('cors');

const port = 8443;
var httpServer = http.createServer(app).listen(port, function () {
    console.log(`Server started at Port ${port} for HTTP`);
});
httpServer.timeout = 300000;

var router = express.Router();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true, parameterLimit: 100000 }));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: "100mb", extended: true, parameterLimit: 100000 }));


app.use(helmet({
    frameguard: {
        action: 'sameorigin'
    },
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives()
        }
    },
    hsts: {
        maxAge: 5184000,
    },
    referrerPolicy: {
        policy: 'same-origin'
    },
    featurePolicy: {
        features: {
            camera: ["'none'"],
            microphone: ["'none'"],
            geolocation: ["'none'"]
        }
    }
}));


//function loadCors(whiteLists){
app.use(cors({
    /*origin: function (origin, callback) {

        callback(null, true);
        if (whiteLists.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            console.log("Cors error: " + origin);
            callback(new Error('Not allowed by CORS'));
        }
    },*/
    origin: "*",
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-LoginSource', 'X-Security-AuthKey', 'X-Locale', 'Authorization', 'X-Type'],
    credentials: true,
    exposedHeaders: ['Link', 'x-page-index', 'x-page-totalcount', 'x-page-pagesize', 'EntityLink', 'UserLink', 'GroupLink', 'ProjectLink', 'X-Blob-FileName']
}));

app.get(`/Ping/:param?`, (req, res) => {
    let response = { status: 'UP' };
    if (req.params.param) {
        response.param = req.params.param;
    }
    res.send(response);
});


router.get("/users", (req,res)=> { return res.status(200).send( [
    {
        "username": "nischal",
        "password": "nischal"
    }
]) })

app.use("/", router);

app.use(function customErrorHandler(err, req, res, next) {
    console.log("customErrorHandler...Error" + err);
    res.status(400).send({ message: "Not allowed!" });
});


//##end region
app.use(function (req, res, next) {
    console.log("Nodeapi request not found");
    res.status(400).send({ message: "Node api Bad Request!!" });
});
