<template>
  <div class="permissionChild">
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

    <el-table
      :data="list"
      stripe
      style="width: 100%">

      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="权限组名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="添加权限">
        <template slot-scope="scope">
          <span>{{scope.row.roleCount}}项</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加人数">
        <template slot-scope="scope">
          <span>{{scope.row.member}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="权限组说明">
        <template slot-scope="scope">
          <span>{{scope.row.detail}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
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
            <!--<div class="status">-->
            <!--<span v-if="scope.row.enable">启用</span>-->
            <!--<span v-if="!scope.row.enable">禁用</span>-->
            <!--<el-switch-->
            <!--@change="(value)=>{changeStatus(value,scope.row)}"-->
            <!--style="display: block"-->
            <!--v-model="scope.row.enable"-->
            <!--active-color="#13ce66">-->
            <!--</el-switch>-->
            <!--</div>-->
            <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA" v-if="hasPerm('settings:roles:groups:delete')">删除</el-button>
            <el-button type="text" size="mini" @click="addTag(scope.row.id)" style="color: #F65860" v-if="hasPerm('settings:roles:groups:edit')">编辑</el-button>

          </div>

        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>

  import {roleDel, roleGroups,} from "../../../api/settings.js";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import {getToken} from "@/utils/auth";


  export default {
    name: "permissionChild",
    directives: {
      waves,
    },
    data() {
      return {
        delParams: {
          targetId: 0,
          token: getToken(),
        },
        total: 0,
        page: 1,
        list: [],
        listQuery: {
          token: getToken(),
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
        this.adEnableParams.targetId = item.id
        this.adEnableParams.yes = value
        activityCancel(this.adEnableParams).then(json => {
          if (json.status === 200) {
            console.log(json);
            // item.enable = !item.enable
          } else {

          }
        })
      },
      //删除
      delTag(data) {
        this.delParams.targetId = data.id;
        this.$confirm("此操作将删除该权限组, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            roleDel(this.delParams).then(res => {
              // console.log(res,"res");
              if (res.status === 200) {
                this.$message.success("删除成功！");
                this.getList();
              }
            });
          })
          .catch(() => {
            this.delParams.targetId = "";
          });
      },

      addTag(id) {
        this.$router.push({
          name: "addPermissonl", params: {
          // name: "editPermisson", params: {
            id: id
          }
        })
      },
      // 列表
      getList() {
        this.listLoading = true;
        roleGroups(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
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

  .permissionChild .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .permissionChild .el-textarea {
    width: 86%;
  }

  .permissionChild .time .el-form-item__content {
    margin-left: 16px !important;
  }
</style>
<style lang="scss" scoped>
  .permissionChild {

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
      padding: 0 20px;
      height: 60px;
      border-bottom: 1px solid #f2f2f2;
      align-items: center;
      .left {
        color: #409EFF;
        font-size: 14px;
      }
    }
    .el-table {
      min-height: calc(100vh - 260px);

    }
    .paginationBox {
      margin: 10px auto;
      text-align: center;
    }
    img {
      width: 60px;
    }

  }
</style>
