<template>
  <div class="businessData">
    <div class="head">
      <div class="back">
        销售业绩
        <div class="line"></div>
      </div>
      <div class="save" @click="exportData" v-if="hasPerm('business:businessData:export')">导出</div>
    </div>
    <div class="content">
      <div class="top">
        <div class="item">
          <p>今日消费金额</p>
          <h4>{{todayConsume|showDecimal}}</h4>
        </div>
        <div class="item">
          <p>今日充值金额</p>
          <h4>{{todayRecharge|showDecimal}}</h4>
        </div>
        <div class="item">
          <p>总充值金额</p>
          <h4>{{totalRecharge|showDecimal}}</h4>
        </div>
        <div class="item">
          <p>剩余储值金额</p>
          <h4>{{surplusRecharge|showDecimal}}</h4>
        </div>
        <div class="item">
          <p>总注册量</p>
          <h4>{{register}}</h4>
        </div>


      </div>
      <div class="client">
        <div class="filter-container">
          <div class="left">
            每日汇总
          </div>
          <!--<div class="right">-->
            <!--<el-input @keyup.enter.native="getList" style="width: 300px;margin-left: 20px" class="filter-item"-->
                      <!--placeholder="搜索你想要的内容"-->
                      <!--v-model="listQuery.keyword">-->
            <!--</el-input>-->
            <!--<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">-->
              <!--搜索-->
            <!--</el-button>-->

          <!--</div>-->
        </div>

        <el-table
          :data="list"
          v-if="hasPerm('business:businessData:list')"
          stripe
          style="width: 100%">

          <!--<el-table-column align="center" label="ID" width="80">-->
            <!--<template slot-scope="scope">-->
              <!--<span>{{scope.row.id}}</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column align="center" label="时间">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | parseTime('{y}-{m}-{d}')}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="充值金额">
            <template slot-scope="scope">
              <span>{{scope.row.recharge | showDecimal}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="消费金额">
            <template slot-scope="scope">
              <span>{{scope.row.consume | showDecimal}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="注册量">
            <template slot-scope="scope">
              <span>{{scope.row.register}}</span>
            </template>
          </el-table-column>

          <!--<el-table-column-->
            <!--style="color:#5BC0DF;"-->
            <!--align="center"-->
            <!--label="操作"-->
            <!--class-name="small-padding fixed-width"-->
          <!--&gt;-->
            <!--<template slot-scope="scope">-->
              <!--<div class="action">-->
                <!--&lt;!&ndash;<el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA">删除</el-button>&ndash;&gt;-->
                <!--<el-button type="text" size="mini" @click="addTag(scope.row)" style="color: #F65860">查看</el-button>-->

              <!--</div>-->

            <!--</template>-->
          <!--</el-table-column>-->
        </el-table>

        <div class="paginationBox">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10,20,30, 50]"
            :page-size="listQuery.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

  import {
    statisticsRealTime,
    statisticsHistories,
  } from "../../api/business";
  import {vipAll} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import qqmap from "@/components/qqmap/index";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "businessData",
    directives: {
      waves,
    },
    data() {
      return {
        todayConsume: null,
        todayRecharge: null,
        totalRecharge: null,
        surplusRecharge: null,
        register: null,
        listLoading: false,
        total: 0,
        page: 1,
        vipData: [],
        list: [],
        listQuery: {
          createTime: 0,
          orderBy: 0,
          limit: 10,
          page: 0,
          staffId: 0,
          timeType: "day",
          token: getToken(),
        }

      };
    },
    methods: {
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val - 1
        this.page = this.listQuery.page + 1
        this.getList()
      },
      exportData() {
        let url ="http:"+ window.API_BASE_URI + "/api/v1" + '/statistics/orderExport?token='+ encodeURIComponent(getToken());
        console.log(url,"url");
        window.open(url, '_blank')
      },

      //   statistics/histories
      // 历史统计数据      // 列表
      getList() {
        this.listLoading = true;
        statisticsHistories(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }
        })
      },

      statisticsRealTime() {
        statisticsRealTime({
          token: getToken()
        }).then(json => {
          if (json.status === 200) {
            // console.log(json);
            this.todayConsume = json.data.today.consume;   //今日消费金额
            this.todayRecharge = json.data.today.recharge + json.data.today.rechargeGift;   //今日充值金额
            this.totalRecharge = json.data.total.recharge + json.data.total.rechargeGift;   //总充值金额
            //剩余储值金额
            this.surplusRecharge = Math.abs(json.data.total.recharge + json.data.total.rechargeGift + json.data.total.consume)
            this.register = json.data.total.register;   //总注册量

          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }
        });
      },
    },
    mounted() {
      this.statisticsRealTime()
      this.getList()
    }
  };
</script>
<style>

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .app-container .right {
    margin: 20px 0;
    text-align: right;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .businessData .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .businessData .el-textarea {
    width: 86%;
  }

  .businessData .time .el-form-item__content {
    margin-left: 16px !important;
  }
  .businessData .filter-container .filter-item{
    margin-bottom: 0;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .businessData {
    background: rgba(245, 246, 250, 0.61);
    .head {
      background: white;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 27px 0 40px;
      .back {
        color: #409EFF;
        font-size: 14px;
        cursor: pointer;
        line-height: 40px;
        position: relative;
        /*border-bottom: 2px solid #5BC0DF;*/
      }
      .line {
        width: 32px;
        height: 2px;
        background: #409EFF;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
      .save {
        color: #F65860;
        cursor: pointer;
        font-size: 14px;
      }
    }
    .content {
      min-height: 100vh;
      padding: 24px;

      display: flex;
      flex-direction: column;
      .form-container {
        background: white;
        padding: 30px 0 100px;
      }
      & > .top {
        width: 100%;
        background: white;
        margin-bottom: 24px;
        padding: 30px;
        display: flex;
        /*border: 1px solid red;*/
        align-items: center;
        .item{
          /*border: 1px solid red;*/
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: auto;
          h4,p{
            margin: 0;
          }
          p{
            color:#999999;
            font-size: 13px;
            margin-bottom:14px;
          }
          h4{
            color:#101010;
            font-weight: 600;
            font-size: 22px;
          }

        }
      }
      & > .client {
        width: 100%;
        background: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .filter-container {
          display: flex;
          justify-content: space-between;
          background: white;
          padding:0 20px;
          height: 60px;
          border-bottom: 1px solid #f2f2f2;
          align-items: center;
          .left {
            color: #409EFF;
            font-size: 14px;
          }
        }
        .action {
          display: flex;
          justify-content: center;
          .status {
            display: flex;
            align-items: center;
            margin-right: 20px;
            span {
              margin-right: 6px;
            }
          }
        }
        .el-table {
          min-height: calc(100vh - 374px);

        }
        .paginationBox {
          margin: 10px auto;
          text-align: center;
        }
      }
    }

  }
</style>
