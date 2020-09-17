<template>
  <div class="viewDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <!--<div class="save" @click="tagSubmitForm">提交</div>-->
    </div>
    <div class="content">

      <el-form class="form-container" ref="postForm" label-width="100px">
        <el-form-item style="margin-bottom: 40px;" prop="title" label="图片">
          <img v-if="formParams.coverImage" :src="formParams.coverImage" class="avatar">
        </el-form-item>
        <el-form-item label="标题">
          <span>{{formParams.title}}</span>
        </el-form-item>

        <el-form-item label="直播类型">
          <span>{{formParams.liveTypeText}}</span>
        </el-form-item>

        <div class="price" style="display: flex">
          <el-form-item label="开播人" prop="title">
            <span>{{formParams.teacher}}</span>
          </el-form-item>
        </div>
        <el-form-item label="直播时间">
          <span>{{formParams.startTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </el-form-item>
        <el-form-item label="进场费用">
          <span>{{formParams.priceFormat}}</span>
        </el-form-item>

        <el-form-item label="提成比例">
          <span>{{formParams.ratio}}%</span>
        </el-form-item>

        <el-form-item label="直播说明">
          <span>{{formParams.intro}}</span>
        </el-form-item>

        <el-form-item label="购买名单" v-if="formParams.liveType =='secret'">
         <span style="color: #1B9AF7;cursor: pointer" @click="viewKehu(1)">查看</span>
        </el-form-item>


        <el-form-item label="邀约名单" v-if="formParams.liveType =='dating'">
         <span style="color: #1B9AF7;cursor: pointer" @click="viewKehu(0)">查看</span>
        </el-form-item>

      </el-form>
    </div>

  </div>
</template>

<script>

  import {
    liveEdit,
    liveDetail,
  } from "../../api/content";
  import {userStaffs,} from "@/api/user";
  import {vipAll,settingRuleGet} from "../../api/settings";
  import {friendFollowMes} from "../../api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "viewDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        label:"",
        formParams: {
          coverImage: "",
          intro: "",
          inviteUsers: [],
          //pub公开、secret密训、dating邀约
          liveType: "pub",
          liveTypeText: "",
          teacherId: null,
          teacher: null,
          liveId: 0,
          price: 0,
          buyUser: 0,
          ratio: 0,
          priceFormat: null,
          startTime: 0,
          title: "",
          token: getToken(),
        },
      };
    },
    methods: {
      viewKehu(num){
        // 0邀约 1 购买
        if(num){
          this.$router.push({
            name: "liveBuysClientList",params:{
              id:this.$route.params.id
            }
          })
        }else {
          this.$router.push({
            name: "liveDatingClientList",params:{
              id:this.$route.params.id
            }
          })
        }
      },
      initData() {
        liveDetail({
          targetId: this.$route.params.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.formParams.liveType = json.data.liveType.value;
            this.formParams.liveTypeText = json.data.liveType.text;
            if(this.formParams.liveType === 'dating'){
            this.label ="邀约名单"
            }else {
              this.label ="购买名单"
            }
            this.formParams.teacherId = json.data.teacherId;
            this.formParams.teacher = json.teacher.extra.trueName;
            this.formParams.coverImage = json.data.coverImage;
            if(json.data.inviteUsers){
              json.data.inviteUsers.forEach((item,index)=>{
                this.formParams.inviteUsers.push(item)
              })
            }
            this.formParams.intro = json.data.intro;
            this.formParams.liveId = json.data.id;
            this.formParams.buyUser = json.data.buyUser;
            this.formParams.ratio = json.data.ratio;
            this.formParams.priceFormat = showDecimal(json.data.price);
            this.formParams.startTime = json.data.startTime
            this.formParams.title = json.data.title;
          }
        });
      },
      back() {
        this.$router.go(-1);//返回上一层
      },
    },
    mounted() {
      // console.log(this.$route.params.id,"parseInt(this.$route.params.id) > 0");
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

  .viewDetail .el-form-item__content{
    margin-left: 130px !important;
  }
</style>
<style lang="scss" scoped>
  .viewDetail {
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
