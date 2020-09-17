<template>
  <div class="classification">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <!--<div class="save" @click="tagSubmitForm">保存</div>-->
    </div>
    <div class="content">
      <div class="filter-container">
        <!-- <el-select
          class="filter-item"
          style="width: 300px;margin-right: 10px"
          v-model="listQuery.type"
          placeholder="类型"
          @change="tagTypeChange"
        >
          <el-option
            v-for="item in tagTypeOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          ></el-option>
        </el-select> -->
        <el-button
          class="filter-item"
          type="primary"
          v-waves
          icon="el-icon-plus"
          @click="addTag(0)"
        >添加分类
        </el-button>
      </div>
      <el-table :data="list" row-key="id" lazy :load="load" style="width: 100%;background: white">
        <el-table-column align="center" label="ID">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column align="center" label="logo">-->
        <!--<template slot-scope="scope">-->
        <!--<img class="logo" :src="scope.row.logo" alt="">-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="center" label="排序">
          <template slot-scope="scope">
            <span>{{scope.row.queue}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.enable ? '启用':'禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.parentId === 0 && scope.row.type.value === 'course'"
              type="default"
              size="mini"
              @click="addSecondTag(scope.row)"
            >添加二级分类
            </el-button>

            <el-button type="text" size="mini" @click="delTag(scope.row)" style="color: #DADADA">删除</el-button>
            <el-button type="text" size="mini" @click="addTag(scope.row)" style="color: #F65860">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <el-dialog
      v-el-drag-dialog
      @dragDialog="handleDrag"
      title="添加或编辑分类"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
    >
      <el-form class="form-container" ref="postForm" label-width="120px">
        <el-form-item label="分类名称">
          <el-input
            maxlength="8"
            style="width:500px;"
            v-model="formParams.name"
            placeholder="8字以内"
          />
        </el-form-item>
        <!--<el-form-item label="分类说明" prop="title">-->
        <!--<el-input-->
        <!--v-model="formParams.detail"-->
        <!--placeholder="分类说明"-->
        <!--/>-->
        <!--</el-form-item>-->
        <!--<el-form-item style="margin-bottom: 40px;" prop="title" label="分类LOGO">-->
        <!--<el-upload-->
        <!--class="avatar-uploader"-->
        <!--:http-request="Upload"-->
        <!--action=""-->
        <!--:show-file-list="false">-->
        <!--<img v-if="formParams.logo" :src="formParams.logo" class="avatar">-->
        <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
        <!--</el-upload>-->
        <!--</el-form-item>-->
        <el-form-item style="margin-bottom: 40px;" prop="title" label="排序">
          <el-input
            style="width:500px;"
            type="number"
            v-model="formParams.queue"
            maxlength="3"
            placeholder="数字越大越靠前"
          />

        </el-form-item>
        <el-form-item label="是否启用" prop="enable">
          <el-checkbox v-model="formParams.enable"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            v-loading="loading"
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
    typeList,
    typeEdit,
    typeDel,
  } from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "classification",
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
          limit: 10,
          page: 0,
          parentId: 0,
          type: "courseBook"
        },
        secondParams: {
          limit: 10,
          page: 0,
          parentId: 0,
          type: "courseBook"
        },
        list: [],
        listLoading: false,
//类型：courseBook书本课程分类，courseNews资讯课程分类
// courseTech技术课程分类，
// department部门分类类型
        tagTypeOptions: [
          {
            key: "courseBook",
            label: "书本课程分类"
          },
          {
            key: "courseNews",
            label: "资讯课程分类"
          },
          {
            key: "courseTech",
            label: "技术课程分类"
          },
          // {
          //   key: "department",
          //   label: "部门分类类型"
          // }
        ],
        createdTimes: 0,
        fields: [],
        rules: {},
        loading: false,
        dialogTableVisible: false,
        formParams: {
          //添加或编辑分类
          detail: "",
          enable: true,
          logo: "",
          name: "",
          parentId: 0,
          queue: "",
          token: getToken(),
          //类型：courseBook书本课程分类，courseNews资讯课程分类
// courseTech技术课程分类，
// department部门分类类型
          type: "workingCircle",
          typeId: 0
        },
        typeDelParams: {
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
        console.log(11111, tree, treeNode, resolve)
        this.listLoading = true;
        this.secondParams.parentId = tree.id;
        typeList(this.secondParams).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            resolve(json.data)
            // console.log(2, json.data);
          } else {

          }
        });
        // console.log(tree, treeNode);
      },
      //一级分类列表
      getTypeList() {
        this.listLoading = true;
        typeList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            if (this.listQuery.type === "course" && this.list.length > 0) {
              this.list.forEach(item => {
                item.hasChildren = true;
              });
            }
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        });
      },
      tagTypeChange(value) {
        this.formParams.type = value;
        this.secondParams.type = value;
        this.getTypeList();
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
      back(){
        this.$router.go(-1);//返回上一层
      },
      //删除分类
      delTag(data) {
        this.typeDelParams.targetId = data.id;
        this.$confirm("此操作将删除该分类, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            typeDel(this.typeDelParams).then(res => {
              // console.log(res,"res");
              if (res.status) {
                this.$message.success("删除成功！");
                this.getTypeList();
              } else {
                this.$message.error(res.message);
              }
            });
          })
          .catch(() => {
            this.typeDelParams.targetId = "";
          });
      },

      //添加二级分类
      addSecondTag(data) {
        this.formParams.parentId = data.id;
        this.dialogTableVisible = true;
      },
      addTag(data) {
        console.log(data,"data");
        this.dialogTableVisible = true;
        if (data) {
          this.formParams.name = data.name;
          this.formParams.detail = data.detail;
          this.formParams.parentId = data.parentId;
          this.formParams.logo = data.logo;
          this.formParams.type = data.type.value;
          this.formParams.typeId = data.id;
          this.formParams.queue = data.queue;
          this.formParams.enable = data.enable;
        } else {
          this.formParams = {
            //添加或编辑分类
            detail: "",
            enable: true,
            logo: "",
            name: "",
            parentId: 0,
            queue: "",
            token: getToken(),
            //类型：courseBook书本课程分类，courseNews资讯课程分类 // courseTech技术课程分类，// department部门分类类型
            type: this.listQuery.type,
            typeId: 0
          }
        }
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
        typeEdit(this.formParams).then(json => {
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });
            this.dialogTableVisible = false;
            window.location.reload()

          } else {
            this.$message({
              message: json.message,
              type: json.status ? "success" : "error"
            });
          }
          this.loading = false;
        });
      },
      handleDrag() {
        // this.$refs.select.blur()
      },

    },
    mounted() {
      // console.log(this.$route.query.type);
      this.listQuery.type = this.$route.query.type
      this.getTypeList();
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
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .classification {
    /*background: rgba(245, 246, 250, 0.61);*/
    .head {
      background: white;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #333333;
      padding: 0 24px 0 20px;
      font-size: 15px;
      .back {
        color: #333333;
        cursor: pointer;
        font-size: 15px;
        font-weight: bold;
      }
      .save {
        color: #F65860;
        cursor: pointer;
      }
    }
    .content {
      padding: 20px;
      background: rgba(245, 246, 250, 0.61);
      /*min-height: calc(100vh - 100px);*/
      .filter-container{
        background: white;
        height: 60px;
        display: flex;
        align-items: center;
        padding-left: 20px;
        padding-bottom: 0;
        border-bottom: 1px solid #f2f2f2;
        .filter-item{
          margin-bottom: 0;
        }
      }
    }
    .el-table{
      min-height: calc(100vh - 200px);

    }

  }
</style>
