<template>
	<view class="setdata_con">
		<!-- 顶部 -->
		<u-navbar title="个人设置" back-text="返回" :custom-back="back">
			<u-button type="success" size="mini" style="right: 30rpx;position: absolute;font-size: 23rpx;padding-top: 5rpx;z-index: 100;"
			 :ripple="true" @click="goToMyHome">完成</u-button>
		</u-navbar>
		<!-- 表单 -->

		<view class="form_con">
			<u-form :model="form" ref="uForm">
				<u-form-item label="姓名" prop="name">
					<u-input v-model="form.name" />
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="职业" prop="goodsType" label-width="90">
					<u-input :border="border" type="select" :select-open="selectShow" v-model="model.goodsType" placeholder="请选择职业类型"
					 @click="selectShow = true"></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="性别" prop="sex">
					<u-input :border="border" type="select" :select-open="actionSheetShow" v-model="model.sex" placeholder="请选择性别"
					 @click="actionSheetShow = true"></u-input>
				</u-form-item>
				<u-form-item label="出生日期" label-width="150" :label-position="labelPosition">
					<u-input v-model="form.data" placeholder="" :border="border" @click="show1 = true" type="select" />
				</u-form-item>
				<u-form-item label="所在地区" label-width="150" :label-position="labelPosition">
					<u-input v-model="form.region" placeholder="" :border="border" @click="show2 = true" type="select" />
				</u-form-item>
				<u-form-item label="关于我" label-width="110">
					<u-input v-model="form.intruduce" placeholder="介绍一下你自己" />
				</u-form-item>
				<u-action-sheet :list="actionSheetList" v-model="actionSheetShow" @click="actionSheetCallback"></u-action-sheet>
				<u-select mode="single-column" :list="selectList" v-model="selectShow" @confirm="selectConfirm"></u-select>
				<u-picker v-model="show1" mode="time" @confirm="confirm"></u-picker>
				<u-picker v-model="show2" mode="region" @confirm="confirmregion"></u-picker>
			</u-form>
			<view>
				<u-toast ref="uToast" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				border: false,
				actionSheetShow: false,
				show: false,
				show1: false,
				show2: false,
				mode_time: 'time',
				mode_region: 'region',
				tite: '完成',
				form: {
					name: '',
					intro: '',
					sex: '',
					data: '',
					region: '',
					intruduce: '',
				},
				rules: {
					name: [{
						required: true,
						message: '请输入姓名',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}]
				},
				goodsType: [{
					required: true,
					message: '请选择职业类型',
					trigger: 'change',
				}],
				selectList: [{
						label: '学生'
					},
					{
						label: '上班族'
					},
					{
						label: '其他'
					}
				],
				actionSheetList: [{
						text: '男'
					},
					{
						text: '女'
					}
				],
				params: {
					year: true,
					month: true,
					day: true,
					province: true,
					city: true,
					area: true
				},
				model: {
					name: '',
					sex: '',
					likeFruit: '',
					intro: '',
					agreement: false,
					region: '',
					goodsType: '',
					phone: '',
					code: '',
					remember: false,
					photo: ''
				},
				selectShow: false,
				labelPosition: 'left',
			}
		},
		methods: {
			getUser(){
				var vm = this
				uni.request({
					url:'http://127.0.0.1:3000/getUser?username='+vm.name, 
					method:'GET',
					success:res=> {
						console.log(res.data[0])
						if(res.data[0]){
							vm.form.name = res.data[0].username
							vm.model.goodsType = res.data[0].job
							vm.model.sex = res.data[0].sex
							var date = new Date(res.data[0].csrq)
							vm.form.data = date.getFullYear() + '-' + vm.checkTime(date.getMonth() + 1) + '-' + vm.checkTime(date.getDate())
							vm.form.region = res.data[0].region
							vm.form.intruduce = res.data[0].about
						}
					}
				})
			},
			checkTime(i){
				if (i < 10) {
				    i = '0' + i
				  }
				  return i
			},
			back() {
				uni.switchTab({
					url: '../myhome/myhome',
				});
			},
			goToMyHome() {
				var vm = this
				var id = uni.getStorageSync('id')
				uni.request({
					url:'http://127.0.0.1:3000/modify',
					data: { //参数
						username: vm.form.name,
						job: vm.model.goodsType,
						sex:vm.model.sex,
						csrq:vm.form.data,
						region:vm.form.region,
						about:vm.form.intruduce,
						id:id
					},
					method:'POST',
					success: (res) => {
						console.log(res.data)
						if (res.data.changedRows>0) {
							vm.$refs.uToast.show({
								title: '修改成功',
								type: 'success',
								url:'/pages/myhome/myhome',
								isTab:'true'
							})
						}else{
							vm.$refs.uToast.show({
								title: '修改失败',
								type: 'error',
							})
						}
					}
				});
				// uni.setStorageSync('name', this.form.name);
				uni.setStorageSync('sex', this.model.sex);
			},
			selectConfirm(e) {
				this.model.goodsType = '';
				e.map((val, index) => {
					this.model.goodsType += val.label;
				})
			},
			actionSheetCallback(index) {
				uni.hideKeyboard();
				this.model.sex = this.actionSheetList[index].text;
			},
			confirm(e) {
				// console.log(e);
				this.form.data = '';
				if (this.mode_time == 'time') {
					if (this.params.year) this.form.data += e.year;
					if (this.params.month) this.form.data += '-' + e.month;
					if (this.params.day) this.form.data += '-' + e.day;
				}
			},
			confirmregion(e) {
				this.form.region = '';
				if (this.mode_region == 'region') {
					this.form.region = e.province.label + '-' + e.city.label + '-' + e.area.label;
				}
			}
		},
		computed: {
			borderCurrent() {
				return this.border ? 0 : 1;
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad(e) {
			this.name = e.username
		},
		created() {
			this.getUser()
		}
	}
</script>

<style>
	.setdata_con {
		width: 100%;
		background-color: #f4f4f5;
	}

	.setdata_con .form_con {
		padding: 30rpx;
		background-color: #fff;
		margin-top: -40rpx;
	}
</style>
