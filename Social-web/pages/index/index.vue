<!-- 首页 -->
<template>
	<view>
		<!-- 顶部导航栏 -->
		<u-navbar :is-back="false" title="">
			<u-search placeholder="搜索用户、内容、圈子、话题" :clearabled="true" v-model="keyword" 
			:show-action="false" class="topBar_search">
			</u-search>
			<image src="../../static/images/lingdao.png" class="ling" @click="showmask = true"></image>
		</u-navbar>
		<!-- 遮罩层 -->
		<u-mask :show="showmask" @click="showmask = false">
			<view class="warp">
				<view class="rect" @tap.stop>
					<view class="rect_con">
						<view class="content">
							<view class="txt">过客不能评论,只能点赞,也许你很想留下评论,但终究是过客</view>
						</view>
						<view class="content">
							<view class="txt">只有在隐私中开启发表至过客,才会出现在这里(要超过10个字哦)</view>
						</view>
						<view class="content">
							<view class="txt">在我的->设置->过客模块可进行关闭过客,不再显示</view>
						</view>
					</view>
				</view>
			</view>
		</u-mask>
		<!-- 大盒子 -->
		<view class="Social_index">
			<!-- 分类 -->
			<view class="Social_type">
				<swiper-item>
					<u-grid :col="5" :border="true">
						<u-grid-item v-for="(item, index) in list" :index="index" :key="index">
							<u-image width="70rpx" height="70rpx" :src="list[index]"></u-image>
							<text class="grid-text txt">{{list_txt[index]}}</text>
						</u-grid-item>
					</u-grid>
				</swiper-item>
			</view>
			<!-- 导航栏 -->
			<u-tabs :list="tab_cur" :is-scroll="false" :current="current" @change="change">
			</u-tabs>
			<!-- 热门栏 -->
			<view class="hot_container" v-show="current==0">
				<!-- @click="(item.push) && goToIndexDetail()"点击事件判断 -->
				<view class="hot_container_item" v-for="(item, index) in hot_data" :index="index" :key="index" @click="(item.push)>0 && goToIndexDetail(item.sign)">
					<view class="title_bar">
						<image src="../../static/images/answer_icon.png" ></image>
						<view class="txt">{{item.title}}</view>
					</view>
					<view class="ask_people">
						<image src="../../static/images/people.png"></image>
						<view class="txt">{{item.ask}}</view>
					</view>
					<view class="ask_content">
						<view class="txt">{{item.text}}</view>
					</view>
					<view class="tar_bottom">
						<view class="txt">1 点赞</view>
						<view class="txt">14 评论</view>
					</view>
				</view>
			</view>
			<!-- 专题栏 -->
			<view class="subject_container" v-show="current==1">
				<view class="subject_container_item" v-for="(item, index) in subject_data" :index="index" :key="index">
					<view class="title_bar">
						<view class="txt">{{item.title}}</view>
					</view>
					<view class="editor">
						<image src="../../static/images/answer_icon.png"></image>
						<view class="txt">{{item.ask}}</view>
					</view>
					<view class="insert_image">
						<image :src="item.img"></image>
					</view>
					<view class="content">
						<view class="txt">{{item.text}}</view>
					</view>
					<view class="tar_bottom">
						<view class="txt">1 点赞</view>
						<view class="txt">14 评论</view>
					</view>
				</view>
			</view>
			<!-- 推送 -->
			<view class="push_container" v-show="current==2">
				<view class="push_container_item" v-for="(item, index) in push_data" :index="index" :key="index">
					<view class="title_bar">
						<view class="txt">每日一语</view>
					</view>
					<view class="editor">
						<image src="../../static/images/answer_icon.png"></image>
						<view class="txt">{{item.title}}</view>
					</view>
					<view class="content">
						<image :src="item.img"></image>
						<view class="push_con">
							<view class="title">每日一语</view>
							<view class="txt">{{item.text}}</view>
						</view>
					</view>
					<view class="tarBar_bottom">
						<view class="txt">1 在看</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showmask:false,
				keyword: '',
				list: ['/static/images/scroll1.png', '/static/images/scroll2.png',
					'/static/images/scroll3.png', '/static/images/scroll4.png',
					'/static/images/scroll5.png', '/static/images/scroll6.png',
					'/static/images/scroll7.png', '/static/images/scroll8.png',
					'/static/images/scroll9.png', '/static/images/scroll10.png'
				],
				list_txt: ['恋爱秘诀', '搞笑天地', '娱乐频道', '新人报道', '爱晒美图', '星语心愿', '爱美日常', '音乐前线', '美食诱惑', '更多'],
				tab_cur: [{
					name: '热门'
				}, {
					name: '专题'
				}, {
					name: '推送',
				}],
				current: 0,
				hot_data: [
					
				],
				subject_data: [
					
				],
				push_data: [
					
				]
			}
		},
		onLoad: function(options) {
			setTimeout(function() {
				console.log('start pulldown');
			}, 1000);
			uni.startPullDownRefresh();
		},
		onPullDownRefresh() {
			console.log('refresh');
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			change(index) {
				this.current = index;
			},
			goToIndexDetail(id) {
				uni.navigateTo({
					url: '../index_detail/index_detail?id='+id
				});
			},
			getContent(){
				var vm = this
				let token = uni.getStorageSync('token')
				uni.request({
					url: 'http://127.0.0.1:3000/getContent', //仅为示例，并非真实接口地址。
					header: {
						'authorization': token //自定义请求头信息
					},
					method: 'GET', //请求方式  或GET
					success: res => {
						let arr = res.data;
						let newArr1 = [];
						let newArr2 = [];
						let newArr3 = [];
						arr.forEach(item=>{
							if(item.id == 0){
								newArr1.push(item)
							}else if(item.id == 1){
								newArr2.push(item)
							}else if(item.id == 2){
								newArr3.push(item)
							}
						});
						vm.hot_data = JSON.parse(JSON.stringify(newArr1))
						vm.subject_data = JSON.parse(JSON.stringify(newArr2))
						vm.push_data = JSON.parse(JSON.stringify(newArr3))
					}
				});
			}
		},
		created() {
			this.getContent()
		}
	}
</script>

<style>
	/* 顶部导航 */
	.topBar_search {
		padding: 0 100rpx 0 10rpx;
		position: relative;
	}

	.ling {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 30rpx;
	}
	
	.rect{
		padding: 0 30rpx;
	}
	.rect .rect_con{
		background-color: #fff;
		height: 300rpx;
		margin-top: 450rpx;
		border-radius: 20rpx;
		padding: 20rpx;
	}
	.rect .rect_con .content{
		height: 80rpx;
		margin-left: 40rpx;
		line-height: 1.2em;
		margin-top: 15rpx;
		font-size: 30rpx;
		padding-top: 10rpx;
		position: relative;
	}
	.rect .rect_con .content:first-child{
		margin-top: 0;
	}
	.rect .rect_con .content::before{
		content: "";
		width: 20rpx;
		height: 50rpx;
		background-color: #18B566;
		display: block;
		position: absolute;
		left: -30rpx;
	}
	/* .topBar_search::after {
		content: "";
		background: url(../../static/images/lingdao.png);
		display: block;
		background-size: 100%;
		position: absolute;
		right: 30rpx;
		width: 40rpx;
		height: 40rpx;
	} */

	.Social_index {
		width: 100%;
	}

	/* 分类 */
	.Social_type {
		height: 340rpx;
	}

	.Social_type .txt {
		font-size: 14rpx;
		margin-top: 20rpx;
	}
	.u-tabs{
		margin-top: 20rpx;
	}

	/* 热门 */
	.hot_container {
		width: 100%;
		background-color: #f4f4f5;
		z-index: -1;
	}

	.hot_container .hot_container_item {
		margin-top: 20rpx;
		padding: 10rpx;
		z-index: 10;
		background-color: #fff;
	}

	.hot_container .hot_container_item:first-child {
		margin-top: 0;
	}

	.hot_container .hot_container_item:last-child {
		margin-bottom: 20rpx;
	}

	.hot_container .hot_container_item .title_bar {
		height: 60rpx;
		display: flex;
	}

	.hot_container .hot_container_item .title_bar image {
		width: 50rpx;
		height: 50rpx;
		padding: 10rpx;
	}

	.hot_container .hot_container_item .title_bar .txt {
		color: #303133;
		line-height: 60rpx;
	}

	.hot_container .hot_container_item .title_bar .txt:first-child {
		padding-left: 10rpx;
		color: #82848a;
		line-height: 60rpx;
	}

	.hot_container .hot_container_item .ask_people {
		height: 60rpx;
		margin-top: 10rpx;
		display: flex;
	}

	.hot_container .hot_container_item .ask_people image {
		height: 40rpx;
		width: 40rpx;
		padding: 10rpx 15rpx;
	}

	.hot_container .hot_container_item .ask_people .txt {
		color: #303133;
		line-height: 60rpx;
		font-size: 24rpx;
	}

	.hot_container .hot_container_item .ask_content {
		height: 80rpx;
		margin-top: 10rpx;
	}

	.hot_container .hot_container_item .ask_content .txt {
		color: #909399;
		font-size: 23rpx;
		padding: 10rpx 15rpx;
		letter-spacing: 4rpx;
		line-height: 1.4em;
	}

	.hot_container .hot_container_item .tar_bottom {
		height: 50rpx;
		margin-top: 10rpx;
		color: #909399;
		display: flex;
		line-height: 50rpx;
		padding-left: 15rpx;
	}

	.hot_container .hot_container_item .tar_bottom .txt {
		font-size: 22rpx;
	}

	.hot_container .hot_container_item .tar_bottom .txt:last-child {
		margin-left: 30rpx;
	}

	/* 专题 */
	.subject_container {
		background-color: #f4f4f5;
		width: 100%;
	}

	.subject_container .subject_container_item {
		padding: 10rpx;
		margin-top: 20rpx;
		background-color: #FFFFFF;
	}

	.subject_container .subject_container_item:first-child {
		margin-top: 0rpx;
	}

	.subject_container .subject_container_item .title_bar {
		height: 60rpx;
		line-height: 60rpx;
		padding-left: 10rpx;
	}

	.subject_container .subject_container_item .title_bar .txt {
		color: #303133;
	}

	.subject_container .subject_container_item .editor {
		margin-top: 10rpx;
		height: 60rpx;
		color: #303133;
		display: flex;
	}

	.subject_container .subject_container_item .editor image {
		width: 40rpx;
		height: 40rpx;
		padding: 10rpx 15rpx;
	}

	.subject_container .subject_container_item .editor .txt {
		line-height: 60rpx;
		font-size: 23rpx;
	}

	.subject_container .subject_container_item .insert_image {
		height: 300rpx;
		margin-top: 10rpx;
	}

	.subject_container .subject_container_item .insert_image image {
		height: 100%;
		width: 100%;
		border-radius: 10rpx;
	}

	.subject_container .subject_container_item .content {
		margin-top: 10rpx;
	}

	.subject_container .subject_container_item .content .txt {
		font-size: 23rpx;
		padding: 10rpx 15rpx;
		letter-spacing: 4rpx;
		line-height: 1.4em;
		color: #909399;
	}

	.subject_container .subject_container_item .tar_bottom {
		height: 50rpx;
		margin-top: 10rpx;
		display: flex;
		line-height: 50rpx;
		color: #909399;
		padding-left: 15rpx;
	}

	.subject_container .subject_container_item .tar_bottom .txt {
		font-size: 22rpx;
	}

	.subject_container .subject_container_item .tar_bottom .txt:last-child {
		margin-left: 30rpx;
	}

	/* 推送 */
	.push_container {
		width: 100%;
		background-color: #f4f4f5;
	}

	.push_container .push_container_item {
		background-color: #FFFFFF;
		margin-top: 20rpx;
		padding: 10rpx;
	}

	.push_container .push_container_item:first-child {
		margin-top: 0;
	}

	.push_container .push_container_item .title_bar {
		height: 60rpx;
		line-height: 60rpx;
	}

	.push_container .push_container_item .title_bar .txt {
		color: #303133;
		padding: 0 10rpx;
	}

	.push_container .push_container_item .editor {
		height: 60rpx;
		line-height: 60rpx;
		margin-top: 10rpx;
		display: flex;
	}

	.push_container .push_container_item .editor image {
		width: 40rpx;
		height: 40rpx;
		padding: 10rpx 15rpx;
	}

	.push_container .push_container_item .editor .txt {
		font-size: 23rpx;
		color: #303133;
	}

	.push_container .push_container_item .content {
		height: 150rpx;
		margin-top: 10rpx;
		border-radius: 10rpx;
		display: flex;
		background-color: #f4f4f5;
		color: #909399;
	}

	.push_container .push_container_item .content image {
		width: 160rpx;
		height: 150rpx;
		border-radius: 10rpx 0 0 10rpx;
	}

	.push_container .push_container_item .push_con {
		height: 80rpx;
		display: flex;
		flex-direction: column;
		margin-top: 30rpx;
		padding: 10rpx;
		margin-left: 10rpx;
	}

	.push_container .push_container_item .push_con .title {
		color: #909399;
	}

	.push_container .push_container_item .push_con .txt {
		margin-top: 10rpx;
		font-size: 20rpx;
		letter-spacing: 5rpx;
	}

	.push_container .push_container_item .tarBar_bottom {
		height: 60rpx;
		margin-top: 10rpx;
	}

	.push_container .push_container_item .tarBar_bottom .txt {
		color: #909399;
		font-size: 22rpx;
		padding-left: 15rpx;
		line-height: 60rpx;
	}
</style>
