require.config({
    paths:{
        'jquery':'../lib/jquery',
        'randomcode':'./randomcode',
        'http':'./httpclient',
        'reg':'./regtest',
        'cookie':'./cookieOperate'
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

require(['jquery','randomcode','http','inteval','reg','cookie'],($,random,http,inteval,reg,cookie) => {
    jQuery(function($){
        
        var touchEvent = () => {
            let index = 60;
            let randomCode = random();
            $('#code').prop('value','').prop('placeholder',`${randomCode}`);
            let  phone = $('#userphone').val();
            let date = Date.now();
            //验证手机号
            let phTest = reg('phone',phone);
            console.log(phone,phTest)
            if(!phTest){
                $('#userphone').prop('value','').prop('placeholder','手机号不正确');
                $('#userphone')[0].focus();
                console.log('err')
            }else{
                //注册手机号，存入验证码
                http.post('codelogin',{
                    phone:phone,
                    randomcode:randomCode,
                    expires:date + 60000
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
                $('#userphone').prop('value','').prop('placeholder','手机号不正确');
                $('#userphone')[0].focus();
                console.log('err')
            }else{
                http.post('codelogin',{
                    phone:phone,
                    randomcode:randomCode
                }).then((res) => {
                    console.log(res);
                    //验证验证码合法性
                    if(res.status){
                        let codeExpires = Number(res.data.res[0].codeExpires);
                        let randomCode = res.data.res[0].randomcode;
                        let date = Date.now();
                        console.log(codeExpires,date)
                        if(randomCode != $('#code').val()){
                            $('#code').prop('value','').prop('placeholder','验证码不正确');
                            $('#code')[0].focus();
                        }else if(date > codeExpires){
                            $('#code').prop('value','').prop('placeholder','验证码已过期');
                            $('#code')[0].focus();
                        }else{

                            window.localStorage.setItem('token',res.data.token)
                            window.location.href = '../index.html';
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