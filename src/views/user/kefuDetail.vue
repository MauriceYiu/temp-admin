<template>
  <div class="kefuDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>

    </div>
    <div class="content">
      <div class="head">聊天记录</div>
      <div class="main">
        <div class="item" v-for="(item,index) in list" :key="index">
          <div class="from" v-if="item.from == from">
            <h3>{{names[item.from]}} <span class="fromTime time">{{item.sendtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span></h3>
            <chat-msg :msg="item"></chat-msg>
          </div>
          <div class="to" v-else>
            <h3><span class="toTime time">{{item.sendtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>{{names[item.from]}} </h3>
            <chat-msg :msg="item"></chat-msg>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>

  import userInfo from "./components/userInfo"; //子组件
  import chatHistory from "./components/chatHistory"; //子组件
  import {chatHistoryMessages, serviceBuyDetail} from '@/api/user'
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import ChatMsg from "./components/chatMsg";


  export default {
    name: "kefuDetail",
    directives: {
      waves,
    },
    components: {
      ChatMsg,
      pagination,
      userInfo,
      chatHistory
    },
    data() {
      return {
        list: [],
        from: 0,
        listQuery: {
          endTime: 0,
          from: 0,
          startTime: 0,
          to: 0,
          token: getToken()
        },
        names: {}
      };
    },
    methods: {
      getList() {
        chatHistoryMessages(this.listQuery).then(json => {
          if (json.status === 200) {
            this.list = json.data.msgs
            console.log(json.data.msgs, "json.data.msgs");
          }
        })
      },
      back() {
        this.$router.go(-1);//返回上一层
      },


    },
    mounted() {
      let data = JSON.parse(this.$route.query.data);
      this.listQuery.from = data.csId;
      this.from = data.csId;
      this.names[data.csId] = data.csName;
      this.names[data.userId] = data.userName;
      this.listQuery.to = data.userId;
      this.listQuery.endTime = data.createTime
      this.listQuery.startTime = data.createTime - 24 * 60 * 60 * 7
      this.getList()
    }
  };
</script>
<style lang="scss" scoped>
  .kefuDetail {
    background: rgba(245, 246, 250, 0.61);
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
        font-weight: bold;
      }
      .right {
        display: flex;
        .btn {
          color: #F65860;
          cursor: pointer;
        }
        .reject {
          color: #5BC0DF;
        }
        .pass {
          margin-left: 30px;
        }
        .green {
          color: green;
        }
        .red {
          color: red;
        }
      }

    }
    .content {
      min-height: calc(100vh - 140px);
      margin: 20px;
      display: flex;
      flex-direction: column;
      background: white;
      .head {
        height: 60px;
        display: flex;
        color: #5BC0DF;
        align-items: center;
        padding-left: 26px;
        border-bottom: 1px solid #f2f2f2;
        font-size: 14px;
        width: 100%;
      }
      .main {
        width: 70%;
        height: calc(100vh - 220px);
        overflow: scroll;
        padding: 26px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .item {
          /*display: flex;*/
          flex-direction: column;
          font-size: 14px;
          margin-bottom: 20px;
          /*border: 1px solid red;*/
          h3 {
            color: #5BC0DF;
            font-size: 14px;
            margin: 0 0 6px;
          }
          .msg {
            color: #666666;
          }

          .from {
            h3 {
              color: #F65860;
            }
          }
          .to {
            text-align: right;
            h3 {
              color: #5BC0DF;
            }
          }
          .time{
            color: #cccccc;
            font-weight: normal;
          }
          .fromTime{
            margin-left: 10px;
          }
          .toTime{
            margin-right: 10px;
          }
        }
      }
      .main::-webkit-scrollbar {
        border: none;
      }
    }

  }
</style>
