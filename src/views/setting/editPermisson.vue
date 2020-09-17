<template>
  <div class="editPermisson">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="submitRoles">保存</div>
    </div>
    <div class="content">
      <div class="left">
        <el-form ref="form" :model="form" label-width="140px">
          <el-form-item label="权限组名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="权限组描述">
            <el-input
              v-model="form.detail"
              :autosize="{ minRows: 4, maxRows: 10}"
              type='textarea'>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <el-tree
          ref="tree"
          :props="props"
          :default-expanded-keys="form.roles"
          :data="roleData"
          check-strictly
          node-key="id"
          show-checkbox
        ></el-tree>
      </div>
    </div>

    <!--<div class="btnBox">-->
      <!--<el-button @click="submitRoles" type="primary">保存</el-button>-->
    <!--</div>-->
  </div>
</template>


<script>
  import {allRoles,roleDetail,roleEdit} from "../../api/settings.js";
  import {getToken} from "@/utils/auth";

  export default {
    name: "editPermisson",
    data() {
      return {
        name: "",
        uploadAction: window.API_BASE_URI + "/api/v1/file/upload",
        roleData: [
          {
            name: "全部",
            id: 1,
            actions: []
          }
        ],
        props: {
          label: "name",
          children: "actions",
          // disabled: 'must'
        },
        params: {
          targetId: "",
          token: getToken()
        },
        checkAll: false,
        checkedCities: [],
        isIndeterminate: true,
        form: {
          detail: "", //
          enable: true, //
          logo: "", //
          name: "", //
          parentId: 0, //
          queue: "",
          roleGroupId:"" , //
          roles: [],
          token: getToken()
        }
      };
    },
    methods: {
      handleSuccess(res) {
        this.form.logo = res.data;
      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      beforeUpload(file) {
        const extension = file.type === "image/jpeg";
        const extension2 = file.type === "image/png";
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!(extension || extension2)) {
          this.$message.error("上传图片只能是 JPG|PNG 格式!");
          return false;
        }
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过 2MB!");
          return false;
        }
      },
      //权限组添加或编辑
      submitRoles() {
        if (this.vails()) {
          let checkedKeys = this.$refs.tree.getCheckedKeys();
          console.log(checkedKeys,"checkedKeys");
          let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
          console.log(halfCheckedKeys,"halfCheckedKeys");
          if (checkedKeys.length === 0) {
            this.$message.error("请选择权限组权限明细");
            return false;
          }
          this.form.roles = checkedKeys.concat(halfCheckedKeys);
          console.log(this.form.roles,"this.form.roles");
          roleEdit(this.form).then(json => {
            if (json.status === 200) {
              this.$message.success(json.message);
              this.$router.go(-1)

            } else {

            }
          });
        }
      },

      vails() {
        if (!this.form.name) {
          this.$message.error("请输入角色名称");
          return false;
        }
        // if (!this.form.detail) {
        //   this.$message.error("请输入权限组描述");
        //   return false;
        // }
        if (!this.form.detail) {
          this.$message.error("请输入角色描述");
          return false;
        }
        return true;
      },

      //权限列表
      getDetails() {
        if(this.$route.params.id){
          this.params.targetId = this.$route.params.id;
          roleDetail(this.params).then(json => {
            if (json.status === 200) {
              this.name = json.data.name;
              this.form = {
                detail: json.data.detail,
                enable: json.data.enable,
                logo: json.data.logo,
                name: json.data.name,
                parentId: json.data.parentId,
                queue: json.data.queue,
                roleGroupId: json.data.id,
                roles: json.data.roles,
                token: getToken()
              };

              this.$refs.tree.setCheckedKeys(json.data.roles);
            } else {
              this.$message.error(json.message);
            }
          });
        }
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
      }
    },
    mounted() {
      this.form.roleGroupId = this.$route.params.id
      this.getList();
    }
  };
</script>


<style lang="scss" scoped>
  .editPermisson {
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
    .content {
      margin: 20px;
      background: white;
      min-height: calc(100vh - 140px);
      display: flex;
      .left {
        width: 46%;
        padding-top: 40px;
        /*border: 1px solid red;*/
        .form-container {
          background: white;
          padding: 30px 0 100px;

        }
      }
      .right {
        padding-top: 40px;
        background: #ffffff;
        width: 40%;
        margin-left: 140px;
        /*border: 1px solid greenyellow;*/
      }
    }
    .btnBox {
     margin-left: 300px;
      width: 100%;
      padding: 1rem 0;
      background: #fff;
    }
    h3 {
      font-size: 22px;
      color: #101010;
      font-weight: 400;
      margin-bottom: 1rem;
    }
    .defaultBtn {
      color: #409eff;
    }
  }
</style>
