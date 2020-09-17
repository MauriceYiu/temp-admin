<template>
  <div class="coupon">
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        v-waves
        icon="el-icon-plus"
        @click="addTag(0)"
      >添加
      </el-button>

      <div class="right">
        <el-input @keyup.enter.native="getList" style="width: 300px;margin-left: 20px" class="filter-item"
                  placeholder="优惠券名称"
                  v-model="listQuery.keyword">
        </el-input>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
          搜索
        </el-button>
      </div>


    </div>
    <el-table :data="list" row-key="id" border style="width: 100%;">
      <el-table-column align="center" label="优惠券ID">
      <template slot-scope="scope">
      <span>{{scope.row.id}}</span>
      </template>
      </el-table-column>
      <el-table-column align="center" label="优惠券名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="券面价值">
        <template slot-scope="scope">
          <span>{{scope.row.value | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="满额条件">
        <template slot-scope="scope">
          <span>{{scope.row.suffice | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="有效期">
        <template slot-scope="scope">
          <div v-if="scope.row.validStartTime">
            <span>{{scope.row.validStartTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span> -
            <span>{{scope.row.validEndTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </div>
          <span v-if="scope.row.days">领取后{{scope.row.days}}天过期</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addTag(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="mini" @click="delTag(scope.row)">删除</el-button>
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
    couponList,
    couponDel,
  } from "../../api/coupon";
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
        activeName: "msg",
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
        couponDelParams: {
          targetId: "",
          token: getToken(),
        }
      };
    },
    methods: {
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
        couponList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          } else {

          }
        })
      },
      tagTypeChange(value) {
        this.formParams.type = value;
        this.secondParams.type = value;
        this.getList();
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
      this.getList();
    }
  };
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
<style lang="scss" scoped>
  .coupon {
    padding: 15px;
    .filter-container {
      display: flex;
      justify-content: space-between;
      /*margin-bottom: 20px;*/
    }
    .hiderow {
      visibility: hidden;
    }
    .el-table__expand-column {
      .cell {
        display: none;
      }
    }
    .logo {
      width: 60px;
    }
    .red{
      color: red;
    }

  }
</style>
