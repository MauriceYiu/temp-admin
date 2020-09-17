<template>
  <div class="dynamic">

    <div class="subject">
      <div class="subjectLeft">
        <div class="top">
          <div class="left">
          <el-tabs v-model="activeSubName" @tab-click="handleClick">
            <el-tab-pane label="推荐" name="recommend">
            </el-tab-pane>
            <el-tab-pane label="热门" name="hot">
            </el-tab-pane>
          </el-tabs>
          </div>
          <div class="right">
            <el-input @keyup.enter.native="getList" style="width: 300px;margin-left: 20px" class="filter-item"
                      placeholder="搜索你想要的内容"
                      v-model="listQuery.keyword">
            </el-input>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
              搜索
            </el-button>

          </div>
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
                <div class="dianzan">
                  <img src="../../../assets/dianzan.png" alt="" v-if="!item.liked" @click="dynamicAwesome(item,true)">
                  <img src="../../../assets/dianzanActive.png" alt="" v-else @click="dynamicAwesome(item,false)">
                </div>
                <span :class="{blue:item.liked}">{{item.awesome}}</span>
                <!--<div class="share"><i class=" el-icon-position"></i>分享</div>-->
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
          我的动态
        </div>

        <!--我的动态列表-->
        <div class="list">
          <div class="item" v-for="(item,index) in list2" :key="index">
            <div class="time">
              {{item.createTime | formatTime('{y}-{m}-{d} {h}:{i}')}}
            </div>
            <div class="bottom">
              <div class="left"><img src="../../../assets/4.png" alt=""></div>
              <div class="right">
                <div class="line1">{{item.userName}} <span>{{item.createTime | formatTime('{y}-{m}-{d} {h}:{i}')}}</span> <span>{{item.type.text}}</span>
                </div>
                <div class="content">“{{item.answer}}”</div>
              </div>
            </div>
          </div>
        </div>


        <div class="paginationBox" v-if="list2.length>0">
          <el-pagination
            small
            layout="prev, pager, next"
            :total="total2">
          </el-pagination>
        </div>


      </div>


    </div>


  </div>
</template>

<script>

  import {
    dynamicList,
    dynamicDel,
    dynamicCheck,
    dynamicAwesome,
    qaDynamics,
  } from "../../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import {formatTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import attachment from "@/components/attachment"


  export default {
    name: "dynamic",
    directives: {
      waves,
    },
    components: {
      attachment,
    },
    data() {
      return {
        activeSubName: 'recommend',
        zanNum: 1,
        listQuery: {
          enable:-1,
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
        checkParams: {
          changeTo: "",
          reason: "",
          targetId: 0,
          token: getToken(),
        },
        total: 0,
        total2: 0,
        page: 1,
        list: [],
        list2: [],
        listLoading: false,
        loading: false,
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeSubName);
        // sessionStorage.setItem('activeSubName', this.activeSubName)
        switch (this.activeSubName) {
          case "recommend":
            this.listQuery.orderBy = 0;
            break;
          case "hot":
            this.listQuery.orderBy = 1;
            break;
        }
        this.getList();
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
        this.checkParams.targetId = this.formParams.activityId
        this.checkParams.changeTo = "success"
        dynamicCheck(this.checkParams).then(json => {
          if (json.status === 200) {
            this.$message.success('审核通过！')
            this.$router.push({name: "offLineCheck"})
          } else
            this.$message({message: json.message})
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
      dynamicAwesome(item, bool) {
        dynamicAwesome({
          "cancel": !bool,
          "targetId": item.id,
          "token": getToken()
        }).then(json => {
          if (json.status === 200) {
            item.liked = !item.liked;
            item.awesome = json.data;
          }
        })
      },
      getList() {
        this.listLoading = true;
        dynamicList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list = []
            this.list = json.data;
            this.total = json.total
          }

        })
      },
      getMyList() {
        this.listLoading = true;
        qaDynamics(this.listQuery2).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list2 = []
            this.list2 = json.data;
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

      //删除分类
      delTag(data) {
        this.dynamicDelParams.targetId = data.id;
        this.$confirm("此操作将删除该条动态, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            dynamicDel(this.dynamicDelParams).then(res => {
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
            this.dynamicDelParams.targetId = "";
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
    },
    mounted() {
      // this.getList();
    }
  };
</script>
<style>

  .dynamic .subject .el-tabs__active-bar {
    background: none;
  }
  .dynamic .el-tabs__nav-scroll .el-tabs__nav{
    margin-left: 0;
  }
</style>
<style lang="scss" scoped>
  .dynamic {
    /*padding: 15px;*/

    .subject {
      /*border: 1px solid red;*/
      padding: 20px;
      display: flex;
      background: #f5f6fa;
      min-height: 100vh;
      .subjectLeft {
        flex-grow: 1;
        background: #ffffff;
        /*padding-top: 20px;*/
        margin-right: 20px;
        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          padding: 0 20px;
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
              margin-right: 100px;
              cursor: pointer;
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
                line-height: 24px;
                display: table-cell;
                vertical-align: bottom;
              }
              .blue{
                color: deepskyblue;
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
        width: 440px;
        background: #ffffff;
        .top {
          display: flex;
          align-items: center;
          height: 60px;
          padding-left: 20px;
          border-bottom: 1px solid #f2f2f2;
          font-size: 16px;
        }
        .list {

          display: flex;
          flex-direction: column;
          .item {
            width: 100%;
            box-sizing: border-box;
            padding: 20px;
            display: flex;
            flex-direction: column;
            font-size: 14px;
            border-bottom: 1px solid #f2f2f2;
            .time {
              /*border: 1px solid red;*/
              color: #101010;

            }
            .bottom {
              margin-top: 18px;
              width: 100%;
              box-sizing: border-box;
              display: flex;
              .left {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                /*border: 1px solid red;*/
                margin-right: 20px;
                img {
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                }
              }
              .right {
                width: 60%;
                flex-grow: 1;
                /*border: 1px solid red;*/
                .line1 {
                  color: #999999;
                  margin-bottom: 10px;
                }
                .content {
                  color: #333333;
                  width: 90%;
                  display: inline-block;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  font-weight: bold;
                }
              }
            }
          }
        }
        /*border: 1px solid red;*/
      }
    }
    .paginationBox{
      margin:10px auto;
      text-align: center;
    }

    .red {
      color: red;
    }

  }
</style>
