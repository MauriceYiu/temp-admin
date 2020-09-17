<template>
  <div class="orderData">

    <el-tabs v-model="activeNameOrderData" @tab-click="handleClick">
      <el-tab-pane label="充值订单" name="rechargeOrder" v-if="hasPerm('financial:orders:recharge')">
        <rechargeOrder ref="rechargeOrder"></rechargeOrder>
      </el-tab-pane>
      <el-tab-pane label="课程购买" name="courseBuy" v-if="hasPerm('financial:orders:course')">
        <courseBuy ref="courseBuy"></courseBuy>
      </el-tab-pane>
      <el-tab-pane label="业务服务" name="businessService" v-if="hasPerm('financial:orders:service')">
        <businessService ref="businessService"></businessService>
      </el-tab-pane>
      <el-tab-pane label="直播观看" name="liveWatch" v-if="hasPerm('financial:orders:live')">
        <liveWatch ref="liveWatch"></liveWatch>
      </el-tab-pane>
      <el-tab-pane label="线下课程" name="OfflineCourse" v-if="hasPerm('financial:orders:activity')">
        <OfflineCourse ref="OfflineCourse"></OfflineCourse>
      </el-tab-pane>

    </el-tabs>

    <div class="right">
      <div class="recharge" @click="recharge"
           v-if="activeNameOrderData ==='rechargeOrder' && hasPerm('financial:orders:recharge:offline')">线下充值
      </div>
      <el-popover
        placement="left"
        v-model="visible">
        <p>请选择时间区间，最长不超过180天</p>
        <el-date-picker
          v-model="dates"
          type="datetimerange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
        <div style="text-align: right; margin: 20px 0 10px 0">
          <el-button size="small" type="text" @click="visible = false">取消</el-button>
          <el-button type="primary" size="small" @click="salaryExport">确定</el-button>
        </div>
        <div slot="reference" class="salaryExport">数据导出</div>
      </el-popover>
    </div>

  </div>
</template>

<script>

  import waves from "@/directive/waves"; // 水波纹指令
  import rechargeOrder from "./components/rechargeOrder"; //子组件
  import courseBuy from "./components/courseBuy"; //子组件
  import businessService from "./components/businessService"; //子组件
  import liveWatch from "./components/liveWatch"; //子组件
  import OfflineCourse from "./components/OfflineCourse"; //子组件
  import {parseTime, showDecimal} from "@/utils";
  import {getToken} from "@/utils/auth";


  export default {
    name: "orderData",
    directives: {
      waves,
    },
    components: {
      rechargeOrder,
      courseBuy,
      businessService,
      liveWatch,
      OfflineCourse,
    },

    data() {
      return {
        visible: false,
        activeNameOrderData: 'rechargeOrder',
        dates: null,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeNameOrderData);
        sessionStorage.setItem('activeNameOrderData', this.activeNameOrderData)
        this.getList();
      },
      recharge() {
        this.$router.push({name: "offlineRecharge"})
      },
      salaryExport() {
        console.log(this.dates);
        if (!this.dates || this.dates.length !== 2) {
          this.$message.error('请选择时期范围')
          return
        }
        let startTime = parseInt(this.dates[0].getTime() / 1000);
        let endTime = parseInt(this.dates[1].getTime() / 1000);
        console.log(startTime);
        console.log(endTime);

        if (endTime - startTime > 180 * 24 * 60 * 60) {
          this.$message.error('时期范围最大跨度为180天')
          return;
        }

        this.visible = false;
        let url = null;
        switch (this.activeNameOrderData) {
          case "rechargeOrder":
            url = window.API_BASE_URI + '/api/v1/wealth/order/export?startTime=' + startTime + '&endTime=' + endTime + '&token=' + encodeURIComponent(getToken());
            break;
          case "courseBuy":
            url = window.API_BASE_URI + '/api/v1/course/order/export?startTime=' + startTime + '&endTime=' + endTime + '&token=' + encodeURIComponent(getToken());
            break;
          case "businessService":
            url = window.API_BASE_URI + '/api/v1/service/order/export?startTime=' + startTime + '&endTime=' + endTime + '&token=' + encodeURIComponent(getToken());
            break;
          case "liveWatch":
            url = window.API_BASE_URI + '/api/v1/live/order/export?startTime=' + startTime + '&endTime=' + endTime + '&token=' + encodeURIComponent(getToken());
            break;
          case "OfflineCourse":
            url = window.API_BASE_URI + '/api/v1/activity/order/export?startTime=' + startTime + '&endTime=' + endTime + '&token=' + encodeURIComponent(getToken());
            break;
        }
        console.log(url, "url");
        if (url) window.open(url, '_blank')
      },
      addTag() {
        this.$router.push({name: "classification"})

      },
      getList() {
        switch (this.activeNameOrderData) {
          case "rechargeOrder":
            this.$refs.rechargeOrder.getVipList();
            break;
          case "courseBuy":
            this.$refs.courseBuy.getVipList();
            break;
          case "businessService":
            this.$refs.businessService.getVipList();
            break;
          case "liveWatch":
            this.$refs.liveWatch.getVipList();
            break;
          case "OfflineCourse":
            this.$refs.OfflineCourse.getVipList();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeNameOrderData')) {
        this.activeNameOrderData = sessionStorage.getItem('activeNameOrderData')
      } else {
        this.activeNameOrderData = "rechargeOrder"
      }
      console.log(this.activeNameOrderData, "activeNameOrderData");
      this.getList()
    }
  };
</script>
<style>
  .orderData .el-tabs__nav {
    margin-left: 40px;
  }

  .orderData .el-tabs__nav-wrap::after {
    background: none;
  }

  .orderData .el-tabs__header {
    margin: 0;
  }

  .orderData .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }

  .el-table::before {
    background: none;
  }
</style>
<style lang="scss" scoped>
  .orderData {
    position: relative;
    min-height: calc(100vh - 60px);

    .right {
      position: absolute;
      right: 27px;
      top: 10px;
      display: flex;
      align-items: center;

      .newAdd {
        color: #666666;
        font-size: 14px;
        cursor: pointer;
      }

      .recharge {
        color: #1B9AF7;
        font-size: 14px;
        cursor: pointer;
        margin-left: 40px;
      }

      .salaryExport {
        color: #F65860;
        font-size: 14px;
        cursor: pointer;
        margin-left: 40px;
      }
    }

  }
</style>
