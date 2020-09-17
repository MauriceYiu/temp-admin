<template>
  <div class="dynamic">
    <div class="detail">
      <div class="top backList" @click="backList">
        返回
      </div>
      <div class="title">{{question.title}}</div>
      <div class="subTitle">
        <span>{{question.answerCount}}人回答</span>
        <span>{{question.visit}}人感兴趣</span>
        <span>{{question.createTime | formatTime('{y}-{m}-{d} {h}:{i}')}}</span>
      </div>
      <div class="content" v-html="question.content"></div>
      <div class="attachments" v-if="question.attachments">
        <attachment v-for="(attachment,index) in question.attachments" :key="index"
                    :attachment="attachment"></attachment>
      </div>
      <div class="bottom">
        <div class="left">
          <div class="imgWrap"><img :src="question.userAvatar" alt=""></div>
          <div class="nameWrap">
            <div class="name">{{question.userName}}</div>
            <div class="level">{{userVip.name}} <span>({{user.createTime | formatTime('{y}-{m}-{d} {h}:{i}')}}注册)</span>
            </div>
          </div>
        </div>
        <!--<div class="attention" @click="follow(true)" v-if="!followed">关注</div>-->
        <!--<div class="attention" @click="follow(false)" v-if="followed">取关</div>-->
      </div>

    </div>

    <!--详情回答-->
    <div class="answer">

      <div class="top backList">
        回答
      </div>
      <div class="items"  v-if="answers.length>0">
        <div class="item" v-for="(answer,index) in answers" :key="index">
          <!--<div class="item">-->
          <div class="left">
            <img :src="answer.userAvatar" alt="">
          </div>
          <div class="rgiht">
            <div class="topInfo">
              <div class="left">
                <div class="name">{{answer.userName}} <span class="blue" @click="replyTa(answer)">@TA</span></div>
                <span class="time">{{answer.createTime | formatTime('{y}-{m}-{d} {h}:{i}')}}</span>
              </div>
              <div class="right">
                <div class="dianzan" @click="dianzan">
                  <img src="../../../assets/dianzan.png" alt="" v-if="!answer.liked" @click="qaAwesome(answer,true)">
                  <img src="../../../assets/dianzanActive.png" alt="" v-else @click="qaAwesome(answer,false)">
                </div>

                <span>{{answer.awesome}}</span>
              </div>
            </div>
            <div class="content" v-html="answer.content"></div>
            <div class="answerBox" v-if="answer.replies.length > 0">
              <div class="answerItem" v-for="(reply,idx) in answer.replies" :key="idx">
                {{reply.userName}}<span class="gray">回复</span> <span class="blue">{{reply.targetUserName}}  </span>
                <span class="contentWord">{{reply.content}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="qaBottom">
        <div class="inputBox">
          <el-input
            type="textarea"
            :rows="2"
            v-model="replayValue"
            :placeholder="placeholder"
          />
          <i class="icon el-icon-close" v-if="closebTn" @click="close"></i>
          <div class="reply" @click="reply">回答</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

  import {
    qaAnswers,
    qaAwesome,
    qaAnswer,
    qaAnswerReply ,
  } from "../../../api/content";
  import {
    userDetail,
    vipUser,
    friendFollowed,
    friendFollow,
  } from "../../../api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import {formatTime, showDecimal} from "@/utils";
  import {getToken} from "@/utils/auth";
  import attachment from "@/components/attachment"

  export default {
    name: "questionsDetail",
    directives: {
      waves,
    },
    data() {
      return {
        question: {},
        userVip: {},
        user: {},
        replayValue: '',
        placeholder: '请输入回复内容',
        followed: false,
        closebTn: false,
        answerParams: {
          "limit": 10,
          "page": 0,
          "questionId": 0,
          "token": getToken()
        },
        qaAnswerReplyParams: {
          content: "",
          targetId: 0,
          targetUserId: 0,
          token: getToken()
        },
        answers: [],
        answerTotal: 0,
      };
    },
    components: {
      attachment,
    },
    methods: {
      show(question) {
        this.question = question;
        this.answerParams.questionId = this.question.id;
        this.answerParams.page = 0;
        this.userDetail(this.question.userId);
        this.vipUser(this.question.userId);
        this.friendFollowed(this.question.userId);
        this.qaAnswers();
      },
      backList() {
        this.$emit("back")
      },
      reply() {
        if(!this.closebTn){
          qaAnswer({
            content: this.replayValue,
            questionId: this.question.id,
            token: getToken(),
          }).then(json => {
            if (json.status === 200) {
              this.qaAnswers()
              this.replayValue = ''
            }
          })
        }else {
          this.qaAnswerReply();
        }
        this.replayValue = ""
      },
      follow(bool) {
        friendFollow({
          "cancel": !bool,
          "targetId": this.question.userId,
          "token": getToken()
        }).then(json => {
          if (json.status === 200) {
            this.followed = !this.followed;
          }
        });
      },
      dianzan() {

      },
      replyTa(data) {
        this.closebTn = true
        console.log(data,'AAAAA');
        this.placeholder = "回复"+ data.userName
        this.qaAnswerReplyParams.targetId = data.id;
        this.qaAnswerReplyParams.targetUserId = data.userId;

      },
      qaAnswerReply(){
        this.qaAnswerReplyParams.content = this.replayValue;
        if( this.qaAnswerReplyParams.content ){
          qaAnswerReply(this.qaAnswerReplyParams).then(json => {
            if (json.status === 200) {
              this.qaAnswers();
            }
          })
        }else {
          this.$message({
            message:"回复内容不能为空！",
            type: "error"
          });
        }


      },
      close(){
        this.closebTn = false;
        this.placeholder = "请输入回复内容"
      },
      userDetail(id) {
        userDetail({
          targetId: id
        }).then(json => {
          if (json.status === 200) {
            console.log(json);
            this.user = json.data;
          } else {

          }
        })
      },
      vipUser(id) {
        vipUser({
          targetId: id
        }).then(json => {
          if (json.status === 200) {
            console.log(json);
            this.userVip = json.data;
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }
        })
      },
      friendFollowed(userId) {
        friendFollowed({
          "targetId": userId,
          "token": getToken()
        }).then(json => {
          if (json.status === 200) {
            this.followed = json.data;
          }
        })
      },
      qaAnswers() {
        qaAnswers(this.answerParams).then(json => {
          if (json.status === 200) {
            this.answers = json.data;
            console.log(this.answers);
            this.answerTotal = json.total;
          }
        })
      },
      qaAwesome(answer, bool) {
        qaAwesome({
          "cancel": !bool,
          "targetId": answer.id,
          "token": getToken()
        }).then(json => {
          if (json.status === 200) {
            answer.liked = !answer.liked;
            answer.awesome = json.data;
          }
        })
      }
    },
    mounted() {

    }
  };
</script>
<style>

  .dynamic .subject .el-tabs__active-bar {
    background: none;
  }
  .dynamic .el-textarea__inner{
    outline: none;
    resize:none;
    border:none;
  }
</style>
<style lang="scss" scoped>
  .dynamic {
    /*border: 1px solid red;*/
    background: #ffffff;
    height: 100%;
    .detail {
      background: #ffffff;
      display: flex;
      flex-direction: column;
      .backList {
        display: flex;
        align-items: center;
        height: 60px;
        border-bottom: 1px solid #f2f2f2;
        color: #5BC0DF;
        padding-left: 20px;
        cursor: pointer;
      }
      .title {
        padding-left: 20px;
        font-size: 20px;
        font-weight: 600;
        margin: 20px 0;
      }
      .subTitle {
        padding-left: 20px;
        color: #999999;
        font-size: 10px;
        span:nth-child(2) {
          margin: 0 40px 0 20px;
        }
      }
      .content {
        padding-left: 20px;
        color: #333333;
        font-size: 14px;
        margin: 20px 0 50px;
        line-height: 20px;
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
      .bottom {
        border-top: 1px solid #f2f2f2;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          display: flex;
          .imgWrap {
            margin-right: 18px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .nameWrap {
            /*border: 1px solid red;*/
            .name {
              font-size: 16px;
              margin: 7px 0 4px;
            }
            .level {
              font-size: 14px;
              color: #999999;
            }
          }
        }
        .attention {
          background: #5BC0DF;
          color: white;
          font-size: 14px;
          cursor: pointer;
          width: 60px;
          height: 30px;
          border-radius: 20px;
          display: flex;
          justify-content: center;
          align-items: center;

        }
      }
    }
    .answer {
      background: #ffffff;
      margin-top: 18px;
      .backList {
        display: flex;
        align-items: center;
        height: 60px;
        border-bottom: 1px solid #f2f2f2;
        color: #5BC0DF;
        padding-left: 20px;
      }
      .items {
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid #f2f2f2;
        .item {
          cursor: pointer;
          padding: 20px;
          /*border: 1px solid red;*/
          display: flex;
          & > .left {
            margin-right: 18px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          & > .rgiht {
            /*border: 1px solid red;*/
            flex-grow: 1;
            width: 90%;
            display: flex;
            flex-direction: column;
            .topInfo {
              display: flex;
              justify-content: space-between;
              .left {
                display: flex;
                flex-direction: column;
                .name {
                  margin-bottom: 6px;
                  .blue{
                    margin-left: 10px;
                    color: rgba(91, 192, 223, 1);
                  }
                }
                .time {
                  color: #999999;
                  font-size: 12px;
                }

              }
              .right {
                display: flex;
                .dianzan {
                  cursor: pointer;
                  width: 20px;
                  height: 20px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin-right: 4px;
                  img {
                    width: 14px;
                  }
                }
                span {
                  /*border: 1px solid red;*/
                  font-size: 12px;
                  color: #999999;
                  width: 20px;
                  height: 20px;
                  line-height: 20px;
                  display: table-cell;
                  vertical-align: bottom;
                }
              }
            }
            .content {
              /*padding-left: 20px;*/
              color: #333333;
              font-size: 14px;
              margin: 20px 0;
              line-height: 20px;
            }
            .answerBox {
              background: #F9F9F9;
              padding: 20px;
              .answerItem {
                color: #333333;
                margin-bottom: 12px;
                font-size: 13px;
                .gray {
                  color: #999999;
                  margin: 0 10px;
                  font-size: 12px;
                }
                .blue {
                  color: #5BC0DF;
                  margin-right: 16px;
                }
                .contentWord {
                  color: #999999;
                }
              }
              .answerItem:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
      }

      .qaBottom {
        padding: 20px;
        .inputBox{
          height: 100px;
          position: relative;
          border: 1px solid #f2f2f2;
          border-radius: 4px;
          .reply{
            cursor: pointer;
            position: absolute;
            right:13px;
            bottom: 6px;
            padding: 4px 14px 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #5BC0DF;
            border-radius: 5px;
            font-size: 14px;
            color: white;
          }
          .el-icon-close{
            position: absolute;
            left:13px;
            top: -7px;
            color: red;
            cursor: pointer;
          }
        }
      }
    }

  }
</style>
