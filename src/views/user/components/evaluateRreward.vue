<template>
  <div class="evaluateRreward">
    <div class="left">
      <!--<div class="department" @click="openIndex=2"> + 添加部门</div>-->
      <!--<div class="alldepartment" style="color: deepskyblue"> 所有部门</div>-->
      <staffList @getRightList="getList"></staffList>
      <!--<el-tree :data="departmentOptions" :props="defaultProps" @node-click="handleNodeClick" :expand-on-click-node="false" default-expand-all></el-tree>-->
    </div>

    <!--列表 1 -->
    <div class="rightMain">
      <div class="filter-container">
        <div style="color: deepskyblue;display: flex;align-items: center">{{name}}</div>

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
        <el-table-column align="center" label="ID" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="客户昵称">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="注册手机号">
          <template slot-scope="scope">
            <span>{{scope.row.userMobile}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="会员等级">
          <template slot-scope="scope">
            <span>{{vipString(scope.row)}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="提交时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="评价">
          <template slot-scope="scope">
            <span style="color: #5BC0DF">{{scope.row.score}}/{{scope.row.professionText}}/{{scope.row.serviceText}}/{{scope.row.speedText}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="打赏">
          <template slot-scope="scope">
            <span style="color: #5BC0DF">{{scope.row.bestow | showDecimal}}</span>
          </template>
        </el-table-column>

        <!--<el-table-column-->
          <!--align="center"-->
          <!--label="操作"-->
          <!--class-name="small-padding fixed-width"-->
        <!--&gt;-->
          <!--<template slot-scope="scope">-->
            <!--<div class="action">-->
              <!--&lt;!&ndash;<el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA">删除</el-button>&ndash;&gt;-->
              <!--<el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860">查看</el-button>-->

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
</template>

<script>
  import {
    serviceEvaluates,
  } from "../../../api/user";
  import {
    departmentAll,
  } from "../../../api/department.js";
  import {vipAll} from "../../../api/settings";
  import staffList from "./staffList";  //子组件
  import {list, userEnable} from '@/api/user'
  import waves from "@/directive/waves"; // 水波纹指令
  import {getToken} from '@/utils/auth'
  import pagination from '@/components/Pagination/index'

  export default {
    name: "evaluateRreward",
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
        vipData: [],
        name: '全部',
        listLoading: false,
        loading: false,
        listQuery: {
          limit: 10,
          teacherId: 0,
          page: 0,
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
      //取得vip 等级列表
      getVipList() {
        vipAll().then(json => {
          if (json.status === 200) {
            this.vipData = json.data;
            this.getList()
          }
        });
      },
      vipString(item) {
        // console.log(this.vipData);
        if (this.vipData) {
          for (let i = this.vipData.length - 1; i >= 0; i--) {
            if (item.userRecharge >= this.vipData[i].value) {
              return this.vipData[i].name;
            }
          }
        }
        return '--'
      },
      delTag(row) {

      },
      addTag(id) {
        // this.$router.push({
        //   name: "colleagueDetail", params: {
        //     id: id
        //   }
        // })
      },
      changeStatus() {

      },

      handleNodeClick(data) {
        console.log(data);
        this.listQuery.departmentId = data.id;
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
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        });
      },
// 列表
      getList(data) {
        if (data) {
          // console.log(data, "点击 的数据 ");
          this.listLoading = true;
          this.listQuery.teacherId = data.checkId;
          this.name = data.checkName
          serviceEvaluates(this.listQuery).then(json => {
            this.listLoading = false;
            if (json.status === 200) {
              this.list = json.data;
              this.total = json.total
            }
          })
        }
      },

    },
    mounted() {
      // this.types();
      this.getList();
    }
  }
</script>
<style lang="scss" scoped>
  .evaluateRreward {
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
