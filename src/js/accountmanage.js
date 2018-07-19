require.config({
    paths:{
        'jquery':'../lib/jquery',
        'cookie':'./cookieOperate',
        'http':'./httpclient',
        'dialog':'../lib/dialog/js/dialog',
    }
});


require(['jquery','cookie','http','dialog'],($,cookie,http,dialog) => {
    $(function(){
        let _cookie = cookie.read();
        if(!_cookie){
            _cookie = {};
        }
        http.get('getaccount',{
            id:_cookie.uid || null
        },{'auth':window.localStorage.getItem('token')}).then((res) => {
            if(res.status){
                let phn = res.data.res[0].phone.slice(0,3) + '****' +res.data.res[0].phone.slice(-4)
                $('.userphone').text(phn);
            }else{
                console.log(res.message)
            }
        }).catch((err) => {
            console.log(err);
        });

        $(document).on('click', '#btn-01', function() {
            var dialog1 = $(document).dialog({
                type:'confirm',
                style:'ios',
                titleText:'帐号注销风险',
                content: `注销后，将放弃以下资产或权益，包括不限于：<br>
                            个人身份信息、账户信息、权益将被清空且无法恢复。<br>
                            交易记录将被删除，请确保所有交易已经完结且无纠纷。帐号注销后历史交易可能产生的资金退回权益等视作自动放弃`,
                buttons: [
                    {
                        name: '取消',
                        class: 'dialog-btn-hl',
                        callback: function() {
                           
                        }
                    },
                    {
                        name: '确定',
                        class: '',
                        callback: function() {
                            window.location.href = './cancleaccount.html'
                        }
                    }
                ]
            });
        });
        
    })
})