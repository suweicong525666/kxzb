import request from '../../http.js';
Page({
  data: {},
  onLoad() {
    this.login()          
  },
  login(){
    var that=this;
    my.getAuthCode({
         scopes: 'auth_user', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
         success: (result) => {
           console.log(result);
            request('/api/v2/Login/GetAliUser/GetAliUser','GET',{auth_code:result.authCode,puserid:this.data.userid?this.data.userid:'',appid:'2021002139665742'}).then(res=>{
             if(res.success){
                console.log('后端返回个人信息',res.data.access_token);
                my.setStorageSync({
                      key: 'token',
                      data: res.data.access_token
                });
						that.GetUserModel()
					}
           })
         },
      });
  },
  onShow(){
    this.GetUserModel()
  },
  onRenderSuccess(e){
    console.log('阿里图片广告加载成功',e)
    if(e.detail.height>0){
          this.setData({
            alBanShow:true
          })
    }
  },
   //获取用户信息
  GetUserModel(){
      request('/api/v2/User/GetUserDetail/GetUserModel','GET', {
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
        console.log('成功回调',res)
        this.setData({
          userInfo:res.data
        })
      })
  },
  jump_myCoin(){
     my.navigateTo({
      url: '/pages/child/myCoin/myCoin'
    });
  },
  jump_balance(){
    my.navigateTo({
      url: '/pages/child/balance/balance'
    });
  },
  //跳转建议反馈二级页面
			jump_feedBack(){
				my.navigateTo({
					url:'../child/feedback/feedback'
				})
			},
			//跳转抽奖记录二级页面
			jump_luckdraw(e){
        let index=e.currentTarget.dataset.index;
				my.navigateTo({
					url:'../child/luckdraw/luckdraw?tabIndex='+index
				})
				
			},
			//跳转我的反馈二级页面
			jump_myFeedback(){
				my.navigateTo({
					url:'../child/myFeedback/myFeedback'
				})
			},
});
