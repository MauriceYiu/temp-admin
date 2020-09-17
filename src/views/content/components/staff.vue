<template>
  <div class="staff">
    <div class="filter-container">
      <div class="left">
        全部消息
      </div>
      <div class="right">
        <el-input @keyup.enter.native="search" style="width: 300px;margin-left: 20px" class="filter-item"
                  placeholder="搜索你想要的内容"
                  v-model="listQuery.keyword">
        </el-input>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search" v-if="hasPerm('content:push:staff:search')">
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
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.redirectType.text}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发送时间">
        <template slot-scope="scope">
          <span v-if="scope.row.executeTime">{{scope.row.executeTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="消息内容">
        <template slot-scope="scope">
          <span>{{scope.row.content}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.executeTime > 0 ? '已发送':'未发送'}}</span>
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
            <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA" v-if="scope.row.executeTime ===0  && hasPerm('content:push:staff:delete')">删除</el-button>
            <el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860" v-if="scope.row.executeTime  === 0 &&  hasPerm('content:push:staff:edit')">编辑</el-button>
            <el-button type="text" size="mini" @click="viewTag(scope.row.id)" style="color: #F65860" v-if="scope.row.executeTime  > 0 &&  hasPerm('content:push:staff:detail')">查看</el-button>

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
    pushList,
    pushDel,
    activityCancel,
  } from "../../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "staff",
    directives: {
      waves,
    },
    data() {
      return {
        listQuery: {
          app: "staff",
          limit: 10,
          page: 0,
        },
        total: 0,
        page: 1,
        list: [],
        listLoading: false,
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
      search(){
        this.listQuery.page = 0
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
        pushList(this.listQuery).then(json => {
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
        this.adDelParams.targetId = data.id;
        this.$confirm("此操作将删除该推送消息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            pushDel(this.adDelParams).then(res => {
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
          name: "pushDetail", params: {
            id: data
          }
        })
      },
      viewTag(data) {
        this.$router.push({
          name: "pushViewDetail", params: {
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

  .staff .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .staff .el-tabs__content {
    display: none;
  }

  .staff .filter-container .filter-item {
    margin-bottom: 0;
  }
</style>
<style lang="scss" scoped>
  .staff {
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
