require.config({
    paths:{
        'jquery':'../lib/jquery',
        'http':'./httpclient',
        'reg':'./regtest',
        'cookie':'./cookieOperate'
    }
});

require(['jquery','http','reg','cookie'],($,http,reg,cookie) => {
    $(function(){
        $('#login_btn').on('touchstart',() => {
            //验证手机号、密码合法性
            let phone = $('#userphone').val();
            let password = $('#userpwd').val();

            let phTest = reg('phone',phone);
            let pwdTest = reg('pwd',password);

            if(!phTest){
                $('#userphone').val('');
                $('#userphone')[0],focus();
            }else if(!pwdTest){
                $('#userpwd').val('');
                $('#userpwd')[0],focus();
            }else{
                http.post('login',{
                    phone:phone,
                    password:password
                }).then((res) => {
                    console.log(res);
                    if(res.status){
                        let uid = res.data.result[0]._id;
                        let data = {uid:uid};
                        console.log(data)
                        cookie.set(data);
                        window.localStorage.setItem('token',res.data.token)
                        // window.location.href = '../index.html';
                    }else{
                        return;
                    }
                },(err) => {
                    console.log(err);
                });
            }
            
        })
    })
})