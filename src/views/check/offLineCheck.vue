<template>
  <div class="offLineCheck">
    <div class="filter-container">
      <el-select
        class="filter-item"
        style="width: 150px"
        v-model="listQuery.checkStatus"
        placeholder="状态"
        @change="getList()"
      >
        <el-option
          v-for="item in tagTypeOptions"
          :key="item.key"s
          :label="item.label"
          :value="item.key"
        ></el-option>
      </el-select>
    </div>
    <el-table :data="list" row-key="id" border style="width: 100%;">
      <el-table-column align="center" label="ID">
      <template slot-scope="scope">
      <span>{{scope.row.id}}</span>
      </template>
      </el-table-column>
      <el-table-column align="center" label="活动名称">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="主讲人姓名">
        <template slot-scope="scope">
          <span>{{scope.row.teacherName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="预约价格">
        <template slot-scope="scope">
          <span>{{scope.row.price | showDecimal}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="报名人数">
        <template slot-scope="scope">
          <span>{{scope.row.datingUser}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="活动时间">
        <template slot-scope="scope">
          <span>{{scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            <p style="margin:0">至</p>
          <span>{{scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="活动预约截止时间">
        <template slot-scope="scope">
          <span>{{scope.row.datingEndTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="总预约人数">
        <template slot-scope="scope">
          <span>{{scope.row.totalUser}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.checkStatus.text}}</span>
          <span class="red" v-if="scope.row.checkStatus.value==='failed'">{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="view(scope.row.id)">查看</el-button>
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
    activityList,
    activityDel,
  } from "../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime,showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "offLineCheck",
    directives: {
      waves,
    },
    data() {
      return {
        activeName: "msg",
        listQuery: {
          checkStatus: null,
          keyword: "",
          limit: 10,
          page: 0,
          typeId: 0
        },
        tagTypeOptions: [
          {
            key: null,
            label: "全部"
          },{
            key: "checking",
            label: "审核中"
          },
          {
            key: "success",
            label: "审核成功"
          },
          {
            key: "failed",
            label: "审核失败"
          }
        ],
        total: 0,
        page: 1,
        list: [],
        listLoading: false,
        loading: false,
        activityDelParams: {
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
      getLiveType(value) {

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
        activityList(this.secondParams).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            resolve(json.data)
            // console.log(2, json.data);
          }
        });
      },
      //一级分类列表
      getList() {
        this.listLoading = true;
        activityList(this.listQuery).then(json => {
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
          }
        });
      },

      //删除分类
      delTag(data) {
        this.activityDelParams.targetId = data.id;
        this.$confirm("此操作将删除该条活动, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            activityDel(this.activityDelParams).then(res => {
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
            this.activityDelParams.targetId = "";
          });
      },
      view(data) {
        this.$router.push({
          name: "offLineActivityView", params: {
            id: data
          }
        })
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
  .offLineCheck {
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
