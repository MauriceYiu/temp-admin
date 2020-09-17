<template>
  <div class="questions">

    <div class="subject">
      <div class="subjectLeft" v-if="!showDetail">
        <div class="top">
          <el-tabs v-model="activeSubName" @tab-click="handleClick">
            <el-tab-pane label="待审核" name="checkPending">
            </el-tab-pane>
            <el-tab-pane label="已发布" name="publish">
            </el-tab-pane>
          </el-tabs>
          <div class="right">
            <el-input @keyup.enter.native="getList" style="width: 300px;margin-left: 20px" class="filter-item"
                      placeholder="搜索你想要的内容"
                      v-model="listQuery.keyword">
            </el-input>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList"  v-if="hasPerm('content:found:question:search')">
              搜索
            </el-button>

          </div>
        </div>
        <div class="list">
          <div class="item" v-for="(item,index) in list" :key="index">
            <div class="title">
              <div class="titleWord">
                <div class="left">{{item.title}}</div>
                <div class="right" v-if="item.checkStatus.value ==='checking'">待审</div>
              </div>
              <div class="content" v-text="item.content"></div>
              <div class="attachments" v-if="item.attachments">
                <attachment v-for="(attachment,index) in item.attachments" :key="index"
                            :attachment="attachment"></attachment>
              </div>
            </div>
            <div class="bottom">
              <div class="left">
                <div class="action">
                  <div class="reply"><i class="el-icon-s-comment"></i>{{item.answerCount}}</div>
                  <div class="collect"><img style="" src="../../../assets/heart.png" alt="">{{item.visit}}</div>
                </div>
                <div class="description">
                  <div class="piece"><span>{{item.userName}}</span></div>
                  <div class="piece time"><span>{{item.createTime | formatTime('{y}-{m}-{d} {h}:{i}')}}</span></div>
                </div>
              </div>
              <div class="right">
                <el-button type="text" class="delBtn" size="mini" @click="delTag(item)" style="color: #DADADA" v-if="hasPerm('content:found:question:delete')">删除
                </el-button>
                <el-button type="text" class="delBtn viewDetail" size="mini" @click="goDetail(item)"
                           style="color: #DADADA" v-if="hasPerm('content:found:question:check')">查看
                </el-button>
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

      <!--问题详情-->
      <div class="qaDetail subjectLeft" v-show="showDetail">
        <question-detail @back="showDetail = false" ref="qDetail"></question-detail>
      </div>

    </div>


  </div>
</template>

<script>

  import {
    questions,
    qaAnswers,
    questionDel,
    qaDynamics,
    questionDetail,
  } from "../../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import {formatTime, showDecimal} from "@/utils";
  import {getToken} from "@/utils/auth";
  import QuestionDetail from "./questionsDetail"
  import attachment from "@/components/attachment"

  export default {
    name: "questions",
    directives: {
      waves,
    },
    data() {
      return {
        activeSubName: 'publish',
        userId: 0,
        zanNum: 1,
        answerCount: 0,
        awesome: 0,
        createTime: 0,
        delParams: {
          targetId: "",
          token: getToken(),
        },
        listQuery: {
          checkStatus: 'success',
          keyword: "",
          limit: 10,
          orderBy: 0,
          page: 0,
          token: getToken(),
        },
        listQuery2: {
          limit: 10,
          page: 0,
          token: getToken(),
        },

        total: 0,
        total2: 0,
        page: 1,
        list: [],
        attachments: [],
        listMy: [],
        listLoading: false,
        showDetail: false,
        loading: false,
        title: "",
        content: "志气这东西是能传染的，你能感染着笼罩在你的环境中的精神你能感染着笼罩在你的环境中的精神你能感染着笼罩在你的环境中的精神你能感染着笼罩在你的环境中的精神你能感染着笼罩在你的环境中的精神你能感染着笼罩在你的环境中的精神。那些在你周围不断向上奋发的人的胜利，会鼓励激发你作更艰苦的奋斗，以求达到如象他们所做的样子。",
      };
    },
    components: {
      QuestionDetail,
      attachment,
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeSubName);
        this.page = 1;
        this.total = 0;
        this.listQuery.page = 0;
        switch (this.activeSubName) {
          case "publish":
            this.listQuery.checkStatus = 'success';
            break;
          case "checkPending":
            this.listQuery.checkStatus = 'checking';
            break;
        }
        this.getList();
      },
      dianzan() {

      },
      goDetail(item) {
        this.showDetail = true;
        this.$refs.qDetail.show(item)
      },
      backList(id) {
        this.showDetail = false
      },

      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val - 1
        this.page = this.listQuery.page + 1
        this.getList()
      },
      goDetails(id) {
        this.$router.push({
          name: 'dynamicDetail', params: {
            id: id
          }
        })
      },
      //一级分类列表
      getList() {
        this.listLoading = true;
        questions(this.listQuery).then(json => {
          this.listLoading = false;
          this.list = []
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          } else {

          }
        })
      },
      getMyList() {
        this.listLoading = true;
        qaDynamics(this.listQuery2).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.listMy = []
            this.listMy = json.data;
            this.total2 = json.total
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        })
      },
      tagTypeChange(value) {
        this.formParams.type = value;
        this.secondParams.type = value;
        this.getList();
      },
      initData() {
        globalRuleGet().then(response => {
          const json = response.data;
          if (json.status) {
            this.rules = json.data.rule;
            this.fields = json.data.params;
          } else {

          }
        });
      },
      viewTag() {

      },
      //删除
      delTag(data) {
        this.delParams.targetId = data.id;
        this.$confirm("此操作将删除该条提问, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            questionDel(this.delParams).then(res => {
              // console.log(res,"res");
              if (res.status) {
                this.$message.success("删除成功！");
                this.getList();
              } else {
                this.$message.error(res.message);
              }
            });
          })
          .catch(() => {
            this.delParams.targetId = "";
          });
      },

      //添加二级分类
      addSecondTag(data) {
        this.formParams.parentId = data.id;
        this.dialogTableVisible = true;
      },
      addTag(data) {
        this.$router.push({
          name: "dynamicDetail", params: {
            id: data
          }
        })
      },
      tagSubmitForm() {
        if (!this.formParams.name) {
          this.$message({
            message: "请输入分类名称",
            type: "error"
          });
          return false;
        }

        // if (!this.formParams.detail) {
        //   this.$message({
        //     message: "请输入分类说明",
        //     type: "error"
        //   });
        //   return false;
        // }
        //
        // if (!this.formParams.logo) {
        //   this.$message({
        //     message: "请上传分类logo",
        //     type: "error"
        //   });
        //   return false;
        // }

        if (!this.formParams.queue) {
          this.$message({
            message: "请输入排序",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        liveEdit(this.formParams).then(json => {
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });
            this.dialogTableVisible = false;
            this.getList();
            this.formParams.name = "";
            this.formParams.detail = "";
            this.formParams.logo = "";
            this.formParams.parentId = "";
            this.formParams.queue = "";
            this.formParams.typeId = "";
          } else {
            this.$message({
              message: json.message,
              type: json.status ? "success" : "error"
            });
          }
          this.loading = false;
        });
      },
      submitForm() {
        this.loading = true;
        globalRuleEdit(this.rules).then(response => {
          const json = response.data;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });
          } else {

          }
          this.loading = false;
        });
      },
      handleDrag() {
        // this.$refs.select.blur()
      },

    },
    mounted() {
      // this.getList();
    }
  };
</script>
<style>

  .questions .subject .el-tabs__active-bar {
    background: none;
  }

  .questions .subject .el-tabs__active-bar {
    background: none;
  }

  .questions .subject .el-tabs__nav-scroll .el-tabs__nav {
    margin-left: 0;
  }
</style>
<style lang="scss" scoped>
  .questions {
    /*padding: 15px;*/

    .subject {
      display: flex;
      background: #f5f6fa;
      min-height: 100vh;
      .subjectLeft {
        margin: 20px;
        background: white;
        min-height: calc(100vh - 140px);
        position: relative;
        flex-grow: 1;
        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          padding: 0 20px;
          border-bottom: 1px solid #f2f2f2;
          .right {
            /*margin-right: 30px;*/
          }
          /*border: 1px solid red;*/
        }
        .item {
          font-size: 14px;
          border-bottom: 1px solid #f2f2f2;
          padding: 20px;
          /*width: 90%;*/
          .title {
            color: #101010;
            display: flex;
            flex-direction: column;
            line-height: 20px;
            .titleWord {
              display: flex;
              justify-content: space-between;
              .left {
                color: #101010;
                font-weight: 600;
              }
              .right {
                color: #F65860;
              }
            }
            .content {
              margin-top: 6px;
              color: #666666;
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
            color: #999999;
            .left {
              display: flex;
              .action {
                display: flex;
                margin-right: 70px;
                .reply {
                  display: flex;
                  align-items: center;
                  margin-right: 28px;
                  /*cursor: pointer;*/
                  i {
                    font-size: 19px;
                    margin-right: 5px;
                    color: #999999;
                  }
                }
                .collect {
                  /*cursor: pointer;*/
                  display: flex;
                  align-items: center;
                  img {
                    width: 18px;
                    margin-right: 5px
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
            .right {
              .delBtn {
                border: 1px solid #DCDFE6;
                width: 60px;
                border-radius: 30px;
              }
              .viewDetail {
                background: #1e98ea;
                color: white !important;
                border: none;
              }
            }

          }

        }
        .item:last-child {
          border-bottom: 1px solid #f2f2f2;
        }
      }
      .qaDetail {
        background: #f5f6fa;
        .detail {
          background: #ffffff;
          display: flex;
          flex-direction: column;
          .backList {
            border-bottom: 1px solid #f2f2f2;
            color: #5BC0DF;
            cursor: pointer;
            padding-left: 20px;
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
      }

    }
    .list {
      min-height: calc(100vh - 260px);

    }
    .paginationBox {
      margin: 10px auto;
      text-align: center;
    }
    .red {
      color: red;
    }

  }
</style>
