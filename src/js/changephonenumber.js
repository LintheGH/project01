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
});



require(['jquery','http','reg','randomcode','inteval','dialog'],($,http,reg,random,inteval,dialog) => {
    $(function(){
        let _phone='';
        var touchEvent = () => {

            let  phone = $('#userphone').val();
            //验证手机号合法性
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
                let index = 60;
                let randomCode = random();
                //
                $('#code').prop('value','').prop('placeholder',`${randomCode}`);
                let date = Date.now();
                //查找账户
                
                let _id = window.localStorage.getItem('_id');
                http.get('getaccount',{
                    id:_id
                }).then((res) => {

                    if(res.status){
                        _phone = res.data.res[0].phone
                        //更新验证码
                        http.post('update',{
                            phone:_phone,
                            randomcode:randomCode,
                            expires:date + 120000
                        },{'auth':window.localStorage.getItem('token')}).then((res) => {
                            console.log(res.message);
                        }).catch((err) => {
                            console.log(err.message)
                        });
                        inteval(index,touchEvent);
                    }else{
                        console.log(res.message)
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        }

        //获取验证码按钮
        $('#code_btn').on('touchstart',touchEvent);

        //确定按钮
        $('#confirm_btn').on('touchstart',() => {
            let  phone = $('#userphone').val();
            let randomCode = $('#code').val();
            //验证手机号合法性
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
                http.get('getaccount',{
                    phone:_phone,
                    randomcode:randomCode
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
                                randomcode:randomCode
                            },{'auth':`${window.localStorage.getItem('token')}`}).then((res) => {

                                if(res.status){
                                    window.localStorage.setItem('token',res.data.token)
                                    $(document).dialog({
                                        type:'confirm',
                                        titleShow: false,
                                        content: '修改成功',
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
                        alert('手机号未注册');
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
  
        });
        
        $('#back_btn').on('touchstart',() => {
            window.location.href = './accountmanage.html'
        })
    })
})
