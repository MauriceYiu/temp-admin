<template>
  <div class="pkDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">保存</div>
    </div>
    <div class="content">
      <el-form class="form-container" ref="postForm" label-width="154px">
        <el-form-item label="PK项目">
          <el-input
            style="width:600px;"
            v-model="formParams.title"
            maxlength="12"
            placeholder="请输入项目名称"
          />
        </el-form-item>
        <el-form-item label="PK规则">
          <el-input
            style="width:600px;"
            type="textarea"
            :rows="4"
            v-model="formParams.rule"
            placeholder="请输入规则"
          />
        </el-form-item>
        <el-form-item label="PK筹码">
          <el-input
            style="width:600px;"
            v-model="formParams.reward"
            placeholder="请输入PK筹码"
          />
        </el-form-item>
        <el-form-item label="PK类型">

          <el-radio-group v-model="radio" @change="changeRadio">
            <el-radio :label="1">个人协议</el-radio>
            <el-radio :label="2">团队协议</el-radio>
          </el-radio-group>


          <!--<el-select-->
          <!--class="filter-item"-->
          <!--style="width:600px;"-->
          <!--v-model="formParams.type"-->
          <!--placeholder="请选择类型"-->
          <!--&gt;-->
          <!--<el-option-->
          <!--v-for="item in typeOptions"-->
          <!--:key="item.key"-->
          <!--:label="item.name"-->
          <!--:value="item.key"-->
          <!--&gt;</el-option>-->
          <!--</el-select>-->

        </el-form-item>
        <div class="personal" v-if="radio === 1">
          <el-form-item label="PK甲方">
            <el-select
              filterable
              class="filter-item"
              style="width:600px;"
              v-model="valuePersonalIds1"
              placeholder="请选择"
            >
              <el-option
                v-for="item in staffOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <!--<el-cascader-->
          <!--style="width:600px;"-->
          <!--placeholder="请选择"-->
          <!--v-model="valuePersonalIds1"-->
          <!--:options="staffOptions"-->
          <!--:props="{ expandTrigger: 'hover', checkStrictly: true, label:'name', value:'id' }"-->
          <!--@change="handleChange1"></el-cascader>-->
          <!--</el-form-item>-->

          <el-form-item label="PK乙方">
            <el-select
              filterable
              class="filter-item"
              style="width:600px;"
              v-model="valuePersonalIds2"
              placeholder="请选择"
            >
              <el-option
                v-for="item in staffOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>

            <!--<el-cascader-->
            <!--style="width:600px;"-->
            <!--placeholder="请选择"-->
            <!--v-model="valuePersonalIds2"-->
            <!--:options="staffOptions"-->
            <!--:props="{ expandTrigger: 'hover', checkStrictly: true, label:'name', value:'id' }"-->
            <!--@change="handleChange2"></el-cascader>-->

          </el-form-item>
        </div>
        <div class="personal" v-if="radio === 2">
          <el-form-item label="PK甲方">
            <el-cascader
              style="width:600px;"
              placeholder="请选择部门"
              v-model="valueDepartmentIds1"
              :options="departmentOptions"
              :props="{ expandTrigger: 'hover', checkStrictly: true, label:'name', value:'id' }"
            ></el-cascader>
          </el-form-item>

          <el-form-item label="PK乙方">
            <el-cascader
              style="width:600px;"
              placeholder="请选择部门"
              v-model="valueDepartmentIds2"
              :options="departmentOptions"
              :props="{ expandTrigger: 'hover', checkStrictly: true, label:'name', value:'id' }"
            ></el-cascader>

          </el-form-item>
        </div>


        <!--<el-form-item label="是否启用" prop="enable">-->
        <!--<el-checkbox v-model="formParams.enable"></el-checkbox>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
  </div>
</template>

<script>

  import {
    pkEdit,
    pkDetail,
  } from "../../api/business";
  import {
    departmentAll,
    departmentParents,
  } from "../../api/department.js";
  import {userStaffs,} from "@/api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "pkDetail",
    directives: {
      waves,
      elDragDialog
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        total: 0,
        page: 1,
        valuePersonalIds1: null,
        valuePersonalIds2: null,
        valueDepartmentIds1: [],
        valueDepartmentIds2: [],
        tableKey: 0,
        list: [],
        departmentOptions: [],
        staffOptions: [],
        radio: 1,
        listLoading: false,
        loading: false,
        formParams: {
          fromId: 0,    //发起方
          pkId: 0,
          reward: "",
          rule: "",
          title: "",
          toId: 0,   //挑战方
          type: "single",
          token: getToken(),
        },
      };
    },
    methods: {
      back() {
        this.$router.go(-1);//返回上一层
      },
      changeRadio(value) {
        switch (this.radio) {
          case  1:
            this.formParams.type = "single"
            this.getUserList()
            break;
          case  2:
            this.formParams.type = "team"
            this.departmentList()
            break;
        }
      },
      //取部门列表
      departmentList() {
        departmentAll().then(json => {
          if (json.status === 200) {
            this.departmentOptions = json.data
          }
        });
      },


      //取得员工列表
      getUserList() {
        userStaffs({
          enable: 1,
          jobLeave: 1,
          token: getToken()
        }).then(json => {
          if (json.status === 200) {
            this.staffOptions = json.data
          }
        });
      },
      initData() {
        pkDetail({
          targetId: this.$route.params.id,
        }).then(json => {
          if (json.status === 200) {

            this.formParams.pkId = json.data.id;
            this.formParams.reward = json.data.reward;
            this.formParams.rule = json.data.rule;
            this.formParams.title = json.data.title;
            this.formParams.type = json.data.type.value;
            if (json.data.type.value === 'single') {
              this.valuePersonalIds1 = json.data.fromId
              this.valuePersonalIds2 = json.data.toId

            }
            if (json.data.type.value === 'team') {

              departmentParents(
                {
                  targetId: json.data.fromId,
                  token: getToken(),
                }
              ).then(json => {
                if (json.status === 200) {
                  this.valueDepartmentIds1 = json.data
                }
              });

              departmentParents(
                {
                  targetId: json.data.toId,
                  token: getToken(),
                }
              ).then(json => {
                if (json.status === 200) {
                  this.valueDepartmentIds2 = json.data
                }
              });
            }
            this.formParams.fromId = json.data.fromId;
            this.formParams.toId = json.data.toId;

          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }
        });
      },

      tagSubmitForm() {
        console.log(this.formParams);
        if (!this.formParams.title) {
          this.$message({
            message: "请输入项目名称",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.rule) {
          this.$message({
            message: "请输入规则",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.reward) {
          this.$message({
            message: "请输入PK筹码",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.type) {
          this.$message({
            message: "请选择PK类型",
            type: "error"
          });
          return false;
        }

        switch (this.formParams.type) {
          case 'single':
            this.formParams.fromId  = this.valuePersonalIds1
            this.formParams.toId  = this.valuePersonalIds2
            break;
          case 'team':
            this.formParams.fromId  = this.valueDepartmentIds1[this.valueDepartmentIds1.length-1]
            this.formParams.toId  = this.valueDepartmentIds2[this.valueDepartmentIds2.length-1]
            break;
        }

        if (!this.formParams.fromId) {
          this.$message({
            message: "请选择PK发起方",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.toId) {
          this.$message({
            message: "请选择PK挑战方",
            type: "error"
          });
          return false;
        }


        if (this.formParams.fromId === this.formParams.toId) {
          this.$message({
            message: "PK甲方和PK乙方不能相同，重新选择",
            type: "error"
          });
          return false;
        }


        this.loading = true;
        pkEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });

            this.$router.push({
              name: "PKlist"
            })
            this.formParams = {
              fromId: 0,    //发起方
              pkId: 0,
              reward: "",
              rule: "",
              title: "",
              toId: 0,   //挑战方
              type: "single",
              token: getToken(),
            }
          } else {

          }

        })
      },
      handleDrag() {
        // this.$refs.select.blur()
      },

    },
    mounted() {
      // console.log(this.$route.params.id);
      if (parseInt(this.$route.params.id) > 0) {
        this.initData();
      }

      if (this.$route.params.type === 'single') {
        this.radio = 1
      } else {
        this.radio = 2
      }
      this.formParams.type = this.$route.params.type;
      console.log(this.formParams.type,"this.formParams.type");

      this.getUserList();
      this.departmentList()
    }
  };
</script>
<style>
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
</style>
<style lang="scss" scoped>
  .pkDetail {
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
      /*background: rgba(245, 246, 250, 0.61);*/
      margin: 20px;
      background: white;
      min-height: calc(100vh - 140px);
      .form-container {
        background: white;
        padding: 30px 0 100px;

      }
    }

    .imbox {
      display: flex;
      justify-content: center;
      .imgWrap {
        margin-right: 6px;
        img {
          width: 60px;
        }
      }
      .imgWrap:last-child {
        margin-right: 0;
      }
    }
  }
</style>
