<!-- 我的 -->
<template>
	<!-- 整个的盒子 -->
	<view class="home_web">
		<!-- 头部显示 -->
		<view class="topBar_user" @tap="top_Bar_info()">
			<image src="../../static/images/background.jpg"></image>
			<view class="head_photo">
				<u-avatar :src="avatar" @tap="preAvatar" class="head" v-if="avatar" :sex-icon="m_or_w" :show-sex="true" size="160" style="border: 5rpx solid #FFFFFF;"></u-avatar>
				<view class="username">{{name}}</view>
				<view class="head_star">
					<view class="star">星星</view>
					<view class="num"><span>×</span>1</view>
				</view>
			</view>
			<!-- 更换图片-->
			<view>
				<u-action-sheet :list="list" v-model="show" :z-index="100" @click="click"></u-action-sheet>
			</view>
		</view>
		<!-- 内容 -->
		<view class="home_data">
			<view class="data_con" hover-class="data_con_hover" @click="navigateToSetData">
				<image src="../../static/images/data_set.png"></image>
				<view class="txt_con">资料修改</view>
			</view>
			<view class="data_con" hover-class="data_con_hover">
				<image src="../../static/images/jewel.png"></image>
				<view class="txt_con">升级高级账户</view>
			</view>
		</view>
		<view class="home_data">
			<view class="data_con" hover-class="data_con_hover">
				<image src="../../static/images/notice.png"></image>
				<view class="txt_con">系统通知</view>
			</view>
		</view>
		<view class="home_data">
			<view class="data_con" hover-class="data_con_hover">
				<image src="../../static/images/good.png"></image>
				<view class="txt_con">好评鼓励</view>
			</view>
			<view class="data_con" hover-class="data_con_hover">
				<image src="../../static/images/more.png"></image>
				<view class="txt_con">更多功能</view>
			</view>
			<view class="data_con" hover-class="data_con_hover">
				<image src="../../static/images/seting.png"></image>
				<view class="txt_con">设置</view>
			</view>
			<view class="data_con" hover-class="data_con_hover">
				<image src="../../static/images/share.png"></image>
				<view class="txt_con">分享给朋友</view>
			</view>
		</view>
		<view class="home_data">
			<u-button type="error" style="margin: 0 100rpx;" @click="quit()">退出登录</u-button>
		</view>
		<view class="footer"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				m_or_w:'man',
				list: [{
					text: '更换背景',
					color: '#909399',
					fontSize: 22
				}, {
					text: '更换头像'
				}],
				show: false,
				avatar: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg',
				name: 'return',
				isfirst: true,
			}
		},
		created() {
			uni.$on('uAvatarCropper', path => {
				this.avatar = path;
			}),
			this.getName(),
			this.name = uni.getStorageSync('username')
		},
		onLoad: function(options) {
			 // let name = uni.getStorageSync('name');
			 let sex = uni.getStorageSync('sex');
			 if(name){
				 this.name = name
			 }else{
				 this.name = "return"
			 }
			 if(sex == '女'){
			 	this.m_or_w = "woman"
			 }else{
			 	this.m_or_w = "man"
			 }
		},
		onPullDownRefresh() {
			console.log('refresh');
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			getName(){
				var id = uni.getStorageSync('id')
				console.log(id)
				uni.request({
					url:'http://127.0.0.1:3000/getName/?id='+id,
					method:'GET',
					success(res) {
						console.log(res.data[0])
						uni.setStorageSync('username',res.data[0].username)
						if(res.data[0].sex == '女'){
							this.m_or_w = "woman"
						}else{
							this.m_or_w = "man"
						}
					}
				})
			},
			top_Bar_info() {
				this.show = true
			},
			navigateToSetData(){
				uni.navigateTo({
					url:'../setdata/setdata?username='+this.name
				});
			},
			quit(){
				uni.removeStorageSync('token');
				uni.removeStorageSync('username');
				uni.removeStorageSync('id');
				uni.navigateTo({
					url:'../login/login'
				});
			},
			click(index) {
				if (index == 1) {
					uni.navigateTo({
						url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
						params: {
							// 输出图片宽度，高等于宽，单位px
							destWidth: 300,
							// 裁剪框宽度，高等于宽，单位px
							rectWidth: 200,
							// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
							fileType: 'jpg',
						}
					})
				}
			},
			qualityChange(index) {
				this.quality = index == 0 ? 0.3 : index == 1 ? 0.7 : 1;
			},
			styleChange(index) {
				if (index == 0) {
					this.rectHeight = this.rectWidth = this.destHeight = this.destWidth = 200;
					this.boundStyle = {
						lineWidth: 8,
						borderColor: this.$u.color['error'],
						mask: 'rgba(0, 0, 0, 0.8)'
					}
				} else {
					this.rectHeight = this.rectWidth = this.destHeight = this.destWidth = 400;
					this.boundStyle = {
						lineWidth: 4,
						borderColor: 'rgb(245, 245, 245)',
						mask: 'rgba(0, 0, 0, 0.35)'
					}
				}
			},
			preAvatar() {
				wx.previewImage({
					current: '', // 当前显示图片的 http 链接
					urls: [this.avatar] // 需要预览的图片 http 链接列表
				})
			}
		}
	}
</script>

<style>
	.home_web {
		width: 100%;
		background-color: #f4f4f5;
	}

	.topBar_user {
		width: 100%;
		height: 400rpx;
		position: relative;
	}

	.topBar_user image {
		width: 100%;
		height: 100%;
	}

	.topBar_user .head {
		margin: 20rpx;
	}

	.topBar_user .head_photo {
		width: 200rpx;
		height: 300rpx;
		position: absolute;
		left: 37%;
		top: 20%;
		color: #fff;
	}

	.topBar_user .head_photo .username {
		text-align: center;
	}

	.topBar_user .head_photo .head_star {
		display: flex;
		font-size: 23rpx;
		margin: 0 auto;
		width: 140rpx;
	}

	.topBar_user .head_photo .head_star .star {
		position: relative;
	}

	.topBar_user .head_photo .head_star .star::after {
		content: "";
		background: url(../../static/images/star.png) no-repeat;
		width: 35rpx;
		height: 35rpx;
		display: block;
		position: absolute;
		left: 50rpx;
		top: 0;
	}

	.topBar_user .head_photo .head_star .num span {
		font-size: 10rpx;
	}

	.topBar_user .head_photo .head_star .num {
		margin-left: 40rpx;
	}
	
	/* 修改内容 */
	.home_web .home_data {
		width: 100%;
		margin-top: 40rpx;
	}

	.home_web .home_data .data_con {
		background-color: #fff;
		height: 80rpx;
		padding: 10rpx 30rpx;
		display: flex;
	}
	
	.home_web .home_data .data_con_hover{
		opacity: 0.9;
		background-color: #ccc;
	}

	.home_web .home_data .data_con image {
		width: 35rpx;
		height: 35rpx;
		margin-top: 15rpx;
	}

	.home_web .home_data .data_con .txt_con {
		width: 86%;
		padding: 10rpx 0 0 0;
		position: relative;
		margin-left: 25rpx;
		font-size: 30rpx;
	}
	
	.home_web .home_data .data_con .txt_con::after {
		content: "";
		position: absolute;
		bottom: 0px;
		left: 0px;
		right: 0px;
		border-bottom: 1px solid #C0C0C0;
		-webkit-transform: scaleY(.3);
		-webkit-transform-origin: 0 0;
	}
	.home_web .home_data .data_con .txt_con::before{
		content: "";
		width: 30rpx;
		background-color: #ccc;
		position: absolute;
		right: -40rpx;
		top: 15rpx;
		height: 30rpx;
		background: url(../../static/images/right.png) no-repeat;
	}
	.home_web .home_data:last-child{
		height: 150rpx;
	}
	.footer{
		height: 50rpx;
		margin-top: 90rpx;
	}
</style>
