const jwt = require('jsonwebtoken');

module.exports = {
    codeToken: (id) => {
        let secret = 'lintoken';
        let preload = {_id:id};
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
