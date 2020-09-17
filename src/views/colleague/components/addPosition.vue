<template>
  <div class="addPosition">

    <div class="content">
      <div id="menus" class="left">
        <div class="alldepartment" style="color: deepskyblue"> 所有职位</div>

        <el-tree :data="data" :props="defaultProps" node-key="id" :default-expand-all="true"
                 @node-contextmenu="rightClick" @node-click="handleNodeClick" :expand-on-click-node="false">
        </el-tree>


        <div v-show="menuVisible" id="jpMenu" class="menu">
          <div class="menu_item" @click="newAdd">新增</div>
          <!--<div class="menu_item" @click="openDialog">复制</div>-->
          <div class="menu_item" @click="jpDel">删除</div>
        </div>
      </div>


      <div class="rightMain">
        <div class="addDepartment">
          <el-form class="form-container" ref="postForm" label-width="154px">
            <el-form-item label="职位名称">
              <el-input
                style="width:600px;"
                maxlength="20"
                v-model="formParams.name"
                placeholder="请输入职位名称，20字以内"
              />
            </el-form-item>

            <el-form-item label="上级职位">

              <el-cascader
                style="width:600px;"
                v-model="valueDepartmentIds"
                :options="positionOptions"
                :props="{ expandTrigger: 'hover', checkStrictly: true, label:'name', value:'id' }"
                @change="handleChange"></el-cascader>

            </el-form-item>
            <el-form-item label="职位等级">
              <el-input
                style="width:600px;"
                v-model="formParams.level"
                placeholder="数字越小，等级越高"
              />
            </el-form-item>
            <el-form-item label="职位说明">
              <el-input
                style="width: 600px"
                type="textarea"
                :rows="4"
                v-model="formParams.intro"
                placeholder="输入职位说明"
              />
            </el-form-item>

            <el-form-item label="">
              <div class="addPosition" @click="submitForm">保存</div>
            </el-form-item>

          </el-form>

        </div>
      </div>

    </div>

    <el-dialog title="" :visible.sync="dialogFormVisible">
      <el-form :model="copyParams">


        <el-form-item label="请选择复制到">
          <el-cascader
            style="width:600px;"
            v-model="valueDepartmentIdsCopy"
            :options="positionOptions"
            :props="{ expandTrigger: 'hover', checkStrictly: true, label:'name', value:'id' }"
            ></el-cascader>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="copyTo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    jpAll,
    jpDetail,
    jpEdit,
    jpDel,
    jpParents,
    jpCopy,
  } from "../../../api/department.js";
  import {userStaffs,} from "@/api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import {getToken} from '@/utils/auth'
  import pagination from '@/components/Pagination/index'
  import addColleague from './../components/addColleague'

  export default {
    name: "addPosition",
    components: {
      pagination,
      addColleague,
    },
    directives: {
      waves,
    },
    data() {
      return {
        formLabelWidth: "130px",
        dialogFormVisible: false,
        menuVisible: false,
        total: 0,
        page: 1,
        valueDepartmentIds: [],
        valueDepartmentIdsCopy: [],
        userOptions: [],
        positions: [],
        positionOptions: [
          {
            id: 0,
            name: "易答在线",
            children: [],
          }
        ],
        listLoading: false,
        loading: false,
        formParams: {
          intro: "",
          level: null,
          name: "",
          parentId: 0,
          positionId: 0,
          token: getToken(),
        },

        listQuery: {
          app: "staff",
          limit: 1,
          page: 0,
          departmentId: 0,
          token: getToken()
        },
        jpDelParams: {
          targetId: null,
          token: getToken()
        },
        copyParams: {
          copyToId: null,  //复制到职位ID
          jobPositionId: null,
          token: getToken()
        },
        data: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    created() {

    },
    methods: {
      refresh() {


      },
      //右键点击
      rightClick(MouseEvent, object, node, element) { // 鼠标右击触发事件
        console.log(object, 'object');
        console.log(object.id, 'id');
        this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
        this.menuVisible = true  // 显示模态窗口，跳出自定义菜单栏
        var menu = document.querySelector('#jpMenu')
        document.addEventListener('click', this.foo) // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
        menu.style.display = "block";
        menu.style.left = MouseEvent.clientX - 150 + 'px'
        menu.style.top = MouseEvent.clientY - 80 + 'px'
        this.jpDelParams.targetId = object.id;
        this.copyParams.jobPositionId = object.id;
      },
      foo() { // 取消鼠标监听事件 菜单栏
        this.menuVisible = false
        document.removeEventListener('click', this.foo) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
      },
      addTag() {
        this.$router.push({
          name: "colleagueDetail", id: 0
        })
      },
      //取左边的职位列表
      getList() {
        jpAll().then(json => {
          if (json.status === 200) {
            this.data = json.data
            this.positionOptions[0].children = [];
            this.data.forEach((item, index) => {
              this.positionOptions[0].children.push(item);
            })
          }
        });
      },
      addDepartment() {
        this.formParams.typeId = 0;
        this.formParams.parentId = 0;
        this.formParams.name = "";
        this.valueDepartmentIds = []
      },
      handleChange() {
      },
      handleNodeClick(data, node) {
        console.log(data,node,"data");
        this.formParams.parentId = data.parentId;
        this.jpDelParams.positionId = data.id;
        this.formParams.positionId = data.id;
        this.formParams.intro = data.intro;
        this.formParams.name = data.name
        this.formParams.level = data.level
        this.jpDelParams.targetId = data.id;

        this.copyParams.jobPositionId = data.id;
        jpDetail({
          targetId: data.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.formParams.intro = json.data.intro;
          }
        });
        jpParents({
          targetId: data.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.valueDepartmentIds = [0]
            json.data.forEach(item => this.valueDepartmentIds.push(item));
          }
          console.log(this.valueDepartmentIds);
          this.valueDepartmentIds.splice(this.valueDepartmentIds.length - 1 ,1)

        });


      },
      // confirmSelect() {
      //   this.dialogFormVisible = false;
      //   this.selectArr = [];
      //   this.staffOptions.forEach((item, index) => {
      //     if (this.formParams.userIds.indexOf(item.id) > -1) {
      //       this.selectArr.push(item)
      //     }
      //   })
      // },
      copyTo(){
        if (this.valueDepartmentIdsCopy.length === 0) {
          this.$message({
            message: "请选择要复制到的职位",
            type: "error"
          });
          return false;
        }
        this.copyParams.copyToId = this.valueDepartmentIdsCopy[this.valueDepartmentIdsCopy.length - 1]

        this.dialogFormVisible = false;
        jpCopy(this.copyParams).then(json => {
          if (json.status === 200) {
           this.getList()
          }
        });
      },
      openDialog(){
        this.dialogFormVisible = true;
      },
      newAdd() {
        this.formParams = {
          intro: "",
          level: null,
          name: "",
          parentId: 0,
          positionId: 0,
          token: getToken(),
        }
        this.positions = []
      },
      jpDel() {
        // console.log(item, "item");

        if (this.jpDelParams.targetId) {
          this.$confirm("确定删除该职位?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              jpDel(this.jpDelParams).then(json => {
                this.loading = false;
                if (json.status === 200) {
                  this.$message({
                    message: "删除成功！",
                    type: json.status === 200 ? "success" : "error"
                  });

                  window.location.reload()
                }
              });
            })
            .catch(() => {
            });
        } else {
          this.$message({
            message: "请选择要删除的部门！",
            type: "error"
          });
        }

      },
      submitForm() {
        // this.loading = true;
        console.log(this.valueDepartmentIds);
        if (!this.formParams.name) {
          this.$message({
            message: "请输入职位名称",
            type: "error"
          });
          return false;
        }
        if (this.valueDepartmentIds.length === 0) {
          this.$message({
            message: "请选择上级职位",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.level) {
          this.$message({
            message: "请输入职位等级",
            type: "error"
          });
          return false;
        }
        console.log(this.formParams, "formParams");
        this.formParams.parentId = this.valueDepartmentIds[this.valueDepartmentIds.length - 1]

        jpEdit(this.formParams).then(json => {
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });
            this.loading = false;
            window.location.reload()
          }


        });
      },
      delPosition(item, index) {
        console.log(item, "item");
        this.positonRemoveParams.positionId = item.id;
        this.$confirm("确定删除该职位?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            jpDel(this.positonRemoveParams).then(json => {
              this.loading = false;
              if (json.status === 200) {
                this.$message({
                  message: "删除成功！",
                  type: json.status === 200 ? "success" : "error"
                });

                window.location.reload()
              }
            });
          })
          .catch(() => {
          });
      },
    },
    mounted() {
      // this.getList();
    }
  }
</script>
<style lang="scss" scoped>
  .addPosition {
    background: rgb(245, 246, 250);
    /*min-height: 100vh;*/
    .update {
      position: absolute;
      color: #F65860;
      right: 20px;
      top: 0;
      z-index: 9999;
    }

    .content {
      display: flex;
      background: #f4f5f7;
      padding: 20px;
      .left {
        width: 240px;
        height: 85vh;
        overflow-y: auto;
        margin-right: 20px;
        background: #ffffff;
        .department {
          border: 1px solid #999999;
          width: 70%;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          /*margin: 20px 0;*/
          margin: 20px auto;
          cursor: pointer;
        }
        .alldepartment {
          width: 70%;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          /*margin: 20px 0;*/
          margin: 20px auto;
        }
        .el-tree {
          background: #ffffff;
        }
      }
      .rightMain {
        background: #ffffff;
        flex-grow: 1; //铺满盒子剩余空间
        padding: 25px 15px;
        .filter-container {
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
        }
        .treeBox {
          border: 1px solid #DCDFE6;
          border-radius: 4px;
          padding: 20px 10px;
        }
        .addPosition {
          width: 80px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #5BC0DF;
          color: white;
          border-radius: 30px;
          cursor: pointer;
          margin: 6px 0 30px;
        }
        .positionList {
          .item {

            /*height: 30px;*/
            /*width: 100px;*/
            /*border: 1px solid yellow;*/
            color: #666666;

            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .name {
              /*height: 30px;*/
              border-radius: 10px;
              position: relative;
              padding: 0 20px 0;
              background: #f2f2f2;
              /*border: 1px solid red;*/
            }
            .del {
              /*border: 1px solid red;*/
              color: rgba(102, 102, 102, 0.6);
              position: absolute;
              right: 8px;
              top: -1px;
              cursor: pointer;
            }
          }
        }
      }
    }
    .menu {
      height: 80px;
      width: 100px;
      display: flex;
      flex-direction: column;
      position: absolute;
      border: 1px solid rgba(242, 242, 242, 0.8);
      background-color: #fff;
    }
    .menu_item {
      height: 40px;
      font-size: 14px;
      width: 100%;
      text-align: center;
      border-bottom: 1px solid rgba(242, 242, 242, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #606266;

    }
    .menu_item:last-child {
      border-bottom: none;
    }
    .menu_item:hover {
      background-color: #f5f7fa;
      cursor: pointer;
    }

  }
</style>
