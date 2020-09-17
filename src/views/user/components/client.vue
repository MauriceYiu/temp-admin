<template>
  <div class="client">
    <div class="filter-container">
      <div class="left">
        全部客户
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
      <el-table-column align="center" label="昵称">
        <template slot-scope="scope">
          <span>{{scope.row.extra.trueName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.gender.text}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册手机号">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="推广人">
        <template slot-scope="scope">
          <span>{{scope.row.inventUserName || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员等级" width="80">
        <template slot-scope="scope">
          <span>{{vipString(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="已消费">
        <template slot-scope="scope">
          <span>{{scope.row.recharge | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账户余额">
        <template slot-scope="scope">
          <span>{{scope.row.surplus | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.enable ? '可用':'禁用'}}</span>
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
              <span v-if="scope.row.enable">已启用</span>
              <span v-if="!scope.row.enable">已禁用</span>
              <el-switch
                @change="(value)=>{changeStatus(value,scope.row)}"
                style="display: block"
                v-model="scope.row.enable"
                active-color="#13ce66">
              </el-switch>
            </div>
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
  import {list, userEnable,} from "../../../api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import {vipAll} from "../../../api/settings";
  import {parseTime, showDecimal} from "@/utils";
  import {getToken} from "@/utils/auth";


  export default {
    name: "client",
    directives: {
      waves,
    },
    data() {
      return {
        activeName: 'first',
        vipData: [],
        listQuery: {
          app: "app",
          limit: 10,
          page: 0,
          token: getToken(),
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
          targetUserId: "",
          enable: true,
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
      //取得vip 等级列表
      getVipList() {
        vipAll().then(json => {
          if (json.status === 200) {
            this.vipData = json.data;
            this.getList()
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        });
      },
      changeStatus(value, item) {
        console.log(value);
        this.adEnableParams.targetUserId = item.id
        this.adEnableParams.enable = value
        userEnable(this.adEnableParams).then(json => {
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
        list(this.listQuery).then(json => {
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
      vipString(item) {
        // console.log(this.vipData);
        if (this.vipData) {
          for (let i = this.vipData.length - 1; i >= 0; i--) {
            if (item.recharge >= this.vipData[i].value) {
              return this.vipData[i].name;
            }
          }
        }
        return '--'
      },
      //删除分类
      delTag(data) {
        this.adDelParams.targetId = data.id;
        this.$confirm("此操作将删除该客户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            atcDel(this.adDelParams).then(res => {
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

      addTag(item) {
        // console.log(item,"item");
        this.$router.push({
          name: "userDetail", params: {
            id: item.id
          }, query: {
            token: item.token
          }
        })
      },


    },
    mounted() {
    }
  };
</script>
<style>

  .client .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .client .el-tabs__content {
    display: none;
  }

  .client .filter-container .filter-item {
    margin-bottom: 0;
  }
</style>
<style lang="scss" scoped>
  .client {
    padding: 20px;
    .filter-container {
      display: flex;
      justify-content: space-between;
      background: white;
      padding: 20px;
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

  }
</style>
