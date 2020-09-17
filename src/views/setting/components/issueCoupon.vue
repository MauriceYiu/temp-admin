<template>
  <div class="issueCoupon">
    <div class="filter-container">
      <div class="left">
        全部
      </div>
      <div class="right">
        <!--<el-input @keyup.enter.native="getList" style="width: 300px;margin-left: 20px" class="filter-item"-->
        <!--placeholder="搜索你想要的内容"-->
        <!--v-model="listQuery.keyword">-->
        <!--</el-input>-->
        <!--<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">-->
        <!--搜索-->
        <!--</el-button>-->

      </div>
    </div>

    <el-table
      :data="list"
      stripe
      style="width: 100%">

      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="优惠券ID">
        <template slot-scope="scope">
          <span>{{scope.row.coupon.couponId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="优惠券名称">
        <template slot-scope="scope">
          <span>{{scope.row.coupon.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="面额">
        <template slot-scope="scope">
          <span>{{scope.row.coupon.value | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="满额">
        <template slot-scope="scope">
          <span>{{scope.row.coupon.suffice | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="过期类型">
        <template slot-scope="scope">
          <div v-if="scope.row.coupon.validStartTime">
            <span>{{scope.row.coupon.validStartTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            <p style="margin: 0">-</p>
            <span>{{scope.row.coupon.validEndTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </div>
          <span v-if="scope.row.coupon.days">领取后{{scope.row.coupon.days}}天过期</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发放总数">
        <template slot-scope="scope">
          <span>{{scope.row.amount*scope.row.userCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单人数量">
        <template slot-scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发放人数">
        <template slot-scope="scope">
          <span>{{scope.row.userCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发放总额">
        <template slot-scope="scope">
          <span>{{scope.row.userCount*scope.row.coupon.value | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发放时间">
        <template slot-scope="scope">
          <span>{{scope.row.sendTime  | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.sent ? '已发放':'待发放'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        style="color:#5BC0DF;"
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div class="action">
            <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA">删除</el-button>
            <el-button type="text" size="mini" @click="viewTag(scope.row.id)" style="color: #F65860">查看</el-button>

          </div>

        </template>
      </el-table-column>
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


    <el-dialog :title="dialogTitle" :visible.sync="issueDialog">
      <div class="issueNum">
        发放人数{{ total_Dialog }}人
      </div>
      <!--<el-input @keyup.enter.native="issueUserList" style="width: 300px;text-align: right" class="filter-item"-->
      <!--placeholder="搜索你想要的内容"-->
      <!--v-model="listQueryIssue.keyword">-->
      <!--</el-input>-->
      <!--<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getIssueList">-->
      <!--搜索-->
      <!--</el-button>-->
      <el-table :data="issueUserList" highlight-current-row>
        <el-table-column label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="工号">
          <template slot-scope="scope">
            <span>{{scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门">
          <template slot-scope="scope">
            <span>{{scope.row.departmentName}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>

  import {
    cgcList,
    cgcDetail,
    cgcDel,
    courseEnable,
  } from "../../../api/coupon";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "coupon",
    directives: {
      waves,
    },
    data() {
      return {
        listQuery: {
          limit: 10,
          page: 0,
          token: getToken(),
        },
        dialogTitle: "全部",
        total: 0,
        page: 1,
        list: [],
        issueUserList: [],
        listLoading: false,
        loading: false,
        enableParams: {
          targetId: "",
          yes: true,
          token: getToken(),
        },
        page_Dialog: 1,
        total_Dialog: 0,
        issueDialog: false,
        listQueryIssue: {
          targetId: 0
        },
        couponDelParams: {
          targetId: "",
          token: getToken(),
        }
      };
    },
    methods: {
      handleSizeChange_Dialog(val) {
        this.listQueryIssue.limit = val;
        this.getIssueList()
      },
      handleCurrentChange_Dialog(val) {
        this.listQueryIssue.page = val - 1
        this.page_Dialog = this.listQueryIssue.page + 1
        this.getIssueList()
      },
      getIssueList() {
        cgcDetail(this.listQueryIssue).then(json => {
          if (json.status === 200) {
            this.issueUserList = json.data.users;
            this.total_Dialog = json.data.users.length;
            // this.dialogTitle = "全部     "+ "发放人数" + json.data.users.length+"人"
          }
        })
      },
      changeStatus(value, item) {
        console.log(value);
        this.enableParams.targetId = item.id
        this.enableParams.yes = value
        courseEnable(this.enableParams).then(json => {
          if (json.status === 200) {
            console.log(json);
            // item.enable = !item.enable
          } else {

          }
        })
      },
      viewTag(id) {
        this.issueDialog = true
        this.listQueryIssue.targetId = id
        this.getIssueList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val - 1
        this.page = this.listQuery.page + 1

        this.getList()
      },
      //一级分类列表
      getList() {
        this.listLoading = true;
        cgcList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        })
      },

      //删除分类
      delTag(data) {
        this.couponDelParams.targetId = data.id;
        this.$confirm("此操作将删除该优惠券发放, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            cgcDel(this.couponDelParams).then(res => {
              if (res.status) {
                this.$message.success("删除成功！");
                this.getList();
              } else {
                this.$message.error(res.message);
              }
            });
          })
          .catch(() => {
            this.couponDelParams.targetId = "";
          });
      },

    },
    mounted() {
      // this.getList();
    }
  };
</script>
<style>

  .issueCoupon .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .issueCoupon .el-tabs__content {
    display: none;
  }

  .issueCoupon .el-dialog__title {
    font-size: 14px;
    color: #1B9AF7;
  }

  .issueCoupon .el-dialog__header {
    padding: 20px;
    border-bottom: 1px solid #f2f2f2;
  }

  .issueCoupon .filter-container .filter-item {
    margin-bottom: 0;
  }
</style>
<style lang="scss" scoped>
  .issueCoupon {
    margin: 20px;
    background: white;
    min-height: calc(100vh - 140px);
    position: relative;

    .filter-container {
      display: flex;
      justify-content: space-between;
      background: white;
      padding: 0 20px;
      height: 60px;
      border-bottom: 1px solid #f2f2f2;
      align-items: center;

      .left {
        color: #1B9AF7;
      }
    }

    img {
      width: 80px;
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
      min-height: calc(100vh - 260px);

    }

    .paginationBox {
      margin: 10px auto;
      text-align: center;
    }

    .issueNum {
      position: absolute;
      left: 95px;
      top: 23px;
    }

  }
</style>
