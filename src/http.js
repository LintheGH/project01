/*

    请求操作封装

*/

var http = {

    baseUrl：'http://localhost:93/',
    urlFilter:(url) => {
        if(url.startsWith('http')){
            return url;
        }else{
            return this.baseUrl + url;
        }
    },
    get:function(_url,data,header={},async=true){
                return new Promise((resolve,reject) =>{
                    $.ajax({
                        url:this.urlFilter(_url),
                        data:data || {},
                        type:'GET',
                        async:async,
                        headers:header,
                        success:function(res){
                            resolve(res);
                        },
                        error:function(error){
                            reject(error);
                        }
                    })
                })
            },
    post:function(_url,data,header={},async=true){
        return new Promise((resolve,reject) =>{
            $.ajax({
                url:this.urlFilter(_url),
                data:data || {},
                type:'POST',
                async:async,
                headers:header,
                success:function(res){
                    resolve(res);
                },
                error:function(error){
                    reject(error);
                }
            })
        })
    }

}
    
                
// http.get('getaccount',{
//     phone:'13500135001'
// })
