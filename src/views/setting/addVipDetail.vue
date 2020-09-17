<template>
  <div class="addVipDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">保存</div>
    </div>
    <div class="content">
      <el-form class="form-container" ref="postForm" label-width="154px">
        <el-form-item label="会员等级名">
          <el-input
            style="width: 600px"
            v-model="formParams.name"
            placeholder="输入会员等级名"
          />
        </el-form-item>
        <el-form-item label="累积充值">
          <el-input
            style="width: 600px"
            type="number"
            v-model="formParams.valueFormat"
            placeholder="输入面额"
          />
        </el-form-item>
        <el-form-item label="权益说明">
          <el-input
            style="width: 600px"
            type="textarea"
            :rows="4"
            v-model="formParams.intro"
            placeholder="输入权益说明"
          />
        </el-form-item>
        <el-form-item label="权益图片">
          <el-upload
            class="avatar-uploader"
            :http-request="Uploadpicture"
            action=""
            :show-file-list="false">
            <img v-if="formParams.introUrl" :src="formParams.introUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="所有人都可购买" prop="enable">
          <el-checkbox v-model="formParams.anyoneBuy"></el-checkbox>
        </el-form-item>
        <el-form-item label="高于此级别的免费" prop="enable">
          <el-checkbox v-model="formParams.freeForGreater"></el-checkbox>
        </el-form-item>
        <el-form-item label="是否直播发弹幕" prop="enable">
          <el-checkbox v-model="formParams.barrage"></el-checkbox>
        </el-form-item>
      </el-form>

    </div>

  </div>
</template>

<script>

  import {
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
    name: "addVipDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        loading: false,
        uploadImages: [],
        formParams: {
          name: "",
          token: getToken(),
          value: 0,
          valueFormat: "",
          intro: "",
          introUrl: "",
          anyoneBuy: true,
          freeForGreater: true,
          barrage: true,
          vipId: 0
        },
      };
    },
    methods: {
      Uploadpicture(file) {
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
          this.formParams.introUrl = result.url
        })
      },
      initData() {
        vipDetail({
          targetId: this.$route.params.id
        }).then(json => {
          if (json.status === 200) {
            this.formParams.name = json.data.name;
            this.formParams.valueFormat = json.data.value / 100
            this.formParams.value = json.data.value
            this.formParams.intro = json.data.intro;
            this.formParams.introUrl = json.data.introUrl;
            this.formParams.vipId = json.data.id;
            this.formParams.anyoneBuy = json.data.anyoneBuy;
            this.formParams.freeForGreater = json.data.freeForGreater;
            this.formParams.barrage = json.data.barrage;
          } else {

          }
        });


      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      tagSubmitForm() {
        // console.log(this.formParams);
        // console.log(this.uploadImages);
        if (!this.formParams.name) {
          this.$message({
            message: "请输入会员等级名",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.valueFormat) {
          this.$message({
            message: "输入面额",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.intro) {
          this.$message({
            message: "输入权益说明",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.introUrl) {
          this.$message({
            message: "请上传VIP权益说明图片",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        this.formParams.value = this.formParams.valueFormat * 100
        vipEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            // const json = response.data;
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });

            this.$router.push({
              name: "vipAbout"
            })
            this.formParams = {
              name: "",
              token: getToken(),
              value: 0,
              valueFormat: "",
              intro: "",
              introUrl: "",
              anyoneBuy: true,
              freeForGreater: true,
              barrage: true,
              vipId: 0
            }
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
  .addVipDetail {
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
      /*background: rgba(245, 246, 250, 0.61);*/
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
