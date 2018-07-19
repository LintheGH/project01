require.config({
    paths:{
        'jquery':'../lib/jquery',
        'http':'./httpclient',
        'reg':'./regtest',
        'cookie':'./cookieOperate',
        'dialog':'../lib/dialog/js/dialog',

    }
});

require(['jquery','http','reg','cookie','dialog'],($,http,reg,cookie,dialog) => {
    $(function(){
        $('#login_btn').on('touchstart',() => {
            //验证手机号、密码合法性
            let phone = $('#userphone').val();
            let password = $('#userpwd').val();

            let phTest = reg('phone',phone);
            let pwdTest = reg('pwd',password);

            if(!phTest){
               $(document).dialog({
                    type:'alert',
                    titleShow: false,
                    autoClose: 1000,
                    content: '手机号不正确'
                });
                $('.dialog-content-ft').remove();
            }else if(!pwdTest){
                $(document).dialog({
                    type:'alert',
                    titleShow: false,
                    autoClose: 1000,
                    content: '8-20位数字和字母组合'
                });
                $('.dialog-content-ft').remove();
            }else{
                http.post('login',{
                    phone:phone,
                    password:password
                }).then((res) => {

                    if(res.status){
                        let uid = res.data.result[0]._id;
                        window.localStorage.setItem('_id',uid);
                        window.localStorage.setItem('token',res.data.token)
                        window.location.href = '../index.html';
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