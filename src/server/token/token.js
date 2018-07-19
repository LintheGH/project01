const jwt = require('jsonwebtoken');

module.exports = {
    codeToken: (name) => {
        let secret = 'lintoken';
        let preload = {phone:name};
        let expires = {expiresIn:'240h'}
        let token;
        return token = jwt.sign(preload,secret,expires);
    },
    encodeToken: (token) => {
        let secret = 'lintoken';
        return new Promise((resolve,reject) => {
            jwt.verify(token,secret,(err,res) => {
                if(err){
                    reject(err);
                }else {
                    resolve(res);
                }
            })
        })
        
    }
}
