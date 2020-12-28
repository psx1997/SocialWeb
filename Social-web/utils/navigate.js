function to(url) {
	return new Promise((resolve, reject) => {
		if (!hasLogin()) {
			reject(new Error('未登录'))
			return;
		}
		uni.navigateTo({
			url: url,
			success(res) {
				resolve(res)
			},
			fail(e) {
				reject(e)
			}
		})
	})
}

function back(delta) {
	return new Promise((resolve, reject) => {
		if (!hasLogin()) {
			reject(new Error('未登录'))
			return;
		}
		uni.navigateBack({
			delta: delta,
			success(res) {
				resolve(res)
			},
			fail(e) {
				reject(e)
			}
		})
	})
}

function hasLogin() {
	// ...
	return false;
}

function curPage() {
	uni.getCurrentPages()
}

function curIsLoginPage() {
	return curPage == '/pages/login/login.vue'
}

function toLogin() {
	if (curIsLoginPage()) return
	uni.navigateTo({
		url: '/pages/login/login.vue'
	})
}

export default {
	hasLogin: hasLogin,
	to: to,
	back: back
}
