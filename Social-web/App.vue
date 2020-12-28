<script>
	import navigate from '@/utils/navigate.js'
	export default {
		onLaunch: function() {
			// console.log('App Launch')
			// console.log('hasLogin', navigate.hasLogin())
		},
		onShow: function() {
			console.log('App Show')
			let token = uni.getStorageSync('token')
			if (!token) {
				uni.reLaunch({
					url: 'pages/login/login'
				});
			}
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
</style>
