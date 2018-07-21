require.config({
    paths:{
        'jquery':'../lib/jquery',
        'randomcode':'./randomcode',
        'http':'./httpclient',
        'reg':'./regtest',
        'dialog':'../lib/dialog/js/dialog',

    }
})

define('inteval',() => {
    return function(index,fn){
        $("#code_btn").off();
        $('#code_btn').addClass('active');
        let timer = setInterval(() => {
            index--;
            $('#code_btn').prop('value',`重新获取(${index})`);
            
            if(index <= 0){
                clearInterval(timer);
                $('#code_btn').removeClass('active');
                $('#code_btn').prop('value',`获取验证码`);
                $('#code_btn').on('touchstart',fn);
            }
        },1000)
    }
})

require(['jquery','randomcode','http','inteval','reg','dialog'],($,random,http,inteval,reg,dialog) => {
    jQuery(function($){
        
        var touchEvent = () => {
            
            let  phone = $('#userphone').val();
            
            //验证手机号
            let phTest = reg('phone',phone);

            if(!phTest){
                $(document).dialog({
                    type:'alert',
                    titleShow: false,
                    autoClose: 1000,
                    content: '手机号不正确'
                });
                $('.dialog-content-ft').remove();
            }else{
                //注册手机号，存入验证码
                let index = 60;
                let randomCode = random();
                let date = Date.now();
                $('#code').prop('value','').prop('placeholder',`${randomCode}`);
                http.post('codelogin',{
                    phone:phone,
                    randomcode:randomCode,
                    expires:date + 120000
                }).then((res) => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err)
                });
                inteval(index,touchEvent);
            }
        }
        //获取验证码按钮
        $('#code_btn').on('touchstart',touchEvent);

        //确定按钮
        $('#login_btn').on('touchstart',() => {
            let randomCode = $('#code').val();
            let  phone = $('#userphone').val();
            //验证手机号
            let phTest = reg('phone',phone);
            if(!phTest){
                $(document).dialog({
                    type:'alert',
                    titleShow: false,
                    autoClose: 1000,
                    content: '手机号不正确'
                });
                $('.dialog-content-ft').remove();
            }else{
                http.post('codelogin',{
                    phone:phone,
                    randomcode:randomCode
                }).then((res) => {

                    //验证验证码合法性
                    if(res.status){
                        let codeExpires = Number(res.data.res[0].codeExpires);
                        let randomCode = res.data.res[0].randomcode;
                        console.log(randomCode)
                        let date = Date.now();

                        if(randomCode != $('#code').val()){
                            $(document).dialog({
                                type:'alert',
                                titleShow: false,
                                autoClose: 1000,
                                content: '验证码不正确'
                            });
                            $('.dialog-content-ft').remove();
                        }else if(date > codeExpires){
                            $(document).dialog({
                                type:'alert',
                                titleShow: false,
                                autoClose: 1000,
                                content: '验证码已过期'
                            });
                            $('.dialog-content-ft').remove();
                        }else{
                            window.localStorage.setItem('_id',res.data.res[0]._id)
                            window.localStorage.setItem('token',res.data.token)
                            window.location.href = '../index.html'
                        }
                    }else{
                        $('#userphone').prop('value','');
                        $('#userphone')[0].focus();
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
  
        });
    })
})