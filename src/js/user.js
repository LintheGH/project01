require.config({
    paths:{
        'jquery':'../lib/jquery',
        'cookie':'./cookieOperate',
        'http':'./httpclient'
    }
});


require(['jquery','cookie','http'],($,cookie,http) => {
    $(function(){
        let _id = window.localStorage.getItem('_id');

        http.get('getaccount',{
            id:_id
        },{'auth':window.localStorage.getItem('token')}).then((res) => {
            if(res.status){
                $('.userphone').text(res.data.res[0].phone)
            }else{
                console.log(res.message)
            }
        }).catch((err) => {
            console.log(err);
        });

    })
})