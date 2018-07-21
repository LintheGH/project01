const mongodb = require('mongodb').MongoClient;
var db;

mongodb.connect('mongodb://10.3.138.132:27017', { useNewUrlParser: true },(err,_db) => {
    if(err){
        console.log(`connection go wrong`);
    }
    db = _db.db('tianma');
});

    





module.exports = {
    insert: (_collection,_data) => {
        return new Promise(async (resolve,reject) => {
            db.collection(_collection).insert(_data).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        })
    },
    find:(_collection,_data) => {
        return new Promise (async (resolve,reject) => {
            db.collection(_collection).find(_data).toArray().then((res) => {
                
                resolve(res);
            }).catch((err) =>{
                console.log(3)
                reject(err);
            })
        })
    },
    update:(_collection,_condition,_data) => {
        return new Promise ((resolve,reject) => {
            db.collection(_collection).update(_condition,_data).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        })
    },
    delete:(_collection,_condition) => {
        return new Promise ((resolve,reject) => {
            db.collection(_collection).deleteOne(_condition).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        })
    }
}