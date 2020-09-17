<template>
  <div id="giftEvaluation">
    <div class="filter-container">
      <div class="left">
        全部
      </div>
      <!--<el-button-->
        <!--class="filter-item"-->
        <!--type="info"-->
        <!--v-waves-->
        <!--@click="add(0)"-->
      <!--&gt;添加-->
      <!--</el-button>-->
    </div>
    <el-table :data="list" row-key="id" style="width: 100%;">
      <el-table-column align="center" label="礼物ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="礼物名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="价格">
        <template slot-scope="scope">
          <span>{{ scope.row.price| showDecimal()}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="礼物图片">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" alt="">
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序">
        <template slot-scope="scope">
          <span>{{scope.row.queue}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.sale ? '启用':'禁用'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA" v-if="hasPerm('settings:gifts:bestow:delete')">删除</el-button>
          <el-button type="text" size="mini" @click="add(scope.row.id)" style="color: #F65860" v-if="hasPerm('settings:gifts:bestow:edit')">编辑</el-button>
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
    giftList,
    giftDel,
  } from "../../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "giftEvaluation",
    directives: {
      waves,
      elDragDialog
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        total: 0,
        page: 1,
        activeName: "msg",
        value: "",
        tableKey: 0,
        listQuery: {
          limit: 10,
          page: 0,
          token: getToken(),
          type: "service"
        },
        list: [],
        listLoading: false,
        loading: false,
        giftDelParams: {
          targetId: "",
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

      //列表
      getList() {
        this.listLoading = true;
        giftList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          } else {

          }
        });
      },

      //删除分类
      delTag(data) {
        this.giftDelParams.targetId = data.id;
        this.$confirm("此操作将删除该打赏礼物, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            giftDel(this.giftDelParams).then(res => {
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
            this.giftDelParams.targetId = "";
          });
      },

      add(data) {
        this.$router.push({
          name: 'giftEvaluationDetail', params: {
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

<style lang="scss" scoped>
  #giftEvaluation {

    margin: 20px;
    background: white;
    min-height: calc(100vh - 140px);
    position: relative;
    .el-table__expand-column {
      .cell {
        display: none;
      }
    }
    .filter-container {
      display: flex;
      justify-content: space-between;
      background: white;
      padding:0 20px;
      height: 60px;
      border-bottom: 1px solid #f2f2f2;
      align-items: center;
      .left{
        color: #409EFF;
        font-size: 14px;
      }
    }
    .el-table{
      min-height: calc(100vh - 260px);

    }
    .paginationBox{
      margin:10px auto;
      text-align: center;
    }
    img{
      width: 60px;
    }


  }
</style>
