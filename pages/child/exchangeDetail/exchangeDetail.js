import request from '../../../http.js';
Page({
  data: {
    page:1,
    size:10
  },
  onLoad() {
    this.GetMyActivityLottery()
  },
  onReachBottom() {
			this.data.page++;
			this.GetMyActivityLottery(true)
  },
  //余额明细接口
			 GetMyActivityLottery(concat=false){
				 var that=this;
				 var page=that.data.page;
         var size=that.data.size;
         request('/api/v2/User/GetMyActivityLottery','GET',{page:page,size:size}).then(res=>{
            if(res.success&&res.data.length>0){
                that.setData({
                    noMore:false
                })
							if(!concat){
                that.setData({
                  list:res.data
                })
							}else{
                that.setData({
                  list:that.data.list.concat(res.data)
                })
								
							}
						}else{
              that.setData({
                	noMore:true,
							    page:that.data.page-1
              })
						
						}
         })
			}
});
