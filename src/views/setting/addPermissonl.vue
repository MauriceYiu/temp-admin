<template>
  <div class="addPermissonl">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="submitRoles">保存</div>
    </div>
    <div class="main">
      <div class="content">
        <el-form ref="formParams" :model="formParams" label-width="140px">
          <el-form-item label="权限组名称">
            <el-input style="width: 90%" v-model="formParams.name"></el-input>
          </el-form-item>
          <el-form-item label="权限组描述">
            <el-input
              style="width: 90%"
              v-model="formParams.detail"
              :autosize="{ minRows: 4, maxRows: 10}"
              type='textarea'>
            </el-input>
          </el-form-item>
          <el-form-item label="主系统功能权限">
            <el-card style="width: 200px;float:left;margin-right: 10px;margin-bottom: 10px"
                     v-for="(item,index) in roleData" :key="index">
              <div slot="header" class="clearfix">
                <span>{{item.name}}</span>
              </div>
              <el-tree
                ref="tree"
                :props="props"
                :data="item.actions"
                node-key="id"
                check-strictly
                show-checkbox
              ></el-tree>
            </el-card>
          </el-form-item>
          <el-form-item label="CRM系统功能权限">
            <el-card style="width: 200px;float:left;margin-right: 10px;margin-bottom: 10px"
                     v-for="(item,index) in crmRoleList" :key="index">
              <div slot="header" class="clearfix">
                <span>{{item.name}}</span>
              </div>
              <el-tree
                ref="crmTree"
                :props="props"
                :data="item.actions"
                node-key="id"
                check-strictly
                show-checkbox
              ></el-tree>
            </el-card>
          </el-form-item>
        </el-form>

      </div>
      <div class="list">

        <div class="filter-container">
          <div class="left">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <!--<el-tab-pane label="添加权限" name="first"></el-tab-pane>-->
              <el-tab-pane label="添加成员" name="second"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="right" @click="openDialog" v-show="activeName === 'second'">
            添加
          </div>
        </div>
        <div class="addPerm" v-show="activeName === 'first'" style="padding: 30px 20px;box-sizing: border-box">
          <!--<el-tree-->
          <!--ref="tree"-->
          <!--:props="props"-->
          <!--:default-expanded-keys="formParams.roles"-->
          <!--:data="roleData"-->
          <!--check-strictly-->
          <!--node-key="id"-->
          <!--show-checkbox-->
          <!--&gt;</el-tree>-->

          <!--<div class="save" @click="submitRoles">保存</div>-->
        </div>

        <el-table :data="selectArr" row-key="id" style="width: 100%;" v-show="activeName === 'second'">
          <el-table-column align="center" label="ID" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="工号">
            <template slot-scope="scope">
              <span>{{scope.row.mobile}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="部门">
            <template slot-scope="scope">
              <span>{{scope.row.departmentName || '--'}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="操作"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <div class="action">
                <el-button type="text" size="mini" @click="delTag(scope.$index, scope.row.id)" style="color: #DADADA">删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </div>


    <el-dialog title="添加接受人员" :visible.sync="dialogFormVisible">
      <el-form :model="formParams">


        <el-form-item label="接受人员">
          <el-select style="width: 70%" v-model="formParams.userIds" filterable multiple placeholder="请选择接受人员">
            <el-option
              v-for="item in staffOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

  import {cgcAdd,} from "../../api/coupon";
  import {allRoles, roleDetail, roleEdit, roleUser , getCrmRole} from "../../api/settings.js";
  import {userStaffs,} from "../../api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'

  export default {
    name: "addPermissonl",
    directives: {
      waves,
    },
    components: {
      pagination
    },
    data() {
      return {
        crmRoleList:[],
        selectArr: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        radio: 1,
        valuePicker: '',
        list: [],
        staffOptions: [],
        total: 0,
        page: 1,
        listQuery: {
          limit: 10,
          page: 0,
          token: getToken()
        },
        dialogFormVisible: false,
        loading: false,
        props: {
          label: "name",
          children: "actions",
          // disabled: 'must'
        },
        roleData: [
          {
            name: "全部",
            id: 1,
            actions: []
          }
        ],
        activeName: 'second',
        formParams: {
          detail: "", //
          enable: true, //
          logo: "", //
          name: "", //
          parentId: 0, //
          queue: "",
          roleGroupId: "", //
          userIds: [], //
          roles: [],
          token: getToken(),
          crmRoles:[]
        },
        params: {
          targetId: "",
          token: getToken()
        },
      };
    },
    methods: {
      //权限列表
      getDetails() {
        if (this.$route.params.id) {
          this.params.targetId = this.$route.params.id;
          roleDetail(this.params).then(json => {
            if (json.status === 200) {
              this.formParams.detail = json.data.detail,
                this.formParams.enable = json.data.enable,
                this.formParams.logo = json.data.logo,
                this.formParams.name = json.data.name,
                this.formParams.parentId = json.data.parentId,
                this.formParams.queue = json.data.queue,
                this.formParams.roleGroupId = json.data.id,
                this.formParams.roles = json.data.roles,
                this.formParams.crmRoles = json.data.crmRoles,
                this.formParams.token = getToken()
              // };
              console.log(this.formParams.userIds);
              json.users.forEach((item, index) => {
                this.formParams.userIds.push(item.id)
              })
              this.selectArr = json.users
              console.log(this.$refs.tree);
              this.$refs.tree.forEach((item, index) => {
                item.setCheckedKeys(json.data.roles);
              });
              this.$refs.crmTree.forEach((item, index) => {
                item.setCheckedKeys(json.data.crmRoles);
              });
            } else {
              // this.$message.error(json.message);
            }
          });
        }
      },
      //权限组添加或编辑
      submitRoles() {
        if (this.vails()) {
          let checkedKeys = [];
          let crmCheckedKeys = [];

          this.$refs.tree.forEach((item, index) => {
            let keys = [];
            keys = keys.concat(item.getCheckedKeys());
            keys = keys.concat(item.getHalfCheckedKeys());
            if (keys.length > 0) {
              keys.push(parseInt(String(keys[0]).substr(0, 3) + "0"))
            }
            checkedKeys = checkedKeys.concat(keys);
          });
          this.$refs.crmTree.forEach((item, index) => {
            let keys = [];
            keys = keys.concat(item.getCheckedKeys());
            keys = keys.concat(item.getHalfCheckedKeys());
            if (keys.length > 0) {
              keys.push(parseInt(String(keys[0]).substr(0, 3) + "0"))
            }
            crmCheckedKeys = crmCheckedKeys.concat(keys);
          });
          console.log(crmCheckedKeys)
          // return
          //let checkedKeys = this.$refs.tree.getCheckedKeys();
          //console.log(checkedKeys, "checkedKeys");
          //let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
          //console.log(halfCheckedKeys, "halfCheckedKeys");
          console.log(checkedKeys);
          if (checkedKeys.length === 0) {
            this.$message.error("请选择权限组权限明细");
            return false;
          }
          this.formParams.roles = checkedKeys;
          this.formParams.crmRoles = crmCheckedKeys;
          // console.log(this.formParams.roles,"this.formParams.roles");
          roleEdit(this.formParams).then(json => {
            if (json.status === 200) {
              this.$message.success(json.message);
              this.$router.go(-1)

            } else {

            }
          });
        }
      },
      vails() {
        if (!this.formParams.name) {
          this.$message.error("请输入角色名称");
          return false;
        }
        // if (!this.formParams.detail) {
        //   this.$message.error("请输入权限组描述");
        //   return false;
        // }
        if (!this.formParams.detail) {
          this.$message.error("请输入角色描述");
          return false;
        }
        return true;
      },
      //删除
      delTag(index, id) {
        this.$confirm("确定删除此接受人?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.selectArr.splice(index, 1)
          this.formParams.userIds.splice(this.formParams.userIds.indexOf(id), 1)
          this.$message.success("删除成功！");

          if (this.$route.params.id) {
            roleUser({
              add: false,
              roleGroupId: this.$route.params.id,
              userIds: [id],
              token: getToken()
            }).then(json => {
              if (json.status === 200) {

              }
            })
          }
        })
      },
      openDialog() {
        this.dialogFormVisible = true
        //this.formParams.userIds = [];
      },
      handleClick(tab, event) {
        //   this.page = 1;
        //   this.total = 0;
        //   this.listQuery.page = 0;
        //   // console.log(tab.name, event, "tab");
        //   switch (tab.name) {
        //     case "first":
        //       this.listQuery.free = 0;
        //       this.listQuery.prefer = 0;
        //       break;
        //     case "second":
        //       this.listQuery.free = 0;
        //       this.listQuery.prefer = 1;
        //       break;
        //     case "third":
        //       this.listQuery.free = 1;
        //       this.listQuery.prefer = 0;
        //       break;
        //   }
        //
        //   this.getList()
      },
      confirmSelect() {
        this.dialogFormVisible = false;
        this.selectArr = [];
        this.staffOptions.forEach((item, index) => {
          if (this.formParams.userIds.indexOf(item.id) > -1) {
            this.selectArr.push(item)
          }
        })
      },
      getAllStaffs() {
        userStaffs({
          enable: 1,
          jobLeave: 1,
          token: getToken()
        }).then(json => {
          if (json.status === 200) {
            // console.log(json);
            this.staffOptions = json.data
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
        sessionStorage.setItem('settingVip', this.listQuery.page)
        this.getList()
      },
      changePicker() {
        this.formParams.sendTime = this.valuePicker / 1000
      },
      tagSubmitForm() {
        console.log(this.formParams);
        if (!this.formParams.couponId) {
          this.$message({
            message: "请选择优惠券",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.amount) {
          this.$message({
            message: "请输入单人数量",
            type: "error"
          });
          return false;
        }

        if (!this.valuePicker) {
          this.$message({
            message: "选择优惠截止时间",
            type: "error"
          });
          return false;
        }

        if (this.formParams.userIds.length === 0) {
          this.$message({
            message: "请选择接受人员",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.intro) {
          this.$message({
            message: "请输入卡券详情",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        this.formParams.sendTime = this.valuePicker / 1000;
        cgcAdd(this.formParams).then(json => {
          this.loading = false;
          // const json = response.data;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });

            this.dialogTableVisible = false;
            this.$router.push({
              name: "coupon"
            })
            this.formParams = {
              amount: "",
              couponId: "",
              intro: "",
              sendTime: 0,
              userIds: [],
              token: getToken(),
            }
          } else {

          }


        });
      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      //系统默认权限
      getList() {
        allRoles().then(json => {
          if (json.status === 200) {
            this.roleData = json.data;
            this.$nextTick(() => {
              this.getDetails();
            });

          } else {

          }
        });
      },
      doGetCrmRole(){
        getCrmRole({}).then(res=>{
          this.crmRoleList = res.data;
        })
      }

    },
    mounted() {
      this.getAllStaffs();
      this.formParams.roleGroupId = this.$route.params.id
      this.getList();
      this.doGetCrmRole();
    }
  };
</script>
<style>
  .el-card__header {
    padding: 5px 10px;
  }

  .el-card__body {
    padding: 10px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .app-container .right {
    margin: 20px 0;
    text-align: right;
  }

  .addPermissonl .list .filter-container .left .el-tabs__active-bar {
    background: none;
  }

  .addPermissonl .list .filter-container .left .el-tabs__content {
    display: none;
  }

  .addPermissonl .list .filter-container .left .el-tabs__header {
    margin-bottom: 0;
  }

  .addPermissonl .list .filter-container .left .el-tabs__nav {
    margin-left: 0;
  }

  .addPermissonl .list .filter-container .left .el-tabs__nav-wrap::after {
    background: none;
  }
</style>
<style lang="scss" scoped>
  .addPermissonl {

    background: rgba(245, 246, 250, 0.61);
    /*min-height: 100vh;*/
    .head {
      background: white;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #333333;
      padding: 0 24px 0 20px;
      font-size: 15px;
      .back {
        color: #333333;
        cursor: pointer;
        font-size: 15px;
        font-weight: bold;
      }
      .save {
        color: #F65860;
        cursor: pointer;
      }
    }
    .main {

      margin: 20px;
      /*background: white;*/
      min-height: calc(100vh - 140px);
      display: flex;
      justify-content: space-between;
      .content {
        /*border: 1px solid red;*/
        width: 49%;
        background: #ffffff;
        padding: 30px 0;
        .form-container {
          background: white;
          padding: 30px 0 100px;

        }
      }
      .list {
        /*border:3px solid yellow;*/
        width: 50%;
        background: #ffffff;
        .filter-container {
          padding: 0 20px;
          height: 60px;
          border-bottom: 1px solid #f2f2f2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          .left {
            color: #1B9AF7;
          }
          .right {
            color: #F65860;
            cursor: pointer;
          }
        }
      }
    }

  }
</style>
