<template>
  <div class="salaryChild">
    <div class="filter-container">
      <div class="left">
        <el-tabs v-model="activeSalaryName" @tab-click="handleClick">
          <el-tab-pane label="未结算" name="first"></el-tab-pane>
          <el-tab-pane label="本周结算" name="second"></el-tab-pane>
          <el-tab-pane label="本周实时" name="third"></el-tab-pane>
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
      ref="salaryTable"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column align="center" label="ID" width="60">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" width="60">
        <template slot-scope="scope">
          <span>{{scope.row.gender.text}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="工号">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门">
        <template slot-scope="scope">
          <span>{{scope.row.departmentName ? scope.row.departmentName : "--"}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结算时间" v-if="activeSalaryName === 'second'">
        <template slot-scope="scope">
          <span>{{scope.row.dealTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间"  v-if="activeSalaryName === 'first'">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}/{m}/{d}')}}-{{(scope.row.createTime + 7*24*60*60 - 1) | parseTime('{y}/{m}/{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间"  v-if="activeSalaryName === 'third'">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}/{m}/{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="基本薪资">
        <template slot-scope="scope">
          <span>{{scope.row.base | showDecimal}}</span>
          <i v-if="activeSalaryName === 'first'" class="el-icon-edit" @click="edit(scope)"
             style="margin-left: 4px;color: #1B9AF7;cursor: pointer"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提成">
        <template slot-scope="scope">
          <span>{{scope.row.divide | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="扣罚">
        <template slot-scope="scope">
          <span>{{scope.row.fine | showDecimal}}</span>
          <i v-if="activeSalaryName === 'first'" class="el-icon-edit" @click="edit(scope)"
             style="margin-left: 4px;color: #1B9AF7;cursor: pointer"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" label="奖励">
        <template slot-scope="scope">
          <span>{{scope.row.reward | showDecimal}}</span>
          <i v-if="activeSalaryName === 'first'" class="el-icon-edit" @click="edit(scope)"
             style="margin-left: 4px;color: #1B9AF7;cursor: pointer"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实发金额">
        <template slot-scope="scope">
          <span>{{scope.row.base +  scope.row.divide  +  scope.row.reward - scope.row.fine | showDecimal}}</span>
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
            <el-button v-if="activeSalaryName === 'first'" type="text" size="mini" @click="goBalance(scope.row.id)"
                       style="color: #ffffff;background: #1B9AF7;padding: 6px 16px 8px;border-radius: 30px">结算
            </el-button>

            <el-button type="text" size="mini" v-if="activeSalaryName !== 'first'" @click="viewTag(scope.row)"
                       style="color: #F65860">查看
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div style="padding: 20px 38px 20px 14px;display: flex;justify-content: space-between;background: white"
         v-if="activeSalaryName === 'first'">
      <el-checkbox @change="checkAll">全部</el-checkbox>
      <el-button type="text" size="mini" @click="goBalance()"
                 style="color: #ffffff;background: #1B9AF7;padding: 6px 16px 8px;border-radius: 30px">结算
      </el-button>
    </div>

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


    <el-dialog title="编辑用户薪资" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="基本薪资" :label-width="formLabelWidth">
          <el-input v-model="form.baseFormat" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="罚款" :label-width="formLabelWidth">
          <el-input v-model="form.fineFormat" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="奖励" :label-width="formLabelWidth">
          <el-input v-model="form.rewardFormat" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="salaryEdit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="结算原因" :visible.sync="settlementDialog">
      <el-form ref="postForm">
        <el-input
          type="textarea"
          style="width: 90%"
          :rows="4"
          @input="change($event)"
          v-model="dealParams.remark"
          placeholder="请输入结算原因"
        />

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="settlementDialog = false">取 消</el-button>
        <el-button type="primary" @click="settlementConfirm">确 定</el-button>
      </div>
    </el-dialog>


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
    name: "salaryChild",
    directives: {
      waves,
    },
    data() {
      return {
        activeSalaryName: 'first',
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
        sessionStorage.setItem('activeSalaryName', this.activeSalaryName)
        // console.log(tab.name, event, "tab");
        switch (this.activeSalaryName) {
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
            this.activeSalaryName = 'second'
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
      if (sessionStorage.getItem('activeSalaryName')) {
        this.activeSalaryName = sessionStorage.getItem('activeSalaryName')
      } else {
        this.activeSalaryName = "first"
      }

    }
  };
</script>
<style>

  .salaryChild .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .salaryChild .el-tabs__content {
    display: none;
  }

  .salaryChild .filter-container .filter-item {
    margin-bottom: 0;
  }

  .salaryChild .filter-container .left .el-tabs__nav {
    margin-left: 0;
  }

</style>
<style lang="scss" scoped>
  .salaryChild {
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
