<template>
  <div class="Live">
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        v-waves
        icon="el-icon-plus"
        @click="addTag(0)"
      >添加直播
      </el-button>

      <div class="right">
        <el-input @keyup.enter.native="getList" style="width: 300px;margin-left: 20px" class="filter-item"
                  placeholder="直播间名称"
                  v-model="listQuery.keyword">
        </el-input>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
          搜索
        </el-button>
      </div>


    </div>
    <el-table :data="list" row-key="id" border style="width: 100%;">
      <!--<el-table-column align="center" label="ID">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{scope.row.id}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" label="发布者">
        <template slot-scope="scope">
          <span class="link-type" @click="goDetails(scope.row.teacherId)">{{scope.row.teacherName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="直播间名称">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.liveType.text}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格">
        <template slot-scope="scope">
          <span>{{scope.row.price | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="观看人数">
        <template slot-scope="scope">
          <span class="link-type" @click="goDetails(scope.row.id)">{{scope.row.joinUser}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开播时间">
        <template slot-scope="scope">
          <span>{{scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status.text}}</span>
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
          <el-button type="success" size="mini" @click="live(scope.row)">开始直播</el-button>
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
    liveList,
    courseEdit,
    liveDel,
  } from "../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime,showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "Live",
    directives: {
      waves,
    },
    data() {
      return {
        activeName: "msg",
        listQuery: {
          endTime: 0,
          keyword: "",
          limit: 10,
          liveType: "secret",
          page: 0,
          startTime: 0,
//直播状态：cancel已取消，init审核中，failed审核失败，pause暂停中，ok审核通过待开播，ing直播中，finished直播完成
          statuses: "finished",
          teacherId: 0,
          token: getToken(),
        },
        total: 0,
        page: 1,
        list: [],
        listLoading: false,
        loading: false,
        liveDelParams: {
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
      goDetails(id) {
        this.$router.push({
          name: 'courseDetail', params: {
            id: id
          }
        })
      },
      load1(tree, treeNode, resolve) {
        setTimeout(() => {
          resolve()
        }, 1000)
      },
      load(tree, treeNode, resolve) {
        console.log(11111, tree, treeNode, resolve)
        this.listLoading = true;
        this.secondParams.parentId = tree.id;
        liveList(this.secondParams).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            resolve(json.data)
            // console.log(2, json.data);
          } else {

          }
        });
      },
      //一级分类列表
      getList() {
        this.listLoading = true;
        liveList(this.listQuery).then(json => {
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
      tagTypeChange(value) {
        this.formParams.type = value;
        this.secondParams.type = value;
        this.getList();
      },
      initData() {
        globalRuleGet().then(response => {
          const json = response.data;
          if (json.status) {
            this.rules = json.data.rule;
            this.fields = json.data.params;
          } else {

          }
        });
      },

      //删除分类
      delTag(data) {
        this.liveDelParams.targetId = data.id;
        this.$confirm("此操作将删除该直播, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            liveDel(this.liveDelParams).then(res => {
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
            this.liveDelParams.targetId = "";
          });
      },

      //添加二级分类
      addSecondTag(data) {
        this.formParams.parentId = data.id;
        this.dialogTableVisible = true;
      },
      live(live){
        let id = live.sinaChannel.chatRoomId;
        let pushUrl = encodeURIComponent(live.sinaChannel.pushUrl);
        window.open("./chat/im/chatroom/room.html?id=" + id + "&publishUrl=" + pushUrl, "livePublish", "", true);
      },
      addTag(data) {
        this.$router.push({
          name: "LiveDetail", params: {
            id: data
          }
        })
      },
      tagSubmitForm() {
        if (!this.formParams.name) {
          this.$message({
            message: "请输入分类名称",
            type: "error"
          });
          return false;
        }

        // if (!this.formParams.detail) {
        //   this.$message({
        //     message: "请输入分类说明",
        //     type: "error"
        //   });
        //   return false;
        // }
        //
        // if (!this.formParams.logo) {
        //   this.$message({
        //     message: "请上传分类logo",
        //     type: "error"
        //   });
        //   return false;
        // }

        if (!this.formParams.queue) {
          this.$message({
            message: "请输入排序",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        courseEdit(this.formParams).then(json => {
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });
            this.dialogTableVisible = false;
            this.getList();
            this.formParams.name = "";
            this.formParams.detail = "";
            this.formParams.logo = "";
            this.formParams.parentId = "";
            this.formParams.queue = "";
            this.formParams.typeId = "";
          } else {
            this.$message({
              message: json.message,
              type: json.status ? "success" : "error"
            });
          }
          this.loading = false;
        });
      },
      submitForm() {
        this.loading = true;
        globalRuleEdit(this.rules).then(response => {
          const json = response.data;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });
          } else {

          }
          this.loading = false;
        });
      },
      handleDrag() {
        // this.$refs.select.blur()
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
  .Live {
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

  }
</style>
