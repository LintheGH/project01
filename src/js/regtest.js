/*

    正则验证

*/


define(function(){
    return function(name,string){
        let result = true;
        switch(true){
            case name == 'username' :
            result = /^[a-z][a-z0-9_\-]{5,19}$/i.test(string);
            break;
            case name === 'pwd' :
            result = /^[^\s]{8,20}$/i.test(string);
            break;
            case name === 'phone':
            result = /^1[3-9]\d{9}$/i.test(string);
            break;
            case name === 'pic-randomcode':
            result = /^\d{4}$/i.test(string);
            break;
            case name === 'msgcode':
            result = /^\d{6}$/i.test(string);
            break;
            default :
            result = true;
        }
        return result;
    }
})

// require(['regtext'],function(res){
//     return res;
// })