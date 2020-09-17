<template>
  <div class="inviteUser">

    <div class="list">
      <div class="item" v-for="(item,index) in list" :key="index" style="padding:0 20px;margin-bottom: 20px">
        <div class="imgWrap">
          <img :src="item.extra.trueAvatar?item.extra.trueAvatar:defaultImg" alt="">
        </div>
        <div class="info">
          <span class="trueName">{{item.extra.trueName}}</span> <span class="mobile">{{item.mobile}}</span>
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
    list,
  } from "../../../api/user";

  import {serviceBuys,} from "../../../api/financeData";
  import {vipAll} from "../../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import {getToken} from "@/utils/auth";
  import attachment from "@/components/attachment"

  export default {
    name: "inviteUser",
    directives: {
      waves,
    },
    data() {
      return {
        list: [],
        total: 0,
        page: 1,
        defaultImg:require('../../../assets/yiLogo.png'),
        listQuery: {
          app: "app",
          limit: 10,
          page: 0,
          inviteUserId: 0,
          token: getToken(),
        },

      };
    },
    props: ['userId'],
    components: {
      attachment,
    },
    watch: {
      userId(val) {
        this.listQuery.inviteUserId = val
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
      getList(id) {
        this.listLoading = true;
        list(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
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
  .inviteUser {

    .item {
      height: 30px;
      display: flex;
      font-size: 14px;
      /*border: 1px solid red;*/
      .imgWrap {
        margin-right: 14px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .info {
        display: flex;
        align-items: center;
        /*border: 1px solid red;*/
        .trueName {
          margin-right: 40px;
        }
        .mobile{
          color: #cccccc;
        }
      }

    }

    .paginationBox {
      margin: 10px auto;
      text-align: center;
    }
  }

</style>
