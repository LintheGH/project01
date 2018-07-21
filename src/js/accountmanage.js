require.config({
    paths:{
        'jquery':'../lib/jquery',
        'http':'./httpclient',
        'dialog':'../lib/dialog/js/dialog',
        'validate':'./validate'
    }
});
 

require(['jquery','http','dialog','validate'],($,http,dialog,validate) => {
    $(function(){

        validate('../index.html');

        let Id = window.localStorage.getItem('_id');
        http.get('getaccount',{
            id:Id
        },{'auth':window.localStorage.getItem('token')}).then((res) => {
            console.log(res)
            if(res.status){
                let phn = res.data.res[0].phone.slice(0,3) + '****' +res.data.res[0].phone.slice(-4)
                $('.userphone').text(phn);
            }else{
                console.log(res.message)
                var dialog2 = $(document).dialog({
                    type:'alert',
                    titleShow: false,
                    overlayClose: true,
                    content: '无法获取帐号信息',
                    onClosed: function() {
                        window.location.href = './user.html'
                    }
                });
                $('.dialog-content').css({'width':'60%'})
                $('.dialog-content-bd').css('text-align','center')
                $('.dialog-content-ft').remove();
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
            $('.dialog-content-hd .dialog-content-title').css('font-size','0.4017857142857143rem ')
        });
        
    })
})