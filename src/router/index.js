import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)


const isAdmin = (localStorage.getItem('role') == 'admin')
    /**
     * Note: sub-menu only appear when route children.length >= 1
     * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
     *
     * hidden: true                   if set true, item will not show in the sidebar(default is false)
     * alwaysShow: true               if set true, will always show the root menu
     *                                if not set alwaysShow, when item has more than one children route,
     *                                it will becomes nested mode, otherwise not show the root menu
     * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
     * name:'router-name'             the name is used by <keep-alive> (must set!!!)
     * meta : {
        roles: ['admin','editor']    control the page roles (you can set multiple roles)
        title: 'title'               the name show in sidebar and breadcrumb (recommend set)
        icon: 'svg-name'             the icon show in the sidebar
        breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
        activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
      }
     */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */


export const constantRoutes1 = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },
    {
        path: '/messageHistory',
        component: () =>
            import ('@/views/messageHistory/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },
]


const constantRoutes = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },

    {
        path: '/messageHistory',
        component: () =>
            import ('@/views/messageHistory/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        hidden: true,
        children: [{
            path: 'dashboard',
            name: 'dashboard',
            hidden: true,
            component: () =>
                import ('@/views/homePage/index')
        }, ]
    },
    {
        path: '/interact',
        component: Layout,
        redirect: '/dashboard',
        meta: { title: '互动发现', icon: 'interact', menu: 'discovery' },
        children: [{
                path: 'discover',
                name: 'interactDiscover',
                component: () =>
                    import ('@/views/interact/discover'),
                meta: { title: '发现圈', menu: 'circle' }
            },
            {
                path: 'work',
                name: 'work',
                component: () =>
                    import ('@/views/interact/work'),
                meta: { title: '工作圈', menu: 'workCircle' }
            },
            {
                path: 'workDetail/:id',
                name: 'workDetail',
                hidden: true,
                component: () =>
                    import ('@/views/interact/workDetail'),
                meta: { title: '添加或编辑工作圈' }
            },

        ]
    },
    {
        path: '/advertising',
        component: Layout,
        redirect: '/advertising/banner',
        name: '广告维护',
        meta: { title: '广告维护', icon: 'advertising', menu: 'ad' },
        children: [{
                path: 'banner',
                name: 'banner',
                component: () =>
                    import ('@/views/advertising/banner'),
                meta: { title: 'Banner', menu: 'banner' }
            },
            {
                path: 'tripartiteAD',
                name: 'tripartiteAD',
                component: () =>
                    import ('@/views/advertising/tripartiteAD'),
                meta: { title: '三方广告', menu: 'third' }
            },
            {
                path: 'iconSet',
                name: 'iconSet',
                component: () =>
                    import ('@/views/advertising/iconSet'),
                meta: { title: '图标设置', menu: 'icon' }
            },
            {
                path: 'guidePage',
                name: 'guidePage',
                component: () =>
                    import ('@/views/advertising/guidePage'),
                meta: { title: '引导页', menu: 'guide' }
            },
            {
                path: 'iconDetail/:id',
                name: 'iconDetail',
                component: () =>
                    import ('@/views/advertising/iconDetail'),
                hidden: true,
                meta: { title: '添加或编辑图标' }
            },
            {
                path: 'appGuideDetail/:id',
                name: 'appGuideDetail',
                component: () =>
                    import ('@/views/advertising/appGuideDetail'),
                hidden: true,
                meta: { title: '添加或编辑引导页客户端广告' }
            },
            {
                path: 'staffGuideDetail/:id',
                name: 'staffGuideDetail',
                component: () =>
                    import ('@/views/advertising/staffGuideDetail'),
                hidden: true,
                meta: { title: '添加或编辑引导页员工端广告' }
            }, {
                path: 'homepageAdDetail/:id',
                name: 'homepageAdDetail',
                component: () =>
                    import ('@/views/advertising/homepageAdDetail'),
                hidden: true,
                meta: { title: '添加或编辑主页广告' }
            },
            {
                path: 'backgroundDetail/:id',
                name: 'backgroundDetail',
                component: () =>
                    import ('@/views/advertising/backgroundDetail'),
                hidden: true,
                meta: { title: '添加或编辑公告背景' }
            },
            {
                path: 'collegeAdDetail/:id',
                name: 'collegeAdDetail',
                component: () =>
                    import ('@/views/advertising/collegeAdDetail'),
                hidden: true,
                meta: { title: '添加或编辑学院广告' }
            },
            // {
            //   path: 'homepageAd',
            //   name: 'homepageAd',
            //   component: () => import('@/views/advertising/homepageAd'),
            //   meta: {title: '主页广告', admin: true}
            // },
            // {
            //   path: 'serviceMarket',
            //   name: 'serviceMarket',
            //   component: () => import('@/views/advertising/serviceMarket'),
            //   meta: {title: '服务市场', admin: true}
            // },
            // {
            //   path: 'collegeAd',
            //   name: 'collegeAd',
            //   component: () => import('@/views/advertising/collegeAd'),
            //   meta: {title: '学院广告', admin: true}
            // },
            //
            // {
            //   path: 'auxiliaryTool',
            //   name: 'auxiliaryTool',
            //   component: () => import('@/views/advertising/auxiliaryTool'),
            //   meta: {title: '辅助工具', admin: true}
            // },
        ]
    },
    {
        path: '/content',
        component: Layout,
        redirect: '/content/course',
        name: '内容管理',
        meta: { title: '内容管理', icon: 'content', menu: 'content' },
        children: [{
                path: 'course',
                name: 'course',
                component: () =>
                    import ('@/views/content/course'),
                meta: { title: '课程', menu: 'course' }
            },
            {
                path: 'bookDetail/:id',
                name: 'bookDetail',
                component: () =>
                    import ('@/views/content/bookDetail'),
                hidden: true,
                meta: { title: '添加或编辑书本课程' }
            },
            {
                path: 'news',
                name: 'news',
                component: () =>
                    import ('@/views/content/news'),
                meta: { title: '资讯', menu: 'news' }
            },

            {
                path: 'tech',
                name: 'tech',
                component: () =>
                    import ('@/views/content/tech'),
                meta: { title: '技术', menu: 'tech' }
            },

            {
                path: 'newsDetail/:id',
                name: 'newsDetail',
                component: () =>
                    import ('@/views/content/newsDetail'),
                hidden: true,
                meta: { title: '添加或编辑资讯' }
            },
            {
                path: 'techDetail/:id',
                name: 'techDetail',
                component: () =>
                    import ('@/views/content/techDetail'),
                hidden: true,
                meta: { title: '添加或编辑技术课程' }
            },
            {
                path: 'Live',
                name: 'Live',
                component: () =>
                    import ('@/views/content/Live'),
                meta: { title: '直播', menu: 'live' }
            },
            {
                path: 'LiveDetail/:id',
                name: 'LiveDetail',
                component: () =>
                    import ('@/views/content/LiveDetail'),
                hidden: true,
                meta: { title: '添加或编辑直播' }
            },
            {
                path: 'viewDetail/:id',
                name: 'viewDetail',
                component: () =>
                    import ('@/views/content/viewDetail'),
                hidden: true,
                meta: { title: '查看直播详情' }
            },
            {
                path: 'activity',
                name: 'activity',
                component: () =>
                    import ('@/views/content/activity'),
                meta: { title: '线下', menu: 'activity' }
            },
            {
                path: 'discover',
                name: 'discover',
                component: () =>
                    import ('@/views/content/discover'),
                meta: { title: '发现', menu: 'found' }
            },
            {
                path: 'activityDetail/:id',
                name: 'activityDetail',
                component: () =>
                    import ('@/views/content/activityDetail'),
                hidden: true,
                meta: { title: '添加或编辑线下课程' }
            },
            {
                path: 'guestDetail/:id',
                name: 'guestDetail',
                component: () =>
                    import ('@/views/content/guestDetail'),
                hidden: true,
                meta: { title: '添加或编辑嘉宾' }
            },
            {
                path: 'push',
                name: 'push',
                component: () =>
                    import ('@/views/content/push'),
                meta: { title: '推送', menu: 'push' }
            },
            {
                path: 'pushDetail/:id',
                name: 'pushDetail',
                component: () =>
                    import ('@/views/content/pushDetail'),
                hidden: true,
                meta: { title: '添加或编辑推送' }
            },
            {
                path: 'pushViewDetail/:id',
                name: 'pushViewDetail',
                component: () =>
                    import ('@/views/content/pushViewDetail'),
                hidden: true,
                meta: { title: '查看推送详情' }
            },
            // {
            //   path: 'LiveDetail1/:id',
            //   name: 'LiveDetail1',
            //   component: () => import('@/views/content/LiveDetail1'),
            //   hidden: true,
            //   meta: {title: '添加或编辑原直播', admin: true}
            // },
            // {
            //   path: 'offLineActivity',
            //   name: 'offLineActivity',
            //   component: () => import('@/views/content/offLineActivity'),
            //   meta: {title: '线下活动', admin: true}
            // },
            // {
            //   path: 'offLineActivityDetail/:id',
            //   name: 'offLineActivityDetail',
            //   component: () => import('@/views/content/offLineActivityDetail'),
            //   hidden: true,
            //   meta: {title: '添加或编辑线下活动', admin: true}
            // },
            // {
            //   path: 'Dailydiscounts',
            //   name: 'Dailydiscounts',
            //   component: () => import('@/views/content/Dailydiscounts'),
            //   meta: {title: '每日优惠', admin: true}
            // },
            // {
            //   path: 'dynamic',
            //   name: 'dynamic',
            //   component: () => import('@/views/content/dynamic'),
            //   meta: {title: '动态', admin: true}
            // },
            {
                path: 'dynamicDetail/:id',
                name: 'dynamicDetail',
                component: () =>
                    import ('@/views/content/dynamicDetail'),
                hidden: true,
                meta: { title: '添加或编辑动态' }
            },
            {
                path: 'newsEdit/:id',
                name: 'newsEdit',
                component: () =>
                    import ('@/views/content/newsEdit'),
                hidden: true,
                meta: { title: '添加或编辑时讯小报' }
            },
            // {
            //   path: 'questions',
            //   name: 'questions',
            //   component: () => import('@/views/content/questions'),
            //   meta: {title: '提问', admin: true}
            // },
            // {
            //   path: 'questionsDetail/:id',
            //   name: 'questionsDetail',
            //   component: () => import('@/views/content/questionsDetail'),
            //   hidden: true,
            //   meta: {title: '添加或编辑问题', admin: true}
            // },
        ]
    },
    {
        path: '/colleague',
        component: Layout,
        redirect: '/colleague/colleagueList',
        name: '部门管理',
        meta: { title: '部门管理', icon: 'colleague', menu: 'department' },
        children: [{
                path: 'colleagueList',
                name: 'colleagueList',
                component: () =>
                    import ('@/views/colleague/colleagueList'),
                meta: { title: '同事列表', menu: 'staffs' }
            }, {
                path: 'addDepartment',
                name: 'addDepartment',
                component: () =>
                    import ('@/views/colleague/addDepartment'),
                meta: { title: '创建部门', menu: 'departmentCreate' }
            },
            {
                path: 'colleagueDetail/:id',
                name: 'colleagueDetail',
                component: () =>
                    import ('@/views/colleague/colleagueDetail'),
                hidden: true,
                meta: { title: '添加或编辑同事' }
            },
            {
                path: 'viewColleagueDetail/:id',
                name: 'viewColleagueDetail',
                component: () =>
                    import ('@/views/colleague/viewColleagueDetail'),
                hidden: true,
                meta: { title: '同事详情' }
            },
        ]
    },
    {
        path: '/vipSign',
        component: Layout,
        redirect: '/vipSign',
        name: '会签系统',
        meta: { title: '会签系统', icon: 'colleague', menu: 'countersign' },
        children: [{
                path: '',
                name: 'vipSign',
                component: () =>
                    import ('@/views/vipSign/vipSign'),
                meta: { title: '会签列表', menu: 'countersign' }
            },{
                path: 'modifyVipSign',
                name: 'modifyVipSign',
                hidden: true,
                component: () =>
                    import ('@/views/vipSign/subPages/modifyVipSign/modifyVipSign'),
                meta: { title: '添加/修改会签', menu: 'countersign' }
            },{
                path: 'signInfo',
                name: 'signInfo',
                hidden: true,
                component: () =>
                    import ('@/views/vipSign/subPages/signInfo/signInfo'),
                meta: { title: '详情', menu: 'countersign' }
            }]
    },
    {
        path: '/user',
        component: Layout,
        redirect: '/user/userList',
        name: '客户中心',
        meta: { title: '客户中心', icon: 'usercenter', menu: 'customers' },
        children: [{
                path: 'userList',
                name: 'userList',
                component: () =>
                    import ('@/views/user/userList'),
                meta: { title: '客户列表', menu: 'customer' }
            },
            {
                path: 'customerService',
                name: 'customerService',
                component: () =>
                    import ('@/views/user/customerService'),
                meta: { title: '客服售后', menu: 'afterSale' }
            },
            {
                path: 'serviceDetail/:id',
                name: 'serviceDetail',
                component: () =>
                    import ('@/views/user/serviceDetail'),
                hidden: true,
                meta: { title: '售后查看', admin: true }
            },
            {
                path: 'kefuDetail',
                name: 'kefuDetail',
                component: () =>
                    import ('@/views/user/kefuDetail'),
                hidden: true,
                meta: { title: '客服查看', admin: true }
            },

            // {
            //   path: 'tableUsb',
            //   name: 'tableUsb',
            //   hidden: true,
            //   component: () => import('@/views/user/tableUsb'),
            //   meta: {title: '用户缴纳诚意金楼盘列表', icon: 'table'}
            // },
        ]
    },
    {
        path: '/finance',
        component: Layout,
        redirect: '/finance/orderData',
        name: '运营数据',
        meta: { title: '运营数据', icon: 'finance', menu: 'financial' },
        children: [{
                path: 'orderData',
                name: 'orderData',
                component: () =>
                    import ('@/views/finance/orderData'),
                meta: { title: '订单数据', menu: 'orders' }
            },

            {
                path: 'salaryList',
                name: 'salaryList',
                component: () =>
                    import ('@/views/finance/salaryList'),
                meta: { title: '薪资列表', menu: 'divide' }
            },
            {
                path: 'salaryDetail/:id',
                name: 'salaryDetail',
                component: () =>
                    import ('@/views/finance/salaryDetail'),
                hidden: true,
                meta: { title: '薪资详情', menu: 'divide' }
            },
            {
                path: 'bestowDetail/:id',
                name: 'bestowDetail',
                component: () =>
                    import ('@/views/finance/bestowDetail'),
                hidden: true,
                meta: { title: '打赏详情', menu: 'divide' }
            },
            {
                path: 'rewardDetail/:id',
                name: 'rewardDetail',
                component: () =>
                    import ('@/views/finance/rewardDetail'),
                hidden: true,
                meta: { title: '打赏明细', menu: '' }
            },
            {
                path: 'rewardRecord',
                name: 'rewardRecord',
                component: () =>
                    import ('@/views/finance/rewardRecord'),
                meta: { title: '打赏记录', menu: 'bestow' }
            },
            // {
            //   path: 'bill',
            //   name: 'bill',
            //   component: () => import('@/views/finance/bill'),
            //   meta: {title: '客户账单', admin: true}
            // },
            {
                path: 'financeSet',
                name: 'financeSet',
                component: () =>
                    import ('@/views/finance/financeSet'),
                meta: { title: '财务设置', menu: 'financialSetting' }
            },
            {
                path: 'offlineRecharge',
                name: 'offlineRecharge',
                component: () =>
                    import ('@/views/finance/offlineRecharge'),
                hidden: true,
                meta: { title: '线下充值' }
            },
        ]
    },
    {
        path: '/business',
        component: Layout,
        redirect: '/business/businessData',
        name: '业务中心',
        meta: { title: '业务中心', icon: 'business', menu: 'business' },
        children: [{
                path: 'businessData',
                name: 'businessData',
                component: () =>
                    import ('@/views/business/businessData'),
                meta: { title: '业务数据', menu: 'businessData' }
            },
            {
                path: 'ranking',
                name: 'ranking',
                component: () =>
                    import ('@/views/business/ranking'),
                meta: { title: '业绩排行', menu: 'businessRanking' }
            },
            {
                path: 'training',
                name: 'training',
                component: () =>
                    import ('@/views/business/training'),
                meta: { title: '新人培训', menu: 'newcomer' }
            },
            {
                path: 'clientPool',
                name: 'clientPool',
                component: () =>
                    import ('@/views/business/clientPool'),
                meta: { title: '客户池', menu: 'customerPool' }
            },
            {
                path: 'PKlist',
                name: 'PKlist',
                component: () =>
                    import ('@/views/business/PKlist'),
                meta: { title: 'PK列表', menu: 'pk' }
            },
            {
                path: 'businessProduct',
                name: 'businessProduct',
                component: () =>
                    import ('@/views/business/businessProduct'),
                meta: { title: '业务产品', menu: 'service' }
            },
            {
                path: 'businessArea',
                name: 'businessArea',
                component: () =>
                    import ('@/views/business/businessArea'),
                meta: { title: '业务领域', menu: 'serviceArea' }
            }, {
                path: 'businessAreaDetail/:id',
                name: 'businessAreaDetail',
                hidden: true,
                component: () =>
                    import ('@/views/business/businessAreaDetail'),
                meta: { title: '添加或编辑业务', menu: 'serviceArea' }
            },
            {
                path: 'trainingDetail/:id',
                name: 'trainingDetail',
                component: () =>
                    import ('@/views/business/trainingDetail'),
                hidden: true,
                meta: { title: '添加或编辑新人培训' }
            },
            {
                path: 'pkDetail/:id',
                name: 'pkDetail',
                component: () =>
                    import ('@/views/business/pkDetail'),
                hidden: true,
                meta: { title: '添加或编辑PK' }
            },
            {
                path: 'businessDetail/:id',
                name: 'businessDetail',
                component: () =>
                    import ('@/views/business/businessDetail'),
                hidden: true,
                meta: { title: '添加或编辑业务' }
            },
            {
                path: 'techTeacherDetail/:id',
                name: 'techTeacherDetail',
                component: () =>
                    import ('@/views/business/techTeacherDetail'),
                hidden: true,
                meta: { title: '更新技术老师信息' }
            },
            {
                path: 'viewTechTeacher/:id',
                name: 'viewTechTeacher',
                component: () =>
                    import ('@/views/business/viewTechTeacher'),
                hidden: true,
                meta: { title: '查看技术老师信息' }
            },
            {
                path: 'customerServiceDetail/:id',
                name: 'customerServiceDetail',
                component: () =>
                    import ('@/views/business/customerServiceDetail'),
                hidden: true,
                meta: { title: '更新客服信息' }
            },
            {
                path: 'viewcustomerService/:id',
                name: 'viewcustomerService',
                component: () =>
                    import ('@/views/business/viewcustomerService'),
                hidden: true,
                meta: { title: '查看客服信息' }
            },
        ]
    },
    // {
    //   path: '/afterSale',
    //   component: Layout,
    //   redirect: '/afterSale/index',
    //   name: '售后',
    //   meta: {title: '售后', icon: 'example'},
    //   children: [
    //     {
    //       path: 'index',
    //       name: 'afterSale',
    //       component: () => import('@/views/afterSale/index'),
    //       meta: {title: '售后', icon: 'table', admin: true}
    //     },
    //   ]
    // },
    {
        path: '/order',
        component: Layout,
        redirect: '/order/rechargeOrder',
        name: '订单',
        hidden: true,
        meta: { title: '订单', icon: 'example' },
        children: [{
                path: 'rechargeOrder',
                name: 'rechargeOrder',
                component: () =>
                    import ('@/views/order/rechargeOrder'),
                meta: { title: '充值订单' }
            },
            {
                path: 'appointment',
                name: 'appointment',
                component: () =>
                    import ('@/views/order/appointment'),
                meta: { title: '活动预约', admin: true }
            }, {
                path: 'buyCourse',
                name: 'buyCourse',
                component: () =>
                    import ('@/views/order/buyCourse'),
                meta: { title: '课程购买', admin: true }
            }, {
                path: 'LiveWatch',
                name: 'LiveWatch',
                component: () =>
                    import ('@/views/order/LiveWatch'),
                meta: { title: '直播观看', admin: true }
            }, {
                path: 'LiveReward ',
                name: 'LiveReward',
                component: () =>
                    import ('@/views/order/LiveReward'),
                meta: { title: '直播打赏', admin: true }
            }, {
                path: 'businessPurchase',
                name: 'businessPurchase',
                component: () =>
                    import ('@/views/order/businessPurchase'),
                meta: { title: '业务购买', admin: true }
            }, {
                path: 'businessEvaluationReward',
                name: 'businessEvaluationReward',
                component: () =>
                    import ('@/views/order/businessEvaluationReward'),
                meta: { title: '业务评价打赏', admin: true }
            },
        ]
    },
    {
        path: '/check',
        component: Layout,
        redirect: '/check/courseCheck',
        name: '审核',
        hidden: true,
        meta: { title: '审核', icon: 'example' },
        children: [{
                path: 'courseCheck',
                name: 'courseCheck',
                component: () =>
                    import ('@/views/check/courseCheck'),
                meta: { title: '课程', admin: true }
            }, {
                path: 'courseView/:id',
                name: 'courseView',
                component: () =>
                    import ('@/views/check/courseView'),
                hidden: true,
                meta: { title: '查看课程', admin: true }
            }, {
                path: 'liveCheck',
                name: 'liveCheck',
                component: () =>
                    import ('@/views/check/liveCheck'),
                meta: { title: '直播', admin: true }
            },
            {
                path: 'liveView/:id',
                name: 'liveView',
                component: () =>
                    import ('@/views/check/liveView'),
                hidden: true,
                meta: { title: '查看直播', admin: true }
            },
            {
                path: 'liveBuysClientList/:id',
                name: 'liveBuysClientList',
                component: () =>
                    import ('@/views/check/liveBuysClientList'),
                hidden: true,
                meta: { title: '购买名单', admin: true }
            },
            {
                path: 'liveDatingClientList/:id',
                name: 'liveDatingClientList',
                component: () =>
                    import ('@/views/check/liveDatingClientList'),
                hidden: true,
                meta: { title: '预约名单', admin: true }
            },
            {
                path: 'offLineCheck',
                name: 'offLineCheck',
                component: () =>
                    import ('@/views/check/offLineCheck'),
                meta: { title: '线下活动', admin: true }
            }, {
                path: 'offLineActivityView/:id',
                name: 'offLineActivityView',
                component: () =>
                    import ('@/views/check/offLineActivityView'),
                hidden: true,
                meta: { title: '查看线下活动', admin: true }
            },
        ]
    },
    // {
    //   path: '/coupon',
    //   component: Layout,
    //   redirect: '/coupon/index',
    //   name: '优惠券',
    //   meta: {title: '优惠券', icon: 'example'},
    //   children: [
    //     {
    //       path: 'coupon',
    //       name: 'coupon',
    //       component: () => import('@/views/coupon/coupon'),
    //       meta: {title: '优惠券', admin: true}
    //     },
    //     // {
    //     //   path: 'index',
    //     //   name: 'index',
    //     //   component: () => import('@/views/coupon/index.vue'),
    //     //   meta: {title: '原优惠券', icon: 'table', admin: true}
    //     // },
    //     {
    //       path: 'couponChildDetail/:id',
    //       name: 'couponChildDetail',
    //       component: () => import('@/views/coupon/couponChildDetail'),
    //       hidden: true,
    //       meta: {title: '添加或编辑优惠券', admin: true}
    //     },
    //     {
    //       path: 'issueCouponDetail/:id',
    //       name: 'issueCouponDetail',
    //       component: () => import('@/views/coupon/issueCouponDetail'),
    //       hidden: true,
    //       meta: {title: '编辑发送优惠券', admin: true}
    //     },
    //     {
    //       path: 'couponDetail/:id',
    //       name: 'couponDetail',
    //       component: () => import('@/views/coupon/couponDetail'),
    //       hidden: true,
    //       meta: {title: '添加或编辑优惠券', admin: true}
    //     },
    //   ]
    // },
    {
        path: '/setting',
        component: Layout,
        redirect: '/setting/log',
        name: '设置',
        meta: { title: '设置', icon: 'setting', menu: 'settings' },
        children: [
            // {
            //   path: 'index',
            //   name: 'setting',
            //   component: () => import('@/views/setting/index'),
            //   meta: {title: '全局设置', admin: true}
            // },
            {
                path: 'log',
                name: 'log',
                component: () =>
                    import ('@/views/setting/log'),
                meta: { title: '操作日志', menu: 'logs' }
            },
            {
                path: 'permission',
                name: 'permission',
                component: () =>
                    import ('@/views/setting/permission'),
                meta: { title: '权限设置', menu: 'roles' }
            },
            {
                path: 'vipAbout',
                name: 'vipAbout',
                component: () =>
                    import ('@/views/setting/vipAbout'),
                meta: { title: '会员相关', menu: 'members' }
            },
            {
                path: 'classification',
                name: 'classification',
                component: () =>
                    import ('@/views/setting/classification'),
                hidden: true,
                meta: { title: '分类设置', admin: true }
            },
            {
                path: 'workCircleClassification',
                name: 'workCircleClassification',
                component: () =>
                    import ('@/views/setting/workCircleClassification'),
                hidden: true,
                meta: { title: '分类设置', admin: true }
            },
            // {
            //   path: 'award',
            //   name: 'award',
            //   component: () => import('@/views/setting/award'),
            //   meta: {title: '奖励设置', admin: true}
            // },
            // {
            //   path: 'recharge',
            //   name: 'recharge',
            //   component: () => import('@/views/setting/recharge'),
            //   meta: {title: '充值设置', admin: true}
            // }, {
            //   path: 'vip',
            //   name: 'vip',
            //   component: () => import('@/views/setting/vip'),
            //   meta: {title: 'vip级别设置', admin: true}
            // },
            {
                path: 'addVipDetail/:id',
                name: 'addVipDetail',
                component: () =>
                    import ('@/views/setting/addVipDetail'),
                hidden: true,
                meta: { title: '添加或编辑会员' }
            },
            {
                path: 'addPermissonl/:id',
                name: 'addPermissonl',
                component: () =>
                    import ('@/views/setting/addPermissonl'),
                hidden: true,
                meta: { title: '添加或编辑权限' }
            },
            {
                path: 'vipDetail/:id',
                name: 'vipDetail',
                component: () =>
                    import ('@/views/setting/vipDetail'),
                hidden: true,
                meta: { title: '原添加或编辑vip级别设置' }
            },
            {
                path: 'roleDetail/:id',
                name: 'roleDetail',
                component: () =>
                    import ('@/views/setting/roleDetail'),
                hidden: true,
                meta: { title: '编辑角色' }
            },
            {
                path: 'roleView',
                name: 'roleView',
                component: () =>
                    import ('@/views/setting/roleView'),
                hidden: true,
                meta: { title: '查看角色' }
            },
            {
                path: 'roleView2/:id',
                name: 'roleView2',
                component: () =>
                    import ('@/views/setting/roleView2'),
                hidden: true,
                meta: { title: '查看角色' }
            },
            {
                path: 'editPermisson/:id',
                name: 'editPermisson',
                component: () =>
                    import ('@/views/setting/editPermisson'),
                hidden: true,
                meta: { title: '添加或编辑权限组' }
            },
            {
                path: 'gift',
                name: 'gift',
                component: () =>
                    import ('@/views/setting/gift'),
                meta: { title: '礼物设置', menu: 'gifts' }
            },
            {
                path: 'appraiseSet',
                name: 'appraiseSet',
                component: () =>
                    import ('@/views/setting/appraiseSet'),
                hidden: true,
                meta: { title: '评价设置', menu: 'gifts' }
            },
            {
                path: 'giftLiveDetail/:id',
                name: 'giftLiveDetail',
                component: () =>
                    import ('@/views/setting/giftLiveDetail'),
                hidden: true,
                meta: { title: '添加或编辑直播礼物' }
            },
            {
                path: 'giftEvaluationDetail/:id',
                name: 'giftEvaluationDetail',
                component: () =>
                    import ('@/views/setting/giftEvaluationDetail'),
                hidden: true,
                meta: { title: '添加或编辑打赏礼物' },

            },
            // {
            //   path: 'couponReward',
            //   name: 'couponReward',
            //   component: () => import('@/views/setting/couponReward'),
            //   meta: {title: '优惠券奖励设置', admin: true},
            //   // children: [
            //   //   {
            //   //     path: 'gift',
            //   //     name: 'gift',
            //   //     component: () => import('@/views/setting/gift'),
            //   //     meta: {title: '礼物设置', admin: true}
            //   //   },
            //   //   {
            //   //     path: 'vip',
            //   //     name: 'vip',
            //   //     component: () => import('@/views/setting/vip'),
            //   //     meta: {title: 'vip级别设置', admin: true}
            //   //   },
            //   // ]
            // },
            {
                path: 'coupon',
                name: 'coupon',
                component: () =>
                    import ('@/views/setting/coupon'),
                meta: { title: '优惠券', menu: 'coupons' }
            },
            {
                path: 'quickEntry',
                name: 'quickEntry',
                component: () =>
                    import ('@/views/setting/quickEntry'),
                meta: { title: '快捷入口', menu: 'quickEntry' }
            },
            {
                path: 'otherSettiing',
                name: 'otherSettiing',
                component: () =>
                    import ('@/views/setting/otherSettiing'),
                meta: { title: '其他设置', menu: 'other' }
            },
            {
                path: 'couponChildDetail/:id',
                name: 'couponChildDetail',
                component: () =>
                    import ('@/views/setting/couponChildDetail'),
                hidden: true,
                meta: { title: '添加或编辑优惠券' }
            },
            {
                path: 'auxiliaryToolDetail/:id',
                name: 'auxiliaryToolDetail',
                component: () =>
                    import ('@/views/setting/auxiliaryToolDetail'),
                hidden: true,
                meta: { title: '添加或编辑辅助工具' }
            },
            {
                path: 'smartStrategypDetail/:id',
                name: 'smartStrategypDetail',
                component: () =>
                    import ('@/views/setting/smartStrategypDetail'),
                hidden: true,
                meta: { title: '添加或编辑智能攻略' }
            },
            {
                path: 'issueCouponDetail/:id',
                name: 'issueCouponDetail',
                component: () =>
                    import ('@/views/setting/issueCouponDetail'),
                hidden: true,
                meta: { title: '编辑发送优惠券' }
            },
            {
                path: 'helpDetail/:id',
                name: 'helpDetail',
                component: () =>
                    import ('@/views/setting/helpDetail'),
                hidden: true,
                meta: { title: '添加或编辑帮助文档' }
            },
            {
                path: 'aboutUsDetail/:id',
                name: 'aboutUsDetail',
                component: () =>
                    import ('@/views/setting/aboutUsDetail'),
                hidden: true,
                meta: { title: '编辑关于我们' }
            },
            {
                path: 'versionUpload/:id',
                name: 'versionUpload',
                component: () =>
                    import ('@/views/setting/versionUpload'),
                hidden: true,
                meta: { title: '版本上传' }
            },
            {
                path: 'signDetail/:id',
                name: 'signDetail',
                component: () =>
                    import ('@/views/setting/signDetail'),
                hidden: true,
                meta: { title: '添加或编辑签到奖励设置' }
            },
            {
                path: 'registerDetail/:id',
                name: 'registerDetail',
                component: () =>
                    import ('@/views/setting/registerDetail'),
                hidden: true,
                meta: { title: '添加或编辑注册成功奖励优惠券设置' }
            },
            {
                path: 'salesmanIssueDetail/:id',
                name: 'salesmanIssueDetail',
                component: () =>
                    import ('@/views/setting/salesmanIssueDetail'),
                hidden: true,
                meta: { title: '添加或编辑发放业务员奖励' }
            },

            // {
            //   path: 'courseRule',
            //   name: 'courseRule',
            //   component: () => import('@/views/setting/courseRule'),
            //   meta: { title: '课程全局规则设置',admin:true }
            // },
            // {
            //   path: 'permissonSetting',
            //   name: 'permissonSetting',
            //   component: () => import('@/views/setting/permissonSetting'),
            //   meta: { title: '权限设置',admin:true }
            // },
        ]
    },
];

function hasPermission(menus, route) {
    if (route.meta && route.meta.menu && menus) {
        /*
         * 如果这个路由有menu属性,就需要判断用户是否拥有此menu权限
         */
        return menus.indexOf(route.meta.menu) > -1;
    } else {
        return true
    }
}

function filterAsyncRoutes(asyncRoutes, menus) {
    return asyncRoutes.filter(route => {
        if (hasPermission(menus, route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRoutes(route.children, menus)
                return (route.children && route.children.length)
            }
            return true
        }
        return false
    })
}

function createRouter() {
    let menus = JSON.parse(localStorage.getItem("menus"));
    let accessedRouters = filterAsyncRoutes(constantRoutes, menus);
    //console.log(accessedRouters, "accessedRouters");
    return new Router({
        // mode: 'history', // require service support
        scrollBehavior: () => ({
            y: 0
        }),
        routes: accessedRouters,
        routesTemp: accessedRouters,
    })
}

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
