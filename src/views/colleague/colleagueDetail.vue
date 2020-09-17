<template>
  <div class="bookDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">提交</div>
    </div>
    <div class="content">

      <el-form class="form-container" ref="postForm" label-width="100px">
        <div class="price" style="display: flex">
          <el-form-item style="margin-bottom: 40px;" prop="title" label="头像">
            <el-upload
              class="avatar-uploader"
              :http-request="UploadCoverImage"
              action=""
              :show-file-list="false">
              <div class="imgWrap" v-if="formParams.trueAvatar">
                <img :src="formParams.trueAvatar" class="avatar">
              </div>

              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item style="margin-left: 290px" prop="title" label="工号">
            <el-input
              style="width:260px;"
              v-model="formParams.account"
              placeholder="请输入工号"
            />
          </el-form-item>
        </div>

        <div class="price" style="display: flex">
          <el-form-item label="姓名">
            <el-input
              style="width:360px;"
              v-model="formParams.trueName"
              placeholder="请输入姓名"
            />
          </el-form-item>
          <el-form-item label="性别" prop="title">
            <el-select
              class="filter-item"
              style="width: 260px"
              v-model="formParams.gender"
              placeholder="请选择"
            >
              <el-option
                v-for="item in genderOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="price" style="display: flex">
          <el-form-item label="手机号">
            <el-input
              style="width:360px;"
              v-model="formParams.mobile"
              placeholder="请输入手机号"
            />
          </el-form-item>
          <el-form-item label="密码" v-if="newAdd">
            <el-input
              style="width:260px;"
              v-model="formParams.password"
              placeholder="请输入密码"
            />
          </el-form-item>
        </div>

        <div class="price" style="display: flex">
          <el-form-item label="籍贯" prop="title">
            <el-input
              style="width:360px;"
              v-model="formParams.birthplace"
              placeholder="请输入籍贯"
            />
          </el-form-item>
          <el-form-item label="学历" prop="title">
            <el-select
              class="filter-item"
              style="width: 260px"
              v-model="formParams.education"
              placeholder="请选择"
            >
              <el-option
                v-for="item in educationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="price" style="display: flex">
          <el-form-item label="邮箱">
            <el-input
              style="width:360px;"
              v-model="formParams.email"
              placeholder="请输入邮箱"
            />
          </el-form-item>
          <!--<el-form-item label="角色" prop="title">-->
          <!--<el-select-->
          <!--class="filter-item"-->
          <!--style="width: 260px"-->
          <!--v-model="formParams.role"-->
          <!--placeholder="请选择"-->
          <!--&gt;-->
          <!--<el-option-->
          <!--v-for="item in roleOptions"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value"-->
          <!--&gt;</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
        </div>
        <el-form-item label="兴趣爱好">
          <el-input
            style="width:720px;"
            v-model="formParams.hobby"
            placeholder="请输入兴趣爱好"
          />
        </el-form-item>
        <div class="price" style="display: flex">
          <el-form-item label="部门" prop="title">
            <el-cascader
              style="width: 360px"
              v-model="valueDepartmentIds"
              :options="departmentOptions"
              :props="{ expandTrigger: 'hover', checkStrictly: true, label:'name', value:'id' }"
              @change="handleChange"></el-cascader>

          </el-form-item>
          <el-form-item label="职位" prop="title">

            <el-cascader
              style="width: 260px"
              v-model="valueJobIds"
              :options="jobOptions"
              :props="{ expandTrigger: 'hover', checkStrictly: true, label:'name', value:'id' }"
            ></el-cascader>

          </el-form-item>

        </div>
        <div class="price" style="display: flex">
          <!--<el-form-item label="权限" prop="title">-->
          <!--<el-select-->
          <!--class="filter-item"-->
          <!--style="width: 360px"-->
          <!--@change="aa"-->
          <!--multiple-->
          <!--v-model="formParams.roleGroupIds"-->
          <!--placeholder="请选择"-->
          <!--&gt;-->
          <!--<el-option-->
          <!--v-for="item in roleGroupOptions"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value"-->
          <!--&gt;</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="岗位">
            <el-input
              style="width:360px;"
              v-model="formParams.job"
              placeholder="请输入岗位"
            />
          </el-form-item>

          <el-form-item label="直属上级" prop="title">
            <el-select
              filterable
              class="filter-item"
              style="width: 260px"
              v-model="formParams.parentUserId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in staffOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

        </div>
        <div class="price" style="display: flex">
          <el-form-item label="内推人" prop="title">
            <el-select
              filterable
              class="filter-item"
              style="width: 360px"
              v-model="formParams.inviteUserId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in staffOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="招聘人事" prop="title">
            <el-select
              filterable
              class="filter-item"
              style="width: 260px"
              v-model="formParams.auditionUserId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in staffOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

        </div>
        <div class="price" style="display: flex">
          <el-form-item label="入职时间">
            <el-date-picker
              style="width: 360px"
              v-model="valuePickerJoinTime"
              type="date"
              value-format="timestamp"
              @change="changePicker"
              placeholder="选择入职时间"
              default-time="12:00:00">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker
              style="width: 260px"
              v-model="valuePickerBirth"
              type="date"
              value-format="timestamp"
              @change="changePicker2"
              placeholder="选择生日时间"
              default-time="12:00:00">
            </el-date-picker>
          </el-form-item>
        </div>

        <div class="price" style="display: flex">
          <el-form-item label="银行卡号">
            <el-input
              style="width:360px;"
              v-model="formParams.bankNo"
              placeholder="请输入银行卡号"
            />
          </el-form-item>
          <el-form-item label="支付宝账户">
            <el-input
              style="width:260px;"
              v-model="formParams.alipay"
              placeholder="请输入支付宝账户"
            />
          </el-form-item>
        </div>
        <el-form-item label="简介">
          <el-input
            style="width:720px"
            type="textarea"
            :rows="2"
            v-model="formParams.intro"
            placeholder="请输入简介"
          />
        </el-form-item>


      </el-form>
    </div>

  </div>
</template>

<script>

  import {
    roleGroups,
    userStaffs,
    userDetail,
    userEdit,
  } from "../../api/user";
  import {
    departmentAll,
    departmentDetail,
    departmentEdit,
    departmentPositionEdit,
    departmentPositionRemove,
    departmentParents,
    jpParents,
    jpAll,
  } from "../../api/department.js";
  import {
    types,
  } from "@/api/settings";
  import {vipAll} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal, isMobile} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "bookDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        newAdd: true,
        departmentOptions: [],
        staffOptions: [{
          value: 0,
          label: "无"
        }],
        jobOptions: [],
        valueJobIds: [],
// 用户类型：user普通用户，teacher业务老师，official官方账号，salesman业务员，cs客服人员
        roleOptions: [
          // {
          //   value: 'user',
          //   label: '普通用户',
          // },
          {
            value: 'teacher',
            label: '业务老师',
          }, {
            value: 'official',
            label: '官方账号',
          }, {
            value: 'salesman',
            label: '业务员',
          }, {
            value: 'cs',
            label: '客服人员',
          },
        ],
        // user普通用户，teacher业务老师，official官方账号，salesman业务员，cs客服人员
        roleGroupOptions: [],
        valueDepartmentIds: [],
        genderOptions: [
          // 性别：male男, female女
          {
            value: 'male',
            label: '男',
          }, {
            value: 'female',
            label: '女',
          },
        ],
        // 学历：postdoctoral博士后、doctor博士、postgraduate研究生、bachelor本科、college大专、midCollege中专、other其他
        educationOptions: [
          // 性别：male男, female女
          {
            value: 'postdoctoral',
            label: '博士后',
          }, {
            value: 'doctor',
            label: '博士',
          }, {
            value: 'postgraduate',
            label: '研究生',
          }, {
            value: 'bachelor',
            label: '本科',
          }, {
            value: 'college',
            label: '大专',
          }, {
            value: 'midCollege',
            label: '中专',
          }, {
            value: 'other',
            label: '其他',
          },
        ],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        uploadUrl: "",//你要上传视频到你后台的地址
        tags: '',
        time: '',
        timeLimit: true,
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        formParams: {
          app: "staff",
          account: "",
          alipay: "",
          education: "",
          bankNo: "",
          auditionUserId: null,
          birthplace: "",  //籍贯
          departmentId: null,
          jobTime: null,
          birthday: null,
          email: "",
          enable: true,
          gender: "male",
          hobby: "",
          intro: "",
          inviteUserId: null,  //邀请用户ID
          jobPositionId: null,
          mobile: "",
          parentUserId: null,   //上级用户ID
          password: "",   //
          role: "",   //
          job: "",   //
          roleGroupIds: [],   //
          token: getToken(),
          trueAvatar: "",
          trueName: "",
          userId: 0,
        },
        uploadImages: [],
        loading: false,
        valuePickerJoinTime: "",
        valuePickerBirth: "",
      };
    },
    methods: {
      handleChange(value) {
        console.log(value, "valueDepartmentIds");
        let departmentId = value[value.length - 1]
        this.getUserList()
        console.log(this.departmentOptions, "this.departmentOptions");
        // this.departmentOptions.forEach((item, index) => {
        //   if (item.id === departmentId) {
        //     this.jobOptions = item.positions
        //   }
        // })
      },
      // getroleGroupIds
      roleGroups() {
        roleGroups({
          token: getToken()
        }).then(json => {
          if (json.status === 200) {
            json.data.forEach((item, index) => {
              this.roleGroupOptions.push({
                value: item.id,
                label: item.name,
              })
            })
          }
        });
      },

      // userStaffs   user/staffs获取相应部门下的员工列表
      getUserList(departmentId) {
        console.log(departmentId, "departmentId");
        userStaffs({
          departmentId: 0,
          enable: 1,
          jobLeave: 1,
          token: getToken()
        }).then(json => {
          if (json.status === 200) {
            // console.log(json.data);
            json.data.forEach((item, index) => {
              this.staffOptions.push({
                value: item.id,
                label: item.name,
              })
            })
            console.log(this.staffOptions, "this.staffOptions");
          }
        });
      },
      changePicker() {
        this.formParams.jobTime = this.valuePickerJoinTime / 1000
      },
      changePicker2() {
        this.formParams.birthday = this.valuePickerBirth / 1000
      },

      UploadCoverImage(file) {
        // console.log(111);
        const that = this
        //判断扩展名
        const tmpcnt = file.file.name.lastIndexOf(".")
        const exname = file.file.name.substring(tmpcnt + 1)
        const names = ['jpg', 'JPG', 'jpeg', 'webp', 'png', 'bmp']
        if (names.indexOf(exname) < 0) {
          this.$message.error("不支持的格式!")
          return
        }
        //定义唯一的文件名，打印出来的uid其实就是时间戳
        //client 是第一步中的 client
        // console.log(file.file);
        this.$upload(file.file.uid + "." + exname, file.file, (success, result) => {
          this.formParams.trueAvatar = result.url
        })
      },

      initData() {
        userDetail({
          targetId: this.$route.params.id,
        }).then(json => {
          if (json.status === 200) {

            this.formParams = {
              app: json.data.app.value,
              account: json.data.mobile,
              alipay: json.data.extra.alipay,
              role: json.data.role ? json.data.role.value : "",
              education: json.data.education ? json.data.education.value : "",
              bankNo: json.data.extra.bankNo,
              auditionUserId: json.data.auditionUserId,
              birthplace: json.data.extra.birthplace,
              departmentId: json.data.departmentId,
              departmentName: json.data.departmentName,
              email: json.data.extra.email,
              enable: json.data.enable,
              gender: json.data.gender.value,
              hobby: json.data.extra.hobby,
              intro: json.data.extra.intro,
              inviteUserId: json.data.inviteUserId,
              jobPositionId: json.data.jobPositionId,
              job: json.data.extra.job,
              mobile: json.data.extra.mobile,
              parentUserId: json.data.parentUserId,
              password: json.data.password,
              roleGroupIds: [],
              trueAvatar: json.data.extra.trueAvatar,
              trueName: json.data.extra.trueName,
              userId: json.data.id,
            }
            let id = json.data.departmentId
            this.getUserList(id)

            departmentParents(
              {
                targetId: id,
                token: getToken(),
              }
            ).then(json => {
              if (json.status === 200) {
                this.valueDepartmentIds = json.data
              }
            });

            jpParents({
              targetId: json.data.jobPositionId,
              token: getToken(),
            }).then(json => {
              if (json.status === 200) {
                this.valueJobIds = json.data
              }
            });

            this.valuePickerBirth = json.data.extra.birthday * 1000
            this.valuePickerJoinTime = json.data.jobTime * 1000
            if (json.data.roleGroups) {
              json.data.roleGroups.forEach((item, index) => {
                this.formParams.roleGroupIds.push(item.id)
              })
            }
            // console.log(this.formParams.roleGroupIds, "roleGroupIds");
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }
        });
      },
      departmentList() {
        departmentAll().then(json => {
          if (json.status === 200) {
            this.departmentOptions = json.data
          }
        });
      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      tagSubmitForm() {
        if (!this.formParams.trueAvatar) {
          this.$message({
            message: "请上传头像",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.account) {
          this.$message({
            message: "请输入工号",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.trueName) {
          this.$message({
            message: "请输入同事姓名",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.gender) {
          this.$message({
            message: "请选择性别",
            type: "error"
          });
          return false;
        }
        if (!isMobile(this.formParams.mobile)) {
          this.$message({
            message: "请输入正确的手机号码",
            type: "error"
          });
          return false;
        }
        if (this.newAdd) {
          if (this.formParams.password.length < 6 || this.formParams.password.length > 12) {
            this.$message({
              message: "请输入6到12位密码",
              type: "error"
            });
            return false;
          }
        }
        this.formParams.jobPositionId = this.valueJobIds[this.valueJobIds.length - 1]
        if (!this.formParams.jobPositionId) {
          this.$message({
            message: "请输入职位",
            type: "error"
          });
          return false;
        }


        if (!this.formParams.job) {
          this.$message({
            message: "请输入岗位",
            type: "error"
          });
          return false;
        }


        // if (this.formParams.roleGroupIds.length === 0) {
        //   this.$message({
        //     message: "请选择权限",
        //     type: "error"
        //   });
        //   return false;
        // }
        if (!this.formParams.intro) {
          this.$message({
            message: "请输入个人简介",
            type: "error"
          });
          return false;
        }
        this.formParams.token = getToken()
        this.formParams.jobTime = this.valuePickerJoinTime / 1000
        this.formParams.birthday = this.valuePickerBirth / 1000
        this.formParams.departmentId = this.valueDepartmentIds[this.valueDepartmentIds.length - 1]
        this.formParams.jobPositionId = this.valueJobIds[this.valueJobIds.length - 1]
        userEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            this.$router.push({
              name: "colleagueList"
            })
            this.formParams = {
              app: "staff",
              account: "",
              alipay: "",
              education: "",
              bankNo: "",
              auditionUserId: null,
              birthplace: "",  //籍贯
              departmentId: null,
              jobTime: null,
              birthday: null,
              email: "",
              enable: true,
              gender: "male",
              hobby: "",
              intro: "",
              role: "",
              inviteUserId: null,  //邀请用户ID
              jobPositionId: "",
              mobile: "",
              parentUserId: null,   //上级用户ID
              password: "",   //
              roleGroupIds: [],   //
              token: getToken(),
              trueAvatar: "",
              trueName: "",
              userId: 0,
            }
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }

        });
      },
      handleDrag() {
        // this.$refs.select.blur()
      },
      aa(value) {
        // console.log(value);
      },
      // 所有的职位列表
      jpAll() {
        jpAll().then(json => {
          if (json.status === 200) {
            this.jobOptions = json.data
          }
        });
      },

    },
    mounted() {
      this.roleGroups();
      // this.typesGet();  //原部门列表
      this.departmentList();
      this.jpAll();
      if (parseInt(this.$route.params.id) > 0) {
        this.initData();
        this.newAdd = false
        console.log(this.newAdd, "this.newAdd");
      }
    }
  };
</script>
<style>

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
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
    width: 70px;
    height: 70px;
    line-height: 70px;
    text-align: center;
  }

  .avatar {
    width: 70px;
    height: 70px;
    display: block;
  }

  .app-container .right {
    margin: 20px 0;
    text-align: right;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .bookDetail .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .bookDetail .el-textarea {
    width: 86%;
  }

  .bookDetail .time .el-form-item__content {
    margin-left: 16px !important;
  }
</style>
<style lang="scss" scoped>
  .bookDetail {
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
      background: rgba(245, 246, 250, 0.61);
      padding: 20px;
      .form-container {
        background: white;
        padding: 30px 0 100px;

      }
    }
    .imgWrap {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

  }
</style>
