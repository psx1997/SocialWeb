<!-- 日记 -->
<template>
	<view class="container">
		<view>
			<u-modal v-model="show" :content="content" :show-cancel-button="true" width="70%" @confirm="remove()"></u-modal>
		</view>
		<view>
			<u-toast ref="uToast" />
		</view>
		<u-navbar :is-back="false" title="全部日记" :background="background" title-color="#fff">
			<view class="navbar_icon">
				<button class="btn_click" @click="goToWriteDiary"></button>
				<image class="cal" @click="showcal=true" src="../../static/images/data.png"></image>
				<view class="title" @click="reset"></view>
			</view>
		</u-navbar>
		<u-calendar v-model="showcal" :mode="mode" @change="change"></u-calendar>
		<view class="content">
			<view v-for="(item, index) in data_list" :index="index" :key="index" v-show="startDate<(item.data.datetime) && (item.data.datetime)<endDate">
				<view class="d_con_item">
					<view class="d_con_data">
						<view class="num">{{item.data.day}}</view>
						<view class="day">{{item.data.week}}</view>
						<view class="yymm">{{item.data.yymm}}</view>
					</view>
					<view class="d_con_content">
						<view class="d_content_view">
							<view class="close_img" @click="closeDiary(item.date.sign)"></view>
							<view class="txt">{{item.date.title}}</view>
							<view class="time">{{item.date.address}}</view>
						</view>
					</view>
				</view>
			</view>
			<view style="text-align: center; margin-top: 30rpx;">{{str}}</view>
			<view style="background-color: #F1F1F1;height: 130rpx;margin-top: 80rpx;"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				content: '是否确定删除',
				mode: 'range',
				showcal: false,
				str: '',
				sign:'',
				startDate: "2000-01-01",
				endDate: "2050-01-01",
				background: {
					backgroundColor: '#57B883'
				},
				data_list: [

				]
			}
		},
		onPullDownRefresh() {
			console.log('refresh');
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			closeDiary(sign) {
				this.show = true
				this.sign = sign
			},
			remove(){
				var vm = this
				uni.request({
					url:'http://127.0.0.1:3000/removeDiary?sign='+vm.sign,
					method:'GET',
					success: res => {
						if (res.data.affectedRows>0) {
							vm.$refs.uToast.show({
								title: '删除成功',
								type: 'success',
								url:'/pages/diary/diary',
								isTab:'true'
							})
						}else{
							vm.$refs.uToast.show({
								title: '删除失败',
								type: 'error',
							})
						}
					}
				})
				console.log('data_list')
			},
			goToWriteDiary() {
				uni.navigateTo({
					url: '../writediary/writediary'
				})
			},
			change(e) {
				this.startDate = e.startDate;
				this.endDate = e.endDate;
			},
			reset() {
				this.startDate = '2020-01-01';
				this.endDate = '2021-01-01';
			},
			checkTime(i) {
				if (i < 10) {
					i = '0' + i
				}
				return i
			},
			getDiary() {
				var vm = this
				var id = uni.getStorageSync('id')
				// console.log(id)
				uni.request({
					url: 'http://127.0.0.1:3000/getDiary?id=' + id,
					method: 'GET',
					success(res) {
						if (res.data.length == 0) {
							vm.str = '暂时没有内容，快去写日记吧'
						}
						// console.log(res.data)
						let arr = res.data;
						let newArr = [];
						let newArr2 = [];
						arr.forEach(item => {
							newArr.push(item)
						});
						let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
						arr.forEach(v => {
							var obj = {};
							var date = new Date(v.date)
							var mouth = date.getMonth()+1 < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)
							obj.yymm = date.getFullYear() + "." + mouth
							obj.day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
							obj.week = week[date.getDay()]
							obj.datetime = date.getFullYear() + '-' + vm.checkTime(date.getMonth() + 1) + '-' + vm.checkTime(date.getDate())
							newArr2.push(obj)
						})
						let newRes = [];
						newRes = newArr2.map((data, i) => ({
							data,
							date: newArr[i]
						}));
						// console.log(newRes)
						vm.data_list = JSON.parse(JSON.stringify(newRes));
						vm.getDiary()
						// console.log(vm.data_list[0].date.address)
					}
				});
			}
		},
		onLoad: function() {
			let content = uni.getStorageSync('content');
			let address = uni.getStorageSync('address');
			if (content) {
				this.data_list[4].content = content
				this.data_list[4].show = true
			} else {
				this.data_list[4].content = ""
				this.data_list[4].show = false
			}
			if (address) {
				this.data_list[4].address = address
			} else {
				this.data_list[4].content = ""
			}
		},
		created() {
			this.getDiary()
		}
	}
</script>

<style>
	.navbar_icon {
		position: relative;
	}

	.title {
		width: 150rpx;
		height: 50rpx;
		position: absolute;
		top: -20rpx;
		left: 300rpx;
	}

	.cal {
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		left: 40rpx;
		top: -20rpx;
	}

	.navbar_icon::before {
		content: "";
		width: 50rpx;
		height: 50rpx;
		background: url(../../static/images/diary.png) no-repeat;
		position: absolute;
		left: 670rpx;
		bottom: -30rpx;
	}

	.btn_click {
		width: 50rpx;
		height: 50rpx;
		opacity: 0;
		position: absolute;
		left: 670rpx;
		bottom: -30rpx;
	}

	.content {
		height: 1800rpx;
		background-color: #F1F1F1;
		width: 100%;
	}

	.content .d_con_item {
		width: 100%;
		display: flex;
		height: 190rpx;
	}

	.content .d_con_item .d_con_data {
		border-right: 1rpx solid #ccc;
		padding-top: 30rpx;
		padding-left: 20rpx;
		padding-right: 30rpx;
		width: 20%;
		display: flex;
		flex-wrap: wrap;
		position: relative;
	}

	.content .d_con_item .d_con_data::after {
		content: "";
		width: 30rpx;
		height: 30rpx;
		position: absolute;
		display: block;
		border: 1rpx solid #ccc;
		background-color: #f4f4f5;
		border-radius: 50%;
		left: 133rpx;
		top: 50rpx;
	}

	.content .d_con_item .d_con_data .num {
		font-size: 35rpx;
	}

	.content .d_con_item .d_con_data .day {
		font-size: 23rpx;
		margin-top: 10rpx;
		margin-left: 10rpx;
	}

	.content .d_con_item .d_con_data .yymm {
		font-size: 21rpx;
		margin-bottom: 100rpx;
	}

	.content .d_con_item .d_con_content {
		width: 80%;
		padding: 30rpx 20rpx 10rpx 50rpx;
	}

	.content .d_con_item .d_con_content .d_content_view {
		background-color: #fff;
		width: 100%;
		height: 150rpx;
		border-radius: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 10rpx;
		padding-left: 20rpx;
		position: relative;
	}

	.content .d_con_item .d_con_content .d_content_view .close_img {
		height: 40rpx;
		position: absolute;
		width: 40rpx;
		right: 20rpx;
		/* background-color: red; */
		background-image: url(../../static/images/close.png);
	}

	.content .d_con_item .d_con_content .d_content_view::after {
		content: "";
		position: absolute;
		width: 0;
		height: 0;
		border-width: 15rpx 20rpx;
		border-style: solid;
		border-color: transparent #fff transparent transparent;
		left: -36rpx;
		top: 24rpx;
	}

	.content .d_con_item .d_con_content .d_content_view .txt {
		flex-wrap: wrap;
		width: 90%;
	}

	.content .d_con_item .d_con_content .d_content_view .time {
		font-size: 20rpx;
		color: #999999;
	}
</style>
