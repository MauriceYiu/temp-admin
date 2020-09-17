<template>
  <div class="clientPool">
    <div class="head">
      <div class="back">
        客户池
        <div class="line"></div>
      </div>
    </div>
    <div class="content">
      <div class="client">
        <div class="filter-container">
          <div class="left">
            全部
          </div>
          <!--<div class="right">-->
            <!--<el-input @keyup.enter.native="getList" style="width: 300px;margin-left: 20px" class="filter-item"-->
                      <!--placeholder="搜索你想要的内容"-->
                      <!--v-model="listQuery.keyword">-->
            <!--</el-input>-->
            <!--<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">-->
              <!--搜索-->
            <!--</el-button>-->

          <!--</div>-->
        </div>

        <el-table
          :data="list"
          v-if="hasPerm('business:customerPool:list')"
          stripe
          style="width: 100%">

          <el-table-column align="center" label="ID" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="昵称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="前绑定人">
            <template slot-scope="scope">
              <span>{{scope.row.inviteUserName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="注册时间">
            <template slot-scope="scope">
              <span>{{scope.row.registerTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="进入时间">
            <template slot-scope="scope">
              <span>{{scope.row.joinTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <span>{{getStatus(scope.row.status)}}</span>
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
                  <span v-if="scope.row.enable">正常</span>
                  <span v-if="!scope.row.enable">禁用</span>
                  <el-switch
                    @change="(value)=>{changeStatus(value,scope.row)}"
                    style="display: block"
                    v-model="scope.row.enable"
                    v-if="hasPerm('business:customerPool:enable')"
                    active-color="#13ce66">
                  </el-switch>
                </div>

                <!--<el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA">删除</el-button>-->
                <!--<el-button type="text" size="mini" @click="addTag(scope.row)" style="color: #F65860">查看</el-button>-->

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

    </div>
  </div>
</template>

<script>

  import {
    userEnable,
    userCustomerPools,
  } from "../../api/user";
  import {vipAll} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import qqmap from "@/components/qqmap/index";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "clientPool",
    directives: {
      waves,
    },
    data() {
      return {
        listLoading: false,
        total: 0,
        page: 1,
        list: [],
        enableParams: {
          targetUserId: "",
          enable: true,
          token: getToken(),
        },
        listQuery: {
          limit: 10,
          page: 0,
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
        this.getList()
      },
      // 列表
      getList() {
        this.listLoading = true;
        userCustomerPools(this.listQuery).then(json => {
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
      getStatus(num){
        switch (num){
          case -1:
            return "已禁用"
            break;
          case 0:
            return "可获取"
            break;
          case 1:
            return "保护期"
            break;
        }

      },
      changeStatus(value, item) {
        console.log(value);
        this.enableParams.targetUserId = item.id
        this.enableParams.enable = value
        userEnable(this.enableParams).then(json => {
          if (json.status === 200) {
            // console.log(json);
          this.getList()
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }
        })
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

  .clientPool .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .clientPool .el-textarea {
    width: 86%;
  }

  .clientPool .time .el-form-item__content {
    margin-left: 16px !important;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .clientPool {
    /*background: rgba(245, 246, 250, 0.61);*/
    background: rgb(245, 246, 250);
    min-height: 100vh;

    .head {
      background: white;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 27px 0 40px;
      .back {
        color: #409EFF;
        font-size: 14px;
        cursor: pointer;
        line-height: 40px;
        position: relative;
        /*border-bottom: 2px solid #5BC0DF;*/
      }
      .line {
        width: 28px;
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
      }
    }
    .content {
      min-height: 100vh;
      padding: 24px;
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
        .el-table {
          min-height: calc(100vh - 260px);

        }
        .paginationBox {
          margin: 10px auto;
          text-align: center;
        }
      }
    }

  }
</style>
