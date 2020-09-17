<template>
  <div class="financeCheck">
    <div class="filter-container">
      <div class="left">
        <el-tabs v-model="activeFinanceCheck" @tab-click="handleClick">
          <el-tab-pane label="未审核" name="first"></el-tab-pane>
          <el-tab-pane label="已审核" name="second"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="right">
        <el-input @keyup.enter.native="getList" style="width: 300px;margin-left: 20px" class="filter-item"
                  placeholder="搜索你想要的内容"
                  v-model="listQuery.keyword">
        </el-input>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
          搜索
        </el-button>

      </div>
    </div>

    <el-table
      :data="list"
      stripe
      style="width: 100%">

      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="提交人">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.rule}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户手机号">
        <template slot-scope="scope">
          <span>{{scope.row.reward}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员等级">
        <template slot-scope="scope">
          <span>{{scope.row.fromName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{scope.row.toName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="售后原因">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="退款金额">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.winnerId === 0 ? '进行中':'已结束'}}</span>
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
            <!--<el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA">删除</el-button>-->
            <el-button type="text" size="mini" @click="addTag(scope.row)" style="color: #F65860">查看</el-button>

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


  </div>
</template>

<script>
  import {
    salaryList,
    salaryDeal,
    salaryEdit,
  } from "../../../api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "financeCheck",
    directives: {
      waves,
    },
    data() {
      return {
        activeFinanceCheck: 'first',
        listQuery: {
          // 1已发放，2未发放  当前薪资应该是未发放的2，历史薪资应该是已发放的1
          deal: 2,
          limit: 10,
          page: 0,
          startTime: 0,
          dealEndTime: 0,
          dealStartTime: 0,
          type: "divide",
          token: getToken(),
        },
        formLabelWidth: '120px',
        weekStartTime: '',
        weekEndTime: '',
        total: 0,
        page: 1,
        form: {
          base: null,
          baseFormat: null,
          fine: null,
          fineFormat: null,
          reward: null,
          rewardFormat: null,
          targetId: 0,
          token: getToken(),
        },
        list: [],
        multipleSelection: [],
        listLoading: false,
        dialogFormVisible: false,
        settlementDialog: false,    //结算弹框
        loading: false,
        dealParams: {
          targetIds: [],
          remark: "",
          token: getToken(),
        },
        editIndex: -1
      };
    },
    methods: {
      change(e) {
        this.$forceUpdate()
      },
      getMondayStartTime() {
        let now = new Date(); //当前日期
        let nowDayOfWeek = now.getDay(); //今天本周的第几天
        let nowDay = now.getDate(); //当前日
        let nowMonth = now.getMonth(); //当前月
        let nowYear = now.getYear(); //当前年
        nowYear += (nowYear < 2000) ? 1900 : 0; //

        let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
        this.weekStartTime = (new Date(weekStartDate).getTime()) / 1000
        this.getSundayStartTime();

      },
      getSundayStartTime() {
        let now = new Date(); //当前日期
        let nowDayOfWeek = now.getDay(); //今天本周的第几天
        let nowDay = now.getDate(); //当前日
        let nowMonth = now.getMonth(); //当前月
        let nowYear = now.getYear(); //当前年
        nowYear += (nowYear < 2000) ? 1900 : 0; //
        let weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 7);
        this.weekEndTime = (new Date(weekEndDate).getTime()) / 1000
        this.getList()
      },
      handleClick(tab, event) {
        this.page = 1;
        this.total = 0;
        this.listQuery.page = 0;
        sessionStorage.setItem('activeFinanceCheck', this.activeFinanceCheck)
        // console.log(tab.name, event, "tab");
        switch (this.activeFinanceCheck) {
          case "first":
            this.listQuery.deal = 2;
            this.listQuery.startTime = 0;
            this.listQuery.dealEndTime = 0;
            this.listQuery.dealStartTime = 0;
            break;
          case "second":
            this.listQuery.deal = 1;
            this.listQuery.startTime = 0;
            this.listQuery.dealEndTime = this.weekEndTime;
            this.listQuery.dealStartTime = this.weekStartTime
            break;
          case "third":
            this.listQuery.deal = 2;
            this.listQuery.startTime = this.weekStartTime;
            this.listQuery.dealEndTime = 0;
            this.listQuery.dealStartTime = 0;
            break;
        }

        this.getList()
      },
      checkAll() {
        this.$refs.salaryTable.toggleAllSelection()
      },
      handleSelectionChange(val) {
        // console.log(val,"handleSelectionChange");
        this.multipleSelection = val;
        this.dealParams.targetIds = []
        this.multipleSelection.forEach((item, index) => {
          this.dealParams.targetIds.push(item.id)
        })
        console.log(this.dealParams.targetIds, "targetIds");
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val - 1
        this.page = this.listQuery.page + 1
        sessionStorage.setItem('settingVip', this.listQuery.page)
        this.getList()
      },
      changeStatus(value, item) {
        console.log(value);
        this.dealParams.targetId = item.id
        this.dealParams.yes = value
        activityCancel(this.dealParams).then(json => {
          if (json.status === 200) {
            console.log(json);
            // item.enable = !item.enable
          } else {

          }
        })
      },

// 列表
      getList() {

        this.listLoading = true;
        salaryList(this.listQuery).then(json => {
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

      selectionChange() {
        console.log();
      },
      edit(scope) {
        this.editIndex = scope.$index;
        let row = scope.row;
        this.form.targetId = row.id
        this.form.base = row.base
        this.form.fine = row.fine
        this.form.reward = row.reward
        this.form.baseFormat = row.base / 100
        this.form.fineFormat = row.fine / 100
        this.form.rewardFormat = row.reward / 100
        this.dialogFormVisible = true
      },
      goBalance(id) {
        this.settlementDialog = true
        if (id) {
          this.dealParams.targetIds = []
          this.dealParams.targetIds.push(id)
        }
      },
      viewTag(data) {
        this.$router.push({
          name: "salaryDetail", query: {
            id: data.id,
            data:data
          }
        })
      },
      // 结算
      settlementConfirm() {
        if (!this.dealParams.remark) {
          this.$message({
            message: "请输入结算原因",
            type: "error"
          });
          return false;
        }
        this.loading = true;
        salaryDeal(this.dealParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "结算成功！",
              type: json.status === 200 ? "success" : "error"
            })
            this.settlementDialog = false
            this.activeFinanceCheck = 'second'
            this.handleClick();
          }
        })
      },
      salaryEdit() {
        this.form.base = this.form.baseFormat * 100
        this.form.fine = this.form.fineFormat * 100
        this.form.reward = this.form.rewardFormat * 100
        this.dialogFormVisible = false
        console.log(this.form);
        salaryEdit(this.form).then(json => {
          if (json.status === 200) {
            this.list[this.editIndex].base = json.data.base;
            this.list[this.editIndex].fine = json.data.fine;
            this.list[this.editIndex].reward = json.data.reward;
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }
          this.editIndex = -1;
        })
      },


    },
    mounted() {
      if (sessionStorage.getItem('activeFinanceCheck')) {
        this.activeFinanceCheck = sessionStorage.getItem('activeFinanceCheck')
      } else {
        this.activeFinanceCheck = "first"
      }

    }
  };
</script>
<style>

  .financeCheck .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .financeCheck .el-tabs__content {
    display: none;
  }

  .financeCheck .filter-container .filter-item {
    margin-bottom: 0;
  }

  .financeCheck .filter-container .left .el-tabs__nav {
    margin-left: 0;
  }

</style>
<style lang="scss" scoped>
  .financeCheck {
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
        color: #409EFF;
        font-size: 14px;
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

  }
</style>
