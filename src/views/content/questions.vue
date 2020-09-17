<template>
  <div class="questions">

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="审核通过" name="first"> </el-tab-pane>
      <el-tab-pane label="待审核" name="second"></el-tab-pane>
      <el-tab-pane label="审核失败" name="third"></el-tab-pane>
    </el-tabs>
    <div class="list">
      <div class="item" v-for="(item,index) in list" :key="index">
        <div class="title">
          <div class="piece"><span class="text">发布者</span><span>{{item.userName}}</span></div>
          <div class="piece"><span class="text">发布时间</span><span>{{item.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span></div>
        </div>
        <div class="main">
          <div class="piece"><span class="text">内容</span></div>
          <div class="content" v-text="item.content"></div>
          <div class="bottom">
            <el-button type="text"  @click="passCheck(item.id)">通过</el-button>
            <el-button  type="text" style="color: red"  @click="refuse(item.id)">拒绝</el-button>
          </div>
          <!--<div class="bottom">-->
          <!--<div class="piece"><span class="text">失败原因：</span></div>-->
          <!--</div>-->
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
    questions,
    questionDel,
    questionCheck,
  } from "../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "questions",
    directives: {
      waves,
    },
    data() {
      return {
        activeName: 'first',
        listQuery: {
          checkStatus: null,
          keyword: "",
          limit: 10,
          orderBy: null,
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
        page: 1,
        list: [],
        listLoading: false,
        loading: false,
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeName);
        sessionStorage.setItem('activeNameQuestions', this.activeName)
        switch (this.activeName) {
          case "first":
            this.listQuery.checkStatus = "success"
            break;
          case "second":
            this.listQuery.checkStatus = "checking"
            break;
          case "third":
            this.listQuery.checkStatus = "failed"
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
          questionCheck(this.checkParams).then(json => {
            if (json.status ===200) {
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
      passCheck(id) {
        this.checkParams.targetId = id
        this.checkParams.changeTo = "success"
        questionCheck(this.checkParams).then(json => {
          if (json.status ===200) {
            this.$message.success('审核通过！')

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
        sessionStorage.setItem('settingVip', this.listQuery.page)
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
          if (json.status === 200) {
            this.list = json.data;
            this.total = json.total
          } else {

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
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        });
      },

      //删除分类
      delTag(data) {
        this.questionDelParams.targetId = data.id;
        this.$confirm("此操作将删除该条动态, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            questionDel(this.questionDelParams).then(res => {
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
            this.questionDelParams.targetId = "";
          });
      },
    },
    mounted() {
      this.getList();
    }
  };
</script>
<style lang="scss" scoped>
  .questions {
    padding: 15px;
    .list{
      padding-top: 20px;
      .item{
        font-size: 14px;
        border: 1px solid #e6e6e6;
        margin-bottom: 40px;
        padding: 20px;
        padding-bottom: 0;
        width: 90%;
        .title{
          color: #060606;
          display: flex;
          .piece{
            margin-right: 60px;
            .text{
              color: #959595;
              margin-right: 20px;
            }
          }
        }
        .main{
          margin: 20px 0;
          .piece{
            margin-bottom: 20px;
            .text{
              color: #959595;
              margin-right: 30px;
            }
          }
          .content{
            margin-bottom: 20px;
          }
        }
      }
    }
    .red {
      color: red;
    }

  }
</style>
