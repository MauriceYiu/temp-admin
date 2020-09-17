<template>
  <div class="rewardChild">
    <div class="filter-container">
      <div class="left">
        未结算
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
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别">
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
      <el-table-column align="center" label="开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <!--<el-table-column align="center" label="打赏类型">-->
        <!--<template slot-scope="scope">-->
         <!--111-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column align="center" label="打赏金额">
        <template slot-scope="scope">
          <span>{{scope.row.base | showDecimal}}</span>
          <!--<i class="el-icon-edit" @click="edit(scope)" style="margin-left: 4px;color: #1B9AF7;cursor: pointer"></i>-->
        </template>
      </el-table-column>
      <el-table-column align="center" label="提现比例">
        <template slot-scope="scope">
          <span>{{scope.row.fine+'%'}}</span>
          <!--<i class="el-icon-edit" @click="edit(scope)" style="margin-left: 4px;color: #1B9AF7;cursor: pointer"></i>-->
        </template>
      </el-table-column>
      <el-table-column align="center" label="可提现">
        <template slot-scope="scope">
          <span>{{(scope.row.base + scope.row.divide + scope.row.reward) * scope.row.fine /100 | showDecimal}}</span>
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
            <div class="status">
              <span v-if="scope.row.deal">已提现</span>
              <div class="action" v-else>
                <el-button type="text" size="mini" @click="balance(scope.row.id)"
                           style="color: #ffffff;background: #1B9AF7;padding: 6px 16px 8px;border-radius: 30px"  v-if="hasPerm('financial:bestow:deal')">提现
                </el-button>
              </div>
              <el-button type="text" size="mini" @click="viewTag(scope.row.id)" style="color: #F65860;margin-left:14px"  v-if="hasPerm('financial:bestow:detail')">
                查看
              </el-button>

            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div style="padding: 20px 38px 20px 14px;display: flex;justify-content: space-between;background: white"
         >
      <el-checkbox @change="checkAll">全部</el-checkbox>
      <el-button type="text" size="mini" @click="balance()"
                 style="color: #ffffff;background: #1B9AF7;padding: 6px 16px 8px;border-radius: 30px" v-if="hasPerm('financial:bestow:deal')">提现
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
        <el-form-item label="打赏金额" :label-width="formLabelWidth">
          <el-input v-model="form.baseFormat" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="提现比例" :label-width="formLabelWidth">
          <el-input v-model="form.fine" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="salaryEdit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {salaryDeal, salaryEdit, salaryList} from "../../../api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils";
  import {getToken} from "@/utils/auth";


  export default {
    name: "rewardChild",
    directives: {
      waves,
    },
    data() {
      return {
        formLabelWidth: '120px',
        listQuery: {
          // 1已发放，2未发放  当前薪资应该是未发放的2，历史薪资应该是已发放的1
          deal: 2,
          limit: 10,
          page: 0,
          type: "bestow",
          token: getToken(),
        },
        total: 0,
        page: 1,
        list: [],
        multipleSelection: [],
        listLoading: false,
        loading: false,
        dealParams: {
          targetIds: [],
          token: getToken(),
        },
        form: {
          base: null,
          baseFormat: null,
          fine: 100,
          reward: null,
          rewardFormat: null,
          targetId: 0,
          token: getToken(),
        },
        dialogFormVisible: false,
        adEnableParams: {
          targetId: "",
          yes: true,
          token: getToken(),
        }
      };
    },
    methods: {
      checkAll() {
        this.$refs.salaryTable.toggleAllSelection()
      },
      edit(scope) {
        this.editIndex = scope.$index;
        let row = scope.row;
        this.form.targetId = row.id
        this.form.base = row.base
        this.form.fine = row.fine
        this.form.reward = row.reward
        this.form.baseFormat = row.base / 100
        this.dialogFormVisible = true
      },
      salaryEdit() {
        if (this.form.fine > 100) {
          this.$message({
            message: "提现比例不能大于100",
            type: "error"
          });
          return;
        }
        this.form.base = this.form.baseFormat * 100
        this.dialogFormVisible = false
        console.log(this.form);
        salaryEdit(this.form).then(json => {
          if (json.status === 200) {
            this.list[this.editIndex].base = json.data.base;
            this.list[this.editIndex].fine = json.data.fine;
          } else {

          }
          this.editIndex = -1;
        })
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
      handleSelectionChange(val) {
        // console.log(val,"handleSelectionChange");
        this.multipleSelection = val;
        this.dealParams.targetIds = []
        this.multipleSelection.forEach((item, index) => {
          this.dealParams.targetIds.push(item.id)
        })
      },
      balance(id) {
        if(id){
          this.dealParams.targetIds = []
          this.dealParams.targetIds.push(id)
        }
        this.$confirm('确定提现?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.salaryDeal()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });

      },
      salaryDeal(){
        salaryDeal(this.dealParams).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.$message({
              message: "结算成功！",
              type: json.status === 200 ? "success" : "error"
            })
            this.getList()
          }
        })
      },
      changeStatus(value, item) {
        console.log(value);
        this.adEnableParams.targetId = item.id
        this.adEnableParams.yes = value
        activityCancel(this.adEnableParams).then(json => {
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
          }
        })
      },
      viewTag(data) {
        this.$router.push({
          name: "rewardDetail", params: {
            id: data
          }
        })
      },


    },
    mounted() {
      // this.getList();
    }
  };
</script>
<style>

  .rewardChild .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .rewardChild .el-tabs__content {
    display: none;
  }

  .rewardChild .filter-container .filter-item {
    margin-bottom: 0;
  }
</style>
<style lang="scss" scoped>
  .rewardChild {
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
      min-height: calc(100vh - 300px);
      /*border: 2px solid red;*/

    }
    .paginationBox {
      margin: 10px auto;
      text-align: center;
    }

  }
</style>
