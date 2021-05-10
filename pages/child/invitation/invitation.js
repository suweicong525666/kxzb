import request from '../../../http.js';
Page({
  data: {
        list:'',
				userInfo:'',
				tabList:['本月榜单','本周榜单'],
				tabIndex:0,
				taskid:'',
				rankList:''
  },
  onLoad(options) {
    if(options.taskid){
        this.setData({
            taskid:options.taskid
        })
			}
			this.GetUserModel()
			this.GetTaskList();
			this.GetRankingVersion()
  },
  onShareAppMessage() {
			return{
				title:'开心直播',
				path:'pages/index/index?userid='+this.data.userInfo.AliAppletOpenId,
				desc:'开心直播',
				bgImgUrl:'/static/image/fx.webp'
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
        this.GetTaskCenterPage()
      })
  },
  GetTaskCenterPage(){
    request('/api/v3/Activity/GetInvitePage','GET', {
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
        console.log('成功回调',res)
        this.setData({
          topList:res.data
        })
      })
  },
  jump_invitationRules(){
				my.navigateTo({
					url:'../inviteRules/inviteRules'
				})
    },
    GetTaskList(){
    request('/api/v2/Activity/GetTaskList/GetTaskList','GET',{
      JumpType:10
    }).then(res=>{
        this.setData({
            list:res.data
        })
      
    })
  },
  //获取排行榜数据
    GetRankingVersion(){
      console.log('加载中')
      request('/api/v2/User/GetInviteRankingVersion','GET', {
      }).then(res => {
      console.log('成功回调',res)
        this.setData({
            rankList:res.data
        })
      })
  },
  tab(e){
    let index=e.currentTarget.dataset.index;
    this.setData({
      tabIndex:index
    })
    
    my.showLoading({
      content:'加载中'
    })
    this.GetRankingVersion()
  },
  jump_singRule(){
    my.navigateTo({
      url: '/pages/child/signRule/signRule'
    });
  },
lj(e){
      console.log(e);
      let index=e.currentTarget.dataset.index;
      let list=this.data.topList.list;
      let finshNum=this.data.userInfo.NumberCompletions;
      if(list[index].IsTaskCent==true){
          my.showToast({
            content:'已经领取过奖励',
            type:'none'
          });return;
      }
      if(finshNum>=list[index].Number){
          this.AddTaskCenter(list[index].Id)
      }
    },
    AddTaskCenter(id){
       request('/api/v3/Activity/AddInvite','GET', {Id:id
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
        console.log('成功回调',res)
          if(res.success){
            my.showToast({
              content:'领取成功',
              icon:'success'
            })
            this.GetUserModel()
          }else{
            my.showToast({
              content:res.msg,
              icon:'none'
            })
          }
      })
    },
    jump_singRule(){
      my.navigateTo({
        url: '/pages/child/singRule/singRule'
      });
    },
     jump(){
      console.log('11321')
       my.navigateTo({
        url:'/pages/child/signRule/signRule'
      });return;
    }
});
