<template>
  <div class="offlineCourse">
    <div class="filter-container">
      <div class="left">
        全部
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
      <el-table-column align="center" label="标题">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="嘉宾">
        <template slot-scope="scope">
          <span>{{scope.row.master.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="预约价">
        <template slot-scope="scope">
          <span>{{scope.row.price | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="预约人数" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.datingUser}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开课时间">
        <template slot-scope="scope">
          <span>{{scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" v-if="hasPerm('content:activity:list:enable')">
        <template slot-scope="scope">
          <div class="status">
            <span v-if="scope.row.datingOpen">报名中</span>
            <span v-if="!scope.row.datingOpen">截止报名</span>
            <el-switch
              @change="(value)=>{changeStatus(value,scope.row)}"
              style="display: block"
              v-model="scope.row.datingOpen"
              active-color="#13ce66">
            </el-switch>
          </div>
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
            <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA"
                       v-if="hasPerm('content:activity:list:delete')">删除
            </el-button>
            <el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860"
                       v-if="hasPerm('content:activity:list:edit')">编辑
            </el-button>
            <el-button type="text" size="mini" @click="oppDatingDialog(scope.row)" v-if="hasPerm('content:activity:list:datings')">预约名单</el-button>
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

    <el-dialog title="预约名单" :visible.sync="datingDialog">
      <el-table :data="gridData">
        <el-table-column property="id" label="ID" width="80"></el-table-column>
        <el-table-column property="userName" label="昵称"></el-table-column>
        <el-table-column label="头像">
          <template slot-scope="scope">
            <img style="width: 50px;height: 50px;border-radius: 50%" :src="scope.row.userAvatar" alt="">
          </template>
        </el-table-column>
        <el-table-column property="inputName" label="联系人"></el-table-column>
        <el-table-column property="mobile" label="电话"></el-table-column>
        <el-table-column property="inputRemark" label="备注"></el-table-column>
      </el-table>
      <div class="paginationBox">
        <el-pagination
          background
          @size-change="handleSizeChange_Dialog"
          @current-change="handleCurrentChange_Dialog"
          :current-page="page_Dialog"
          :page-sizes="[10,20,30, 50]"
          :page-size="gridParams.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total_Dialog"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {activityBuys, activityDating, activityDel, activityList,} from "../../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils";
  import {getToken} from "@/utils/auth";


  export default {
    name: "offlineCourse",
    directives: {
      waves,
    },
    data() {
      return {
        listQuery: {
          createUserId: 0,
          dating: 0,
          keyword: "",
          limit: 10,
          orderBy: 10,
          page: 0,
          token: getToken(),
        },

        gridParams: {
          "activityId": 0,
          "limit": 10,
          "page": 0,
          token: getToken(),
          "userId": 0
        },
        total: 0,
        total_Dialog: 0,
        page: 1,
        page_Dialog: 1,
        list: [],
        gridData: [],
        listLoading: false,
        datingDialog: false,
        loading: false,
        adDelParams: {
          targetId: "",
          token: getToken(),
        },
        adEnableParams: {
          targetId: "",
          yes: true,
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
        sessionStorage.setItem('settingVip', this.listQuery.page)
        this.getList()
      },
      handleSizeChange_Dialog(val) {
        this.gridParams.limit = val;
        this.getApplyList()
      },
      handleCurrentChange_Dialog(val) {
        this.gridParams.page = val - 1
        this.page_Dialog = this.gridParams.page + 1
        this.getApplyList()
      },
      oppDatingDialog(data) {
        this.datingDialog = true
        this.gridParams.activityId = data.id
        this.getApplyList();
      },
      // 线下活动报名列表
      getApplyList() {
        this.listLoading = true;
        activityBuys(this.gridParams).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.gridData = json.data;
            this.total_Dialog = json.total
          } else {

          }
        })
      },

      changeStatus(value, item) {
        console.log(value);
        this.adEnableParams.targetId = item.id
        this.adEnableParams.yes = value
        activityDating(this.adEnableParams).then(json => {
          if (json.status === 200) {
            console.log(json);
            // item.enable = !item.enable
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        })
      },

// 列表
      getList() {
        this.listLoading = true;
        activityList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          } else {

          }
        })
      },
      //删除分类
      delTag(data) {
        this.adDelParams.targetId = data.id;
        this.$confirm("此操作将删除该线下课程, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            activityDel(this.adDelParams).then(res => {
              // console.log(res,"res");
              if (res.status) {
                this.$message.success("删除成功！");
                this.getList();
              } else {
                this.$message.error(res.message);
              }
            });
          })
          .catch(() => {
            this.adDelParams.targetId = "";
          });
      },

      addTag(data) {
        this.$router.push({
          name: "activityDetail", params: {
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

  .offlineCourse .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .offlineCourse .el-tabs__nav-scroll .el-tabs__nav {
    margin-left: 0;
  }

  .offlineCourse .el-tabs__content {
    display: none;
  }

  .offlineCourse .filter-container .filter-item {
    margin-bottom: 0;
  }
</style>
<style lang="scss" scoped>
  .offlineCourse {
    margin: 20px;
    background: white;
    min-height: calc(100vh - 140px);
    position: relative;
    .filter-container {
      display: flex;
      justify-content: space-between;
      background: white;
      height: 60px;
      padding: 0 20px;
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
