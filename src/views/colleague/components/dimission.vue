<template>
  <div class="colleagueList">
    <div class="left">
      <!--<div class="department" @click="openIndex=2"> + 添加部门</div>-->
      <div class="alldepartment" style="color: #5BC0DF;"> 所有部门</div>
      <el-tree :data="departmentOptions" :props="defaultProps" :default-expand-all="true" @node-click="handleNodeClick" :expand-on-click-node="false"></el-tree>
    </div>

    <!--列表 1 -->
    <div class="rightMain" v-if="openIndex ===1">
      <div class="filter-container">
        <span style="color: #5BC0DF;font-size: 14px">{{departmentName}}</span>

        <div class="right">
          <el-date-picker
            style="width: 380px"
            v-model="pickerValue"
            @change='changePicker()'
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="入职开始日期"
            end-placeholder="入职结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-cascader
            v-model="jobPositionIds"
            :options="options"
            style="margin-left: 8px;width: 300px"
            placeholder="请选择职位"
            :props="{ expandTrigger: 'hover',label: 'name',value:'id' }"
            @change="handleChange"></el-cascader>
          <el-input @keyup.enter.native="getList" style="width:200px;margin-left: 20px;" class="filter-item"
                    placeholder="姓名/手机号/工号"
                    v-model="listQuery.keyword">
          </el-input>


          <!--<img src="../../../assets/select1.png" alt="" class="select">-->
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList"
                     style="margin-left: 8px">
            搜索
          </el-button>
        </div>


      </div>
      <el-table :data="list" row-key="id" style="width: 100%;">
        <el-table-column align="center" label="ID" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.extra.trueName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="性别" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.gender ? scope.row.gender.text : '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="工号">
          <template slot-scope="scope">
            <span>{{scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="部门">
          <template slot-scope="scope">
            <span>{{scope.row.departmentName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="职位">
          <template slot-scope="scope">
            <span>{{scope.row.jobPositionName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色">
          <template slot-scope="scope">
            <span>{{scope.row.role ? scope.row.role.text : '--'}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="入职时间">
          <template slot-scope="scope">
            <span>{{scope.row.jobTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span>{{!scope.row.jobLeave?'在职':'离职'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div class="action">
              <!--<div class="status" @click="changeStatus(scope.row)">{{scope.row.jobLeave ? '在职':'离职'}}</div>-->
              <div v-if="hasPerm('department:staffs:leave')">
                <div class="status" @click="onJob(scope.row)" v-if="scope.row.jobLeave">入职</div>
                <div class="status" @click="leaveJob(scope.row)" v-else>离职</div>
              </div>

              <el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860" v-if="hasPerm('department:staffs:edit')">编辑</el-button>

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
    <!--添加部门 2 -->
    <div class="rightMain" v-if="openIndex ===2">
      添加部门
      <addDepartment></addDepartment>
    </div>
    <!--添加同事 3 -->
    <div class="rightMain" v-if="openIndex ===3">
      添加同事
      <addColleague></addColleague>

    </div>

  </div>
</template>

<script>
  import {
    departmentAll,
    jpAll,
  } from "../../../api/department.js";
  import {list,userEnable,userJobLeave} from '@/api/user'
  import waves from "@/directive/waves"; // 水波纹指令
  import {getToken} from '@/utils/auth'
  import pagination from '@/components/Pagination/index'
  import addColleague from '../components/addColleague'
  import addDepartment from './addDepartment2'

  export default {
    name: "colleagueList",
    components: {
      pagination,
      addColleague,
      addDepartment,
    },
    directives: {
      waves,
    },
    data() {
      return {
        jobPositionIds: [],
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
        pickerValue: '',
        departmentName: '全部',
        openIndex: 1,
        total: 0,
        page: 1,
        list: [],
        options: [],
        listLoading: false,
        loading: false,
        listQuery: {
          app: "staff",
          keyword: "",
          limit: 10,
          page: 0,
          enable: 0,
          jobLeave: -1,
          departmentId: 0,
          token: getToken()
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
        enableParams: {
          targetUserId: "",
          enable: true,
          token: getToken(),
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
      //取左边的职位列表
      jpAll() {
        jpAll().then(json => {
          if (json.status === 200) {
            this.options = json.data
          }
        });
      },
      // 离职操作
      leaveJob(item) {
        this.enableParams.enable = false
        this.enableParams.targetUserId = item.id
        this.$confirm("确认"+item.extra.trueName+"离职?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            userJobLeave(this.enableParams).then(res => {
              if (res.status === 200) {
                this.$message.success(item.extra.trueName+"已离职！");
                item.jobLeave = !item.jobLeave
                this.getList();
              } else {
                this.$message.error(res.message);
              }
            });
          })
          .catch(() => {
            this.enableParams.targetUserId = "";
          });
      },
      // 入职操作
      onJob(item) {
        this.enableParams.targetUserId = item.id
        this.enableParams.enable = true
        this.$confirm("确认"+item.extra.trueName+"入职?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            userJobLeave(this.enableParams).then(res => {
              if (res.status === 200) {
                this.$message.success(item.extra.trueName+"已入职！");
                item.jobLeave = !item.jobLeave
                this.getList();
              } else {
                this.$message.error(res.message);
              }
            });
          })
          .catch(() => {
            this.enableParams.targetUserId = "";
          });
      },
      addTag(data) {
        this.$router.push({
          name: "colleagueDetail", params: {
            id: data
          }
        })
      },
      changeStatus (){

      },

      handleNodeClick(data) {
        this.openIndex = 1
        console.log(data);
        this.listQuery.departmentId = data.id;
        this.departmentName = data.name;
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
            this.departmentOptions[0].children = []
            json.data.forEach((item, index) => {
              this.departmentOptions[0].children.push(item);
            })
          }
        });
      },
      changePicker() {
        if (this.pickerValue) {
          this.listQuery.jobStartTime = this.pickerValue[0] / 1000;
          this.listQuery.jobEndTime = this.pickerValue[1] / 1000;
        } else {
          this.listQuery.jobStartTime = ''
          this.listQuery.jobEndTime = ''
        }
        console.log(this.listQuery, " this.listQuery");
      },
      handleChange(value) {
        console.log(value, "handleChange");
        if (this.jobPositionIds.length > 0) {
          this.listQuery.jobPositionId = this.jobPositionIds[this.jobPositionIds.length - 1]
        } else {
          this.listQuery.jobPositionId = 0
        }
      },
      getList() {
        list(this.listQuery).then(json => {
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          }
        })
      }

    },
    mounted() {
      this.jpAll();
      // this.types();
      // this.getList();
    }
  }
</script>
<style lang="scss" scoped>
  .colleagueList {
    display: flex;
    background: #f4f5f7;
    padding: 20px;
    .left {
      width: 240px;
      height: 85vh;
      overflow-y: auto;
      margin-right: 20px;
      background: #ffffff;
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
      .alldepartment{
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
        padding:0 20px;
        height: 60px;
        border-bottom: 1px solid #f2f2f2;
        align-items: center;

      }
      .action {
        display: flex;
        justify-content: center;
        .status {
          margin-right: 16px;
          width: 62px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #5BC0DF;
          cursor: pointer;
          color: white;
          border-radius: 30px;
        }
      }
      .el-table{
        min-height: calc(100vh - 260px);

      }
      .paginationBox{
        margin:10px auto;
        text-align: center;
      }
    }
  }
</style>
