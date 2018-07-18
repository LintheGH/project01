require.config({
    paths:{
        'jquery':'../lib/jquery',
        'randomcode':'./randomcode',
        'http':'./httpclient',
        'reg':'./regtest'
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
});



require(['jquery','http','reg','randomcode','inteval'],($,http,reg,random,inteval) => {
    $(function(){

        var touchEvent = () => {
            let index = 60;
            let randomCode = random();
            //
            $('#code').prop('value','').prop('placeholder',`${randomCode}`);
            let  phone = $('.phonenum').text();
            let date = Date.now();
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
        //获取验证码按钮
        $('#code_btn').on('touchstart',touchEvent);

        $('#confirm_btn').on('touchstart',() => {
            let password = $('#userpwd').val();
            let  phone = $('.phonenum').text();
            let randomCode = $('#code').val();
            //验证密码合法性
            let pwdTest = reg('pwd',password);
            if(!pwdTest){
                $('#userpwd').prop('value','');
                $('#userpwd')[0].focus();
                console.log('err')
            }else{
                http.post('codelogin',{
                    phone:phone,
                    password:password,
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
                            //更新数据库
                            http.post('update',{
                                phone:phone,
                                password:password,
                                randomcode:randomCode
                            },{'auth':`${window.localStorage.getItem('token')}`}).then((res) => {
                                console.log(res)
                                if(res.status){
                                    window.localStorage.setItem('token',res.data.token)
                                    window.location.href = '../index.html';   
                                }else{
                                    console.log(res.message)
                                }
                            }).catch((err) =>{
                                console.log(err)
                            });
                        }
                    }else{
                        alert('手机号未注册');
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
  
        });
    })
})
