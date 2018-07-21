require.config({
    paths:{
        'jquery':'../lib/jquery',
        'http':'./httpclient',
        'dialog':'../lib/dialog/js/dialog',

    }
});


require(['jquery','http','dialog'],($,http,dialog) => {
    $(function(){
        let _id = window.localStorage.getItem('_id');
        http.get('getaccount',{
            id:_id
        },{'auth':window.localStorage.getItem('token')}).then((res) => {

            if(res.status){
                $('.userphone').text(res.data.res[0].phone)
            }else{
                console.log(res.message)
                $('.userphone').text('登录')
            }
        }).catch((err) => {
            console.log(err);
        });
        
        $('#account').on('touchstart', () => {
            http.get('accountmanage',{},{
                'auth':`${window.localStorage.getItem('token')
            }`}).then((res) => {
                if(res.status){
                    window.location.href = './accountmanage.html'
                }else{
                    $(document).dialog({
                        type:'confirm',
                        titleShow: false,
                        content: '请登录',
                        buttons:[
                                    {
                                        name: '确定',
                                        class: 'dialog-btn-confirm',
                                        callback: function() {
                                            window.location.href = './register.html'
                                        }
                                    }
                                ]
                    });
                }
            }).catch((err) => {
                console.log(err)
            })
        })
    })
})