<template>
	<div class="login_container">
		<!-- 头部 -->
		<div class="login_head">
			<image src="../../static/images/moon.jpg"></image>
		</div>
		<!-- 账号密码输入框 -->
		<div class="login_content">
			<div class="login_show">
				<u-form :model="form" ref="uForm">
					<u-form-item label="用户名" style="color: #fff;" label-width="100">
						<input type="text" v-model="username" style="font-size: 24rpx;width: 500rpx;" placeholder="请输入用户名" placeholder-class="selected"/>
					</u-form-item>
					<u-form-item label="密码" style="color: #fff;" label-width="100">
						<input type="password" v-model="password" style="font-size: 24rpx;width: 500rpx;" placeholder="请输入密码" placeholder-class="selected"/>
					</u-form-item>
				</u-form>
				<u-button type="primary" style="margin-top: 40rpx;" @click="goToIndex()">登录</u-button>
				<p @click="goToResiger()">注册新用户</p>
				<view>
					<u-toast ref="uToast" />
				</view>
			</div>
		</div>
		<!-- 其他内容登录 -->
		<div class="login_footer">
			<div class="text">
				<p>关联社交账号快速登录</p>
				<div class="show_con">
					<image src="../../static/images/QQ.png"></image>
					<image src="../../static/images/wx.png"></image>
					<image src="../../static/images/weibo.png"></image>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				value: '',
				type: 'text',
				border: false,
				username:'',
				password:''
			}
		},
		methods: {
			goToResiger() {
				uni.navigateTo({
					url:'../resiger/resiger'
				});
			},
			goToIndex() {
				var vm = this
				const token = uni.getStorageSync('token');
				uni.request({
					url: 'http://127.0.0.1:3000/login', //仅为示例，并非真实接口地址。
					data: { //参数
						username: vm.username,
						password: vm.password
					},
					// header: {
					// 	'authorization': token //自定义请求头信息
					// },
					method: 'POST', //请求方式  或GET
					success: res => {
						console.log(res.data);
						uni.setStorageSync('id',res.data.result[0].id);
						uni.setStorageSync('token',res.data.token);
						uni.setStorageSync('username',res.data.username);
						if (res.data.result.length>0) {
							vm.$refs.uToast.show({
								title: '登录成功',
								type: 'success',
								url:'/pages/index/index',
								isTab:'true'
							})
						}else{
							vm.$refs.uToast.show({
								title: '登录失败',
								type: 'error'
							})
						}
					}
				});
			}
		},
	}
</script>

<style scoped>
	.login_container {
		width: 750rpx;
		height: 1334rpx;
		background-color: #212E3F;
	}

	.login_head {
		width: 100%;
		height: 450rpx;
		background-color: #212E3F;
		position: relative;
	}

	.login_head image {
		position: absolute;
		margin: auto;
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.login_content {
		width: 100%;
		height: 400rpx;
		position: relative;
	}

	.login_content .login_show {
		position: absolute;
		margin: auto;
		height: 400rpx;
		width: 80%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	
	/deep/ .selected{
		color: #fff;
		font-size: 25rpx;
		margin-top: 5rpx;
	}
	.login_show p{
		color: #fff;
		float: right;
		margin-top: 30rpx;
		opacity: .7;
	}
	.login_footer{
		position: relative;
		width: 100%;
		height: 350rpx;
	}
	.login_footer .text{
		position: absolute;
		width: 80%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
	}
	.login_footer .text p{
		color: #fff;
		text-align: center;
		opacity: .7;
		margin-top: 50rpx;
		position: relative;
	}
	.login_footer .text p:before{
		content: '';
		width: 150rpx;
		border: 1rpx solid #fff;
		position: absolute;
		left: 0;
		top: 20rpx;
	}
	.login_footer .text p:after{
		content: '';
		width: 150rpx;
		border: 1rpx solid #fff;
		position: absolute;
		right: 0;
		top: 20rpx;
	}
	.login_footer .show_con{
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 70%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
	}
	.login_footer .show_con image{
		margin-top: 80rpx;
		width: 100rpx;
		height: 100rpx;
	}
</style>
