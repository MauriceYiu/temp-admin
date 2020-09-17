<template>
  <div class="myPublish">
    <!--我的发发布列表-->
    <div class="list">
      <div class="item" v-for="(item,index) in list" :key="index">
        <div class="time">
          {{item.createTime | formatTime('{y}-{m}-{d}')}}
        </div>
        <div class="bottom">
          <div class="imgWrap" v-if="item.attachments.length>0">
            <img :src="item.attachments[0].url" alt="">
          </div>
          <div class="right">
            <div class="content" v-text="item.content"></div>
            <div class="line1">
              <div class="left">
                <div class="dianzan">
                  <img src="../../../assets/dianzan.png" alt="">
                  <span>{{item.awesome}}</span>
                </div>
                <div class="share" @click="openComment(item)"><i class=" el-icon-s-comment"></i>{{item.replies.length}}
                </div>
              </div>
              <div class="time">{{item.createTime | formatTime('{h}:{i}')}}</div>
            </div>

          </div>
        </div>
      </div>
    </div>


    <div class="paginationBox">
      <el-pagination
        :current-page="page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </div>

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
  import {formatTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import attachment from "@/components/attachment"


  export default {
    name: "myPublish",
    directives: {
      waves,
    },
    components: {
      attachment,
    },
    data() {
      return {
        listQuery: {
          keyword: "",
          limit: 10,
          orderBy: 0,
          page: 0,
          userId: + localStorage.getItem("uid"),
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
        page: 1,
        list: [],
        replies: [],
        listLoading: false,
        loading: false,
      };
    },
    methods: {
      confirmReply(item) {
        wccReply(this.replyParams).then(json => {
          if (json.status === 200) {
            this.replies = json.data
            this.replyParams.content = ""
          }else {

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

    }
  };
</script>

<style lang="scss" scoped>
  .myPublish {
    width: 100%;
    margin-top: 20px;
    .list {
      display: flex;
      flex-direction: column;
      .item {
        /*width: 100%;*/
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
          .imgWrap{
            width: 116px;
            height: 80px;
            margin-right: 20px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .right {
            width: 60%;
            height: 80px;
            flex-grow: 1;
            display: flex;
            justify-content: space-between;
            /*border: 1px solid red;*/
            flex-direction: column;
            .content {
              color: #333333;
              width: 100%;
              line-height: 21px;
              /*margin-bottom: 24px;*/
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .line1 {
              color: #666666;
              display: flex;
              justify-content: space-between;
              .left{
                display: flex;
                width: 50% ;
                .dianzan{
                  margin-right: 20px;
                  img{
                    width: 14px;
                    height: 14px;
                  }
                }
                .share{
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  i {
                    color: #999999;
                    margin-right: 5px;
                  }
                }

              }
              .time{
                color: #999999;
              }

            }
          }
        }
      }
    }
    .paginationBox{
      margin:10px auto;
      text-align: center;
    }
    /*border: 1px solid red;*/
  }
</style>
