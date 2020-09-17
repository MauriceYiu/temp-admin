<template>
  <div class="questionsDetail">
    <div class="detail">
      <div class="top" >
        <div class='backList' @click="backList">返回</div>
        <div class="right" v-if="question.checkStatus.value==='checking'">
          <div class="refuse" @click="refuse">驳回</div>
          <div class="agree" @click="passCheck">同意</div>
        </div>
        <div class="right" v-if="question.checkStatus.value==='failed'">
          <div class="agree" style="color:red">审核失败</div>
        </div>
        <div class="right" v-if="question.checkStatus.value==='success'">
          <div class="agree" style="color: rgb(19, 206, 102)">审核通过</div>
        </div>
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
    <div class="answer" v-if="answers.length>0">

      <div class="top backList">
        回答
      </div>
      <div class="items">
        <div class="item" v-for="(answer,index) in answers" :key="index">
          <!--<div class="item">-->
          <div class="left">
            <img :src="answer.userAvatar" alt="">
          </div>
          <div class="rgiht">
            <div class="topInfo">
              <div class="left">
                <span class="name">{{answer.userName}}</span>
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
            <div class="answerBox" v-if="answer.replies.length>0">
              <div class="answerItem" v-for="(reply,idx) in answer.replies" :key="idx">
                <div class="left">
                  {{reply.userName}}<span class="gray">回复</span> <span class="blue">{{reply.targetUserName}}  </span>
                  <span class="contentWord">{{reply.content}}</span>
                </div>
                <div class="delReplyTag"><span @click="delReplyTag(reply)">删除</span></div>

              </div>
            </div>
            <div class="del"><span @click="delTag(answer)">删除</span></div>
          </div>
        </div>
      </div>
      <div class="paginationBox">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="answerParams.page+1"
          :page-sizes="[10,20,30, 50]"
          :page-size="answerParams.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="answerTotal"
        ></el-pagination>
      </div>
    </div>

  </div>
</template>

<script>

  import {
    qaAnswers,
    qaAwesome,
    questionCheck,
    qaAnswerDel,
    qaAnswerReplyDel,
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
        question: {
          checkStatus:{
            value:'',
          }
        },
        delParams:{
          targetId:0,
          token: getToken(),
        },
        delReplyParams:{
          targetId:0,
          token: getToken(),
        },
        userVip: {},
        user: {},
        followed: false,
        checkParams:{
          changeTo:"",
          reason:"",
          targetId:"",
          token: getToken()
        },
        answerParams: {
          "limit": 10,
          "page": 0,
          "questionId": 0,
          "token": getToken()
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
        console.log(this.question);
        this.answerParams.questionId = this.question.id;
        this.checkParams.targetId = this.question.id;
        this.answerParams.page = 0;
        this.userDetail(this.question.userId);
        this.vipUser(this.question.userId);
        this.friendFollowed(this.question.userId);
        this.qaAnswers();
      },
      backList() {
        this.$emit("back")
      },
      //拒绝审核
      refuse() {
        this.$prompt('请输入拒绝理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\s|\S]{1,}$/,
          inputErrorMessage: '理由不能为空'
        }).then(({value}) => {
          this.checkParams.changeTo = "failed"
          this.checkParams.reason = value;
          questionCheck(this.checkParams).then(json => {
            if (json.status === 200) {
              this.$message({
                type: 'warning',
                message: '审核不通过！'
              });
              this.question.checkStatus.value = json.data.checkStatus.value
              this.$forceUpdate()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });
        });
      },
      //通过审核
      passCheck() {
        this.checkParams.changeTo = "success"
        questionCheck(this.checkParams).then(json => {
          if (json.status === 200) {
            this.$message.success('审核通过！')
            this.question.checkStatus.value = json.data.checkStatus.value
            this.$forceUpdate()

          } else
            this.$message({message: json.message})
        })
      },
      follow(bool) {
        friendFollow({
          "cancel": !bool,
          "targetId": this.question.userId,
          "token": getToken()
        }).then(json => {
          this.followed = !this.followed;
        });
      },
      dianzan() {

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
            this.$message({
              message: json.message,
              type: "error"
            });
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
      handleSizeChange(val) {
        this.answerParams.limit = val;
        this.qaAnswers()
      },
      handleCurrentChange(val) {
        this.answerParams.page = val - 1
        this.qaAnswers()
      },
      //删除答案
      delTag(data) {
        this.delParams.targetId = data.id;
        this.$confirm("此操作将删除该回答, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            qaAnswerDel(this.delParams).then(res => {
              // console.log(res,"res");
              if (res.status === 200) {
                this.$message.success("删除成功！");
                this.qaAnswers()
              } else {
                // this.$message.error(res.message);
              }
            });
          })
          .catch(() => {
            this.delParams.targetId = "";
          });
      },

      //答案回复删除
      delReplyTag(data) {
        this.delReplyParams.targetId = data.id;
        this.$confirm("此操作将删除该回复, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            qaAnswerReplyDel(this.delReplyParams).then(res => {
              if (res.status === 200) {
                this.$message.success("删除成功！");
                this.qaAnswers()
              } else {
                // this.$message.error(res.message);
              }
            });
          })
          .catch(() => {
            this.delReplyParams.targetId = "";
          });
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

  .questionsDetail .subject .el-tabs__active-bar {
    background: none;
  }
</style>
<style lang="scss" scoped>
  .questionsDetail {
    background: #f5f6fa;
    .detail {
      background: #ffffff;
      display: flex;
      flex-direction: column;
      .top {
        font-size: 14px;
        display: flex;
        /*align-items: center;*/
        justify-content: space-between;
        border-bottom: 1px solid #f2f2f2;
        .backList{
          height: 60px;
          line-height: 60px;;

          color: #5BC0DF;
          padding-left: 20px;
          cursor: pointer;
        }
        .right{
          width: 120px;
          display: flex;
          .refuse{
            line-height: 60px;;
            color: red;
            margin-right: 30px;
            cursor: pointer;
          }
          .agree{
            line-height: 60px;;
            color: #5BC0DF;
            cursor: pointer;
          }
        }
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
        .item {
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
              margin: 20px 0 50px;
              line-height: 20px;
            }
            .answerBox {
              background: #F9F9F9;
              padding: 20px;
              margin-bottom: 20px;
              /*border: 1px solid red;*/
              font-size: 14px;
              .answerItem {
                color: #333333;
                margin-bottom: 12px;
                display: flex;
                justify-content: space-between;
                .gray {
                  color: #999999;
                  margin: 0 10px;
                }
                .delReplyTag {
                  color: #999999;
                  font-size: 12px;
                  cursor: pointer;
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
            .del{

              text-align: right;
              span{

                font-size: 14px;
                cursor: pointer;
                color: #F65860;
                display: inline-block;
                padding: 0 16px;
              }

            }
          }
        }
      }
      .paginationBox {
        padding-bottom: 20px;
        /*border: 1px solid red;*/
        text-align: center;
      }
    }

  }
</style>
