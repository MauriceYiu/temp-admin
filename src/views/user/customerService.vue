<template>
  <div class="customerService">
    <el-tabs v-model="activeUserName" @tab-click="handleClick">
      <el-tab-pane label="客服" name="kefu" v-if="hasPerm('customers:afterSale:customerService')">
        <kefu ref="kefu"></kefu>
      </el-tab-pane>
      <el-tab-pane label="售后" name="service" v-if="hasPerm('customers:afterSale:list')">
        <service ref="service"></service>
      </el-tab-pane>
      <el-tab-pane label="评价打赏" name="evaluateRreward" v-if="hasPerm('customers:afterSale:evaluate')">
        <evaluateRreward ref="evaluateRreward"></evaluateRreward>
      </el-tab-pane>

    </el-tabs>

    <div class="right" v-if="activeUserName === 'service'">
      <el-popover
        placement="left"
        @hide="afterSaleFormReset"
        v-model="afterSaleVisible">
        <el-form class="form-container" ref="postForm" label-width="100px">
          <el-form-item label="选择业务订单">
            <el-select
              style="width: 300px"
              v-model="afterSaleParams.orderId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入客户昵称或手机号码"
              :remote-method="remoteMethod"
              :loading="loading">
              <el-option
                v-for="item in serviceOptions"
                :key="item.id"
                :label="item.serviceName + '，订单号' + item.number"
                :value="item.id">
                <span>{{ item.serviceName }}，订单号{{ item.number }}，老师：{{ item.teacherName }}，客户昵称：{{ item.userName }}({{ item.mobile }})，下单时间：{{item.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="售后类型">
            <el-select v-model="afterSaleParams.type"
                       style="width: 300px"
                       placeholder="请选择售后类型">
              <el-option
                v-for="(item,index) in afterSaleOptions"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="售后原因">
            <el-input v-model="afterSaleParams.reason" placeholder="请输入售后原因"/>
          </el-form-item>
          <div style="text-align: right; margin: 20px 0 10px 0">
            <el-button size="small" type="text" @click="afterSaleFormReset">取消
            </el-button>
            <el-button type="primary" size="small" @click="afterSaleSubmit" :loading="afterSaleSubmiting">确定</el-button>
          </div>
        </el-form>
        <div slot="reference" class="salaryExport">提交售后</div>
      </el-popover>
      <el-popover
        placement="left"
        v-model="visible">
        <p>请选择时间区间，最长不超过60天</p>
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
  import kefu from "./components/kefu"; //子组件
  import service from "./components/service"; //子组件
  import evaluateRreward from "./components/evaluateRreward"; //子组件
  import {parseTime, showDecimal} from "@/utils";
  import {getToken} from "@/utils/auth";
  import {serviceBuys} from "../../api/financeData";
  import {serviceRequireAfterSale} from "../../api/user";

  export default {
    name: "customerService",
    directives: {
      waves,
    },
    components: {
      kefu,
      service,
      evaluateRreward,
    },

    data() {
      return {
        activeUserName: 'kefu',
        serviceOptions: [],
        afterSaleOptions: [
          '服务售后', '评价售后', '退款售后'
        ],
        afterSaleVisible: false,
        afterSaleSubmiting: false,
        loading: false,
        visible: false,
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
        afterSaleParams: {
          orderId: null,
          type: null,
          reason: null
        }
      };
    },
    methods: {
      remoteMethod(query) {
        if (query !== '' && query.length > 1) {
          this.loading = true;
          serviceBuys({
            keyword: query,
            statuses: ['rejectEdit', 'ing', 'evaluate']
          }).then(json => {
            this.loading = false;
            console.log(json);
            if (json.data) {
              this.serviceOptions = json.data
            }
          }).catch(e => {
            this.loading = false;

          })
        } else {
          this.serviceOptions = [];
        }
      },
      afterSaleFormReset() {
        this.afterSaleVisible = false, this.serviceOptions = [], this.afterSaleParams.orderId = null
      },
      afterSaleSubmit() {
        this.afterSaleSubmiting = true
        serviceRequireAfterSale(this.afterSaleParams).then(json => {
          this.afterSaleSubmiting = false
          if (json.status === 200) {
            this.afterSaleFormReset();
            this.$refs.service.getVipList();
          }
        }).catch(e => {
          this.afterSaleSubmiting = false
        })
      },
      handleClick(tab, event) {
        console.log(this.activeUserName);
        sessionStorage.setItem('activeUserName', this.activeUserName)
        this.getList();
      },
      addTag(num) {
        switch (num) {
          case 1:
            this.$router.push({
              name: "activityDetail", params: {
                id: 0
              }
            })
            break;
          case 3:
            this.$router.push({
              name: "guestDetail", params: {
                id: 0
              }
            })
            break;
        }

      },
      getList() {
        switch (this.activeUserName) {
          case "kefu":
            this.$refs.kefu.getVipList()
            break;
          case "service":
            this.$refs.service.getVipList();
            break;
          case "evaluateRreward":
            this.$refs.evaluateRreward.getVipList();
            break;
        }
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

        if (endTime - startTime > 60 * 24 * 60 * 60) {
          this.$message.error('时期范围最大跨度为60天')
          return;
        }

        this.visible = false;
        let url = window.API_BASE_URI + '/api/v1/service/order/afterSale/export?startTime=' + startTime + '&endTime=' + endTime + '&token=' + encodeURIComponent(getToken());
        console.log(url, "url");
        if (url) window.open(url, '_blank')
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeUserName')) {
        this.activeUserName = sessionStorage.getItem('activeUserName')
      } else {
        this.activeUserName = "kefu"
      }
      console.log(this.activeUserName, "activeUserName");
      this.getList()
    }
  };
</script>
<style>
  .customerService .el-tabs__nav {
    margin-left: 40px;
  }

  .customerService .el-tabs__nav-wrap::after {
    background: none;
  }

  .customerService .el-tabs__header {
    margin: 0;
  }

  .customerService .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }

  .el-table::before {
    background: none;
  }
</style>
<style lang="scss" scoped>
  .customerService {
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
