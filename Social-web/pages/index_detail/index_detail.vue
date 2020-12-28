<template>
	<view class="detail_container">
		<!-- 顶部导航栏 -->
		<view class="topBar">
			<u-navbar back-text="返回" title="提问详情" :background="background" title-color="#fff" back-icon-color="#fff"
			 :back-text-style="color">
				<image src="../../static/images/three.png" @click="show=true"></image>
			</u-navbar>
		</view>
		<!-- 内容 -->
		<view class="content_con" :style="{height:!showheight?'500rpx':'650rpx'}" style="transition: height 1s;">
			<view class="content_top">
				<image src="../../static/images/people.png"></image>
				<view class="txt">匿名提问</view>
				<view class="time">10-23 21:28</view>
			</view>
			<view class="content_title">
				<view class="ask">问</view>
				<view class="txt">{{def_data.title}}</view>
			</view>
			<view class="content" >
				<u-read-more  show-height="200" :toggle="true" :shadow-style="shadowStyle" text-indent="0.5em" @open="showheight=true" @close="showheight=false">
					<rich-text :nodes="content"></rich-text>
				</u-read-more>
			</view>
			<view class="content_bottom" v-if="showheight">
				<view class="txt">阅读数5</view>
			</view>
		</view>
		<view class="reply">
			<view class="comment" v-for="(res, index) in comList" :key="res.id">
				<view class="left"><image :src="res.date.url" mode="aspectFill"></image></view>
				<view class="right">
					<view class="top">
						<view class="name">{{ res.date.name }}</view>
						<view class="like" :class="{ highlight: res.date.isLike }">
							<view class="num">{{ res.date.likeNum }}</view>
							<u-icon v-if="!res.date.isLike" name="thumb-up" :size="30" color="#9a9a9a" @click="getLike1(index)"></u-icon>
							<u-icon v-if="res.date.isLike" name="thumb-up-fill" :size="30" @click="getLike1(index)"></u-icon>
						</view>
					</view>
					<view class="content">{{ res.date.text }}</view>
					<reply :id="res.date.id"></reply>
					<view class="bottom">
						{{ res.data.datetime }}
						<view class="reply">回复</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 反馈弹出 -->
		<u-action-sheet :list="list" v-model="show" border-radius="20"></u-action-sheet>
	</view>
</template>

<script>
	import reply from '../../component/reply/index.vue'
	export default {
		data() {
			return {
				id:'',
				def_data:[],
				commentList: [],
				comList:[],
				showheight:false,
				background: {
					backgroundColor: '#57B883'
				},
				shadowStyle: {
					backgroundImage: "none",
					paddingTop: "0",
					marginTop: "20rpx"
				},
				color: {
					color: '#fff'
				},
				list: [{
					text: '复制'
				}, {
					text: '举报'
				}, {
					text: '楼层跳转'
				}],
				show: false,
				content: `本人不想熬夜,可最近一段时间总是睡不着睡不好,
						  导致黑眼圈越来越严重。入睡困难,有一点动静就会醒,
						  好难受,脱发的问题也随之而来......
						  各位有没有什么好的办法可以快速入睡,通过百度,我查
						  到人用脑过度，或者经常心事重重，烦闷，或者遇到了
						  什么事儿，精神过于紧张，使脑子受到了很大的刺激，
						  有时候也会影响到头发营养的供应和生长。`
			}

		},
		onLoad(e) {
			this.getComment();
			this.id = e.id;
		},
		created(){
			this.getDef(),
			this.getCom(),
			console.log(this.comList)
		},
		components:{
			reply
		},
		methods: {
			getId(arr){
				// this.comList.forEach((item,index)=>{
					console.log(arr)
				// })
			},
			// 获取父评论
			getCom(){
				var vm = this
				uni.request({
					url:'http://127.0.0.1:3000/showCom',
					data:{
						id:vm.id
					},
					method:'POST',
					success:res=>{
						// console.log(res.data)
						// vm.comList = res.data
						let arr = res.data;
						let newArr = [];
						let newArr2 = [];
						arr.forEach(item=>{
							newArr.push(item)
						})
						arr.forEach(item=>{
							var obj = {};
							var date=new Date(item.date)
							obj.datetime = date.getFullYear() + '-' + vm.checkTime(date.getMonth() + 1) + '-' + vm.checkTime(date.getDate())
							newArr2.push(obj)
						})
						let newRes = [];
						newRes = newArr2.map((data, i) => ({
							data,
							date: newArr[i]
						}));
						// console.log(newRes)
						vm.comList = JSON.parse(JSON.stringify(newRes));
						// console.log(vm.comList)
						// getId(vm.comList)
					}
				})
			},
			checkTime(i) {
				if (i < 10) {
					i = '0' + i
				}
				return i
			},
			//获取文章内容
			getDef(){
				var vm = this
				uni.request({
					url:'http://127.0.0.1:3000/showDef?id='+vm.id,
					method:'GET',
					success:res=>{
						vm.def_data = res.data[0]
						vm.content = res.data[0].content
					}
				})
			},
			// 跳转到全部回复
			toAllReply() {
				uni.navigateTo({
					url: '../reply/reply'
				});
			},
			// 点赞
			getLike(index) {
				this.commentList[index].isLike = !this.commentList[index].isLike;
				if (this.commentList[index].isLike == true) {
					this.commentList[index].likeNum++;
				} else {
					this.commentList[index].likeNum--;
				}
			},
			getLike1(index) {
				this.comList[index].date.isLike = !this.comList[index].date.isLike;
				if (this.comList[index].date.isLike == true) {
					this.comList[index].date.likeNum++;
				} else {
					this.comList[index].date.likeNum--;
				}
			},
			// 评论列表
			getComment() {
				this.commentList = [
					{
						id: 1,
						name: '安可可乐',
						date: '10-25 18:58',
						contentText: '现在这个天气本来就容易掉头发',
						url: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
						allReply: 12,
						likeNum: 33,
						isLike: false,
						replyList: [
							{
								name: '三时の水',
								contentStr: '不要有压力,放平心态'
							},
							{
								name: '开心',
								contentStr: '可能是环境影响,不要想太多了'
							}
						]
					},
					{
						id: 2,
						name: '可爱的女骑士',
						date: '10-27 13:58',
						contentText: '可以喝一点蜂蜜水',
						allReply: 0,
						likeNum: 11,
						isLike: false,
						url: 'https://cdn.uviewui.com/uview/template/niannian.jpg',
					},
					{
						id: 3,
						name: 'Return',
						date: '11-01 16:28',
						contentText: '可以去夜跑缓解下压力',
						allReply: 0,
						likeNum: 21,
						isLike: false,
						allReply: 2,
						url: '../../../static/logo.png',
						replyList: [
							{
								name: '楼主',
								contentStr: '好的,谢谢'
							},
							{
								name: 'Return',
								contentStr: '要是觉得孤单,可以约上小伙伴'
							}
						]
					},
					{
						id: 4,
						name: 'CEO',
						date: '11-10 16:12',
						contentText: '年轻人不会有什么大问题的',
						url: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
						allReply: 0,
						likeNum: 150,
						isLike: false
					}
				];
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail_container {
		width: 100%;
	}

	.detail_container .topBar image {
		width: 50rpx;
		height: 40rpx;
		position: absolute;
		right: 20rpx;
	}

	.detail_container .content_con {
		width: 100%;
		padding: 20rpx;
	}

	.detail_container .content_con .content_top {
		height: 70rpx;
		display: flex;
		position: relative;
	}

	.detail_container .content_con .content_top image {
		width: 50rpx;
		height: 50rpx;
		padding: 10rpx;
	}

	.detail_container .content_con .content_top .txt {
		line-height: 70rpx;
		font-size: 26rpx;
		margin-left: 20rpx;
	}

	.detail_container .content_con .content_top .time {
		position: absolute;
		line-height: 70rpx;
		color: #808080;
		font-size: 24rpx;
		right: 10rpx;
	}

	.detail_container .content_con .content_title {
		height: 60rpx;
		width: 100%;
		margin-top: 5rpx;
		display: flex;
		padding: 10rpx;
	}

	.detail_container .content_con .content_title .ask {
		padding: 2.5rpx;
		width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
		padding-left: 7rpx;
		background-color: #57B883;
		color: #fff;
	}

	.detail_container .content_con .content_title .txt {
		margin-left: 20rpx;
		letter-spacing: 3rpx;
	}

	.detail_container .content_con .content {
		width: 100%;
		margin-top: 10rpx;
	}
	.detail_container .content_con .content_bottom {
		width: 100%;
		height: 70rpx;
		margin-top: 20rpx;
		position: relative;
	}
	.detail_container .content_con .content_bottom .txt{
		color: #808080;
		font-size: 24rpx;
		line-height: 70rpx;
		position: absolute;
		right: 20rpx;
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
	/* 回复 */
	.comment {
		display: flex;
		padding: 30rpx;
		.left {
			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				background-color: #f2f2f2;
			}
		}
		.right {
			flex: 1;
			padding-left: 20rpx;
			font-size: 30rpx;
			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;
				.name {
					color: #5677fc;
				}
				.like {
					display: flex;
					align-items: center;
					color: #9a9a9a;
					font-size: 26rpx;
					.num {
						margin-right: 4rpx;
						color: #9a9a9a;
					}
				}
				.highlight {
					color: #5677fc;
					.num {
						color: #5677fc;
					}
				}
			}
			.content {
				margin-bottom: 10rpx;
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
			.bottom {
				margin-top: 20rpx;
				display: flex;
				font-size: 24rpx;
				color: #9a9a9a;
				.reply {
					color: #5677fc;
					margin-left: 10rpx;
				}
			}
		}
	}
</style>
