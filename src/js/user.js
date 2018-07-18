require.config({
    paths:{
        'jquery':'../lib/jquery',
        'cookie':'./cookieOperate',
        'http':'./httpclient'
    }
});


require(['jquery','cookie','http'],($,cookie,http) => {
    $(function(){
        let _cookie = cookie.read();
        console.log(_cookie);
        http.get('getaccount',{
            id:_cookie.uid
        }).then((res) => {
            console.log(res);
            if(res.status){
                $('.usersphone').text(res.data.res[0]._id)
            }else{
                console.log(res.message)
            }
        }).catch((err) => {
            console.log(err);
        })
    })
})