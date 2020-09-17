<template>
  <div class="smartStrategy">
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

          <el-table-column align="center" label="名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <!--<el-table-column align="center" label="价格"  width="80">-->
            <!--<template slot-scope="scope">-->
              <!--<span>{{scope.row.price | showDecimal}}</span>-->
            <!--</template>-->
          <!--</el-table-column>-->

          <el-table-column align="center" label="简介">
            <template slot-scope="scope">
              <span>{{scope.row.intro}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="图片">
            <template slot-scope="scope">
              <img :src="scope.row.logo" alt="" style="width: 60px">
            </template>
          </el-table-column>

          <!--<el-table-column align="center" label="分类">-->
            <!--<template slot-scope="scope">-->
              <!--<span>{{scope.row.typeName}}</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column align="center" label="发布时间">-->
          <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column align="center" label="状态"  width="80">
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
                <div class="status" v-if="hasPerm('settings:quickEntry:guide:top')">
                  <span v-if="scope.row.top">推热</span>
                  <span v-if="!scope.row.top">普通</span>
                  <el-switch
                    @change="(value)=>{changeTop(value,scope.row)}"
                    style="display: block"
                    v-model="scope.row.top"
                    active-color="#13ce66">
                  </el-switch>
                </div>
                <div class="status" v-if="hasPerm('settings:quickEntry:guide:enable')">
                  <span v-if="scope.row.enable">启用</span>
                  <span v-if="!scope.row.enable">禁用</span>
                  <el-switch
                    @change="(value)=>{changeStatus(value,scope.row)}"
                    style="display: block"
                    v-model="scope.row.enable"
                    active-color="#13ce66">
                  </el-switch>
                </div>
                <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA" v-if="hasPerm('settings:quickEntry:guide:delete')">删除</el-button>
                <el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860" v-if="hasPerm('settings:quickEntry:guide:edit')">编辑</el-button>

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
    toolList,
    toolEnable,
    toolTop,
    toolDel,
  } from "../../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import qqmap from "@/components/qqmap/index";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "smartStrategy",
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
          top: 0,
          type: "guide",
        }

      };
    },
    methods: {
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      changeStatus(value, item) {
        console.log(value);
        this.enableParams.targetId = item.id
        this.enableParams.yes = value
        toolEnable(this.enableParams).then(json => {
          if (json.status === 200) {
            console.log(json);
            // item.enable = !item.enable
          } else {

          }
        })
      },
      changeTop(value, item) {
        console.log(value);
        this.enableParams.targetId = item.id
        this.enableParams.yes = value
        toolTop(this.enableParams).then(json => {
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
      //删除
      delTag(data) {
        this.adDelParams.targetId = data.id;
        this.$confirm("确定删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            toolDel(this.adDelParams).then(res => {
              // console.log(res,"res");
              if (res.status === 200) {
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
          name: "smartStrategypDetail", params: {
            id: data
          }
        })
      },
      // 列表
      getList() {
        this.listLoading = true;
        toolList(this.listQuery).then(json => {
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

  .smartStrategy .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .smartStrategy .el-textarea {
    width: 86%;
  }

  .smartStrategy .time .el-form-item__content {
    margin-left: 16px !important;
  }
</style>
<style lang="scss" scoped>
  .smartStrategy {
    /*background: rgb(245, 246, 250);*/
    /*min-height: 100vh;*/

    .head {
      background: white;
      height: 46px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 50px 0 46px;
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
          padding:0 20px;
          height: 60px;
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
