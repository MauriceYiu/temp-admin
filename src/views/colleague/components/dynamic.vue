<template>
  <div class="dynamic">

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
              <img src="../../../assets/dianzan.png" alt="">
              <!--<img src="../../../assets/dianzanActive.png" alt="" v-else @click="dynamicAwesome(item,false)">-->
            </div>
            <span>{{item.awesome}}</span>
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
</template>

<script>
  import {
    dynamicList,
  } from "../../../api/content";
  import {
    userDetail,
    userStatistics,
  } from "../../../api/user";
  import {serviceBuys,} from "../../../api/financeData";
  import {vipAll} from "../../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import {getToken} from "@/utils/auth";
  import attachment from "@/components/attachment"

  export default {
    name: "dynamic",
    directives: {
      waves,
    },
    data() {
      return {
        list: [],
        total: 0,
        page: 1,
        listQuery: {
          limit: 10,
          userId: 0,
          page: 0,
          token: getToken(),
        },

      };
    },
    props:['userId'],
    components: {
      attachment,
    },
    watch: {
      userId(val) {
        this.listQuery.userId = val
        this.getList()
      }
    },
    methods: {
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
      getList() {
        // this.listQuery.userId = id
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

    },
    mounted() {
    }
  };
</script>
<style>

</style>
<style lang="scss" scoped>
  .dynamic {

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
    .red {
      color: red;
    }
    .paginationBox {
      margin: 10px auto;
      text-align: center;
    }
  }

</style>
