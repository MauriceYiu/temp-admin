<template>
  <div class="courseRule">

    <div class="filter-container">
      <el-select
        class="filter-item"
        style="width: 150px"
        clearable
        v-model="listQuery.vipId"
        placeholder="vip等级"
        @change="tagTypeChange"
      >
        <el-option
          v-for="item in tagTypeOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        v-waves
        icon="el-icon-plus"
        @click="addTag(0)"
      >添加
      </el-button>
    </div>
    <el-table :data="list" row-key="id" border lazy :load="load" style="width: 100%;">
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="vip名称">
        <template slot-scope="scope">
          <span>{{scope.row.vipName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间">
        <template slot-scope="scope">
         <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}
            </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所有人都可购买">
        <template slot-scope="scope">
          <span>{{scope.row.anyoneBuy ? '是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="对高于此级别的免费">
        <template slot-scope="scope">
          <span>{{scope.row.freeForGreater ? '是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.parentId === 0 && scope.row.type.value === 'merchant'"
            type="default"
            size="mini"
            @click="addSecondTag(scope.row)"
          >添加二级分类
          </el-button>
          <el-button type="primary" size="mini" @click="addTag(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="delTag(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-el-drag-dialog
      @dragDialog="handleDrag"
      title="添加或编辑"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
    >
      <el-form class="form-container" ref="postForm">

        <el-form-item label="类型" prop="title">
          <el-select
            class="filter-item"
            style="width: 150px"
            v-model="formParams.vipId"
            placeholder="类型"
            @change="tagTypeChange"
          >
            <el-option
              v-for="item in tagTypeOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所有人都可购买" prop="enable">
          <el-checkbox v-model="formParams.anyoneBuy"></el-checkbox>
        </el-form-item>

        <el-form-item label="高于此级别的免费" prop="enable">
          <el-checkbox v-model="formParams.freeForGreater"></el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button
            style="margin-left: 10px;"
            type="success"
            @click="tagSubmitForm"
          >保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

  import {
    globalRuleGet,
    globalRuleEdit,
    vipAll,
    cvrcAll,
    cvrcEdit,
    cvrcDetail,
    cvrcDel,
  } from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "courseRule",
    directives: {
      waves,
      elDragDialog
    },
    data() {
      return {
        tableStatus: false,
        activeName: "msg",
        tableKey: 0,
        listQuery: {
          vipId: "",
        },
        secondParams: {
          limit: 10,
          page: 0,
          parentId: 0,
          type: "course"
        },
        list: [],
        listLoading: false,
        tagTypeOptions: [],
        createdTimes: 0,
        fields: [],
        rules: {},
        loading: false,
        dialogTableVisible: false,
        formParams: {
          //添加或编辑
          anyoneBuy: true,
          freeForGreater: true,
          ruleId: 0,
          token: getToken(),
          vipId: ""
        },
        cvrcDelParams: {
          targetId: "",
          token: getToken(),
        }
      };
    },
    methods: {
      beforeUpload() {

      },

      Upload(file) {
        // console.log(111);
        const that = this
        //判断扩展名
        const tmpcnt = file.file.name.lastIndexOf(".")
        const exname = file.file.name.substring(tmpcnt + 1)
        const names = ['jpg', 'jpeg', 'webp', 'png', 'bmp']
        if (names.indexOf(exname) < 0) {
          this.$message.error("不支持的格式!")
          return
        }
        //定义唯一的文件名，打印出来的uid其实就是时间戳
        //client 是第一步中的 client
        // console.log(file.file);
        this.$upload(file.file.uid + "." + exname, file.file, (success, result) => {
          this.formParams.logo = result.url
        })

      },

      getCardSetting() {
        // console.log(this.activeName,'ceshi');
        sessionStorage.setItem('activeName', this.activeName)
        switch (this.activeName) {
          case "cardSetting":
            this.$refs.cardSetting.openList();
            break;
          default:
            break;
        }
      },
      load1(tree, treeNode, resolve) {
        setTimeout(() => {
          resolve()
        }, 1000)
      },
      load(tree, treeNode, resolve) {
        // console.log(11111, tree, treeNode, resolve)
        this.listLoading = true;
        this.secondParams.parentId = tree.id;
        cvrcAll(this.secondParams).then(response => {
          this.listLoading = false;
          const json = response.data;
          if (json.status) {
            resolve(json.data)
            // console.log(2, json.data);
          } else {

          }
        });
        // console.log(tree, treeNode);
      },
      //一级分类列表
      getList() {
        this.listLoading = true;
        cvrcAll(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        });
      },
      tagTypeChange(value) {
        // console.log(value);
        this.formParams.vipId = value;
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
        this.cvrcDelParams.targetId = data.id;
        this.$confirm("此操作将删除该分类, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            cvrcDel(this.cvrcDelParams).then(res => {
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
            this.cvrcDelParams.targetId = "";
          });
      },

      //添加二级分类
      addSecondTag(data) {
        this.formParams.parentId = data.id;
        this.dialogTableVisible = true;
      },
      addTag(data) {
        // console.log(data,"data");
        this.dialogTableVisible = true;
        if (data) {
          this.formParams.anyoneBuy = data.anyoneBuy;
          this.formParams.freeForGreater = data.freeForGreater;
          this.formParams.ruleId = data.id;
          this.formParams.vipId = data.vipId;
        }
      },
      tagSubmitForm() {
        // console.log(this.formParams);
        // if (!this.formParams.name) {
        //   this.$message({
        //     message: "请输入分类名称",
        //     type: "error"
        //   });
        //   return false;
        // }

        this.loading = true;
        cvrcEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });
            this.dialogTableVisible = false;
            this.getList();
            this.formParams.anyoneBuy = true;
            this.formParams.freeForGreater = true;
            this.formParams.ruleId = "";
            this.formParams.vipId = null;

          } else {
            this.$message({
              message: json.message,
              type: json.status===200 ? "success" : "error"
            });
          }

        });
      },
      //取得vip 等级列表
      getVipList(){
        vipAll().then(json => {
          if (json.status === 200) {
            // console.log(json.data,"vip")
            // this.tagTypeOptions = json.data;
            json.data.forEach((item,index)=>{
              this.tagTypeOptions.push({
                key: item.id,
                label: item.name
              })
            })
          } else {

          }
        });
      },
      handleDrag() {
        // this.$refs.select.blur()
      },

    },
    mounted() {
      this.getList();
      this.getVipList();
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
  .courseRule {
    padding: 15px;
    .filter-container{
      margin-bottom: 20px;
    }
    .hiderow {
      visibility: hidden;
    }
    .el-table__expand-column {
      .cell {
        display: none;
      }
    }
    .logo{
      width: 60px;
    }

  }
</style>
