<template>
  <div class="otherSettiing">
    <el-tabs v-model="activeOtherSettingName" @tab-click="handleClick" v-if="hasPerm('settings:other')">
      <el-tab-pane label="关于我们" name="aboutUs">
        <aboutUs ref="aboutUs"></aboutUs>
      </el-tab-pane>
      <el-tab-pane label="用户帮助" name="help">
        <help ref="help"></help>
      </el-tab-pane>
      <el-tab-pane label="用户协议" name="userAgreement">
        <userAgreement :activeOtherSettingName="activeOtherSettingName" ref="userAgreement"></userAgreement>
      </el-tab-pane>
      <el-tab-pane label="用户付费协议" name="paymentAgreement">
        <paymentAgreement :activeOtherSettingName="activeOtherSettingName" ref="paymentAgreement"></paymentAgreement>
      </el-tab-pane>
      <el-tab-pane label="版本更新" name="versionUpdate">
        <versionUpdate ref="versionUpdate"></versionUpdate>
      </el-tab-pane>
      <el-tab-pane label="隐私政策" name="privacyPolicy">
        <privacyPolicy :activeOtherSettingName="activeOtherSettingName" ref="privacyPolicy"></privacyPolicy>
      </el-tab-pane>
      <el-tab-pane label="退款说明" name="refundIntro">
        <refundIntro :activeOtherSettingName="activeOtherSettingName" ref="refundIntro"></refundIntro>
      </el-tab-pane>
      <el-tab-pane label="重选老师说明" name="resetTeacherIntro">
        <resetTeacherIntro :activeOtherSettingName="activeOtherSettingName" ref="resetTeacherIntro"></resetTeacherIntro>
      </el-tab-pane>

    </el-tabs>

    <div class="newAdd" @click="addTag('aboutUs')" v-if="activeOtherSettingName==='aboutUs'">内容编辑</div>
    <div class="newAdd" @click="addTag('help')" v-if="activeOtherSettingName==='help'">新增</div>
    <div class="newAdd" @click="addTag('versionUpdate')" v-if="activeOtherSettingName==='versionUpdate'">上传</div>


    <el-dialog title="内容编辑" :visible.sync="dialogFormVisible">
      <el-form :model="formParams">

        <el-form-item style="margin-bottom: 40px;" prop="title" label="logo" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :http-request="Uploadpicture"
            action=""
            :show-file-list="false">
            <img v-if="formParams.cover" :src="formParams.cover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="名称"  :label-width="formLabelWidth">
          <el-input
            style="width: 90%;"
            v-model="formParams.title"
            placeholder="输入名称"
          />
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input
            style="width: 90%;"
            placeholder="输入内容"
            v-model="formParams.content"
            rows="4"
            type='textarea'>
          </el-input>
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
    dynamicList,
    dynamicDel,
    dynamicCheck,
  } from "../../api/content";
  import {
    newsEdit,
    newsDetail,
  } from "../../api/business";
  import {
    newsType,
  } from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import aboutUs from "./components/aboutUs";  //子组件
  import help from "./components/help"; //子组件
  import versionUpdate from "./components/versionUpdate"; //子组件
  import userAgreement from "./components/userAgreement"; //子组件
  import privacyPolicy from "./components/privacyPolicy"; //子组件
  import refundIntro from "./components/refundIntro"; //子组件
  import resetTeacherIntro from "./components/resetTeacherIntro"; //子组件
  import paymentAgreement from "./components/paymentAgreement"; //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "otherSettiing",
    directives: {
      waves,
    },
    components: {
      aboutUs,
      help,
      userAgreement,
      privacyPolicy,
      refundIntro,
      resetTeacherIntro,
      paymentAgreement,
      versionUpdate,
    },

    data() {
      return {
        activeOtherSettingName: 'aboutUs',
        dialogFormVisible: false,
        formLabelWidth: "80px",
        formParams: {
          cover: "",
          title: "",
          content: "",
          newsId: 0,
          type: "aboutUs",
          token: getToken(),
        },
      };
    },
    methods: {
      tagSubmitForm() {
        if (!this.formParams.cover) {
          this.$message({
            message: "请上传图片",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.content) {
          this.$message({
            message: "请输入内容",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        newsEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            // const json = response.data;
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            this.dialogFormVisible = false
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }

        });
      },
      handleClick(tab, event) {
        console.log(this.activeOtherSettingName);
        sessionStorage.setItem('activeOtherSettingName', this.activeOtherSettingName)
        this.getList();
      },
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
          this.formParams.cover = result.url
        })
      },
      initData() {
        newsType({
          type: 'aboutUs',
        }).then(json => {
          if (json.status === 200) {
            this.formParams.content = json.data.content;
            this.formParams.newsId = json.data.id;
            this.formParams.cover = json.data.cover;
            this.formParams.title = json.data.title;
          } else {

          }
        });
      },
      addTag(str) {
        switch (str) {
          case 'aboutUs':
            this.dialogFormVisible = true
            this.initData()
            break;
          case 'help':
            this.$router.push({
              name: "helpDetail", params: {
                id: 0
              }
            })
            break;
          case 'versionUpdate':
            this.$router.push({
              name: "versionUpload", params: {
                id: 0
              }
            })
            break;
        }

      },
      getList() {
        switch (this.activeOtherSettingName) {
          case "aboutUs":
            this.$refs.aboutUs.getVipList();
            break;
          case "help":
            this.$refs.help.getList();
            break;
          case "userAgreement":
            // this.$refs.userAgreement.getList();
            break;
          case "privacyPolicy":
            break;
          case "paymentAgreement":
            // this.$refs.paymentAgreement.getList();
            break;
          case "versionUpdate":
            this.$refs.versionUpdate.getList();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeOtherSettingName')) {
        this.activeOtherSettingName = sessionStorage.getItem('activeOtherSettingName')
      } else {
        this.activeOtherSettingName = "aboutUs"
      }
      console.log(this.activeOtherSettingName, "activeOtherSettingName");
      this.getList()
    }
  };
</script>
<style>
  .otherSettiing .el-tabs__nav {
    margin-left: 40px;
  }

  .otherSettiing .el-tabs__nav-wrap::after {
    background: none;
  }

  .otherSettiing .el-tabs__header {
    margin: 0;
  }

  .otherSettiing .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }

  .otherSettiing .avatar-uploader-icon {
    width: 80px;
    height: 80px;
    line-height: 80px;
    border-radius: 50%;
  }

  .otherSettiing .avatar {
    width: 80px;
    height: 80px;
    line-height: 80px;
    border-radius: 50%;
  }

  .otherSettiing .avatar-uploader .el-upload {
    border: none;
  }

  .el-table::before {
    background: none;
  }
</style>
<style lang="scss" scoped>
  .otherSettiing {
    position: relative;
    .newAdd {
      position: absolute;
      right: 27px;
      top: 10px;
      color: #F65860;
      font-size: 14px;
      cursor: pointer;
    }

  }
</style>
