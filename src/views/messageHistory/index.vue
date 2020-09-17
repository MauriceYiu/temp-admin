<template>
  <div class="messageHistory">
    <div class="content">
      <div class="head">
        聊天记录 (历史消息记录，每次最多返回100条，请选择更精细的时间段查看)&nbsp;&nbsp;&nbsp;
        <el-date-picker
          ref="picker"
          v-model="timeRange"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="timeRangeChange"
          align="right">
        </el-date-picker>
      </div>
      <div style="color: red; text-align: center; padding: 3px;" v-if="size>100">
        当前所选时间段消息总数为{{size}}条，未显示完所有的消息，请选择更精细的时间区别查询
      </div>
      <div class="main">
        <div class="item" v-for="(item,index) in list" :key="index">
          <div class="from" v-if="item.from == listQuery.from">
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
      </div>
    </div>

  </div>
</template>

<script>

  import userInfo from "../user/components/userInfo"; //子组件
  import chatHistory from "../user/components/chatHistory"; //子组件
  import {chatHistoryMessages, serviceBuyDetail} from '@/api/user'
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import ChatMsg from "../user/components/chatMsg";


  export default {
    name: "messageHistory",
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
        size: 0,
        list: [],
        listQuery: {
          endTime: 0,
          from: 0,
          startTime: 0,
          to: 0,
          token: getToken()
        },
        names: {},
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        timeRange: [new Date(), new Date()],
      };
    },
    methods: {
      getList() {
        chatHistoryMessages(this.listQuery).then(json => {
          if (json.status === 200) {
            if (json.fromName) {
              this.names[this.listQuery.from] = json.fromName;
            }

            if (json.toName) {
              this.names[this.listQuery.to] = json.toName;
            }

            this.list = json.data.msgs
            this.size = json.data.size
          }
        })
      },
      timeRangeChange(v) {
        this.listQuery.endTime = parseInt(v[1].getTime() / 1000)
        this.listQuery.startTime = parseInt(v[0].getTime() / 1000)
        this.getList()
      }
    },
    mounted() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      this.timeRange = [start, end];

      let data = {
        csId: this.$route.query.from,
        userId: this.$route.query.to,
      }
      this.listQuery.from = data.csId;
      this.names[data.csId] = '工作人员';
      this.names[data.userId] = '客户';
      this.listQuery.to = data.userId;
      this.listQuery.endTime = parseInt(end.getTime() / 1000)
      this.listQuery.startTime = parseInt(start.getTime() / 1000)
      this.listQuery.token = '1hNozcFYrbj0AQsuH8pjfFL7A6eZDUSCGm0V+yWv51E2jKKuGxI55OJiC07zAlyf'
      this.getList()
    }
  };
</script>
<style lang="scss" scoped>
  .messageHistory {
    background: rgba(245, 246, 250, 0.61);

    .content {
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
        margin: 0 auto;
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

  }
</style>
