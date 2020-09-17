<template>
  <div class="activity">
    <el-tabs v-model="activeVipAboutName" @tab-click="handleClick">
      <el-tab-pane label="会员权益" name="vipEquity"  v-if="hasPerm('settings:members:list')">
        <vipEquity ref="vipEquity"></vipEquity>
      </el-tab-pane>
      <el-tab-pane label="会员充值" name="vipRecharge" v-if="hasPerm('settings:members:recharges')">
        <vipRecharge ref="vipRecharge"></vipRecharge>
      </el-tab-pane>
    </el-tabs>
    <!--<el-input-->
      <!--type="text"-->
      <!--v-model="form.content"-->
      <!--placeholder="请输入充值说明"-->
    <!--/>-->
    <div class="newAdd" @click="addTag('vipEquity')" v-if="activeVipAboutName==='vipEquity' && hasPerm('settings:members:list:add') ">添加会员</div>
    <div class="newAdd" @click="openDialog" v-if="activeVipAboutName==='vipRecharge'  && hasPerm('settings:members:recharges:detail') ">充值说明</div>

    <el-dialog title="充值说明" :visible.sync="dialogFormVisible">
      <el-form ref="postForm">
        <el-input
          type="textarea"
          style="width: 90%;"
         :rows ="4"
          @input="change($event)"
          v-model="formParams.content"
          placeholder="请输入充值说明"
        />

        <!--<el-input-->
          <!--type="text"-->
          <!--v-model="form.content"-->
          <!--placeholder="请输入充值说明"-->
        <!--/>-->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="tagSubmitForm">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

  import {
    dynamicList,
    dynamicDel,
    dynamicCheck,
  } from "../../api/content";
  import {
    newsEdit,
  } from "../../api/business";
  import {
    newsType,
  } from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import vipEquity from "./components/vipEquity";  //子组件
  import vipRecharge from "./components/vipRecharge"; //子组件
  import {parseTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "activity",
    directives: {
      waves,
    },
    components: {
      vipEquity,
      vipRecharge,
    },

    data() {
      return {
        activeVipAboutName: 'vipEquity',
        dialogFormVisible: false,
        formLabelWidth: "120px",
        formParams: {
          title: "title",
          content: "",
          newsId: 0,
          type: "rechargeIntro",
          token: getToken(),
        },
      };
    },
    methods: {
      openDialog(){
        this.getcontent();
        this.dialogFormVisible = true
      },
      change(e){
        this.$forceUpdate()
      },
      getcontent() {
        newsType({
          type: 'rechargeIntro',
        }).then(json => {
          if (json.status === 200) {
            this.formParams.content = json.data.content;
            this.formParams.newsId = json.data.id;
            this.formParams.title = json.data.title;
          } else {

          }
        });
      },
      tagSubmitForm() {
        if (!this.formParams.content) {
          this.$message({
            message: "请输入充值说明",
            type: "error"
          });
          return false;
        }
        this.loading = true;
        newsEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            // const json = response.data;
            this.dialogFormVisible = false
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });


          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }

        });
      },
      handleClick(tab, event) {
        console.log(this.activeVipAboutName);
        sessionStorage.setItem('activeVipAboutName', this.activeVipAboutName)
        this.getList();
      },
      addTag(num) {
        switch (num) {
          case 'vipEquity':
            this.$router.push({
              name: "addVipDetail", params: {
                id: 0
              }
            })
            break;
          case 'vipRecharge':
            this.$router.push({
              name: "vipRechargeDetail", params: {
                id: 0
              }
            })
            break;
        }

      },
      getList() {
        switch (this.activeVipAboutName) {
          case "vipEquity":
            this.$refs.vipEquity.getList();
            break;
          case "vipRecharge":
            this.$refs.vipRecharge.getList();
            break;
        }
      },

    },
    mounted() {
      if (sessionStorage.getItem('activeVipAboutName')) {
        this.activeVipAboutName = sessionStorage.getItem('activeVipAboutName')
      } else {
        this.activeVipAboutName = "vipEquity"
      }
      console.log(this.activeVipAboutName, "activeVipAboutName");
      this.getList()
    }
  };
</script>
<style>
  .activity .el-tabs__nav {
    margin-left: 40px;
  }

  .activity .el-tabs__nav-wrap::after {
    background: none;
  }

  .activity .el-tabs__header {
    margin: 0;
  }

  .activity .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  .activity {
    min-height: calc(100vh - 60px);
    position: relative;
    .newAdd {
      position: absolute;
      right: 27px;
      top: 10px;
      color: #F65860;
      font-size: 14px;
      cursor: pointer;
    }

  }
</style>
