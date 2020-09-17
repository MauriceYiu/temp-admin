<template>
  <div class="chatHistory">
    <div class="head">聊天记录</div>
    <div class="main">
      <div class="item" v-for="(item,index) in list" :key="index" v-if="list.length > 0">
        <!--<div class="item">-->
        <div class="from" v-if="item.from == from">
          <h3>{{names[item.from]}} <span
            class="fromTime time">{{item.sendtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span></h3>
          <chat-msg :msg="item"></chat-msg>
        </div>
        <div class="to" v-else>
          <h3><span class="toTime time">{{item.sendtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>{{names[item.from]}}
          </h3>
          <chat-msg :msg="item"></chat-msg>
        </div>
      </div>
      <div v-if="list.length === 0">没有数据</div>
    </div>
  </div>
</template>

<script>
  import { chatHistoryMessages, serviceBuyDetail } from '@/api/user'
  import waves from '@/directive/waves' // 水波纹指令
  import { getToken } from '@/utils/auth'
  import pagination from '@/components/Pagination/index'
  import ChatMsg from './chatMsg'

  export default {
    name: 'chatHistory',
    components: {
      ChatMsg,
      pagination
    },
    directives: {
      waves
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
      }
    },
    props: ['jsonData'],
    watch: {
      jsonData(val) {
        this.names[val.teacherId] = val.teacherName
        this.names[val.userId] = val.userName
        this.listQuery.from = val.teacherId
        this.from = val.teacherId
        this.listQuery.to = val.userId
        this.listQuery.endTime = val.afterSale.createTime
        this.listQuery.startTime = val.afterSale.createTime - 24 * 60 * 60 * 7
        this.getList()
      }
    },
    methods: {
      // initData() {
      //   serviceBuyDetail({
      //     orderId: this.$route.params.id,
      //     token: getToken()
      //   }).then(json => {
      //     if (json.status === 200) {
      //       this.listQuery.from = json.data.teacherId;
      //       this.fromName = json.data.teacherName;
      //       this.toName = json.data.userName;
      //       this.listQuery.to = json.data.userId;
      //       this.listQuery.endTime = json.data.afterSale.createTime
      //       this.listQuery.startTime = json.data.afterSale.createTime - 24 * 60 * 60 * 7
      //       this.getList()
      //       // console.log(this.listQuery.endTime);//打印当前时间戳
      //       // console.log(this.listQuery.startTime);
      //       ;//当前时间戳（毫秒） - 1天毫秒数 = 前一天时间戳
      //     }
      //   })
      // },
      getList() {
        if (this.listQuery.from > 0 && this.listQuery.to > 0) {
          chatHistoryMessages(this.listQuery).then(json => {
            if (json.status === 200) {
              this.list = json.data.msgs
              console.log(json.data.msgs, 'json.data.msgs')
            }
          })
        }
      }

    },
    mounted() {
      // this.initData();
    }
  }
</script>

<style lang="scss" scoped>
  .chatHistory {

    .head {
      height: 60px;
      display: flex;
      color: #5BC0DF;
      align-items: center;
      padding-left: 26px;
      border-bottom: 1px solid #f2f2f2;
      font-size: 14px;
    }

    .main {
      height: calc(100vh - 220px);
      overflow: scroll;
      padding: 26px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;

      .item {
        /*border: 1px solid red;*/
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

        .time {
          color: #cccccc;
          font-weight: normal;
        }

        .fromTime {
          margin-left: 10px;
        }

        .toTime {
          margin-right: 10px;
        }
      }
    }

    .main::-webkit-scrollbar {
      border: none;
    }
  }
</style>
