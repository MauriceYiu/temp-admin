<template>
  <div class="vipDetail">
      <el-form class="form-container" ref="postForm" label-width="154px">
        <el-form-item label="VIP级数">
          <el-input
            style="width:600px;"
            v-model="formParams.name"
            placeholder="请输入VIP级数"
          />
        </el-form-item>
        <el-form-item label="累计充值悟空币" prop="title">
          <el-input
            style="width:600px;"
            type="number"
            v-model="value"
            placeholder="请输入累计输入悟空币"
          />
        </el-form-item>
        <el-form-item label="权益描述">
          <Tinymce1 id="Tinymce1" v-model="formParams.intro" :height="300"/>
        </el-form-item>
        <el-form-item label="课程所有人都可购买" prop="enable">
          <el-checkbox v-model="formParams.anyoneBuy"></el-checkbox>
        </el-form-item>

        <el-form-item label="课程高于此级别的免费" prop="enable">
          <el-checkbox v-model="formParams.freeForGreater"></el-checkbox>
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
  </div>
</template>

<script>

  import {
    vipAll,
    vipEdit,
    vipDetail,
  } from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "vipDetail",
    directives: {
      waves,
      elDragDialog
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        dialogImageUrl: '',
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
          name: "",
          images: [],
          token: getToken(),
          value: "",
          intro: "",
          anyoneBuy: true,
          freeForGreater: true,
          vipId: 0
        },
        vipDelParams: {
          targetId: "",
          token: getToken(),
        }
      };
    },
    methods: {
      handleRemove(file, fileList) {
        // console.log(file, fileList,"on-remove");
        this.uploadImages = fileList
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },

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
          this.uploadImages.push({
            name: file.file.name,
            url: result.url
          });
        })
      },

      initData() {
        vipDetail({
          targetId: this.$route.params.id
        }).then(json => {
          if (json.status === 200) {
            this.formParams.name = json.data.name;
            this.uploadImages = [];
            // json.data.images.forEach((image, index) => {
            //   this.uploadImages.push({
            //     name: index,
            //     url: image
            //   });
            // });
            this.value =json.data.value / 100
            this.formParams.value = json.data.value;
            this.formParams.intro = json.data.intro;
            this.formParams.vipId =json.data.id;
            this.formParams.anyoneBuy =json.data.anyoneBuy;
            this.formParams.freeForGreater =json.data.freeForGreater;
          } else {

          }
        });




      },
      tagSubmitForm() {
        // console.log(this.formParams);
        // console.log(this.uploadImages);
        if (!this.formParams.name) {
          this.$message({
            message: "请输入vip名称",
            type: "error"
          });
          return false;
        }

        if (!this.value) {
          this.$message({
            message: "累计充值悟空币",
            type: "error"
          });
          return false;
        }

        if (this.uploadImages.intro) {
          this.$message({
            message: "请输入权益说明",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        this.formParams.value = this.value * 100
        this.uploadImages.forEach((image, index) => {
          this.formParams.images.push(image.url)
        })
        // console.log(this.formParams.images,"this.formParams.images");
        vipEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            // const json = response.data;
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });

            this.dialogTableVisible = false;
            this.$router.push({
              name:"vip"
            })
            this.formParams.name = "";
            this.formParams.images = [];
            this.formParams.value = "";
            this.value = "";
            this.formParams.vipId = "";
            this.formParams.anyoneBuy = true;
            this.formParams.freeForGreater = true;

          }else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }

        });
      },
      handleDrag() {
        // this.$refs.select.blur()
      },

    },
    mounted() {
      console.log(this.$route.params.id);
      if (parseInt(this.$route.params.id) > 0) {
        this.initData();
      }
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
</style>
<style lang="scss" scoped>
  .vipDetail {
    padding: 15px;
    .filter-container {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
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
    .paginationBox {
      text-align: right;
      margin-top: 60px;
    }

    .imbox {
      display: flex;
      justify-content: center;
      .imgWrap {
        margin-right: 6px;
        img {
          width: 60px;
        }
      }
      .imgWrap:last-child {
        margin-right: 0;
      }
    }

  }
</style>
