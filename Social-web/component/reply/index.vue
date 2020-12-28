<template name='reply'>
	<view class="reply-box" @click="show = true">
		<view class="item" v-for="(item, index) in replyList" :key="item.index">
			<view class="username">{{item.name}}</view>
			<view class="text">{{item.text}}</view>
			<u-popup v-model="show" mode="center" border-radius="14" height="400" width="500" closeable="true">
				<view class="addCom">
					<p>添加评论:</p>
					<u-input v-model="value" :type="type" :border="border" :clearable="false" height="260"/>
					<u-button type="info" size="mini" @click="sendInfo(value,item.id)">发送</u-button>
				</view>
			</u-popup>
		</view>
		<view>
			<u-toast ref="uToast" />
		</view>
		<!-- v-if="res.replyList != undefined" -->
		<view class="all-reply">
			共{{replyList.length}}条评论
			<u-icon class="more" name="arrow-right" :size="26"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'reply',
		props: ["id"],
		data() {
			return {
				replyList: [],
				show: false,
				value: '',
				type: 'textarea',
				border: false
			}
		},
		created() {
			this.getSecond()
		},
		methods: {
			//发送评论
			sendInfo(value,id){
				if(value.length==0){
					this.$refs.uToast.show({
						title: '请输入内容',
						type: 'error'
					})
				}else{
					console.log(id)
					var name = uni.getStorageSync('username')
					var vm = this
					uni.request({
						url:'http://127.0.0.1:3000/innerSec',
						data:{
							id:id,
							name:name,
							text:value
						},
						method:'POST',
						success:res=> {
							console.log(res.data.affectedRows)
							if(res.data.affectedRows>0){
								this.$refs.uToast.show({
									title: '发布成功',
									type: 'success'
								})
								vm.show = false
								vm.getSecond()
							}else{
								this.$refs.uToast.show({
									title: '发布失败',
									type: 'error'
								})
							}
						}
					})
				}
			},
			//获取子评论
			getSecond() {
				var vm = this
				uni.request({
					url: 'http://127.0.0.1:3000/showSec?id=' + vm.id,
					method: 'GET',
					success: res => {
						// console.log(res.data)
						vm.replyList = res.data
						// console.log(vm.replyList)
					}
				})
			}
			// 跳转到全部回复
			// toAllReply() {
			// 	uni.navigateTo({
			// 		url: '../reply/reply'
			// 	});
			// }
		},
	}
</script>

<style lang="scss" scoped>
	.addCom{
		width: 450rpx;
		height: 400rpx;
		padding: 20rpx;
	}
	.reply-box {
		background-color: rgb(242, 242, 242);
		border-radius: 12rpx;

		.item {
			padding: 20rpx;
			border-bottom: solid 2rpx $u-border-color;

			.username {
				font-size: 24rpx;
				color: #999999;
			}
		}

		.all-reply {
			padding: 20rpx;
			display: flex;
			color: #5677fc;
			align-items: center;

			.more {
				margin-left: 6rpx;
			}
		}
	}
</style>
