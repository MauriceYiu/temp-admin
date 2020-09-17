<template>
  <div class="versionUpdate">
    <!--<div class="head">-->
      <!--<div class="back">-->
        <!--帮助文档-->
        <!--<div class="line"></div>-->
      <!--</div>-->
      <!--<div class="save" @click="addTag(0)">新建</div>-->
    <!--</div>-->
    <div class="content">
      <div class="client">
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

          <el-table-column align="center" label="ID" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="APP类型">
            <template slot-scope="scope">
              <span>{{scope.row.app.text}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="版本号">
            <template slot-scope="scope">
              <span>{{scope.row.version}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="系统平台">
            <template slot-scope="scope">
              <span>{{scope.row.platform.text}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="下载地址">
            <template slot-scope="scope">
              <span>{{scope.row.url}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="更新时间">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="版本描述">
            <template slot-scope="scope">
              <span>{{scope.row.detail}}</span>
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
                <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA">删除</el-button>
                <!--<el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860">编辑</el-button>-->

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
    newsEnable,
    newsTop,
  } from "../../../api/business.js";
  import {appVersions,appVersionDel} from "../../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import qqmap from "@/components/qqmap/index";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "versionUpdate",
    directives: {
      waves,
    },
    data() {
      return {
        adDelParams:{
          targetId:0,
          token: getToken(),
        },
        enableParams: {
          targetId: "",
          yes: true,
          token: getToken(),
        },
        total: 0,
        page: 1,
        list: [],
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
      //删除
      delTag(data) {
        this.adDelParams.targetId = data.id;
        this.$confirm("确定删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            appVersionDel(this.adDelParams).then(res => {
              if (res.status ===200) {
                this.$message.success("删除成功！");
                this.getList();
              }
            });
          })
          .catch(() => {
            this.adDelParams.targetId = "";
          });
      },

      addTag(data) {
        this.$router.push({
          name: "helpDetail", params: {
            id: data
          }
        })
      },
      // 列表
      getList() {
        this.listLoading = true;
        appVersions(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          } else {

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
      // this.getList()
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

  .versionUpdate .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .versionUpdate .el-textarea {
    width: 86%;
  }

  .versionUpdate .time .el-form-item__content {
    margin-left: 16px !important;
  }
</style>
<style lang="scss" scoped>
  .versionUpdate {

    .head {
      background: white;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 27px 0 40px;
      .back {
        color: #000000;
        font-size: 14px;
        cursor: pointer;
        line-height: 46px;
        position: relative;
        /*border-bottom: 2px solid #5BC0DF;*/
      }
      .line {
        width: 32px;
        height: 2px;
        background: #5BC0DF;
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
      background: white;
      min-height: calc(100vh - 140px);
      margin: 20px;
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
