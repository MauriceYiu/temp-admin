<template>
  <div class="iconSet">
    <div class="head">
      <div class="back">
        图标设置
        <div class="line"></div>
      </div>
      <div class="save" @click="addTag(0)" v-if="hasPerm('ad:icon:add')">添加</div>
    </div>
    <div class="content">
      <div class="client">
        <el-table
          :data="list"
          stripe
          v-if="hasPerm('ad:icon:list')"
          style="width: 100%">

          <el-table-column align="center" label="ID" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="按钮名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="图标">
            <template slot-scope="scope">
              <img style="width: 40px" :src="scope.row.logo" alt="">
            </template>
          </el-table-column>
          <el-table-column align="center" label="说明">
            <template slot-scope="scope">
              <span>{{scope.row.intro}}</span>
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
                <!--<div class="status" v-if="hasPerm('ad:icon:enable')">-->
                <div class="status">
                  <span v-if="scope.row.enable">已启用</span>
                  <span v-if="!scope.row.enable">已禁用</span>
                  <el-switch
                    @change="(value)=>{changeStatus(value,scope.row)}"
                    style="display: block"
                    v-if="hasPerm('ad:icon:enable')"
                    v-model="scope.row.enable"
                    active-color="#13ce66">
                  </el-switch>
                </div>
                <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA" v-if="hasPerm('ad:icon:delete')">删除</el-button>
                <el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860" v-if="hasPerm('ad:icon:edit')">编辑</el-button>
              </div>

            </template>
          </el-table-column>
        </el-table>

      </div>
      <div class="paginationBox" style="text-align: center">
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
    menuList,
    menuEnable,
    menuDel,
  } from "../../api/ad.js";
  import {vipAll} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import qqmap from "@/components/qqmap/index";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "iconSet",
    directives: {
      waves,
    },
    data() {
      return {
        adDelParams:{
          targetId:0,
          token: getToken(),
        },
        total: 0,
        page: 1,
        list: [],
        menuEnableParams: {
          targetId: "",
          yes: true,
          token: getToken(),
        },
        listQuery: {
          limit: 10,
          page: 0,
        }

      };
    },
    methods: {
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      changeStatus(value,item){
        console.log(value);
        this.menuEnableParams.targetId = item.id
        this.menuEnableParams.yes = value
        menuEnable(this.menuEnableParams).then(json => {
          if (json.status === 200) {
            console.log(json);
            // item.enable = !item.enable
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }
        })
      },
      //删除
      delTag(data) {
        this.adDelParams.targetId = data.id;
        this.$confirm("此操作将删除该图标, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            menuDel(this.adDelParams).then(res => {
              // console.log(res,"res");
              if (res.status ===200) {
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
          name: "iconDetail", params: {
            id: data
          }
        })
      },
      // 列表
      getList() {
        this.listLoading = true;
        menuList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }
        })
      },
      handleCurrentChange(val) {
        this.listQuery.page = val - 1
        this.page = this.listQuery.page + 1
        // sessionStorage.setItem('settingVip', this.listQuery.page)
        this.getList()
      },
    },
    mounted() {
      this.getList()
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

  .app-container .right {
    margin: 20px 0;
    text-align: right;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .iconSet .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .iconSet .el-textarea {
    width: 86%;
  }

  .iconSet .time .el-form-item__content {
    margin-left: 16px !important;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .iconSet {
    position: relative;
    min-height: calc(100vh - 60px);
    background: rgba(245, 246, 250, 0.61);
    .head {
      background: white;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px 0 40px;
      .back {
        color: #409EFF;
        font-size: 14px;
        cursor: pointer;
        line-height: 40px;
        position: relative;
        /*border-bottom: 2px solid #5BC0DF;*/
      }
      .line {
        width: 32px;
        height: 2px;
        background: #409EFF;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
      .save {
        color: #F65860;
        cursor: pointer;
        font-size: 14px;
      }
    }
    .content {
      margin: 20px;
      background: white;
      min-height: calc(100vh - 140px);
      position: relative;
      .form-container {
        background: white;
        padding: 30px 0 100px;
      }
      & > .client {
        width: 100%;
        background: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
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
        .el-table{
          min-height: calc(100vh - 200px);

        }
        .paginationBox{
          margin:10px auto;
          text-align: center;
        }
      }
    }

  }
</style>
