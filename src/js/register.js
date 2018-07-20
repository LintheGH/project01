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



require(['jquery','http','reg','randomcode','inteval','dialog'],($,http,reg,random,inteval,dialog) => {
    $(function(){
        $('.cover').show();

        $('.wrap1').addClass('scaleb').fadeIn(500);

        //获取验证码按钮函数
        var touchEvent = () => {
                    
            let  phone = $('#phone').val();
            
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
                //验证手机号是否已注册
                http.get('getaccount',{
                    phone:phone,
                }).then((res) => {
                    if(res.status){
                        $(document).dialog({
                        type:'alert',
                        titleShow: false,
                        autoClose: 1000,
                        content: '手机号已注册'
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
                            console.log(res.message)
                        }).catch((err) => {
                            console.log(err)
                        });
                        inteval(index,touchEvent);
                    }
                }).catch((err) => {

                })
                
            }
        }


        //确认手机号按钮
        $('#confirm_btn').on('touchstart',() => {
            let phone = $('#phone').val();
            //判断是否为空
            if(phone == ''){
                $('.ph-wrap-info').show();
                return;
            }else{
                $('.ph-wrap-info').hide();
            }
            //验证帐号是否注册
            http.get('getaccount',{
                phone:phone
            }).then((res) => {
                //已注册
                if(res.status){
                    $('.ph-wrap3 span:last-child').text(phone);
                    $('.wrap1').removeClass('scaleb').addClass('scales').fadeOut(500, function() {
                    $('.wrap3').show().removeClass('scales').addClass('scaleb').fadeIn(300);
                    $('#confirm_btn3').on('touchstart',() => {
                        let password = $('#_password').val();
                        let pwdTest = reg('pwd',password);
                        if(!pwdTest){
                            $(document).dialog({
                                type:'alert',
                                titleShow: false,
                                autoClose: 1000,
                                content: '密码格式不正确'
                            });
                            $('.dialog-content-ft').remove();
                            return;
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
                                    $(document).dialog({
                                    type:'alert',
                                    titleShow: false,
                                    autoClose: 1000,
                                    content: '手机号或密码不正确'
                                });
                                $('.dialog-content-ft').remove();
                                }
                            },(err) => {
                                console.log(err);
                            });
                        }
                    })
                   });
                }else{
                    //未注册
                    $('.ph-wrap2 span:last-child').text(phone);
                    $('.wrap1').removeClass('scaleb').addClass('scales').fadeOut(500,() => {
                        $('.wrap2').show().removeClass('scales').addClass('scaleb').fadeIn(300);
                        $('#code').prop('value','').prop('placeholder','请输入短信验证码');
                        $('.wp2-title').text('注册帐号');
                        $('#password').prop('placeholder','重请输入8-20位数字和字母组合');
                        $('._wp2 span:first-child').html('如果您忘了密码，请<a href="javascript:" class="findpwd">找回密码</a>')
                        $('#code_btn').on('touchstart',touchEvent);

                        $('#confirm_btn2').on('touchstart',() => {
                            let password = $('#password').val();
                            //验证密码合法性
                            let pwdTest = reg('pwd',password);
                            if(!pwdTest){
                                $(document).dialog({
                                    type:'alert',
                                    titleShow: false,
                                    autoClose: 1000,
                                    content: '密码格式不正确'
                                });
                                $('.dialog-content-ft').remove();
                            }else{
                                //获取帐号中的验证码
                                http.get('getaccount',{
                                    phone:phone,
                                }).then((res) => {
                                    //验证码合法性
                                    if(res.status){
                                        let codeExpires = Number(res.data.res[0].codeExpires);
                                        let randomCode = res.data.res[0].randomcode;
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
                                            //更新数据库
                                            http.post('update',{
                                                phone:phone,
                                                password:password,
                                                randomcode:randomCode
                                            },{'auth':`${window.localStorage.getItem('token')}`}).then((res) => {
                                                if(res.status){
                                                    $(document).dialog({
                                                        type:'confirm',
                                                        titleShow: false,
                                                        content: '注册完成',
                                                         buttons:   [
                                                                        {
                                                                            name: '确定',
                                                                            class: 'dialog-btn-confirm',
                                                                            callback: function() {
                                                                                window.location.href = '../index.html'
                                                                            }
                                                                        }
                                                                    ]
                                                    });
                                                }else{
                                                    console.log(res.message);
                                                }
                                            }).catch((err) =>{
                                                console.log(err)
                                            });
                                            
                                        }
                                    }else{
                                        console.log(res.message)
                                    }
                                }).catch((err) => {
                                    console.log(err);
                                });
                            }
                        });
                    });
                }
            }).catch((err) => {
                console.log(err)
            })
        });
        
        $(document).on('touchstart','._changephone',() => {
            $('.wrap2').hide().removeClass('scaleb').addClass('scales');
            $('.wrap3').hide().removeClass('scaleb').addClass('scales');
            $('#code').prop('value','').prop('placeholder','');
            $('#code_btn').removeClass('active');
            $('#code_btn').prop('value',`获取验证码`);
            $('.wrap1').show().removeClass('scales').addClass('scaleb');
        });
        $('body').on('touchstart',(evt) => {
            console.log(123)
            if($(evt.target).is('.findpwd')){
                console.log(2)
                $('.wp2-title').text('找回帐号密码');
                $('#password').prop('placeholder','重新设置8-20位数字和字母组合');
                $('._wp2 span:first-child').html('<a href="javascript:" class="alogin">已有帐号登录</a>')
            }
            if($(evt.target).is('.alogin')){
                console.log(3)
                $('.wp2-title').text('注册帐号');
                $('#password').prop('placeholder','重请输入8-20位数字和字母组合');
                $('._wp2 span:first-child').html('如果您忘了密码，请<a href="javascript:" class="findpwd">找回密码</a>')
            }
        })
    })
})
