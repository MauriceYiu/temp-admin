<template>
  <div class="workDynamic">
    <!--我的动态列表-->
    <div class="list">
      <div class="item" v-for="(item,index) in list" :key="index">
        <div class="time">
          {{item.createTime | formatTime('{y}-{m}-{d}')}}
        </div>
        <div class="bottom">
          <div class="left"><img :src="item.userAvatar" alt=""></div>
          <div class="right">
            <div class="line1">{{item.userName}} <span>回复了你的回答</span> <span style="margin-left: 14px">{{item.createTime | formatTime('{h}:{i}')}}</span>
            </div>
            <div class="content" v-text="item.content"></div>
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
    wccDynamics,
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
    name: "workDynamic",
    directives: {
      waves,
    },
    components: {
      attachment,
    },
    data() {
      return {
        listQuery: {
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
        console.log(11);
        this.listLoading = true;
        wccDynamics(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            console.log(22);
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
<style>

</style>
<style lang="scss" scoped>
  .workDynamic {
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
