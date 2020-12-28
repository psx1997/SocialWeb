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
						<input type="text" style="font-size: 24rpx;width: 500rpx;" placeholder="请输入用户名" placeholder-class="selected"
						 v-model="username" />
					</u-form-item>
					<u-form-item label="密码" style="color: #fff;" label-width="100">
						<input type="password" style="font-size: 24rpx;width: 500rpx;" placeholder="请输入密码" placeholder-class="selected"
						 v-model="password" />
					</u-form-item>
				</u-form>
				<u-button type="primary" style="margin-top: 40rpx;" @click="addUser()">注册</u-button>
				<p @click="goToLogin()">返回登录</p>
				<view>
					<u-toast ref="uToast" />
				</view>
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
				username: '',
				password: ''
			}
		},
		methods: {
			goToLogin() {
				uni.navigateTo({
					url: '../login/login'
				});
			},
			addUser() {
				let reg_user = /^[a-zA-Z]\w{5,12}$/
				let reg_pwd = /^\d{6,18}$/
				let sign_user = RegExp(reg_user).test(this.username);
				let sign_pwd = RegExp(reg_pwd).test(this.password);
				if (!sign_user || this.username == '') {
					uni.showToast({
						title: '请检查用户名,用户名是6到13位的字母',
						duration: 2000,
						icon: 'none'
					});
				} else if (!sign_pwd || this.password == '') {
					uni.showToast({
						title: '请检查密码,密码是6到18位的数字',
						duration: 2000,
						icon: 'none'
					});
				} else {
					var vm = this
					uni.request({
						url: 'http://127.0.0.1:3000/verifyUser',
						data: {
							username: vm.username
						},
						method: 'POST',
						success: res => {
							// console.log(res.data[0].count)
							if (res.data[0].count >= 1) {
								vm.$refs.uToast.show({
									title: '用户名已经存在',
									type: 'error'
								})
							}else{
								uni.request({
									url: 'http://127.0.0.1:3000/addUser', //仅为示例，并非真实接口地址。
									data: { //参数
										username: vm.username,
										password: vm.password
									},
									header: {
										'custom-header': 'hello' //自定义请求头信息
									},
									method: 'POST', //请求方式  或GET
									success: res => {
										// console.log(res.data);
										if (res.data.affectedRows > 0) {
											vm.$refs.uToast.show({
												title: '注册成功',
												type: 'success',
												url: '/pages/login/login'
											})
										} else {
											vm.$refs.uToast.show({
												title: '注册失败',
												type: 'error'
											})
										}
									}
								});
							}
						}
					})
					// uni.request({
					// 	url: 'http://127.0.0.1:3000/addUser', //仅为示例，并非真实接口地址。
					// 	data: { //参数
					// 		username: vm.username,
					// 		password: vm.password
					// 	},
					// 	header: {
					// 		'custom-header': 'hello' //自定义请求头信息
					// 	},
					// 	method: 'POST', //请求方式  或GET
					// 	success: res => {
					// 		console.log(res.data);
					// 		if (res.data.affectedRows > 0) {
					// 			vm.$refs.uToast.show({
					// 				title: '注册成功',
					// 				type: 'success',
					// 				url: '/pages/login/login'
					// 			})
					// 		} else {
					// 			vm.$refs.uToast.show({
					// 				title: '注册失败',
					// 				type: 'error'
					// 			})
					// 		}
					// 	}
					// });
				}
			}
		},
		onReady() {

		},
		created() {

		}
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

	/deep/ .selected {
		color: #fff;
		font-size: 25rpx;
		margin-top: 5rpx;
	}

	.login_show p {
		color: #fff;
		float: right;
		margin-top: 30rpx;
		opacity: .7;
	}
</style>
