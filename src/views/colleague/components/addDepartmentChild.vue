<template>
  <div class="addDepartmentChild">
    <!--<div class="update">更新</div>-->

    <div class="content">
      <div id="menus" class="left">
        <div class="alldepartment" style="color: deepskyblue"> 所有部门</div>
        <el-tree :data="data" :props="defaultProps" node-key="id" :default-expand-all="true"
            @node-contextmenu="rightClick" @node-click="handleNodeClick" :expand-on-click-node="false">
        </el-tree>
        <div v-show="menuVisible" id="menu" class="menu">
          <div class="menu_item" @click="newAdd">新增</div>
          <!--<div class="menu_item" @click="openDialog">复制</div>-->
          <div class="menu_item" @click="delDepartment">删除</div>
        </div>
      </div>


      <div class="rightMain">
        <!--<addDepartment></addDepartment>-->
        <div class="addDepartment">
          <el-form class="form-container" ref="postForm" label-width="154px">
            <el-form-item label="部门名称">
              <el-input
                style="width:600px;"
                maxlength="20"
                v-model="formParams.name"
                placeholder="请输入部门名称，20字以内"
              />
            </el-form-item>

            <el-form-item label="上级部门">

              <el-cascader
                style="width:600px;"
                v-model="valueDepartmentIds"
                :options="departmentOptions"
                :props="{ expandTrigger: 'hover', checkStrictly: true, label:'name', value:'id' }"
                @change="handleChange"></el-cascader>

            </el-form-item>
            <el-form-item label="部门等级">
              <el-input
                style="width:600px;"
                v-model="formParams.level"
                placeholder="数字越小，等级越高"
              />
            </el-form-item>
            <el-form-item label="编号">
              <el-input
                style="width:300px;"
                v-model="formParams.number"
                placeholder="请输入编号"
              />
            </el-form-item>
            <el-form-item label="部门负责人">
              <el-select
                class="filter-item"
                style="width: 300px"
                v-model="formParams.leaderId"
                placeholder="请选择部门负责人"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="行政专员">
              <el-select
                class="filter-item"
                style="width: 300px"
                v-model="formParams.administrativeId"
                placeholder="请选择行政专员"
              >
                <el-option
                  v-for="item in administrativeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客服人员">
              <el-select
                class="filter-item"
                style="width: 300px"
                v-model="formParams.csIds"
                placeholder="请选择客服人员"
                multiple
              >
                <el-option
                  v-for="item in csOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门类型">
              <el-select
                class="filter-item"
                style="width: 300px"
                v-model="formParams.type"
                placeholder="请选择部门类型"
              >
                <el-option
                  v-for="item in groupTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
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
            :options="departmentOptions"
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
    departmentAll,
    departmentDetail,
    departmentEdit,
    departmentPositionEdit,
    departmentPositionRemove,
    departmentDel,
    departmentCopy,
  } from "../../../api/department.js";
  import {userStaffs,} from "@/api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import {getToken} from '@/utils/auth'
  import pagination from '@/components/Pagination/index'
  import addColleague from './../components/addColleague'
  // import addDepartment from './components/addDepartment'

  export default {
    name: "addDepartmentChild",
    components: {
      pagination,
      addColleague,
      // addDepartment,
    },
    directives: {
      waves,
    },
    data() {
      return {
        groupTypeOptions:[{
          label:"军团/部",
          value:"legion"
        },{
          label:"战区",
          value:"theater"
        },{
          label:"战队",
          value:"clan"
        }],
        showDelButton: false,
        formLabelWidth: "130px",
        dialogFormVisible: false,
        menuVisible: false,
        total: 0,
        page: 1,
        valueDepartmentIds: [],
        userOptions: [],
        administrativeOptions: [],
        csOptions: [],
        positions: [],
        positionParams: {
          departmentId: 0,
          name: "",
          parentId: null,
          positionId: 0,
        },
        departmentOptions: [
          {
            id: 0,
            name: "易答在线",
            children: [],
          }
        ],
        copyParams: {
          copyToId: null,  //复制到职位ID
          departmentId: null,
          token: getToken()
        },
        listLoading: false,
        loading: false,
        formParams: {
          departmentId: 0,
          leaderId: null,
          administrativeId: null,
          csIds: null,
          level: null,
          name: "",
          token: getToken(),
          parentId: 0,
          number: "",
          type:null,//部门类型
        },
        listQuery: {
          app: "staff",
          limit: 1,
          page: 0,
          departmentId: 0,
          token: getToken()
        },
        positonRemoveParams: {
          departmentId: null,
          positionId: null,
          token: getToken()
        },
        valueDepartmentIdsCopy: [],
        departmentDelParams: {
          targetId: null,
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
        departmentCopy(this.copyParams).then(json => {
          if (json.status === 200) {
            this.getList()
          }
        });
      },
      //右键点击
      rightClick(MouseEvent, object, node, element) { // 鼠标右击触发事件
        console.log(object, 'object');
        console.log(object.id, 'id');
        this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
        this.menuVisible = true  // 显示模态窗口，跳出自定义菜单栏
        var menu = document.querySelector('#menu')
        document.addEventListener('click', this.foo) // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
        menu.style.display = "block";
        menu.style.left = MouseEvent.clientX - 150 + 'px'
        menu.style.top = MouseEvent.clientY - 80 + 'px'
        this.departmentDelParams.targetId = object.id;
        this.copyParams.departmentId = object.id;
      },
      foo() { // 取消鼠标监听事件 菜单栏
        this.menuVisible = false
        document.removeEventListener('click', this.foo) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
      },
      addPosition() {
        this.dialogFormVisible = false;
        departmentPositionEdit(this.positionParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            this.positions = json.data.positions;
          }


        });
      },
      addTag() {
        this.$router.push({
          name: "colleagueDetail", id: 0
        })
      },
      //取左边的部门列表
      getList() {
        departmentAll().then(json => {
          if (json.status === 200) {
            console.log(json.data)
            this.data = json.data
            this.data.forEach((item, index) => {
              this.departmentOptions[0].children.push(item);
            })
          }
        });
      },
      //取得员工列表
      getUserList(departmentId) {
        userStaffs({
          departmentId: departmentId,
          enable: 1,
          jobLeave: 1,
          token: getToken()
        }).then(json => {
          if (json.status === 200) {
            this.userOptions = json.data
          }
        });
      },
      //获取行政专员列表
      getAdministrativeUserList() {
        userStaffs({
          // departmentId: departmentId,
          enable: 0,
          jobLeave: 0,
          role: "administrative",
          token: getToken()
        }).then(json => {
          if (json.status === 200) {
            this.administrativeOptions = json.data
          }
        });
      },
      //获取客服人员列表
      getCsUserList() {
        userStaffs({
          // departmentId: departmentId,
          enable: 0,
          jobLeave: 0,
          role: "cs",
          token: getToken()
        }).then(json => {
          if (json.status === 200) {
            this.csOptions = json.data
          }
        });
      },
      addDepartment() {
        this.formParams.typeId = 0;
        this.formParams.parentId = 0;
        this.formParams.name = "";
        this.valueDepartmentIds = []
        this.showDelButton = false
      },
      handleChange() {
      },
      handleNodeClick(data, node) {
        console.log(data)
        this.showDelButton = true
        this.valueDepartmentIds = []
        console.log(data, node, "openIndexopenIndex");
        this.formParams.parentId = data.parentId;
        this.formParams.departmentId = data.id;
        this.departmentDelParams.targetId = data.id;
        this.formParams.leaderId = data.leaderId ? data.leaderId :null;
        this.formParams.administrativeId = data.administrativeId ? data.administrativeId :null;
        this.formParams.csIds = data.csIds ? data.csIds :null;
        this.formParams.name = data.name
        this.formParams.level = data.level
        this.formParams.number = data.number
        this.formParams.type = data.type;

        this.positionParams.departmentId = data.id;
        this.positonRemoveParams.departmentId = data.id;
        let parent = node.parent;
        // console.log(node.parent, "node.parent;");
        while (parent) {
          if (parent.level > 0) {
            this.valueDepartmentIds.unshift(parent.data.id);
          } else {
            this.valueDepartmentIds.unshift(0);
          }
          parent = parent.parent;
        }
        // console.log(this.valueDepartmentIds);

        departmentDetail({
          targetId: data.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.positions = json.data.positions
          }
        });
        this.getUserList(data.id);
        this.getAdministrativeUserList();
        this.getCsUserList();

      },
      newAdd() {
        this.formParams = {
          departmentId: 0,
          leaderId: null,
          administrativeId: null,
          csIds: null,
          level: null,
          name: "",
          token: getToken(),
          parentId: 0,
          number: "",
          type: null,
        }
        this.positions = []
      },
      openDialog(){
        this.dialogFormVisible = true;
      },
      delDepartment() {
        if (this.departmentDelParams.targetId) {
          this.$confirm("确定删除该部门?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              departmentDel(this.departmentDelParams).then(json => {
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
        if (!this.formParams.name) {
          this.$message({
            message: "请输入部门名称",
            type: "error"
          });
          return false;
        }
        if (this.valueDepartmentIds.length === 0) {
          this.$message({
            message: "请选择所属部门",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.level) {
          this.$message({
            message: "请输入部门等级",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.number) {
          this.$message({
            message: "请输入编号",
            type: "error"
          });
          return false;
        }
        console.log(this.formParams, "formParams");
        this.formParams.parentId = this.valueDepartmentIds[this.valueDepartmentIds.length - 1]

        departmentEdit(this.formParams).then(json => {
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
            departmentPositionRemove(this.positonRemoveParams).then(json => {
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
<style lang="scss">
  .addDepartmentChild {
    background: rgb(245, 246, 250);
    /*min-height: 100vh;*/
    height: 100%;
    overflow: hidden;
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
      height: 100%;
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
