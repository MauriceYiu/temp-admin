<template>
  <div class="workDetail">

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
</template>

<script>
  import {
    wccList,
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
    name: "userDetail",
    directives: {
      waves,
    },
    data() {
      return {
        list: [],
        total: 0,
        page: 1,
        listQuery: {
          keyword: "",
          limit: 10,
          orderBy: 0,
          page: 0,
          userId: 0,
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
        wccList(this.listQuery).then(json => {
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
  .workDetail {

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
      /*border-bottom: 1px solid #f2f2f2;*/
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
