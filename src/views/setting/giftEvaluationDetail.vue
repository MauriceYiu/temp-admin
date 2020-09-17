<template>
  <div class="giftEvaluationDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="submitForm">保存</div>
    </div>
    <div class="content">
      <el-form class="form-container" ref="postForm" label-width="154px">
        <el-form-item label="礼物名称" required>
          <el-input
            style="width:600px;"
            maxlength="8"
            type="name"
            v-model="formParams.name"
            placeholder="请输入礼物名称，8字以内"
          />
        </el-form-item>
        <el-form-item label="礼物价值" required>
          <el-input
            style="width:600px;"
            type="number"
            v-model="formParams.priceFormat"
            placeholder="请输入价值悟空币"
          />
        </el-form-item>

        <el-form-item label="礼物排序" required>
          <el-input
            style="width:600px;"
            type="number"
            v-model="formParams.queue"
            placeholder="数字越大越靠前"
          />
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" prop="title" label="礼物图片" required>
          <el-upload
            class="avatar-uploader"
            :http-request="uploadImage"
            action=""
            :show-file-list="false">
            <img v-if="formParams.imageUrl" :src="formParams.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="上架">
          <el-checkbox v-model="formParams.sale"></el-checkbox>
        </el-form-item>

        <!--<el-form-item>-->
          <!--<el-button-->
            <!--v-loading="loading"-->
            <!--style="margin-left: 10px;"-->
            <!--type="info"-->
            <!--@click="submitForm"-->
          <!--&gt;提交-->
          <!--</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
  </div>
</template>

<script>

  import {
    giftEdit,
    giftDetail,
  } from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "giftEvaluationDetail",
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
        loading: false,
        formParams: {
          giftId: 0,
          imageUrl: "",
          name: "",
          price: 0,
          priceFormat: null,
          queue: null,
          sale: true,
          token: getToken(),
          type: "service",
        },
      };
    },
    methods: {
      uploadImage(file) {
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
          this.formParams.imageUrl = result.url
        })
      },
      changeEnable() {
        this.formParams.enable = !this.formParams.enable;
      },
      itemDel(index) {
        this.formParams.items.splice(index, 1)
      },
      //第三步添加问题
      addInfo() {
        this.formParams.items.push({
          id: null,
          num: null,
        });
      },
      initData() {
        giftDetail({
          targetId: this.$route.params.id,
          token: getToken()
        }).then(json => {
          if (json.status === 200) {
            this.formParams.giftId = json.data.id;
            this.formParams.imageUrl = json.data.imageUrl;
            this.formParams.name = json.data.name;
            this.formParams.queue = json.data.queue;
            this.formParams.sale = json.data.sale;
            this.formParams.priceFormat = showDecimal(json.data.price);

          } else {

          }
        });


      },
      back(){
        this.$router.go(-1);//返回上一层
      },
      submitForm() {
        console.log(this.formParams);
        if (!this.formParams.name) {
          this.$message({
            message: "请输入礼物名称",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.priceFormat) {
          this.$message({
            message: "请输入价值悟空币",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.queue) {
          this.$message({
            message: "请输入排序",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.imageUrl) {
          this.$message({
            message: "请上传礼物图片",
            type: "error"
          });
          return false;
        }

        this.formParams.price = this.formParams.priceFormat * 100
        this.loading = true;
        giftEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });

            this.dialogTableVisible = false;
            this.$router.push({
              name: "gift"
            })
            this.formParams = {
              giftId: 0,
              imageUrl: "",
              name: "",
              price: 0,
              priceFormat: null,
              queue: null,
              sale: true,
            }
          }


        });
      },
    },
    mounted() {
      // console.log(this.$route.params.id);
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
  .giftEvaluationDetail {

    background: rgba(245, 246, 250, 0.61);
    /*min-height: 100vh;*/
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
      background: rgba(245, 246, 250, 0.61);
      margin: 20px;
      background: white;
      min-height: calc(100vh - 140px);
      .form-container {
        background: white;
        padding: 30px 0 100px;

      }
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
