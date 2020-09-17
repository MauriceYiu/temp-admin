<template>
  <div class="offlineCourse">
    <div class="filter-container">
      <div class="left">
        全部
      </div>
      <div class="right">
        <el-input @keyup.enter.native="search" style="width: 300px;margin-left: 20px" class="filter-item"
                  placeholder="搜索你想要的内容"
                  v-model="listQuery.keyword">
        </el-input>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search" v-if="hasPerm('content:push:marquee:search')">
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
      <!--<el-table-column align="center" label="类型">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.content}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column align="center" label="内容">
        <template slot-scope="scope">
          <span>{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.shown ? '显示':'隐藏'}}</span>
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
              <span v-if="!scope.row.shown">隐藏</span>
              <span v-if="scope.row.shown">显示</span>
              <el-switch
                @change="(value)=>{changeStatus(value,scope.row)}"
                style="display: block"
                v-model="scope.row.shown"
                active-color="#13ce66">
              </el-switch>
            </div>
            <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA"  v-if="hasPerm('content:push:marquee:delete')">删除</el-button>
            <!--<el-button type="text" size="mini" @click="addTag(scope.row)" style="color: #F65860">编辑</el-button>-->

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

    <el-dialog title="编辑跑马灯" :visible.sync="dialogFormVisible">
      <el-form :model="formParams">

        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input
            style="width: 800px;"
            placeholder="请输入内容"
            v-model="formParams.content"
            :autosize="{ minRows: 6, maxRows: 10}"
            type='textarea'>
          </el-input>
        </el-form-item>
        <el-form-item label="是否隐藏" prop="enable">
          <el-switch
            style="display: inline-block;"
            v-model="formParams.shown"
            active-color="#13ce66">
          </el-switch>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="tagSubmitForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    marqueeList,
    marqueeDel,
    marqueeShow,
    marqueeEdit,
  } from "../../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "offlineCourse",
    directives: {
      waves,
    },
    data() {
      return {
        listQuery: {
          keyword: "",
          limit: 10,
          page: 0,
        },
        dialogFormVisible: false,
        formLabelWidth: "80px",
        formParams: {
          content: "",
          marqueeId: 0,
          shown: false,
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
        marqueeShow(this.adEnableParams).then(json => {
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
        marqueeList(this.listQuery).then(json => {
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
        this.$confirm("此操作将删除该跑马灯, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            marqueeDel(this.adDelParams).then(res => {
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
        console.log(data);
        this.dialogFormVisible = true;
        this.formParams.content = data.content
        this.formParams.marqueeId = data.id
        this.formParams.shown = data.shown
      },
      tagSubmitForm() {
        if (!this.formParams.content) {
          this.$message({
            message: "请输入内容",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        marqueeEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            // const json = response.data;
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            this.dialogFormVisible = false
            this.getList();
            this.formParams = {
              content: "",
              marqueeId: 0,
              shown: false,
              token: getToken(),
            }
          } else {

          }

        });
      },


    },
    mounted() {
      // this.getList();
    }
  };
</script>
<style>

  .offlineCourse .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .offlineCourse .el-tabs__content {
    display: none;
  }

  .offlineCourse .filter-container .filter-item {
    margin-bottom: 0;
  }
</style>
<style lang="scss" scoped>
  .offlineCourse {
    margin: 20px;
    background: white;
    min-height: calc(100vh - 140px);
    position: relative;
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
    .el-table{
      min-height: calc(100vh - 260px);

    }
    .paginationBox{
      margin:10px auto;
      text-align: center;
    }

  }
</style>
