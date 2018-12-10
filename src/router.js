import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login/login'
import store from './store.js'
import { Message } from 'element-ui'

Vue.use(Router)

var router = new Router({
	base: process.env.BASE_URL,
	routes: [{
			path: '/',
			name: 'home',
			component: () => import( /* webpackChunkName: "about" */ './views/home/home.vue'),
			children: [{
					name: "首页",
					path: '/main',
					component: () => import('@/views/home/main')
				},

				/*************************** 财务模块*************************************/
				{
					name: "收款单",
					path: '/sk',
					component: () => import('@/views/finance/receipt')
				},
				{
					name: "付款单",
					path: '/fk',
					component: () => import('@/views/finance/payNo')
				},
				{
					name: "新增付款单",
					path: '/addpayNo',
					component: () => import('@/views/finance/addpayNo')
				},
				{
					name: "收款单详情",
					path: '/receiptDetail',
					component: () => import('@/views/finance/receiptDetail')
				},
				{
					name: "付款单详情",
					path: '/payNoDetail',
					component: () => import('@/views/finance/payNoDetail')
				},
				{
					name: "发票管理",
					path: '/bill',
					component: () => import('@/views/finance/invoicesManage')
				},
				{
					name: "新增发票",
					path: '/addInvoice',
					component: () => import('@/views/finance/addInvoice')
				},
				{
					name: "发票详情",
					path: '/invoiceDetail',
					component: () => import('@/views/finance/invoiceDetail')
				},
				{
					name: "财务选择采购单",
					path: '/fkChoosePurchaseList',
					component: () => import('@/views/finance/choosePurchaseList')
				},
				{
					name: "收支明细",
					path: '/detail',
					component: () => import('@/views/finance/balance')
				},
				{
					name: "对账单",
					path: '/invoice',
					component: () => import('@/views/finance/checkeBill')
				},
				{
					name: "历史对账单",
					path: '/hisInvoice',
					component: () => import('@/views/finance/hisCheckeBill')
				},
				{
					name: "对账单详情",
					path: '/checkeBillDetail',
					component: () => import('@/views/finance/checkeBillDetail')
				},

				/*************************** 采购模块*************************************/
				{
					name: "采购单",
					path: '/purchaseList',
					component: () => import('@/views/purchase/purchaseList')
				},
				{
					name: "新增采购单",
					path: '/addPurchaseList/:type',
					component: () => import('@/views/purchase/addPurchaseList')
				},
				{
					name: "选择商品",
					path: '/chooseGood',
					component: () => import('@/views/purchase/chooseGood')
				},
				{
					name: "商品详情",
					path: '/purchaseListDetail/:tabtype',
					component: () => import('@/views/purchase/purchaseListDetail')
				},
				{
					name: "作废记录",
					path: '/invalidRecord',
					component: () => import('@/views/purchase/invalidRecord')
				},
				{
					name: "导入采购单",
					path: '/importPurchase',
					component: () => import('@/views/purchase/importPurchaseList')
				},
				{
					name: "采购退货",
					path: '/purchaseReject',
					component: () => import('@/views/purchase/purchaseReject')
				},
				{
					name: "采购退货详情",
					path: '/lookPurchaseReject',
					component: () => import('@/views/purchase/lookPurchaseReject')
				},
				{
					name: "新增退货单",
					path: '/addPurchaseReject',
					component: () => import('@/views/purchase/addPurchaseReject')
				},
				{
					name: "选择关联采购单",
					path: '/chooseRelePurchaseList',
					component: () => import('@/views/purchase/chooseRelePurchaseList')
				},
				{
					name: "已完成退货单",
					path: '/addPurchaseRejectSuccess',
					component: () => import('@/views/purchase/addPurchaseRejectSuccess')
				},
				{
					name: "采购单位",
					path: '/purchaseCompany',
					component: () => import('@/views/purchase/purchaseCompany')
				},
				{
					name: "新增采购单位",
					path: '/addPurchaseCompany',
					component: () => import('@/views/purchase/addPurchaseCompany')
				},
				{
					name: "编辑采购单位",
					path: '/editPurchaseCompany',
					component: () => import('@/views/purchase/editPurchaseCompany')
				},
				{
					name: "采购单位详情",
					path: '/lookPurchaseCompany',
					component: () => import('@/views/purchase/lookPurchaseCompany')
				},
				{
					name: "供应商",
					path: '/purchaseSupplier',
					component: () => import('@/views/purchase/purchaseSupplier')
				},
				{
					name: "新增供应商",
					path: '/addPurchaseSupplier',
					component: () => import('@/views/purchase/addPurchaseSupplier')
				},
				{
					name: "编辑供应商",
					path: '/editPurchaseSupplier',
					component: () => import('@/views/purchase/editPurchaseSupplier')
				},
				{
					name: "供应商详情",
					path: '/lookPurchaseSupplier',
					component: () => import('@/views/purchase/lookPurchaseSupplier')
				},
				/*************************** 仓储模块*************************************/
				{
					name: "入库列表",
					path: '/inboundList',
					component: () => import('@/views/depot/inboundList')
				},
				{
					name: "出库列表",
					path: '/outboundList',
					component: () => import('@/views/depot/outboundList')
				},
				{
					name: "库存列表",
					path: '/repertoryList',
					component: () => import('@/views/depot/repertoryList')
				},
				{
					name: "库存调拨",
					path: '/repertoryAllot',
					component: () => import('@/views/depot/repertoryAllot')
				},
				{
					name: "库存盘点",
					path: '/repertoryCheck',
					component: () => import('@/views/depot/repertoryCheck')
				},
				{
					name: "仓库管理",
					path: '/repertoryManage',
					component: () => import('@/views/depot/repertoryManage')
				},
				{
					name: "新增入库",
					path: '/addInbound',
					component: () => import('@/views/depot/addInbound')
				},
				{
					name: "编辑出入库",
					path: '/editBound/:id',
					component: () => import('@/views/depot/editBound')
				},
				{
					name: "出入库详情",
					path: '/boundDetail/:type/:id',
					component: () => import('@/views/depot/boundDetail')
				},
				{
					name: "出入库明细",
					path: '/inoutBound',
					component: () => import('@/views/depot/inoutBound')
				},
				{
					name: "新增调拨单",
					path: '/addAllot',
					component: () => import('@/views/depot/addAllot')
				},
				{
					name: "调拨单详情",
					path: '/allotDetail/:id',
					component: () => import('@/views/depot/allotDetail')
				},
				{
					name: "编辑调拨单",
					path: '/editAllot/:id',
					component: () => import('@/views/depot/editAllot')
				},
				{
					name: "新增仓库",
					path: '/addRepertory',
					component: () => import('@/views/depot/addRepertory')
				},
				{
					name: "编辑仓库",
					path: '/editRepertory/:type/:id',
					component: () => import('@/views/depot/editRepertory')
				},
				{
					name: "选择订单",
					path: '/chooseOrderList',
					component: () => import('@/views/depot/forms/chooseOrderList')
				},

				/*************************** 审批模块*************************************/
				{
					name: "待我审批",
					path: '/waitReview',
					component: () => import('@/views/review/waitReview')
				},
				{
					name: "待我审批-审批",
					path: '/waitReviewRe',
					component: () => import('@/views/review/waitReview_Re')
				},
				{
					name: "待我审批-查看订单",
					path: '/lookWaitReviewRe',
					component: () => import('@/views/review/waitReview_look')
				},
				{
					name: "我发起的-详情",
					path: '/IlaunchedDetail',
					component: () => import('@/views/review/IlaunchedDetail')
				},
				{
					name: "我发起的",
					path: '/Ilaunched',
					component: () => import('@/views/review/Ilaunched')
				},
				{
					name: "我已审批",
					path: '/IReviewed',
					component: () => import('@/views/review/IReviewed')
				},
				{
					name: "我已审批详情",
					path: '/IReviewDetail',
					component: () => import('@/views/review/IReviewDetail')
				},
				{
					name: "流程监管",
					path: '/Mreview',
					component: () => import('@/views/review/processSupervision')
				},

				/*************************** 商品模块*************************************/
				{
					name: "商品列表",
					path: '/goodsList',
					component: () => import('@/views/goods/goodList')
				},
				{
					name: "新增商品",
					path: '/addGood',
					component: () => import('@/views/goods/addGood')
				},
				{
					name: "新增赠品",
					path: '/addGive',
					component: () => import('@/views/goods/addGive')
				},
				{
					name: "编辑商品",
					path: '/editGood',
					component: () => import('@/views/goods/editGood')
				},
				{
					name: "编辑赠品",
					path: '/editGive',
					component: () => import('@/views/goods/editGive')
				},
				{
					name: "商品详情",
					path: '/goodsDetails',
					component: () => import('@/views/goods/details')
				},
				{
					name: "赠品详情",
					path: '/giveDetails',
					component: () => import('@/views/goods/giveDetails')
				},

				// {name: "商品分类", path: '/goodsItems', component: () => import('@/views/goods/items/items')},
				// {name: "新增分类", path: '/addItems', component: () => import('@/views/goods/items/additems')},
				// {name: "编辑分类", path: '/editItems', component: () => import('@/views/goods/items/edititems')},

				// {name: "商品品牌", path: '/goodsBrand', component: () => import('@/views/goods/brand/brand')},
				// {name: "新增品牌", path: '/addBrand', component: () => import('@/views/goods/brand/addbrand')},
				// {name: "编辑品牌", path: '/editBrand', component: () => import('@/views/goods/brand/editbrand')},


				// {name: "商品规格", path: '/goodsSpec', component: () => import('@/views/goods/spec/spec')},
				// {name: "编辑规格", path: '/editSpec', component: () => import('@/views/goods/spec/editspec')},
				// {name: "新增规格", path: '/addSpec', component: () => import('@/views/goods/spec/addspec')},

				// {name: "包装类型", path: '/goodsTypes', component: () => import('@/views/goods/types/types')},
				// {name: "新增类型", path: '/addTypes', component: () => import('@/views/goods/types/addtypes')},
				// {name: "编辑类型", path: '/editTypes', component: () => import('@/views/goods/types/edittypes')},

				/*************************** 订单模块*************************************/
				{
					name: "订单详情",
					path: '/oderDetail',
					component: () => import('@/views/order/oderDetail')
				},
				{
					name: "订单发货单",
					path: '/logisticsSendOrder',
					component: () => import('@/views/order/invoiceList')
				},
				{
					name: "订单合并订单",
					path: '/orderMerge',
					component: () => import('@/views/order/mergeOderList')
				},
				{
					name: "订单售后管理",
					path: '/refundOrder',
					component: () => import('@/views/order/serviceManage')
				},
				{
					name: "订单列表",
					path: '/orderList',
					component: () => import('@/views/order/orderList')
				},
				{
					name: "新建代下单",
					path: '/addOrderList/:type',
					component: () => import('@/views/order/addOrderList')
				},
				{
					name: "选择商品",
					path: '/orderChooseGoods',
					component: () => import('@/views/order/chooseGoods')
				},
				{
					name: "售后详情",
					path: '/serviceDetail',
					component: () => import('@/views/order/serviceDetail')
				},
				{
					name: "添加赠品",
					path: '/addGiveaway/:type',
					component: () => import('@/views/order/addGiveaway')
				},

				/*************************** 系统模块*************************************/
				{
					name: "流程配置",
					path: '/workflowConfig',
					component: () => import('@/views/work/flow')
				},
				{
					name: "权限管理",
					path: '/permissionManage',
					component: () => import('@/views/work/authority')
				},
				{
					name: "用户管理",
					path: '/userManage',
					component: () => import('@/views/work/user/user')
				},
				{
					name: "配置流程",
					path: '/configuration',
					component: () => import('@/views/work/configuration')
				},
				{
					name: "修改密码",
					path: '/editPassword',
					component: () => import('@/views/work/user/editPassword')
				},
				{
					name: "操作日志",
					path: '/operationLog',
					component: () => import('@/views/work/operation')
				}
			]
		},
		{
			path: '/login',
			name: 'login',
			component: login
		}
	]
})

router.beforeEach((to, from, next) => {
    // 登录拦截
    if (to.fullPath == '/'){
        if (sessionStorage.getItem('user')){
            next()
            return
        } else {
            Message({
                message: '会话已过期,请重新登录!',
                showClose: true,
                type: 'warning'
            });

            next({ path: '/login' })
            return
        }
    } else if (to.fullPath == '/login'){
        next();
        return
    } else if (to.fullPath == '/main'){
        //从其他页面跳转到首页相关操作
        store.commit('setNextMenuShow', false)
        $('#firstMenu_ul>li').removeClass('active')
        $('#firstMenu_ul>[type=shouye]').addClass('active')
        store.commit("setCurrFid", '')
        next();
        return
    } else {
        if (sessionStorage.getItem('user')){
            next();
            return
        } else {
            Message({
                message: '会话已过期,请重新登录!',
                showClose: true,
                type: 'warning'
            });

            next({ path: '/login' })
            return
        }
    }
})

router.afterEach((to) => {
    store.commit('setCurrRoutUrl', to.fullPath)
})
export default router