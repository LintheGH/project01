const db = require('../db/dbhelper');
const apiResult = require('../utils/apiResult');
const _token = require('../token/token');

module.exports = {
    register:(app) => {
        app.post('/register',async (request,response) => {
            let params = {
                phone:request.body.phone,
                password:request.body.password,
                randomcode:request.body.randomcode,
                codeExpires:request.body.expires
            }
            let res = await db.mongo.find('users',{phone:request.body.phone});
            if(res.length >0){
                response.send(apiResult(false,{},'account is already exit'));
            }else{
                let result = await db.mongo.insert('users',params);
                let output = apiResult(true,{result},'register success')
                response.send(output);
            } 
        })
    },
    login:(app) => {
        app.post('/login',async (request,response) => {
            
            let params = {
                phone : request.body.phone,
                password : request.body.password
            }
            // let _params = {
            //     phone:request.body.phone,
            // }
            let result = await db.mongo.find('users',params);
            // let res = await db.mongo.find('users',_params)
            
            if(result.length > 0){
                let token = _token.codeToken(request.body.phone)
                console.log(token)
                response.send(apiResult(true,{result,token},'login success!'));
            }else{
                let output = apiResult(result.length > 0,{},'name or password uncorrect');
                response.send(output);
            }
        })
    },
    update:(app) => {
        app.post('/update',async (request,response) => {
            let params = {
                phone:request.body.phone,
                password:request.body.password,
                randomcode:request.body.randomcode,
                codeExpires:request.body.expires
            }
            let dataset = await db.mongo.find('users',{phone:request.body.phone});
            if(dataset.length <= 0){
                response.send(apiResult(false,{},'account is not exit'))
            }else if(params.password){
                dataset[0].password = request.body.password;
                let result = db.mongo.update('users',{phone:request.body.phone},dataset[0]);
                response.send(apiResult(true,{result},'update successed'));
            }else{
                dataset[0].phone = request.body.phone;
                let result = db.mongo.update('users',{phone:request.body.phone},dataset[0]);
                response.send(apiResult(true,{result},'update successed'));
            }
        })
    },
    delete:(app) => {
        app.post('/delete',async (request,response) => {
            let params = {
                phone:request.body.phone,
                password:request.body.password
            }
            let dataset = db.mongo.find('users',params);
            console.log(dataset)
            if(dataset <= 0){
                response.send(apiResult(false,{},'eror,account not exit'))
            }else{
                let result = db.mongo.delete('users',params);
                response.send(apiResult(true,{result},'the collection has been deleted'))
            }
        })
    },
    codeLogin:(app) => {
        app.post('/codelogin',async (request,response) => {
            let params = {
                phone:request.body.phone,
                password:request.body.password,
                randomcode:request.body.randomcode,
                codeExpires:request.body.expires
            }

            let res = await db.mongo.find('users',{phone:request.body.phone});

            if(res.length >0){
                let token = _token.codeToken(request.body.phone)
                let result = await db.mongo.update('users',{phone:request.body.phone},params);
                response.send(apiResult(true,{res,result,token},'success'))
            }else{
                let result = await db.mongo.insert('users',params);
                let output = apiResult(true,{result},'insert success')
                response.send(output);
            } 
        })
    },
    getAccount:(app) => {
        app.get('/getaccount',async (request,response) => {
            var params;
            if(request.query.id){
                params = {_id:id}
            }else if(request.query.phone){
                params = {phone:request.query.phone}
            }
            
            let res = await db.mongo.find('users',params).toArray();
            if(res.length > 0){
                response.send(apiResult(true,{res},'account has found'));
            }else{
                response.send(apiResult(false,{res},'can not find account'))
            }
        })

    }
}