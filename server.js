const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./src/Routes/route.js');
const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//解析过来的token
app.use((req, res, next) => {
    let token = req.query.token || null;
    if (token !== null) {
        const tokenArr = atob(token).split(':');
        global.UserID = tokenArr[0];
        global.UserToken = tokenArr[1];
    } else {
        global.UserToken = null;
        global.UserID = null;
    }
    console.log(UserID, UserToken);
    next();
});
//middleware
app.use('/', router);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})