<template>
  <div class="dynamic">

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


  </div>
</template>

<script>

  import {
    dynamicList,
    dynamicDel,
    dynamicCheck,
  } from "../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "dynamic",
    directives: {
      waves,
    },
    data() {
      return {
        activeName: 'first',
        listQuery: {
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
        sessionStorage.setItem('activeName', this.activeName)
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
      passCheck() {
        this.checkParams.targetId = this.formParams.activityId
        this.checkParams.changeTo = "success"
        dynamicCheck(this.checkParams).then(json => {
          if (json.status ===200) {
            this.$message.success('审核通过！')
            this.$router.push({name:"offLineCheck"})
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
        dynamicList(this.listQuery).then(json => {
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
      tagSubmitForm() {
        if (!this.formParams.name) {
          this.$message({
            message: "请输入分类名称",
            type: "error"
          });
          return false;
        }

        // if (!this.formParams.detail) {
        //   this.$message({
        //     message: "请输入分类说明",
        //     type: "error"
        //   });
        //   return false;
        // }
        //
        // if (!this.formParams.logo) {
        //   this.$message({
        //     message: "请上传分类logo",
        //     type: "error"
        //   });
        //   return false;
        // }

        if (!this.formParams.queue) {
          this.$message({
            message: "请输入排序",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        liveEdit(this.formParams).then(json => {
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });
            this.dialogTableVisible = false;
            this.getList();
            this.formParams.name = "";
            this.formParams.detail = "";
            this.formParams.logo = "";
            this.formParams.parentId = "";
            this.formParams.queue = "";
            this.formParams.typeId = "";
          } else {

          }
          this.loading = false;
        });
      },
      submitForm() {
        this.loading = true;
        globalRuleEdit(this.rules).then(response => {
          const json = response.data;
          if (json.status===200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });
          } else {
            this.$message({
              message: json.message,
              type: json.status ? "success" : "error"
            });
          }
          this.loading = false;
        });
      },
      handleDrag() {
        // this.$refs.select.blur()
      },

    },
    mounted() {
      this.getList();
    }
  };
</script>
<style lang="scss" scoped>
  .dynamic {
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
