<template>
	<view class="wrap">
		<view class="comment">
			<view class="top">
				<view class="left">
					<view class="heart-photo"><image :src="comment.url" mode=""></image></view>
					<view class="user-info">
						<view class="name">{{ comment.name }}</view>
						<view class="date">06-25 13:58</view>
					</view>
				</view>
				<view class="right" :class="{ highlight: comment.isLike }">
					{{ comment.likeNum }}
					<u-icon v-if="!comment.isLike" name="thumb-up" class="like" color="#9a9a9a" :size="30" @click="getLike"></u-icon>
					<u-icon v-if="comment.isLike" name="thumb-up-fill" class="like" :size="30" @click="getLike"></u-icon>
				</view>
			</view>
			<view class="content">{{ comment.contentText }}</view>
		</view>
		<view class="all-reply">
			<view class="all-reply-top">全部回复（{{ comment.allReply }}）</view>
			<view class="item" v-for="(item, index) in commentList" :key="index">
				<view class="comment">
					<view class="top">
						<view class="left">
							<view class="heart-photo"><image :src="item.url" mode=""></image></view>
							<view class="user-info">
								<view class="name">{{ item.name }}</view>
								<view class="date">{{ item.date }}</view>
							</view>
						</view>
						<view class="right"  :class="{ highlight: item.isLike }">
							<view class="num">{{ item.likeNum }}</view>
							<u-icon v-if="!item.isLike" name="thumb-up" class="like" :size="30" color="#9a9a9a" @click="getLike(index)"></u-icon>
							<u-icon v-if="item.isLike" name="thumb-up-fill" class="like" :size="30" @click="getLike(index)"></u-icon>
						</view>
					</view>
					<view class="reply" v-if="item.reply">
						<view class="username">{{ item.reply.name }}</view>
						<view class="text">{{ item.reply.contentStr }}</view>
					</view>
					<view class="content">{{ item.contentText }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			commentList: [],
			comment: ''
		};
	},
	onLoad() {
		this.getReply();
	},
	methods: {
		// 点赞
		getLike(index) {
			if (index === 0 || index > 0) {
				this.commentList[index].isLike = !this.commentList[index].isLike;
				if (this.commentList[index].isLike == true) {
					this.commentList[index].likeNum++;
				} else {
					this.commentList[index].likeNum--;
				}
			} else {
				if (this.comment.isLike == true) {
					this.comment.isLike = !this.comment.isLike;
					this.comment.likeNum--;
				} else {
					this.comment.isLike = !this.comment.isLike;
					this.comment.likeNum++;
				}
			}
		},

		// 回复列表
		getReply() {
			this.comment = {
				id: 1,
				name: '安可可乐',
				date: '10-25 18:58',
				contentText: '现在这个天气本来就容易掉头发',
				url: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
				allReply: 12,
				likeNum: 33,
				isLikes: false
			};
			this.commentList = [
				{
					name: '芜湖大老C',
					date: '10-25 19:24',
					contentText: '同学不要担心,现在的天气确实不太好',
					url: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
					likeNum: 33,
					isLike: false,
					reply: {
						name: '楼主',
						contentStr: '最好是这样0.0'
					}
				},
				{
					name: '小胖',
					date: '10-26 10:18',
					url: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
					contentText: '不要担心啦,没有什么问题的',
					allReply: 0,
					likeNum: 11,
					isLike: false,
					reply: {
						name: '楼主',
						contentStr: '感觉大家关心,这个平台确实很好,让我认识好多伙伴'
					}
				},
				{
					name: '可爱美少女',
					date: '10-29 12:48',
					contentText: '多多运动下,身体健康就没啥大问题啦',
					allReply: 0,
					likeNum: 21,
					url: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
					isLike: false,
					allReply: 2,
					reply: {
						name: '楼主',
						contentStr: '好的,从明天开始我要锻炼啦'
					}
				},
				{
					name: '高先生',
					date: '11-05 16:28',
					contentText: '吃点维生素补一补,好好睡一觉',
					allReply: 0,
					likeNum: 150,
					url: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
					isLike: false
				}
			];
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f2f2f2;
}
.comment {
	padding: 30rpx;
	font-size: 32rpx;
	background-color: #ffffff;
	.top {
		display: flex;
		justify-content: space-between;
	}
	.left {
		display: flex;
		.heart-photo {
			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				background-color: #f2f2f2;
			}
		}
		.user-info {
			margin-left: 10rpx;
			.name {
				color: #5677fc;
				font-size: 28rpx;
				margin-bottom: 4rpx;
			}
			.date {
				font-size: 20rpx;
				color: $u-light-color;
			}
		}
	}
	.right {
		display: flex;
		font-size: 20rpx;
		align-items: center;
		color: #9a9a9a;
		.like {
			margin-left: 6rpx;
		}
		.num{
			font-size: 26rpx;
			color: #9a9a9a;
		}
	}
	.highlight {
		color: #5677fc;
		.num{
			color: #5677fc;
		}
	}
}
.all-reply {
	margin-top: 10rpx;
	padding-top: 20rpx;
	background-color: #ffffff;
	.all-reply-top {
		margin-left: 20rpx;
		padding-left: 20rpx;
		border-left: solid 4rpx #5677fc;
		font-size: 30rpx;
		font-weight: bold;
	}
	.item {
		border-bottom: solid 2rpx $u-border-color;
	}
	.reply {
		padding: 20rpx;
		background-color: rgb(242, 242, 242);
		border-radius: 12rpx;
		margin: 10rpx 0;
		.username {
			font-size: 24rpx;
			color: #7a7a7a;
		}
	}
}
</style>
