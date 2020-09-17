<template>
  <div class="techChild">
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

      <el-table-column align="center" label="优惠券ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="优惠券名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="面额">
        <template slot-scope="scope">
          <span>{{scope.row.value | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="满额">
        <template slot-scope="scope">
          <span>{{scope.row.suffice | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.vipName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发放总数">
        <template slot-scope="scope">
          <span>{{scope.row.vipName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单人数量">
        <template slot-scope="scope">
          <span>{{scope.row.vipName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发放人数">
        <template slot-scope="scope">
          <span>{{scope.row.vipName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发放总额">
        <template slot-scope="scope">
          <span>{{scope.row.vipName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发放时间">
        <template slot-scope="scope">
          <span>{{scope.row.validStartTime  | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.enable ? '启用':'禁用'}}</span>
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
            <el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860">查看</el-button>

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
    cgcList,
    couponDel,
    courseEnable,
  } from "../../../api/coupon";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime,showDecimal} from "@/utils";
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
        total: 0,
        page: 1,
        list: [],
        listLoading: false,
        loading: false,
        enableParams: {
          targetId: "",
          yes: true,
          token: getToken(),
        },
        couponDelParams: {
          targetId: "",
          token: getToken(),
        }
      };
    },
    methods: {
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
      addTag(data) {
        this.$router.push({
          name: "couponDetail", params: {
            id: data
          }
        })
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
        this.$confirm("此操作将删除该优惠券, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            couponDel(this.couponDelParams).then(res => {
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

  .techChild .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .techChild .el-tabs__content {
    display: none;
  }

  .techChild .filter-container .filter-item {
    margin-bottom: 0;
  }
</style>
<style lang="scss" scoped>
  .techChild {
    padding: 20px;
    .filter-container {
      display: flex;
      justify-content: space-between;
      background: white;
      padding: 20px;
      border-bottom: 1px solid #f2f2f2;
      align-items: center;
      .left{
        color: #1B9AF7;
      }
    }
    img {
      width: 80px;
    }
    .action {
      display: flex;
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
