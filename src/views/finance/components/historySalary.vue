<template>
  <div class="salaryChild">
    <div class="left">
      <!--<div class="department" @click="openIndex=2"> + 添加部门</div>-->
      <!--<div class="alldepartment" style="color: deepskyblue"> 所有部门</div>-->
      <staffList @getRightList="getList"></staffList>
      <!--<el-tree :data="departmentOptions" :props="defaultProps" @node-click="handleNodeClick" :expand-on-click-node="false" default-expand-all></el-tree>-->
    </div>

    <!--列表 1 -->
    <div class="rightMain">
      <div class="filter-container">
        <div style="color: deepskyblue;display: flex;align-items: center">已结算</div>

        <div class="right">
          <el-input @keyup.enter.native="getList" style="width: 300px;margin-left: 20px" class="filter-item"
                    placeholder="姓名/手机号"
                    v-model="listQuery.keyword">
          </el-input>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
            搜索
          </el-button>
        </div>


      </div>
      <el-table :data="list" row-key="id" style="width: 100%;">
        <el-table-column align="center" label="ID" width="60">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime('{y}/{m}/{d}')}}-{{(scope.row.createTime + 7*24*60*60 - 1) | parseTime('{m}/{d}')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="基本薪资">
          <template slot-scope="scope">
            <span>{{scope.row.base | showDecimal}}</span>
            <!--<i class="el-icon-edit" @click="edit(scope)" style="margin-left: 4px;color: #1B9AF7;cursor: pointer"></i>-->
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
            <!--<i class="el-icon-edit" @click="edit(scope)" style="margin-left: 4px;color: #1B9AF7;cursor: pointer"></i>-->
          </template>
        </el-table-column>
        <el-table-column align="center" label="奖励">
          <template slot-scope="scope">
            <span>{{scope.row.reward | showDecimal}}</span>
            <!--<i class="el-icon-edit" @click="edit(scope)" style="margin-left: 4px;color: #1B9AF7;cursor: pointer"></i>-->
          </template>
        </el-table-column>
        <el-table-column align="center" label="实发金额">
          <template slot-scope="scope">
            <span>{{scope.row.base +  scope.row.divide  +  scope.row.reward - scope.row.fine | showDecimal}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.deal ? "已结算":'未结算'}}</span>
            <!--<i class="el-icon-edit" @click="edit(scope)" style="margin-left: 4px;color: #1B9AF7;cursor: pointer"></i>-->
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="操作"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div class="action">
              <el-button type="text" size="mini" @click="viewTag(scope.row)" style="color: #F65860">查看</el-button>

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
  </div>
</template>

<script>
  import {
    salaryList,
  } from "../../../api/user";
  import {
    departmentAll,
  } from "../../../api/department.js";
  import {list, userEnable} from '@/api/user'
  import staffList from "./staffList";  //子组件
  import waves from "@/directive/waves"; // 水波纹指令
  import {getToken} from '@/utils/auth'
  import pagination from '@/components/Pagination/index'

  export default {
    name: "salaryChild",
    components: {
      pagination,
      staffList,
    },
    directives: {
      waves,
    },
    data() {
      return {
        total: 0,
        page: 1,
        list: [],
        listLoading: false,
        loading: false,
        listQuery: {
          // 1已发放，2未发放  当前薪资应该是未发放的2，历史薪资应该是已发放的1
          deal: 1,
          limit: 10,
          userId: 0,
          startTime: null,
          dealStartTime: 0,
          dealEndTime: 0,
          page: 0,
          type: "divide",
          token: getToken(),
        },
        departmentOptions: [
          {
            id: 0,
            name: "易答在线",
            children: [],
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        adDelParams: {
          targetId: "",
          token: getToken(),
        },
      }
    },
    created() {

    },
    methods: {
      viewTag(data) {
        this.$router.push({
          name: "salaryDetail", query: {
            id: data.id,
            data:data
          }
        })
      },
      changeStatus() {

      },

      handleNodeClick(data) {
        console.log(data);
        this.listQuery.departmentId = data.id;
        this.listQuery.userId = data.userId;
        this.listQuery.page = 0;
        this.getList();
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
      goDetails(id) {
        this.$router.push({
          name: 'courseDetail', params: {
            id: id
          }
        })
      },
      types() {
        departmentAll().then(json => {
          if (json.status === 200) {
            json.data.forEach((item, index) => {
              this.departmentOptions[0].children.push(item);
            })
          } else {

          }
        });
      },
// 列表
      getList(data) {
        console.log(data, "点击员工传过来的");
        this.listLoading = true;
        this.listQuery.userId = data ? data.checkId : 0;
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

    },
    mounted() {
      // this.types();
      // this.getList();
    }
  }
</script>
<style lang="scss" scoped>
  .salaryChild {
    display: flex;
    background: #f4f5f7;
    padding: 20px;
    .left {
      width: 240px;
      min-height: 100vh;
      margin-right: 20px;
      background: #ffffff;
      /*display: flex;*/
      /*flex-direction: column;*/
      /*align-items: center;*/
      .department {
        border: 1px solid #999999;
        width: 70%;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        /*margin: 20px 0;*/
        margin: 20px auto;
        cursor: pointer;
      }
      .alldepartment {
        width: 70%;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        /*margin: 20px 0;*/
        margin: 20px auto;
      }
      .el-tree {
        background: #ffffff;
      }
    }
    .rightMain {
      background: #ffffff;
      flex-grow: 1; //铺满盒子剩余空间

      .filter-container {
        display: flex;
        justify-content: space-between;
        background: white;
        padding: 0 20px;
        height: 60px;
        border-bottom: 1px solid #f2f2f2;
        align-items: center;
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
  }
</style>
