<template>
  <div class="dynamic">

    <div class="subject">
      <div class="subjectLeft">
        <div class="filter-container">
          <div class="left">
            全部
          </div>
          <div class="right">
            <el-input @keyup.enter.native="getList" style="width: 300px;margin-left: 20px" class="filter-item"
                      placeholder="搜索你想要的内容"
                      v-model="listQuery.keyword">
            </el-input>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList" v-if="hasPerm('content:found:dynamic:search')">
              搜索
            </el-button>

          </div>
        </div>
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
              <div class="left">
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
              <div class="right">
                <div class="status">
                  <span v-if="item.enable">启用</span>
                  <span v-if="!item.enable">禁用</span>
                  <el-switch
                    @change="(value)=>{changeStatus(value,item)}"
                    style="display: block"
                    v-model="item.enable"
                    v-if="hasPerm('content:found:dynamic:enable')"
                    active-color="#13ce66">
                  </el-switch>
                </div>
                <el-button type="text" class="delBtn" size="mini" @click="delTag(item)" style="color: #DADADA" v-if="hasPerm('content:found:dynamic:delete')">删除
                </el-button>
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


    </div>


  </div>
</template>

<script>

  import {
    dynamicList,
    dynamicDel,
    dynamicEnable,
    dynamicCheck,
  } from "../../../api/content";
  import waves from "@/directive/waves"; // 水波纹指令
  import {formatTime, showDecimal} from "@/utils";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import attachment from "@/components/attachment"


  export default {
    name: "dynamic",
    directives: {
      waves,
    },
    components: {
      attachment,
    },
    data() {
      return {
        activeSubName: 'recommend',
        zanNum: 1,
        listQuery: {
          enable: -1,
          keyword: "",
          limit: 10,
          orderBy: 0,
          page: 0,
          token: getToken(),
        },
        listQuery2: {
          app: "app",
          // checkStatus: "success",
          keyword: "",
          limit: 10,
          orderBy: 0,
          page: 0,
          userId: localStorage.getItem("uid"),
          token: getToken(),
        },
        checkParams: {
          changeTo: "",
          reason: "",
          targetId: 0,
          token: getToken(),
        },
        enableParams: {
          targetId: "",
          yes: true,
          token: getToken(),
        },
        delParams: {
          targetId: "",
          token: getToken(),
        },
        total: 0,
        total2: 0,
        page: 1,
        list: [],
        list2: [],
        listLoading: false,
        loading: false,
      };
    },
    methods: {
      changeStatus(value, item) {
        console.log(value);
        this.enableParams.targetId = item.id
        this.enableParams.yes = value
        dynamicEnable(this.enableParams).then(json => {
          if (json.status === 200) {
            console.log(json);
            // item.enable = !item.enable
          } else {

          }
        })
      },

      //删除分类
      delTag(data) {
        this.delParams.targetId = data.id;
        this.$confirm("此操作将删除该条动态, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            dynamicDel(this.delParams).then(res => {
              // console.log(res,"res");
              if (res.status === 200) {
                this.$message.success("删除成功！");
                this.getList();
              } else {
                this.$message.error(res.message);
              }
            });
          })
          .catch(() => {
            this.delParams.targetId = "";
          });
      },
      handleClick(tab, event) {
        console.log(this.activeSubName);
        // sessionStorage.setItem('activeSubName', this.activeSubName)
        switch (this.activeSubName) {
          case "recommend":
            this.listQuery.orderBy = 0;
            break;
          case "hot":
            this.listQuery.orderBy = 1;
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
          dynamicCheck(this.checkParams).then(json => {
            if (json.status === 200) {
              this.$message({
                type: 'warning',
                message: '审核不通过！'
              });
              // this.$router.push({name:"offLineCheck"})
            } else
              this.$message({message: json.message})
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
          if (json.status === 200) {
            this.$message.success('审核通过！')
            this.$router.push({name: "offLineCheck"})
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
        // sessionStorage.setItem('settingVip', this.listQuery.page)
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
        this.listLoading = true;
        dynamicList(this.listQuery).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
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
      getMyList() {
        this.listLoading = true;
        dynamicList(this.listQuery2).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            this.list2 = []
            this.list2 = json.data;
            this.total2 = json.total
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
    },
    mounted() {
      // this.getList();
    }
  };
</script>
<style>

  .dynamic .subject .el-tabs__active-bar {
    background: none;
  }

  .dynamic .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .dynamic .subject .subjectLeft .filter-container {
    border-bottom: none;
  }

  .dynamic .el-tabs__content {
    display: none;
  }

  .dynamic .filter-container .filter-item {
    margin-bottom: 0;
  }
</style>
<style lang="scss" scoped>
  .dynamic {
    .subject {
      display: flex;
      background: #f5f6fa;
      min-height: 100vh;
      .subjectLeft {
        margin: 20px;
        background: white;
        min-height: calc(100vh - 140px);
        position: relative;
        flex-grow: 1;
        /*padding-top: 20px;*/
        /*margin-right: 20px;*/
        .filter-container {
          display: flex;
          justify-content: space-between;
          background: white;
          height: 60px;
          padding: 0 20px;
          /*border-bottom: 1px solid #f2f2f2;*/
          align-items: center;
          .left {
            font-size: 14px;
            color: #409EFF;
          }
        }
        .item {
          /*border: 1px solid red;*/
          font-size: 14px;
          border-top: 1px solid #f2f2f2;
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
            /*border: 1px solid greenyellow;*/
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            color: #999999;
            .left {
              display: flex;
              .action {
                display: flex;
                align-items: center;
                margin-right: 100px;
                .dianzan {
                  /*cursor: pointer;*/
                  width: 20px;
                  height: 20px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin-right: 4px;
                  img {
                    width: 14px;
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
                }
              }
              .description {
                display: flex;
                align-items: center;
                .piece {
                  margin-right: 28px;
                }
                .time {
                  color: #DADADA;
                }
              }
            }
            .right {
              width: 196px;
              /*border: 1px solid red;*/
              display: flex;
              .status {
                width: 50%;
                display: flex;
                align-items: center;
                span {
                  margin-right: 10px;
                  line-height: 28px;
                }
              }
              .delBtn {
                border: 1px solid #DCDFE6;
                width: 60px;
                border-radius: 30px;
              }
            }

          }

        }
        .item:last-child {
          border-bottom: 1px solid #f2f2f2;
        }
      }
    }
    .list {
      min-height: calc(100vh - 260px);

    }
    .el-table {
      min-height: calc(100vh - 260px);

    }
    .paginationBox {
      margin: 10px auto;
      text-align: center;
    }
    .red {
      color: red;
    }

  }
</style>
