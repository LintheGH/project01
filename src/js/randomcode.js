require.config({
    paths:{
        'jquery':'../lib/jquery'
    }
});

define('randomcode', ['jquery'] , ($) => {
    return function(){
        let result = '';
        for(let i=0;i<5;i++){
            let ran = Math.floor(Math.random()*10);
            result += ran;
        }
        return result;
    }
})