<template>
	<view class="write_container">
		<view class="write_border" :style="{ height: !show_textarea ? '200rpx' : '500rpx' }">
			<view class="write_top">
				<image src="../../static/images/user.jpg"></image>
				<view class="txt" v-if="!show_textarea">写点什么</view>
				<image src="../../static/images/turn_down.png" @click="changeShow" v-if="show_textarea"></image>
			</view>
			<view class="write_content">
				<textarea placeholder="写点什么吧" v-model="value" style="height: 100%;" v-if="show_textarea" maxlength="500" />
				<view style="width: 100%;height: 100%;" v-else @click="changeShow">{{ value }}</view>
				</view>
			<view class="write_bottom">
				<view class="txt" v-if="show_textarea" style="animation: fadeIn 1.5s;">{{address}}</view>
				<view class="bottom_icon" v-if="show_textarea">
					<image src="../../static/images/location.png" v-if="show_textarea" style="animation: fadeIn 1.5s;" @click="goToGetLocation"></image>
					<button v-if="show_textarea" style="animation: fadeIn 1.5s;" @click="goToDiary()">发送</button>
				</view>
			</view>
		</view>
		<view class="write_pic">
			<image src="../../static/images/write_diary.png"></image>
		</view>
		<view class="write_txt">
			<view class="cir1"><image src="../../static/images/load.png"></image></view>
			<view class="txt">开始写下你的日记吧,发布后的日记将会在我的日记中显示</view>
			<view class="cir2"><image src="../../static/images/load.png"></image></view>
		</view>
		<view>
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	export default {
	 data() {
	  return {
		show_textarea: false,
		value:"",
		latitude:"",
		longitude:"",
		address:"宁波"
	  };
	 },
	 methods: {
	  changeShow() {
	   this.show_textarea = !this.show_textarea;
	  },
	  checkTime(i){
	  	if (i < 10) {
	  	    i = '0' + i
	  	  }
	  	  return i
	  },
	  goToDiary(){
		  // uni.reLaunch({
		  // 	url:'../diary/diary'
		  // });
		  // uni.setStorageSync('content', this.value);
		  // uni.setStorageSync('address', this.address);
		  let reg_text = /^[\u4e00-\u9fa5`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]{1,30}$/
		  let sign_text = RegExp(reg_text).test(this.value);
		  if (!sign_text || this.value == '') {
		  	uni.showToast({
		  		title:'请输入1到30位的内容',
		  		duration: 2000,
		  		icon:'none'
		  	});
		  }else{
			  var vm = this
			  var d = new Date();
			  var date = d.getFullYear() + '-' + vm.checkTime(d.getMonth() + 1) + '-' + vm.checkTime(d.getDate())
			  console.log(date)
			  var id = uni.getStorageSync('id')
			  console.log(id)
			  uni.request({
			  	url:'http://127.0.0.1:3000/addDiary',
			  			data:{
			  				id:id,
			  				title:vm.value,
			  				address:vm.address,
			  				date:date
			  			},
			  			method:'POST',
			  			success:res=> {
			  				console.log(res.data)
			  				if (res.data.affectedRows>0) {
			  					vm.$refs.uToast.show({
			  						title: '添加成功',
			  						type: 'success',
			  						url:'/pages/diary/diary',
			  						isTab:'true'
			  					})
			  				}else{
			  					vm.$refs.uToast.show({
			  						title: '添加失败',
			  						type: 'error',
			  					})
			  				}
			  			},
			  			fail:err=>{
			  				console.log(err)
			  			}
			  });
		  }
		  
	  },
	  goToGetLocation(){
		  var vm = this
		  uni.getLocation({
			success: function(res){
		  	vm.latitude = res.latitude
		  	vm.longitude = res.longitude
			},
			fail:function(error){
			console.log(error)
			}
		  });
		  uni.chooseLocation({
			latitude: vm.latitude,
			longitude: vm.longitude,
		  	success:function(res){
				vm.address=res.name
		  	},
			fail:function(error){
				console.log(error)
			}
		  })
	  }
	 }
	};
</script>

<style>
	.write_container{
		height: 1250rpx;
		background-color: #F1F1F1;
		width: 100%;
		padding: 20rpx;
	}
	.write_container .write_border{
		background-color: #fff;
		height: 200rpx;
		margin-top: 10rpx;
		border-radius: 10rpx;
		box-shadow:  darkgrey 0px 0px 10px 1px ;
		transition: height 1s;
		padding: 20rpx;
	}
	.write_container .write_border .write_top{
		height: 60rpx;
		width: 100%;
		display: flex;
		border-bottom: ;
	}
	.write_container .write_border .write_top image{
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
	}
	.write_container .write_border .write_top image:last-child{
		width: 40rpx;
		height: 40rpx;
		border-radius: 0;
		margin-left: 580rpx;
		margin-top: 10rpx;
	}
	.write_container .write_border .write_top .txt{
		line-height: 60rpx;
		margin-left: 20rpx;
	}
	.write_container .write_border .write_content{
		height: 300rpx;
		padding-top: 20rpx;
		margin-top: 10rpx;
		border-top: 1rpx solid #ccc;
	}
	.write_container .write_border .write_bottom{
		height: 90rpx;
		margin-top: 5rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.write_container .write_border .write_bottom .txt{
		color: #999999;
		font-size: 23rpx;
		margin-left: 5rpx;
	}
	.write_container .write_border .write_bottom .bottom_icon{
		height: 80rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.write_container .write_border .write_bottom image{
		width: 50rpx;
		height: 50rpx;
		margin-top: 20rpx;
	}
	.write_container .write_border .write_bottom .bottom_icon button{
		background-color: #19BE6B;
		width: 120rpx;
		height: 60rpx;
		color: #fff;
		font-size: 25rpx;
		line-height: 60rpx;
		margin-bottom: 50rpx;
		margin-top: 5rpx;
		margin-left:500rpx;
	}
	@keyframes fadeIn {
		0% { opacity: 0 }
		15% {opacity: 0 }
		35% {opacity: 0.1 }
		45% {opacity: 0.2 }
		55% {opacity: 0.3 }
		75% {opacity: 0.5 }
		100% { opacity: 1 }
	}
	.write_container .write_pic{
		text-align: center;
		width: 100%;
	}
	.write_container .write_pic image{
		width: 500rpx;
		height: 500rpx;
	}
	.write_container .write_txt{
		display: flex;
	}
	.write_container .write_txt .cir1{
		width: 25%;
	}
	.write_container .write_txt .cir1 image{
		width: 70rpx;
		height: 60rpx;
		margin-top: 10rpx;
		margin-left: 50rpx;
	}
	.write_container .write_txt .cir2{
		width: 25%;
	}
	.write_container .write_txt .cir2 image{
		width: 70rpx;
		height: 60rpx;
		margin-top: 10rpx;
		margin-left: 50rpx;
	}
	.write_container .write_txt .txt{
		width: 50%;
		color: #808080;
		text-align: center;
	}
</style>
