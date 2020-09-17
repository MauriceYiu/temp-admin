<template>
  <div class="workChild">

    <div class="subject">
      <div class="subjectLeft">
        <div class="top">
          <el-tabs v-model="activeSubName" @tab-click="handleClick">
            <el-tab-pane label="全部" name="all">
            </el-tab-pane>
            <el-tab-pane label="热门" name="hot">
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="list">
          <div class="item" v-for="(item,index) in list" :key="index">
            <div class="title">
              <div class="content" v-text="item.content"></div>
              <div class="attachments" v-if="item.attachments">
                <attachment v-for="(attachment,index) in item.attachments" :key="index"
                            :attachment="attachment"></attachment>
              </div>
            </div>
            <div class="bottom">
              <div class="action">
                <div class="right">
                  <div class="dianzan">
                    <img src="../../../assets/dianzan.png" alt="" v-if="!item.liked" @click="wccAwesome(item,true)">
                    <img src="../../../assets/dianzanActive.png" alt="" v-else @click="wccAwesome(item,false)">
                  </div>

                  <span>{{item.awesome}}</span>
                </div>

                <div class="share" @click="openComment(item)"><i class=" el-icon-s-comment"></i>{{item.replies.length}}
                </div>
              </div>
              <div class="description">
                <div class="piece"><span>{{item.userName}}</span></div>
                <div class="piece time"><span>{{item.createTime | formatTime('{y}-{m}-{d} {h}:{i}')}}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div class="paginationBox">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10,20,30, 50]"
            :page-size="listQuery.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>


      </div>

      <div class="subjectRight">

        <div class="top">
          <el-tabs v-model="activeRightName" @tab-click="handleClickRight">
            <el-tab-pane label="工作圈动态" name="workDynamic">
              <workDynamic ref="workDynamic"></workDynamic>
            </el-tab-pane>
            <el-tab-pane label="我的发布" name="myPublish">
              <myPublish ref="myPublish"></myPublish>
            </el-tab-pane>
          </el-tabs>
          <div class="rightEdit" @click="goAdd(0)" v-if="hasPerm('discovery:workCircle:add')">
            <img src="../../../assets/edit.png" alt="">
          </div>
        </div>
        <!--<workDynamic ref="workDynamic" v-show="activeRightName =='workDynamic'"></workDynamic>-->
        <!--<myPublish ref="myPublish" v-show="activeRightName =='myPublish'"></myPublish>-->

      </div>


    </div>

    <el-dialog :visible.sync="dialogFormVisible">
      <div class="dialogbox">
        <div class="list">
          <p v-for="(reply,index) in replies" @click="replyOne(reply)">
            <span>{{reply.userName}}</span> 评论说：{{reply.content}}
          </p>
        </div>
        <div class="bottombox">
          <div class="bottom">
            <input v-model="replyParams.content" :placeholder="placeholder"></input>
          </div>
          <el-button type="primary" class="confirmBtn" @click="confirmReply()">确 定</el-button>
        </div>

        <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>-->
        <!--</div>-->
      </div>

    </el-dialog>

  </div>
</template>

<script>

  import {
    wccList,
    dynamicDel,
    wccAwesome,
    dynamicCheck,
    wccReply,
  } from "../../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import workDynamic from "./workDynamic";  //右边子组件
  import myPublish from "./myPublish";  //右边子组件
  import {formatTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import attachment from "@/components/attachment"


  export default {
    name: "workChild",
    directives: {
      waves,
    },
    components: {
      attachment,
      workDynamic,
      myPublish,
    },
    data() {
      return {
        activeSubName: 'all',
        activeRightName: 'workDynamic',
        placeholder: '评论',
        zanNum: 1,
        listQuery: {
          keyword: "",
          limit: 10,
          orderBy: 0,
          page: 0,
          userId: 0,
          token: getToken(),
        },
        listQuery2: {
          keyword: "",
          limit: 10,
          orderBy: 0,
          page: 0,
          userId: 0,
          token: getToken(),
        },
        checkParams: {
          changeTo: "",
          reason: "",
          targetId: 0,
          token: getToken(),
        },
        replyParams: {
          circleId: 0,
          content: "",
          targetUserId: 0,
          token: getToken(),
        },
        total: 0,
        total2: 0,
        page: 1,
        list: [],
        list2: [],
        replies: [],
        listLoading: false,
        loading: false,
        dialogFormVisible: false,
      };
    },
    methods: {
      openComment(item) {
        console.log(item);
        this.replies = item.replies;
        this.dialogFormVisible = true
        this.replyParams.circleId = item.id
        this.replyParams.targetUserId = item.targetUserId;
        this.placeholder = "评论"
      },
      replyOne(item) {
        console.log(item, "replyOne");
        this.replyParams.targetUserId = item.userId
        this.placeholder = "回复" + item.userName
      },
      confirmReply(item) {
        wccReply(this.replyParams).then(json => {
          if (json.status === 200) {
            this.replies = json.data
            this.replyParams.content = ""
          } else {

          }
          this.replyParams.content = ""
        })

      },

      wccAwesome(answer, bool) {
        wccAwesome({
          "cancel": !bool,
          "targetId": answer.id,
          "token": getToken()
        }).then(json => {
          if (json.status === 200) {
            answer.liked = !answer.liked;
            answer.awesome = json.data.length;
          }
        })
      },
      handleClick(tab, event) {
        this.page = 1;
        this.total = 0;
        this.listQuery.page = 0;
        console.log(this.activeSubName);
        switch (this.activeSubName) {
          case "all":
            this.listQuery.orderBy = 0;
            break;
          case "hot":
            this.listQuery.orderBy = 1;
            break;
        }
        this.getList();
      },
      handleClickRight(tab, event) {
        console.log(this.activeRightName);
        switch (this.activeRightName) {
          case "workDynamic":
            this.$refs.workDynamic.getList();
            break;
          case "myPublish":
            this.$refs.myPublish.getList();
            break;
        }
      },
      goAdd(data) {
        this.$router.push({
          name: "workDetail", params: {
            id: data
          }
        })
      },
      //拒绝审核
      refuse(id) {
        this.$prompt('请输入拒绝理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\s|\S]{1,}$/,
          inputErrorMessage: '理由不能为空'
        }).then(({value}) => {
          this.checkParams.changeTo = "failed"
          this.checkParams.targetId = id
          this.checkParams.reason = value;
          dynamicCheck(this.checkParams).then(json => {
            if (json.status === 200) {
              this.$message({
                type: 'warning',
                message: '审核不通过！'
              });
              // this.$router.push({name:"offLineCheck"})
            } else
              this.$message({message: json.message})
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
        this.checkParams.targetId = this.formParams.activityId
        this.checkParams.changeTo = "success"
        dynamicCheck(this.checkParams).then(json => {
          if (json.status === 200) {
            this.$message.success('审核通过！')
            this.$router.push({name: "offLineCheck"})
          }

        })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val - 1
        this.page = this.listQuery.page + 1
        // sessionStorage.setItem('settingVip', this.listQuery.page)
        this.getList()
      },
      goDetails(id) {
        this.$router.push({
          name: 'dynamicDetail', params: {
            id: id
          }
        })
      },

      getList() {
        this.listLoading = true;
        wccList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = []
            this.list = json.data;
            this.total = json.total
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        })
      },
    },
    mounted() {
      // this.activeRightName = "workDynamic"
      this.handleClickRight();

    }
  };
</script>
<style lang="scss">
  .workChild .subject .el-tabs__active-bar {
    background: none;
  }
  .workChild .el-tabs__nav-scroll .el-tabs__nav{
    margin-left: 20px;
  }

  .workChild {
    .subjectRight {
      .el-tabs__header {
        padding-top: 10px;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .workChild {
    /*padding: 15px;*/

    .subject {
      /*border: 1px solid red;*/
      padding: 20px;
      display: flex;
      background: #f5f6fa;
      min-height: 100vh;
      .subjectLeft {
        width: 72%;
        flex-grow: 1;
        background: #ffffff;
        /*padding-top: 20px;*/
        margin-right: 20px;
        .top {
          display: flex;
          align-items: center;
          height: 60px;
          /*border: 1px solid red;*/
        }
        .item {
          font-size: 14px;
          border-top: 1px solid #f2f2f2;
          padding: 20px;
          /*width: 90%;*/
          .title {
            color: #101010;
            display: flex;
            flex-direction: column;
            line-height: 20px;
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
            margin-top: 20px;
            color: #999999;
            .action {
              display: flex;
              align-items: center;
              margin-right: 100px;
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
              .share {
                cursor: pointer;
                i {
                  margin-right: 5px;
                }
              }
            }
            .description {
              display: flex;
              .piece {
                margin-right: 28px;
              }
              .time {
                color: #DADADA;
              }
            }

          }

        }
        .item:last-child {
          border-bottom: 1px solid #f2f2f2;
        }
      }
      .subjectRight {
        width: 28%;
        background: #ffffff;
        .top {
          position: relative;
          /*width: 100%;*/
          /*box-sizing: border-box;*/
          /*display: flex;*/
          /*align-items: center;*/
          /*justify-content: space-between;*/
          height: 60px;
          /*!*padding: 0 20px;*!*/
          border-bottom: 1px solid #f2f2f2;
          /*font-size: 16px;*/

          .rightEdit {
            cursor: pointer;
            position: absolute;
            right: 20px;
            top: 19px;
            color: #F65860;
            font-size: 14px;
            img {
              width: 20px;
              height: 20px;
            }
          }
        }

      }
    }

    .red {
      color: red;
    }
    .paginationBox{
      margin:10px auto;
      text-align: center;
    }
    .dialogbox {
      .list {
        p {
          cursor: pointer;
        }
      }
      .bottombox {
        display: flex;
        .bottom {
          border: 1px solid #cccccc;
          padding: 10px 20px;
          width: 90%;
          margin-bottom: 20px;
          input {
            border: none;
            width: 92%;
          }
          input:focus {
            outline: none;
          }
        }
        .confirmBtn {
          height: 40px;
          margin-left: 20px;
        }
      }

    }

  }
</style>
