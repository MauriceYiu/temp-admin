<template>
  <div class="viewColleagueDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
    </div>
    <div class="content">
      <div class="left">
        <el-form class="form-container" ref="postForm" label-width="100px">
          <div class="price" style="display: flex;margin-bottom: 30px">
            <el-form-item class="leftFormItem" prop="title" label="头像">
              <div class="imgWrap">
                <img v-if="formParams.trueAvatar" :src="formParams.trueAvatar" class="avatar">
              </div>

            </el-form-item>
            <el-form-item class="rightFormItem" prop="title" label="工号">
              <span style="color: #5BC0DF;font-size: 26px;font-weight: bold">{{ formParams.account }}</span>
            </el-form-item>
          </div>

          <div class="price" style="display: flex">
            <el-form-item class="leftFormItem" label="姓名">
              <span>{{ formParams.trueName }}</span>
            </el-form-item>
            <el-form-item class="rightFormItem" label="籍贯" prop="title">
              <span>{{ formParams.birthplace }}</span>
            </el-form-item>

          </div>
          <div class="price" style="display: flex">
            <el-form-item class="leftFormItem" label="手机号">
              <span>{{ formParams.mobile }}</span>
            </el-form-item>

            <el-form-item class="rightFormItem" label="学历" prop="title">
              <span>{{ formParams.education}}</span>
            </el-form-item>
          </div>

          <div class="price" style="display: flex">
            <el-form-item class="leftFormItem" label="性别">
              <span>{{ formParams.gender}}</span>
            </el-form-item>
            <el-form-item class="rightFormItem" label="生日" prop="title">
              <span>{{ valuePickerBirth | parseTime('{y}/{m}/{d}')}}</span>
            </el-form-item>

          </div>
          <div class="price" style="display: flex">
            <el-form-item class="leftFormItem bankNo" label="邮箱">
              <span>{{ formParams.email}}</span>
            </el-form-item>
          </div>

          <div class="price" style="display: flex">

            <el-form-item class="leftFormItem" label="部门">
              <span>{{ formParams.departmentName }}</span>
            </el-form-item>

            <el-form-item class="rightFormItem" label="职位" prop="title">
              <span>{{ formParams.job}}</span>
            </el-form-item>
          </div>
          <div class="price" style="display: flex">
            <el-form-item class="leftFormItem" label="岗位">
              <span>{{ formParams.job }}</span>
            </el-form-item>
            <el-form-item class="rightFormItem" label="直属上级" prop="title">
              <span>{{ formParams.parentUser }}</span>
            </el-form-item>
          </div>

          <div class="price" style="display: flex">
            <el-form-item class="leftFormItem" label="招聘人事">
              <span>{{ formParams.auditionUser }}</span>
            </el-form-item>
            <el-form-item class="rightFormItem" label="内推人" prop="title">
              <span>{{ formParams.inviteUser }}</span>
            </el-form-item>
          </div>

          <div class="price" style="display: flex">
            <el-form-item class="leftFormItem" label="入职时间">
              <span>{{ valuePickerJoinTime | parseTime('{y}/{m}/{d}')}}</span>
            </el-form-item>

          </div>

          <div class="price" style="display: flex">
            <el-form-item class="leftFormItem bankNo" label="银行卡号">
              <span>{{ formParams.bankNo }}</span>
            </el-form-item>
          </div>

          <div class="price" style="display: flex">
            <el-form-item class="leftFormItem bankNo" label="支付宝账户">
              <span>{{ formParams.alipay }}</span>
            </el-form-item>

          </div>

          <div class="price" style="display: flex">
            <el-form-item class="leftFormItem bankNo" label="兴趣爱好">
              <span>{{ formParams.hobby }}</span>
            </el-form-item>

          </div>
          <div class="price" style="display: flex;margin-top: 40px">
            <el-form-item class="leftFormItem bankNo" label="备注">
              <span>{{ formParams.intro }}</span>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="right">

        <div class="main">
          <div class="top">
            <div class="item" @click="changeItem('work')" :class="{blue:'work'===current}">
              <h4>{{work}}</h4>
              <p>工作圈</p>
            </div>
            <div class="item" @click="changeItem('course')" :class="{blue:'course'===current}">
              <h4>{{course}}</h4>
              <p>课程</p>
            </div>
            <div class="item" @click="changeItem('live')" :class="{blue:'live'===current}">
              <h4>{{live}}</h4>
              <p>直播</p>
            </div>
            <div class="item" @click="changeItem('dynamic')" :class="{blue:'dynamic'===current}">
              <h4>{{dynamic}}</h4>
              <p>动态</p>
            </div>
            <div class="item" @click="changeItem('inviteUser')" :class="{blue:'inviteUser'===current}">
              <h4>{{inviteUser}}</h4>
              <p>推广</p>
            </div>
          </div>
          <div class="note">
            <h4>{{titleText}}</h4>
            <work ref="work" v-show="'work'===current" :userId="formParams.userId"></work>
            <course ref="course" v-show="'course'===current" :userId="formParams.userId"></course>
            <live ref="live" v-show="'live'===current" :userId="formParams.userId"></live>
            <dynamic ref="dynamic" v-show="'dynamic'===current" :userId="formParams.userId"></dynamic>
            <inviteUser ref="inviteUser" v-show="'inviteUser'===current" :userId="formParams.userId"></inviteUser>
          </div>
        </div>


      </div>

    </div>
  </div>
</template>

<script>

  import {
    userStaffs,
    userDetail,
    staffCount,
  } from "../../api/user";
  import {
    jpAll,
  } from "../../api/department.js";
  import {
    types,
  } from "@/api/settings";
  import {vipAll} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal, isMobile} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'
  import work from './components/workDetail'
  import course from './components/course'
  import live from './components/live'
  import dynamic from './components/dynamic'
  import inviteUser from './components/inviteUser'


  export default {
    name: "viewColleagueDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      work,
      course,
      live,
      dynamic,
      inviteUser,
    },
    data() {
      return {
        staffOptions: {},
        formParams: {
          app: "staff",
          account: "",
          alipay: "",
          education: "",
          bankNo: "",
          auditionUserId: null,
          auditionUser: null,
          birthplace: "",  //籍贯
          departmentId: null,
          jobTime: null,
          birthday: null,
          email: "",
          enable: true,
          gender: "male",
          hobby: "",
          intro: "",
          inviteUserId: null,  //邀请用户ID
          inviteUser: null,  //邀请用户ID
          jobPositionId: null,
          mobile: "",
          parentUserId: null,   //上级用户ID
          parentUser: null,   //上级用户ID
          password: "",   //
          role: "",   //
          roleGroupIds: [],   //
          token: getToken(),
          trueAvatar: "",
          trueName: "",
          userId: 0,
          valuePickerBirth: 0,
          departmentName: "",
          job: "",
        },
        valuePickerJoinTime: "",
        valuePickerBirth: "",
        current: "work",
        work: 0,
        course: 0,
        live: 0,
        dynamic: 0,
        inviteUser: 0,
        titleText: "",
        loading: false,

      };
    },
    methods: {

      staffCount() {
        staffCount({
          targetId: parseInt(this.$route.params.id),
          token: this.token
        }).then(json => {
          if (json.status === 200) {
            this.work = json.data.workingCircle;
            this.course = json.data.course;
            this.live = json.data.live;
            this.dynamic = json.data.dynamic;
            this.inviteUser = json.data.invite;   //已购
          }
        });
      },
      changeItem(str, page) {
        this.current = str;
        switch (str) {
          case 'work':
            this.titleText = "工作圈列表"
            break;
          case 'course':
            this.titleText = "课程列表"
            break;
          case 'live':
            this.titleText = "直播列表"
            break;
          case 'dynamic':
            this.titleText = "动态列表"
            // this.dynamic(page);
            break;
          case 'inviteUser':
            this.titleText = "客户列表"
            break;
        }
      },
      initData() {
        userDetail({
          targetId: this.$route.params.id,
        }).then(json => {
          if (json.status === 200) {

            this.formParams = {
              app: json.data.app.value,
              account: json.data.mobile,
              alipay: json.data.extra.alipay,
              role: json.data.role ? json.data.role.text : "",
              education: json.data.education ? json.data.education.text : "",
              bankNo: json.data.extra.bankNo,
              auditionUserId: json.data.auditionUserId,
              auditionUser: '--',
              birthplace: json.data.extra.birthplace,
              departmentId: json.data.departmentId,
              email: json.data.extra.email,
              userId: json.data.id,
              enable: json.data.enable,
              gender: json.data.gender.text,
              hobby: json.data.extra.hobby,
              intro: json.data.extra.intro,
              inviteUserId: json.data.inviteUserId,
              inviteUser: '--',
              jobPositionId: json.data.jobPositionId,
              mobile: json.data.extra.mobile,
              parentUserId: json.data.parentUserId,
              parentUser: '--',
              password: json.data.password,
              roleGroupIds: [],
              trueAvatar: json.data.extra.trueAvatar,
              trueName: json.data.extra.trueName,
              departmentName: json.department.name,
              job: json.data.extra.job ? json.data.extra.job : "--",
            }
            this.valuePickerBirth = json.data.extra.birthday * 1000
            this.valuePickerJoinTime = json.data.jobTime * 1000
            this.getUserList();
            // console.log(this.formParams.userId);
          }
        });
      },
      getUserList() {
        userStaffs({
          departmentId: 0,
          enable: 1,
          jobLeave: 1,
          token: getToken()
        }).then(json => {
          if (json.status === 200) {
            let obj = {}
            json.data.forEach((item) => {
              obj[item.id] = item.name;
            });
            this.formParams.parentUser = obj[this.formParams.parentUserId] ? obj[this.formParams.parentUserId] : "无";
            this.formParams.auditionUser = obj[this.formParams.auditionUserId] ? obj[this.formParams.auditionUserId] : "无";
            this.formParams.inviteUser = obj[this.formParams.inviteUserId] ? obj[this.formParams.inviteUserId] : "无";
            // console.log(this.formParams.parentUser);
            // console.log(this.formParams.auditionUser);
            // console.log(this.formParams.inviteUser);
          }
        });
      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      // 所有的职位列表
      jpAll() {
        jpAll().then(json => {
          if (json.status === 200) {
            this.jobOptions = json.data
          }
        });
      },

    },
    mounted() {
      if (parseInt(this.$route.params.id) > 0) {
        this.initData();
        this.staffCount();
        this.changeItem("work");
      }

    }
  };
</script>
<style>
  .avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    display: block;
  }

  .viewColleagueDetail .el-form-item__label {
    color: #cccccc;
    margin-right: 20px;
  }

  .viewColleagueDetail .el-form-item {
    margin-bottom: 0;
  }

</style>
<style lang="scss" scoped>
  .viewColleagueDetail {
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
      min-height: calc(100vh - 140px);
      position: relative;
      display: flex;
      justify-content: space-between;
      .left {
        /*border: 1px solid yellow;*/
        background: white;
        width: 49%;
        .form-container {
          background: white;
          padding: 30px 0 100px;
          .leftFormItem {
            width: 40%;
            .imgWrap {
              width: 70px;
              height: 70px;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }
          .bankNo {
            width: 100%;
          }
          .rightFormItem {
            width: 60%;
            /*border: 1px solid red;*/
            /*margin-left: 10%*/
          }

        }

      }
      .right {
        background: white;
        width: 49%;
        padding: 30px 0;
        display: flex;
        justify-content: center;
        .main {
          width: 100%;
          .top {
            width: 100%;
            /*border: 1px solid red;*/
            padding-bottom: 30px;
            display: flex;
            flex-direction: row;
            border-bottom: 1px solid #f2f2f2;
            .item {
              flex: 1;
              border-right: 2px solid #f2f2f2;
              cursor: pointer;
              /*border: 1px solid red;*/
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              /*padding: 20px;*/
              /*margin-bottom: 20px;*/
              h4 {
                margin: 0;
                font-size: 22px;
              }
              p {
                margin: 0;
                margin-top: 6px;
                font-size: 10px;
                color: #969696;
              }
            }
            .item:last-child {
              border-right: none;
            }
            .blue {
              color: #5BC0DF;
              font-weight: bold;
              p {
                color: #5BC0DF;
              }
            }
          }
          .note {
            padding-left: 43px;
            box-sizing: border-box;
            h4 {
              color: #5BC0DF;
              margin-top: 38px;
            }
          }
        }
      }

    }

  }
</style>
