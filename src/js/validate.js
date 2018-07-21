require.config({
    paths:{
        'jquery':'../lib/jquery',
        'http':'./httpclient',
        'dialog':'../lib/dialog/js/dialog',

    }
});

define(['jquery','http','dialog'],($,http,dialog) => {
    return function(url){
        http.get('accountmanage',{},{
            'auth':`${window.localStorage.getItem('token')
        }`}).then((res) => {
            console.log(res)
            if(!res.status){
                $(document).dialog({
                    type:'alert',
                    titleShow: false,
                    overlayClose: true,
                    content: '无法获取帐号信息',
                    onClosed: function() {
                        window.location.href = url;
                    }
                });
                $('.dialog-content-ft').remove();
                $('.dialog-content').css({'width':'60%'})
                $('.dialog-content-bd').css('text-align','center')
                    
            }
        }).catch((err) => {
            console.log(err)
        })
    }
})
