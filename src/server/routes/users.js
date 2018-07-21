const db = require('../db/dbhelper');
const apiResult = require('../utils/apiResult');
const _token = require('../token/token');
const ObjectID = require('mongodb').ObjectID;

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
                let token = _token.codeToken(result[0]._id)
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
            let res = await db.mongo.find('users',{phone:request.body.phone});
            if(res.length <= 0){
                if(request.body.randomcode){
                    let dataset = await db.mongo.find('users',{randomcode:request.body.randomcode});
                    if(dataset.length <=0 ){
                        response.send(apiResult(false,{},'account is not exit'));
                    }else{
                        dataset[0].phone = request.body.phone; 
                        let token = _token.codeToken(dataset[0]._id);
                        let result = db.mongo.update('users',{randomcode:request.body.randomcode},dataset[0]);
                        response.send(apiResult(true,{dataset,token},'update successed'));
                    }
                }else{
                    response.send(apiResult(false,{},'account is not exit'));
                }
            }else if(params.password&&(params.password != res[0].password)){
                res[0].password = request.body.password;
                let token = _token.codeToken(res[0]._id);
                let result = db.mongo.update('users',{phone:request.body.phone},res[0]);
                response.send(apiResult(true,{res,token},'update successed'));
            }else if(params.phone&&(params.phone != res[0].phone)){
                res[0].phone = request.body.phone;
                let token = _token.codeToken(res[0]._id);
                let result = db.mongo.update('users',{phone:request.body.phone},res[0]);
                response.send(apiResult(true,{res,token},'update successed'));
            }else if(params.randomcode&&params.codeExpires){
                res[0].randomcode = request.body.randomcode;
                res[0].codeExpires = request.body.expires;
                let token = _token.codeToken(res[0]._id);
                let result = db.mongo.update('users',{phone:request.body.phone},res[0]);
                response.send(apiResult(true,{res,token},'update successed'));
            }
        })
    },
    delete:(app) => {
        app.post('/delete',async (request,response) => {
            let params = {
                phone:request.body.phone,
                password:request.body.password
            }
            let res = db.mongo.find('users',params);
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
                let token = _token.codeToken(res[0]._id)
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
                let _id = new ObjectID(request.query.id);
                params = {_id}
            }else if(request.query.phone){
                params = {phone:request.query.phone}
            }else{
                response.send(apiResult(false,{},'can not get params'));
            }
            let res = await db.mongo.find('users',params);

            if(res.length > 0){
                response.send(apiResult(true,{res},'account has found'));
            }else{
                response.send(apiResult(false,{res},'can not find account'))
            }
        })

    },
    jump:(app) => {
        app.get('/accountmanage',(request,response) => {
            response.send(apiResult(true,{},'token correct'))
        });
        
    }

}