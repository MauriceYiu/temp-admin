<template>
  <div class="userDetail">
    <div class="container">
      <div class="left">
        <div class="avatar">
          <el-avatar :size="90" :src="avatar">
            无
          </el-avatar>
        </div>
        <div class="name">
          <h4>{{name}}</h4>
          <p>{{sign}}</p>
        </div>
        <div class="info">
          <p>ID：{{userId}}</p>
          <p>性别：{{gender}}</p>
          <p>城市：{{address}}</p>
          <p>注册号码：{{mobile}}</p>
          <p>注册时间：{{createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
        </div>
        <div class="shuju">
          <div class="balance">
            <h4>{{surplus|showDecimal}}</h4>
            <p>余额</p>
          </div>
          <div class="balance consume">
            <h4>{{recharge|showDecimal}}</h4>
            <p>累计充值</p>
          </div>
          <div class="vip">{{vipString()}}</div>
        </div>
        <div class="promoter">推广人：{{inviteUserName || "--"}}</div>
        <div class="promoter" v-if="sayHelloTime">业务员绑定时间：{{sayHelloTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</div>
        <div class="promoter" v-if="clearTime">账号注销时间：{{clearTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</div>
        <!--<div class="promoter teacher">服务老师：暂无</div>-->
        <!--<div class="footer">-->
        <!--<h4>客户资质</h4>-->
        <!--<div class="info">-->
        <!--<p>芝麻分：652：{{gender}}</p>-->
        <!--<p>保单：有：{{address}}</p>-->
        <!--<p>信用卡：1张：{{mobile}}</p>-->
        <!--<p>通讯录：78人：</p>-->
        <!--</div>-->
        <!--</div>-->
      </div>
      <div class="right">
        <div class="main">
          <div class="top">
            <div class="item" @click="changeItem('question')" :class="{blue:'question'===current}"
                 v-if="hasPerm('customers:customer:question')">
              <h4>{{question}}</h4>
              <p>提问</p>
            </div>
            <div class="item" @click="changeItem('fav')" :class="{blue:'fav'===current}"
                 v-if="hasPerm('customers:customer:fav')">
              <h4>{{fav}}</h4>
              <p>收藏</p>
            </div>
            <div class="item" @click="changeItem('followed')" :class="{blue:'followed'===current}"
                 v-if="hasPerm('customers:customer:follow')">
              <h4>{{followed}}</h4>
              <p>关注</p>
            </div>
            <div class="item" @click="changeItem('courseBuy')" :class="{blue:'courseBuy'===current}"
                 v-if="hasPerm('customers:customer:buys')">
              <h4>{{courseBuy}}</h4>
              <p>已购</p>
            </div>
            <div class="item" @click="changeItem('note')" :class="{blue:'note'===current}"
                 v-if="hasPerm('customers:customer:notes')">
              <h4>{{note}}</h4>
              <p>笔记</p>
            </div>
            <!--<div class="item" @click="changeItem('wealthFlow')" :class="{blue:'wealthFlow'===current}">-->
            <!--<h4>{{wealthFlow}}</h4>-->
            <!--<p>账单</p>-->
            <!--</div>-->
            <div class="item" @click="changeItem('activityDating')" :class="{blue:'activityDating'===current}"
                 v-if="hasPerm('customers:customer:activity')">
              <h4>{{activityDating}}</h4>
              <p>预约</p>
            </div>
            <div class="item" @click="changeItem('serviceBuy')" :class="{blue:'serviceBuy'===current}"
                 v-if="hasPerm('customers:customer:service')">
              <h4>{{serviceBuy}}</h4>
              <p>订单</p>
            </div>
          </div>
          <div class="note">
            <h4>{{titleText}}</h4>
            <div class="list fav" v-if="'fav'===current">
              <div class="item" v-for="(item,index) in list" :key="index">
                <p>{{item.title}}</p>
                <div class="intro">
                  <div class="left" style="color: #999999">
                    {{item.intro}}
                  </div>
                </div>
                <div class="time" style="color: #DADADA">
                  {{item.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </div>
              </div>
            </div>
            <div class="questionList" v-if="'question'===current">
              <div class="item" v-for="(item,index) in list" :key="index" @click="goDetail(item)">
                <div class="title">
                  <div class="titleWord" v-text="item.title"></div>
                  <div class="content" v-text="item.content"></div>
                  <div class="attachments" v-if="item.attachments">
                    <attachment v-for="(attachment,index) in item.attachments" :key="index"
                                :attachment="attachment"></attachment>
                  </div>
                </div>
                <div class="bottom">
                  <div class="action">
                    <!--<div class="reply"><i class="el-icon-s-comment"></i>{{item.answerCount}}</div>-->
                    <!--<div class="collect"><i class="el-icon-news"></i>{{item.visit}}</div>-->
                    <!--<div class="piece"><span>记录人：{{item.userName}}</span></div>-->
                  </div>
                  <div class="description">
                    <div class="piece time"><span>{{item.createTime | formatTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="followedList" v-if="'followed'===current">
              <div class="item" v-for="(item,index) in list" :key="index" @click="goDetail(item)">
                <div class="imgWrap">
                  <img :src="item.avatar" alt="" style="width: 40px;border-radius: 50%;">
                </div>
                <div class="info">
                  <div class="name" v-text="item.name"></div>
                  <div class="role" v-text="item.role"></div>
                </div>

              </div>
            </div>
            <div class="courseBuy" v-if="'courseBuy'===current">
              <div class="item" v-for="(item,index) in list" :key="index">

                <div class="info">
                  <span>{{item.title}}</span> <span>({{item.createUserName}})</span>
                </div>
                <div class="imgWrap">
                  <img :src="item.coverImage" alt="" style="width: 100px;margin-top:10px;margin-right: 10px">
                </div>
                <div class="bottom">
                  <div class="left">
                    <!--<span style="color: gray"># {{ item.coverImage !==null ? "图文":''文本 }}</span>-->
                    <span style="color: gray" v-if="item.attachmentType"># {{item.attachmentType.text}}</span>
                    <span style="color: red">￥{{item.price | showDecimal()}}</span>
                  </div>
                  <div class="time" style="color: gray">{{item.createTime | formatTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                  </div>
                </div>

              </div>
            </div>
            <div class="list noteList" v-if="'note'===current">
              <div class="item" v-for="(item,index) in list" :key="index">
                <p style="color: #666666">{{item.content}}</p>
                <div class="bottom">
                  <div class="left">
                    记录人: {{item.teacherName || "--"}}
                  </div>
                  <div class="right">
                    {{item.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}
                  </div>
                </div>
              </div>
            </div>
            <div class="wealthFlowList" v-if="'wealthFlow'===current">
              <div class="item" v-for="(item,index) in list" :key="index"
                   style="padding:0 20px;display: flex;justify-content: space-between;margin-bottom: 20px">
                <div class="info">
                  <span>{{item.createTime | formatTime('{y}-{m}-{d} {h}:{i}')}} </span> <span>{{item.detail}}</span>
                  <span>（{{item.unionType.text}} ID：{{item.unionId}}）</span>
                </div>
                <div>￥{{item.offset | showDecimal()}}</div>
              </div>
            </div>
            <div class="activityDatingList" v-if="'activityDating'===current">
              <div class="item" v-for="(item,index) in list" :key="index">
                <div class="title">
                  <span v-if="item.activity">{{item.activity.title}}</span>
                  <span v-if="item.activity" style="color: #666666;font-size: 12px">开始时间 {{item.activity.startTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </div>
                <div class="teacher" v-if="item.activity">
                  讲师 {{ item.activity.master.name }}
                </div>

                <div class="bottom">
                  <span style="color: red;"> ￥{{item.price | showDecimal()}}</span>
                  <div style="color: #999999">{{item.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</div>
                </div>

              </div>
            </div>
            <div class="activityDatingList wealthFlowList" v-if="'serviceBuy'===current">

              <div class="item" v-for="(item,index) in list" :key="index">
                <div class="title">
                  <div class="left">
                    <span>{{item.serviceName}}</span> <span v-if="item.status">{{"--"+item.status.text}}</span>

                  </div>
                  <div class="number">
                    <span style="color: #999999;">{{" 订单号：" +  item.number}}</span>
                  </div>
                  <!--<span v-if="item.extra.values"-->
                  <!--style="display: inline-block;color: #999999;margin-top: 8px">填写的资料：</span><br>-->
                  <!--<span v-for="(value,key) in item.extra.values" :key="key"-->
                  <!--style="color: #999999">{{key}}:{{value }}<br></span>-->
                </div>
                <div class="teacher" style="color: #999999">
                  <span v-if="item.teacherName">{{item.teacherName}}</span>
                  <span v-else>未选择老师</span>
                </div>
                <div class="bottom">
                  <span>￥{{item.price | showDecimal()}}</span>
                  <div style="color: #999999">{{item.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</div>
                </div>

              </div>

            </div>
          </div>
          <div class="paginationBox">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10,20,30, 50]"
              :page-size="listQuery.limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script>

  import {
    activityBuys,
    courseBuys,
    favList,
    friendFollows,
    qaQuestions,
    userDetail,
    userMy,
    userNotes,
    userStatistics,
    wealthFlows,
  } from "../../../api/user";
  import {serviceBuys,} from "../../../api/financeData";
  import {vipAll} from "../../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import {getToken} from "@/utils/auth";
  import attachment from "@/components/attachment"

  export default {
    name: "userDetail",
    directives: {
      waves,
    },
    data() {
      return {
        avatar: '',
        titleText: '',
        name: '',
        sign: '',
        gender: '',
        address: '',
        mobile: '',
        createTime: '',
        surplus: '',
        recharge: '',
        inviteUserName: '',
        sayHelloTime: null,
        clearTime: null,
        activityDating: '',
        coupon: '',
        fav: '',
        followed: '',
        question: '',
        listLoading: false,
        courseBuy: '',
        note: '',
        serviceBuy: '',
        wealthFlow: '',
        total: 0,
        currentPage: 1,
        vipData: [],
        list: [],
        userId: 0,
        token: "",
        listQuery: {
          limit: 10,
          page: 0
        },
        current: 'question'

      };
    },
    components: {
      attachment,
    },
    watch: {
      currentPage(val) {
        console.log(val, "change");
      }
    },
    methods: {
      changeItem(str, page) {
        this.total = 0;
        console.log(page, '1');
        this.listQuery.page = page || 0;
        console.log(this.listQuery.page, '2');
        console.log(this.currentPage, '3');
        this.current = str;
        switch (str) {
          case 'question':    // <p>提问</p>
            this.titleText = "提问列表"
            this.qaQuestions(page);
            break;
          case 'fav':   // <p>收藏</p>
            this.titleText = "收藏列表"
            this.favList(page);
            break;
          case 'followed':   // <p>关注</p>
            this.titleText = "好友列表"
            this.friendFollows(page);
            break;
          case 'courseBuy':   // <p>已购</p>
            this.titleText = "已购列表"
            this.courseBuys(page);
            break;
          case 'note':   // <p>笔记列表</p>
            this.titleText = "服务笔记"
            this.userNotes(page);
            break;
          case 'activityDating':   // 预约
            this.titleText = "预约列表"
            this.activityBuys(page);
            break;
          case 'serviceBuy':   // 订单
            this.titleText = "订单列表"
            this.serviceBuys(page);
            break;
        }
      },
      goDetail(item) {

      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.changeItem(this.current, this.page - 1)
      },
      handleCurrentChange(val) {
        console.log(val);
        this.currentPage = val;
        this.changeItem(this.current, val - 1)
      },
      vipString() {
        if (this.vipData) {
          for (let i = this.vipData.length - 1; i >= 0; i--) {
            if (this.recharge >= this.vipData[i].value) {
              return this.vipData[i].name;
            }
          }
        }
        return '--'
      },
      userStatistics() {
        userStatistics({
          targetId: this.userId,
          token: this.token
        }).then(json => {
          if (json.status === 200) {
            console.log(json);

            this.coupon = json.data.coupon;
            this.fav = json.data.fav;
            this.followed = json.data.followed;
            this.question = json.data.question;
            this.courseBuy = json.data.courseBuy;   //已购
            this.note = json.data.notes;
            this.activityDating = json.data.activityDating;
            this.serviceBuy = json.data.serviceBuy;
          } else {

          }
        });
      },
      //   user/notes
      // 用户笔记列表
      userNotes() {
        this.listLoading = true;
        let params = {
          limit: 10,
          page: 0,
          userId: this.userId,
          token: getToken(),
        }
        userNotes(params).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          }
        })
      },

      //  /qa/questions
      // 问题列表
      qaQuestions(page) {
        this.listLoading = true;
        this.listQuery = {
          limit: 10,
          page: page || 0,
          userId: this.userId,
          token: getToken(),
        }
        qaQuestions(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          }
        })
      },
      // 收藏列表
      favList(page) {
        this.listLoading = true;
        this.listQuery = {
          favType: 'course',
          limit: 10,
          page: page || 0,
          token: this.token,
        }
        favList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          }
        })
      },
      // 我关注的好友
      friendFollows(page) {
        this.listLoading = true;
        this.listQuery = {
          mutual: 0,
          limit: 10,
          page: page || 0,
          userId: this.userId,
          token: this.token,
        }
        friendFollows(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          }
        })
      },
      // 课程购买列表
      courseBuys(page) {
        this.listLoading = true;
        this.listQuery = {
          limit: 10,
          page: page || 0,
          targetUserId: this.userId,
          token: getToken(),
        }
        courseBuys(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          }
        })
      },
      // 用户资产流水
      wealthFlows(page) {
        this.listLoading = true;
        this.listQuery = {
          limit: 10,
          page: page || 0,
          wealthType: "money",
          targetUserId: this.userId,
          token: getToken(),
        }
        wealthFlows(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          } else {

          }
        })
      },
      // 用户资产流水
      // 线下活动4
      activityBuys(page) {
        this.listLoading = true;
        this.listQuery = {
          userId: this.userId,
          limit: 10,
          page: page || 0,
          token: getToken(),
        }
        activityBuys(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          }
        })
      },
      // 用户订单列表
      serviceBuys(page) {
        this.listLoading = true;
        this.listQuery = {
          limit: 10,
          targetUserId: this.userId,
          page: page || 0,
          token: this.token,
        }
        serviceBuys(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          }
        })
      },
      getUserMy() {
        // console.log(this.token);
        userMy({
          token: this.token,
        }).then(json => {
          if (json.status === 200) {
            // console.log(json.data);
            this.avatar = json.data.extra.trueAvatar;
            this.name = json.data.extra.trueName;
            this.sign = json.data.extra.sign;
            this.gender = json.data.gender.text;
            this.address = (json.data.province || '') + (json.data.city || '');
            this.mobile = json.data.mobile;
            this.createTime = json.data.createTime;
            this.surplus = json.data.surplus
            this.recharge = json.data.recharge;
            this.inviteUserName = json.data.inviteUserName;
            this.sayHelloTime = json.data.sayHelloTime;
            this.clearTime = json.data.extra.clearTime;
          }
        });

      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      //取得vip 等级列表
      getVipList() {
        vipAll().then(json => {
          if (json.status === 200) {
            this.vipData = json.data;
          }
        });
      },
      refresh(id, token) {
        this.userId = id;
        this.token = token;
        this.userStatistics()
        this.getUserMy();
        this.changeItem('question')
      }
    },
    mounted() {
      this.getVipList()

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

  .userDetail .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .userDetail .el-textarea {
    width: 86%;
  }

  .userDetail .time .el-form-item__content {
    margin-left: 16px !important;
  }
</style>
<style lang="scss" scoped>
  .userDetail {
    /*background: rgb(245, 246, 250);*/
    min-height: 100vh;
    flex-grow: 1; //铺满盒子剩余空间
    .container {
      min-height: 100vh;
      /*padding: 20px;*/
      /*border: 1px solid red;*/
      display: flex;
      width: 100%;

      & > .left {
        width: 530px;
        background: white;
        margin-right: 20px;
        padding: 30px;

        p {
          margin: 0;
          color: #666666;
          font-size: 14px;
          line-height: 30px;
        }

        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .name {
          margin: 20px 0;

          h4 {
            margin: 0;
          }
        }

        .shuju {
          margin: 30px 0 20px;
          display: flex;
          align-items: center;

          .balance {
            margin-right: 40px;

            h4 {
              margin: 0;
            }

            p {
              margin: 0;
              color: #666666;
              font-size: 14px;
              line-height: 30px;
            }
          }

          .vip {
            background: #5BC0DF;
            color: white;
            border-radius: 30px;
            padding: 0 16px;
            font-size: 12px;
            height: 30px;
            display: flex;
            align-items: center;
          }
        }

        .promoter {
          color: #333333;
          font-size: 14px;
        }

        .teacher {
          margin: 10px 0 50px;
        }

        .footer {
          h4 {
            color: #5BC0DF;
          }
        }
      }

      & > .right {
        /*flex-grow: 1;*/
        width: calc(100% - 550px);
        background: white;
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
                margin-top: 4px;
                font-size: 14px;
              }
            }

            .item:last-child {
              border-right: none;
            }

            .blue {
              color: #5BC0DF;
              font-weight: bold;
            }
          }

          .note {
            padding: 0 43px;
            box-sizing: border-box;

            h4 {
              color: #5BC0DF;
              margin-top: 38px;
            }

            .list {
              .item {
                margin-bottom: 30px;

                p {
                  margin: 0;
                  line-height: 22px;
                  font-size: 14px;
                }

                .bottom {
                  /*border: 1px solid red;*/
                  display: flex;
                  justify-content: space-between;
                  color: #F65860;
                  font-size: 14px;
                  margin-top: 10px;

                  .left {
                    padding: 0;
                  }

                  .right {
                    padding: 0;
                    display: flex;
                    justify-content: flex-end;
                  }
                }
              }
            }

            .questionList {
              /*display: flex;*/
              /*flex-direction: column;*/
              .item {
                font-size: 14px;
                border-bottom: 1px solid #f2f2f2;
                padding: 20px 0;
                cursor: pointer;
                /*border: 1px solid red;*/
                /*width: 90%;*/
                .title {
                  color: #101010;
                  display: flex;
                  flex-direction: column;
                  line-height: 20px;

                  .titleWord {
                    color: #101010;
                  }

                  .content {
                    margin-top: 6px;
                    color: #999999;
                  }

                  .attachments {
                    display: flex;
                    width: 100%;
                    box-sizing: border-box;
                    flex-wrap: wrap;
                    margin-top: 10px;

                    .attachment {
                      width: 140px;
                      height: 140px;
                    }
                  }
                }

                .bottom {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 20px;
                  color: red;

                  .action {
                    display: flex;

                    .reply {
                      margin-right: 28px;
                      cursor: pointer;

                      i {
                        margin-right: 5px;
                      }
                    }

                    .collect {
                      cursor: pointer;

                      i {
                        margin-right: 5px;
                      }
                    }
                  }

                  .description {
                    display: flex;
                  }

                }

              }
            }

            .fav {
              .item {
                padding: 20px 0;
                border-bottom: 1px solid #f2f2f2;

                .intro {
                  font-size: 13px;
                  margin-top: 2px;
                }

                .time {
                  text-align: right;
                  font-size: 12px;
                }
              }
            }

            .courseBuy {
              .item {
                padding: 20px 0;
                border-bottom: 1px solid #f2f2f2;
                font-size: 14px;

                .bottom {
                  margin-top: 10px;
                  font-size: 12px;
                  display: flex;
                  justify-content: space-between;
                }
              }
            }

            .noteList {
              .item {
                padding: 20px 0;
                border-bottom: 1px solid #f2f2f2;
                font-size: 14px;
                margin-bottom: 0;
              }
            }

            .followedList {
              .item {
                display: flex;
                padding: 10px 20px;

                .imgWrap {
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  margin-right: 16px;

                  img {
                    width: 40px;
                    border-radius: 50%;
                  }
                }

                .info {
                  .role {
                    font-size: 12px;
                    color: #cccccc;
                    margin-top: 8px;
                  }
                }
              }

            }

            .activityDatingList {
              .item {
                padding: 20px 0;
                border-bottom: 1px solid #f2f2f2;
                font-size: 14px;

                .title {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 5px;
                }

                .teacher {
                  color: #999999;
                  font-size: 12px;
                }

                .bottom {
                  margin-top: 10px;
                  font-size: 12px;
                  display: flex;
                  justify-content: space-between;
                }
              }
            }

            .serviceBuyList {
              .item {
                display: flex;
                flex-direction: column;

                .title {

                }
              }
            }
          }

          .paginationBox {
            margin: 20px auto;
            text-align: center;
          }
        }
      }
    }

  }
</style>
