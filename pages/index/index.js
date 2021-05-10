import request from '../../http.js';
Page({
  data:{
    modalShow:false,
    page:1,
    size:10,
    number:0,
  },
  onLoad(options) {
     //引流渠道进入
    if(options.channel){
        var channel=options.channel;
         console.log('有渠道参数',channel)
       	// my.uma.trackEvent('renwu_03',{channel:1})
    }
    if(options.userid){
        //获取二维码参数
        this.setData({
            userid:options.userid,
				    taskid:options.taskId
        })
        this.login(options.userid);
      }else{
            var that=this;
            my.getAuthCode({
                 scopes: 'auth_base', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
                 success: (result) => {
              //      console.log(result);
                  request('/api/v2/Login/GetAliUserSilent/GetAliUserSilent','GET',{auth_code:result.authCode,appid:'2021002135640940'}).then(res=>{
                    if(res.success){
                        console.log('后端返回个人信息',res.data.access_token);
                        my.setStorageSync({
                              key: 'token',
                              data: res.data.access_token
                        });
                    that.GetUserModel()
                    that.GetTaskList()
              }
           })
           
			   },
			  });
      }
      if(options.type){
        //收藏
				if(options.type=='s'){
					this.Id=my.getStorageSync({ key: 'Id' }).data
					this.AddReward()
				}
			}
    // 页面加载
  
  },
  login(userid){
         var that=this;
         my.getAuthCode({
			   scopes: 'auth_base', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
			   success: (result) => {
      //      console.log(result);
           request('/api/v2/Login/GetAliUserSilent/GetAliUserSilent','GET',{auth_code:result.authCode,puserid:userid,appid:'2021002135640940'}).then(res=>{
             if(res.success){
                console.log('后端返回个人信息',res.data.access_token);
                my.setStorageSync({
                      key: 'token',
                      data: res.data.access_token
                });
						that.GetUserModel()
						that.GetTaskList()
					}
           })
           
			   },
			  });
  },

  onRenderSuccess(e){
    console.log('阿里图片广告加载成功',e)
    if(e.detail.height>0){
          this.setData({
            alBanShow:true
          })
    }
  },
  onRenderSuccess_rwwc(e){
     console.log('任务完成阿里图片广告加载成功',e)
    if(e.detail.height>0){
          this.setData({
            rw_alBanShow:true
          })
    }else{
       this.setData({
            rw_alBanShow:false
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
  //tab跳转
  tabJump(e){
    let index=e.currentTarget.dataset.index;
    if(index==1){
        my.navigateTo({
          url: '/pages/child/invitation/invitation'
        });return
    }
    if(index==3){
        my.navigateTo({
          url: '/pages/child/exchange/exchange'
        });return
    }
  },	
  jump_left(e){
     let index=e.currentTarget.dataset.index;
     if(index==0){
         my.navigateTo({
        url:'/pages/child/sign/sign'
      });return
     }
     if(index==1){
        this.setData({
          number:1
        })
     }
      if(index==2){
         my.navigateTo({
        url:'/pages/child/rwCenter/rwCenter'
      });return
     }
     
},
  right_jump(e){
     let index=e.currentTarget.dataset.index;
    if(index==0){
        my.navigateTo({
        url:'/pages/child/signRule/signRule'
      });return;
    }
     if(index==1){
        my.navigateTo({
        url:'/pages/child/balance/balance'
      });return;
    }
    
  },
  closeModal(){
    this.setData({
      modalShow:false,
      modalname:''
    })
  },
  //获取任务数据
  GetTaskList(){
    	request('/api/v2/Activity/GetTaskList/GetTaskList','GET',{TaskArea:'dh&',page:this.page,size:this.size},
				).then(dh=>{
					if(dh.success){
						let navList=dh.data;
						for(var i=0;i<navList.length;i++){
							navList[i].IsDone=true
            }
              this.setData({
               navList:navList
             })
					}
        })
      	request('/api/v2/Activity/GetTaskList/GetTaskList','GET',{TaskArea:'rw&',page:this.page,size:this.size},
				).then(rw=>{
					if(rw.success){
             this.setData({
               rwlist:rw.data
             })
              my.uma.trackEvent('zhibo_01',{'show':1})
					}
        })
         request('/api/v2/Activity/GetTaskList/GetTaskList','GET',{TaskArea:'syaligg'},
				).then(syaligg=>{
					if(syaligg.success){
             this.setData({
               syalggList:syaligg.data
             })
					}
        })
         request('/api/v2/Activity/GetTaskList/GetTaskList','GET',{TaskArea:'tsrwgg'},
				).then(tsrwgg=>{
					if(tsrwgg.success){
            this.setData({
               tsrwggList:tsrwgg.data
             })
					}
        })
  },
  //点击去看直播
  go(){
    if(this.data.rwlist.length>0){
        this.setData({
          nowList:this.data.rwlist[0],
          modalShow:true,
          modalname:'start'
        })
    }else{
      my.alert({
        content:'今日任务已完成'
      })
    }
  },
  tabNav(e){
    console.log(e)
        let JumpType=e.currentTarget.dataset.JumpType;
        let item=e.currentTarget.dataset.item;
        var that=this;
				if(JumpType==1){
          if(item.IsDone==false){
              this.setData({
                          modalname:'life',
                          lifeImg:item.Img,
                          lifeTittle:item.Title,
                          lifeSutittle:item.Subtitle,
                          sceneId:item.Component
                    })
                  
               my.uma.trackEvent('zhibo_01',{'click':1})
          }
          this.setData({
            Id:item.Id
          })
					console.log('关注生活号')
					return;
        }
				if(JumpType==2){
              console.log('收藏小程序')
              my.setStorageSync({
                          key: 'Id',
                          data: item.Id
                });
                if(item.IsDone==false){
                  this.setData({
                      BrowseTime:item.BrowseTime,
                      Id:item.Id
                  })
                  that.watchTaobo();
                  my.uma.trackEvent('zhibo_01',{'click':1})
              }
              my.navigateToMiniProgram({
                appId:item.APPID,
                path:item.AliAdvertisingLink,
                success:(res)=> {
                }
              })
					return;
        }
				if(JumpType==3){
          console.log('跳转小程序评价')
           if(item.IsDone==false){
            this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
            })
            that.watchTaobo();
						my.uma.trackEvent('zhibo_01',{'click':1})
					}
					my.navigateToMiniProgram({
						appId:item.APPID,
						path:item.AliAdvertisingLink,
						success:(res)=> {
							// that.watchTaobo()
						}
					})
					return;
				}
				if(JumpType==4){
					console.log('跳转直播间')
					 if(item.IsDone==false){
            this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
            })
            that.watchTaobo();
						my.uma.trackEvent('zhibo_01',{'click':1})
					}
					my.ap.navigateToAlipayPage({
						path:'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D20000067%2526url%3Dhttps://api.shupaiyun.com/jumptb1.html?id='+item.Id,
						// path:'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D20000067%2526url%3Dhttp://192.168.0.132:8848/tb/jump2.html?id='+item.Id,
						success:(res) => {
							
					        // my.alert({content:'系统信息' + JSON.stringify(res)});
					    },
					    fail:(error) => {
					        // my.alert({content:'系统信息' + JSON.stringify(error)});        
					    }
					})
					
					return;
				}
				if(JumpType==5||JumpType==6){
          //生活号文章-h5
           if(item.IsDone==false){
            this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
            })
            that.watchTaobo();
						my.uma.trackEvent('zhibo_01',{'click':1})
					}
					my.ap.navigateToAlipayPage({
						path:item.AliAdvertisingLink,
						success:(res) => {
					      
					    },
					    fail:(error) => {
					        // my.alert({content:'系统信息' + JSON.stringify(error)});        
					    }
					})
					return;
				}
			
        if(JumpType==7){
          console.log('添加桌面');
           my.setStorageSync({
                          key: 'zid',
                          data: item.Id
                });
          this.setData({
            RewardAmount:item.RewardAmount,
            modalname:'zhuomian'
          })
           my.uma.trackEvent('zhibo_01',{'click':1})
           return;
				}
				if(JumpType==8){
					my.navigateTo({
						url:'../child/sign/sign'
					})
					return;
				}
				if(JumpType==9){
					console.log('跳转金币明细')
					my.navigateTo({
						url:'../child/balanceDetail/balanceDetail'
					})
					return;
				}
				if(JumpType==10){
					console.log('跳转邀请好友')
					// my.navigateTo({
					// 	url:'../invation/invation'
					// })
					my.navigateTo({
						url:'../child/invitation/invitation?taskid='+item.Id
					})
					return;
        }
        if(JumpType==11){
          console.log('跳转其他小程序');
           if(item.IsDone==false){
            this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
            })
            that.watchTaobo();
						my.uma.trackEvent('zhibo_01',{'click':1})
					}
              my.navigateToMiniProgram({
                  appId: item.APPID,
                  path: item.AliAdvertisingLink,
                  success: (res) => {
                    console.log(JSON.stringify(res))
                  },
                  fail: (res) => {
                    console.log(JSON.stringify(res))
                  }
             });
					return;
        }
        if(JumpType==12){
            console.log(item);
            if(item.AliAdvertisingLink){
                my.navigateTo({
                  url:item.AliAdvertisingLink
                })
            }else{
              my.alert({
                content:'参数有误,请联系管理人员'
              })
            }
            return;
        }
      },
      //点击阿里广告第一次
			jump_banner(e){
        console.log('e',e);
        let num=e.currentTarget.dataset.num;
         let modalInfo=e.currentTarget.dataset.modalInfo;
          let item=e.currentTarget.dataset.item;
				console.log('您点击了广告',num,modalInfo)
				if(this.data.userInfo.NumberCompletions>=num&&modalInfo==false){
          console.log('有收益');
          this.setData({
                BrowseTimets:item.BrowseTime,
                Id:item.Id
          })
					this.watchTaobo3()
				}
      },
       watchTaobo3(){
				var that=this;
				//获取当前时间戳  
				    var timestamp = Date.parse(new Date());  
            timestamp = timestamp / 1000;
            this.setData({
                timets:timestamp,
				        modalname:''
            })
				    console.log("当前时间戳为：" + timestamp); 
				    
      },
			//点击阿里广告第二次
			jump_bannerSecond(e){
        let num=e.currentTarget.dataset.num;
         let modalInfo=e.currentTarget.dataset.modalInfo;
          let item=e.currentTarget.dataset.item;
				console.log('您点击了广告',num,modalInfo)
				if(this.data.userInfo.NumberCompletions>=num&&modalInfo==false){
          console.log('有收益');
          this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
          })
					this.watchTaobo()
				}
      },
      watchTaobo(){
				var that=this;
				//获取当前时间戳  
				    var timestamp = Date.parse(new Date());  
            timestamp = timestamp / 1000;  
             console.log("当前时间戳为：" + timestamp); 
             this.setData({
                  time:timestamp
             })
      },
      //默认增加金币/集分宝接口
			 AddReward(){
         var that=this;
          request('/api/v3/Activity/AddReward/AddReward','POST',{ taskId: this.data.Id}).then(res=>{
            if(res.success){
                console.log('增加金币成功')
                console.log(res);
                setTimeout(()=>{
                  that.GetTaskList();
                  that.GetUserModel();
                },1000)
                this.setData({
                    modalname:'',
                    time:'',
                    Id:'',
                    BrowseTime:'',
                    RewardAmount:res.data.RewardAmount,
                    modalType:res.data.Type,
                    modalShow:true
                })
              
                my.uma.trackEvent('zhibo_01',{'success':1});
                }else{
                    my.showToast({
                       type: 'none',
                      content:res.data.msg,
                    })
              }
          })
      },
  gl(){
    this.setData({
      number:this.data.number+1
    })
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    var token=my.getStorageSync({ key: 'token' }).data;
    if(token){
      this.GetUserModel();
      this.GetTaskList();
    }

     if(this.data.time){
					var timestamp = Date.parse(new Date());
					timestamp = timestamp / 1000; 
					let useTime=timestamp-this.data.time;
					console.log('useTime',useTime)
				if(useTime>=this.data.BrowseTime){
					console.log('观看时间达到条件')
					this.AddReward();
					//当前观看的时间大于等于接口返回的条件时间数，请求添加收益接口
				}else{
					my.alert({
						content:'访问'+this.data.BrowseTime+'秒以上才能领取奖励哦'
          })
          this.setData({
            time:'',
            timets:''
          })
        }
         return;
      }
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
   onShareAppMessage() {
			return{
				title:'开心直播',
				path:'pages/index/index?userid='+this.data.userInfo.AliAppletOpenId,
				desc:'开心直播',
				bgImgUrl:'/static/image/fx.webp'
			}
    },
});
