<template>
  <div class="addDepartment">
    <el-form class="form-container" ref="postForm" label-width="154px">
      <el-form-item label="部门名称">
        <el-input
          style="width:600px;"
          maxlength="10"
          v-model="formParams.name"
          placeholder="请输入部门名称，8字以内"
        />
      </el-form-item>

      <el-form-item label="所属部门">

        <el-select v-model="formParams.parentId" placeholder="请选择" style="width:600px;">
          <el-option
            v-for="item in departmentOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item>
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="info"
          @click="submitForm"
        >提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import {
    types,
    typeEdit,
    typeDetail,
  } from "@/api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, isMobile, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "addDepartment",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        genderOptions: [
          {
            value: "male",
            text: "男",
          }, {
            value: "female",
            text: "女",
          },
        ],
        departmentOptions: [],
        tags: '',
        dialogVisible: false,
        total: 0,
        page: 1,
        tableStatus: false,
        activeName: "msg",
        value: "",
        tableKey: 0,
        list: [],
        listLoading: false,
        createdTimes: 0,
        loading: false,
        dialogTableVisible: false,
        uploadImages: [],
        formParams: {
          detail: "",
          enable: true,
          logo: "",
          name: "",
          parentId: null,
          queue: null,
          token: getToken(),
          type: "department",
          typeId: 0,
        },
      };
    },
    methods: {
      types() {
        types({type: "department"}).then(json => {
          if (json.status === 200) {
            // console.log(json.data, "json.data");
            json.data.forEach((item, index) => {
              this.departmentOptions.push({
                value: item.typeId,
                label: item.name,
              })

              item.children.forEach((child, i) => {
                this.departmentOptions.push({
                  value: child.typeId,
                  label: child.name,
                })
                child.children.forEach((child2, i) => {
                  this.departmentOptions.push({
                    value: child2.typeId,
                    label: child2.name,
                  })
                })
              })
            })
            // console.log(this.departmentOptions, "departmentOptions");

          }
        });
      },
      genderChange(value) {
        this.formParams.gender = value;
      },
      typeChange(value) {
        this.formParams.parentId = value;
      },
      UploadCoverImage(file) {
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
          this.formParams.trueAvatar = result.url
        })
      },
      initData() {
        typeDetail({
          targetId: this.$route.params.id,
        }).then(json => {
          if (json.status === 200) {
            this.formParams.detail = json.data.detail;
            this.formParams.enable = json.data.enable;
            this.formParams.logo = json.data.logo;
            this.formParams.name = json.data.name;
            this.formParams.parentId = json.data.parentId;
            this.formParams.queue = json.data.queue;
            this.formParams.type = json.data.type.value;
            this.formParams.typeId = json.data.id;
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        });


      },
      submitForm() {
        this.loading = true;
        if (!this.formParams.name) {
          this.$message({
            message: "请选择性别",
            type: "error"
          });
          return false;
        }
        typeEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            window.location.reload()
            this.formParams = {
              detail: "",
              enable: true,
              logo: "",
              name: "",
              parentId: null,
              queue: null,
              token: getToken(),
              type: "department",
              typeId: 0,
            }
          }


        });
      },
      handleChange(value) {

      },
    },
    mounted() {
      // console.log(this.$route.params.id);
      if (parseInt(this.$route.params.id) > 0) {
        this.initData();
      }
      this.types();
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

  textarea {
    min-height: 150px;
  }
</style>
<style lang="scss" scoped>
  .addDepartment {
    padding: 15px;
    .filter-container {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
    }
    .treeBox {
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      padding: 20px 10px;
    }

  }
</style>
