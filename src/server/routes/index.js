const express = require('express');
const app = express();
const bparser = require('body-parser');
const path = require('path');
const users = require('./users');
const token = require('../token/token');
const apiResult = require('../utils/apiResult');
const url = require('url');

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With,auth");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") {
      res.send(200);/*让options请求快速返回*/
    } else{
      next();
    }
});


app.use(express.static(path.join(__dirname,'../')));
app.use(bparser.urlencoded({extended:false}));
var routerFilter = ['/login','/codelogin','/getaccount'];
app.use((request,response,next) => {
    let pathname = request.url;
    let hasRouter = routerFilter.includes(pathname);
    if(!hasRouter){
        let _token = request.headers['auth'];
        token.encodeToken(_token).then((res) => {
            next();
        },(err) => {
            response.send(apiResult(false,{error:err},'token error'));
        })
    } else {
        next();
    }
})



module.exports = {
    start:(port) => {   
        users.login(app);
        
        users.register(app);

        users.update(app);

        users.delete(app);

        users.codeLogin(app);

        users.getAccount(app);
        
        app.listen(port || 8080,() => {
            console.log(`server running at localhost:${port || 8080}`);
        });
    }
}