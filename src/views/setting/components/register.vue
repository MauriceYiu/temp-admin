<template>
  <div id="register">
    <div class="filter-container">
      <h2>用户注册成功奖励优惠券设置</h2>
      <el-button
        class="filter-item"
        type="info"
        v-waves
        @click="add(0)"
      >添加
      </el-button>
    </div>
    <el-table :data="list" row-key="id" border style="width: 100%;">
      <el-table-column align="center" label="奖励优惠券ID">
        <template slot-scope="scope">
          <span>{{scope.row.days}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="面额">
        <template slot-scope="scope">
          <span>{{ scope.row.saleTotal| showDecimal()}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="满额">
        <template slot-scope="scope">
          <span>{{ scope.row.saleTotal| showDecimal()}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="张数">
        <template slot-scope="scope">
          <span>{{ scope.row.saleTotal| showDecimal()}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
      <template slot-scope="scope">
      <span>{{scope.row.enable ? '开启':'禁用'}}</span>
      </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="add(scope.row.id)">编辑</el-button>
          <!--<el-button type="text" style="color: red" @click="delTag(scope.row)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--<div class="paginationBox">-->
    <!--<el-pagination-->
    <!--background-->
    <!--@size-change="handleSizeChange"-->
    <!--@current-change="handleCurrentChange"-->
    <!--:current-page="page"-->
    <!--:page-sizes="[10,20,30, 50]"-->
    <!--:page-size="listQuery.limit"-->
    <!--layout="total, sizes, prev, pager, next, jumper"-->
    <!--:total="total"-->
    <!--&gt;</el-pagination>-->
    <!--</div>-->
  </div>
</template>

<script>

  import {
    crcList,
    crcDel,
  } from "../../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'


  export default {
    name: "register",
    directives: {
      waves,
      elDragDialog
    },
    components: {
      pagination,
    },
    data() {
      return {
        total: 0,
        page: 1,
        tableKey: 0,
        listQuery: {
          enable: 0,
          limit: 10,
          page: 0,
          token: getToken(),
          type: "register"
        },
        list: [],
        listLoading: false,
        loading: false,
        crcDelParams: {
          targetId: "",
          token: getToken(),
        }
      };
    },
    methods: {
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
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
      //列表
      getList() {
        this.listLoading = true;
        crcList(this.listQuery).then(json => {
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
        this.crcDelParams.targetId = data.id;
        this.$confirm("此操作将删除该分类, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            crcDel(this.crcDelParams).then(res => {
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
            this.crcDelParams.targetId = "";
          });
      },

      //添加二级分类
      addSecondTag(data) {
        this.formParams.parentId = data.id;
        this.dialogTableVisible = true;
      },
      add(data){
        this.$router.push({ name: 'registerDetail',params:{
            id:data
          }})
      },
      addTag(data) {
        this.dialogTableVisible = true;
        if (data) {
          this.formParams.name = data.name;
          this.uploadImages = [];
          data.images.forEach((image, index) => {
            this.uploadImages.push({
              name: index,
              url: image
            });
          });
          this.value = data.value / 100
          this.formParams.value = data.value;
          this.formParams.vipId = data.id;
        }
      },
      tagSubmitForm() {
        // console.log(this.formParams);
        // console.log(this.uploadImages);
        if (!this.formParams.name) {
          this.$message({
            message: "请输入vip名称",
            type: "error"
          });
          return false;
        }

        if (!this.value) {
          this.$message({
            message: "VIP等级达到金额",
            type: "error"
          });
          return false;
        }

        if (this.uploadImages.intro) {
          this.$message({
            message: "请输入权益说明",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        this.formParams.value = this.value * 100
        this.uploadImages.forEach((image, index) => {
          this.formParams.images.push(image.url)
        })
        // console.log(this.formParams.images,"this.formParams.images");
        vipEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            // const json = response.data;
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });

            this.dialogTableVisible = false;
            this.getList();
            this.formParams.name = "";
            this.formParams.images = [];
            this.formParams.value = "";
            this.value = "";
            this.formParams.vipId = "";
            this.formParams.anyoneBuy = true;
            this.formParams.freeForGreater = true;
          }else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }


        });
      },
      handleDrag() {
        // this.$refs.select.blur()
      },

    },
  };
</script>

<style lang="scss" scoped>
  #register {
    padding: 15px;
    .hiderow {
      visibility: hidden;
    }
    .el-table__expand-column {
      .cell {
        display: none;
      }
    }
    .filter-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 26px;
      h2{
        font-weight: normal;
        margin: 0;
      }
      .el-button{
        height: 40px;
        box-sizing: border-box;
        margin-bottom: 0;
      }
    }
    .paginationBox {
      text-align: right;
      margin-top: 60px;
    }


  }
</style>
