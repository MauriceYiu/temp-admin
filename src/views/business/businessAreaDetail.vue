<template>
  <div class="businessDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">保存</div>
    </div>
    <div class="container">
      <el-form class="form-container" ref="postForm" label-width="154px">
        <el-form-item label="名称" required>
          <el-input
            style="width:600px;"
            v-model="formParams.name"
            maxlength="12"
            placeholder="12字以内"
          />
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input
            style="width:600px;"
            type="textarea"
            :rows="4"
            v-model="formParams.detail"
            placeholder="请输入服务内容"
          />
        </el-form-item>
        <el-form-item label="请选择领域老师">
          <el-select
            class="filter-item"
            style="width: 600px"
            v-model="formParams.teacherIds"
            multiple
            placeholder="请选择作者"
          >
            <el-option
              v-for="item in teacherOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item required label="排序">
          <el-input
            style="width:600px;"
            v-model="formParams.queue"
            maxlength="3"
            placeholder="数字越大越靠前"
          />
        </el-form-item>
        <el-form-item label="是否启用" prop="enable">
          <el-checkbox v-model="formParams.enable"></el-checkbox>
        </el-form-item>
        <!--<el-form-item>-->
        <!--<el-button-->
        <!--v-loading="loading"-->
        <!--style="margin-left: 10px;"-->
        <!--type="success"-->
        <!--@click="tagSubmitForm"-->
        <!--&gt;保存-->
        <!--</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
  </div>
</template>

<script>

  import {areaDetail, areaEdit,} from "../../api/business";
  import {userStaffs,} from "../../api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "businessDetail",
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
        infoArr: [],
        dialogImageUrl: '',
        dialogVisible: false,
        total: 0,
        page: 1,
        tableStatus: false,
        activeName: "msg",
        value: "",
        tableKey: 0,
        list: [],
        listLoading: false,
        createdTimes: 0,
        loading: false,
        dialogTableVisible: false,
        teacherOptions: [],
        formOptions: [
          {
            key: "input",
            label: "文本信息"
          },
          {
            key: "select",
            label: "选项信息"
          },
        ],
        formParams: {
          coverImage: "",
          bigImage: "",
          enable: true,
          detail: "",
          items: [
            {
              maxSelect: 1,
              name: "",
              optionsForm: [
                {
                  value: ""
                }
              ],
              options: [],
              queue: 1,
              type: "",
              unit: "",
            }
          ],
          name: "",
          price: "",
          priceFormat: "",
          queue: null,
          ratio: null,
          staffRatio: null,
          serviceId: 0,
          token: getToken(),
        },

        items: [
          {
            maxSelect: "",
            name: "",
            options: [
              {
                value: ""
              }
            ],
            queue: "",
            type: "",
            unit: "",
          }
        ],
      };
    },
    methods: {
      back() {
        this.$router.go(-1);//返回上一层
      },
      UploadCoverImage(file) {
        // console.log(111);
        const that = this
        //判断扩展名
        const tmpcnt = file.file.name.lastIndexOf(".")
        const exname = file.file.name.substring(tmpcnt + 1)
        const names = ['jpg', 'jpeg', 'webp', 'png', 'bmp']
        if (names.indexOf(exname) < 0) {
          this.$message.error("不支持的格式!")
          return
        }
        //定义唯一的文件名，打印出来的uid其实就是时间戳
        //client 是第一步中的 client
        // console.log(file.file);
        this.$upload(file.file.uid + "." + exname, file.file, (success, result) => {
          this.formParams.coverImage = result.url
        })
      },
      UploadCoverBigImage(file) {
        // console.log(111);
        const that = this
        //判断扩展名
        const tmpcnt = file.file.name.lastIndexOf(".")
        const exname = file.file.name.substring(tmpcnt + 1)
        const names = ['jpg', 'jpeg', 'webp', 'png', 'bmp']
        if (names.indexOf(exname) < 0) {
          this.$message.error("不支持的格式!")
          return
        }
        //定义唯一的文件名，打印出来的uid其实就是时间戳
        //client 是第一步中的 client
        console.log(file.file,"1111");
        this.$upload(file.file.uid + "." + exname, file.file, (success, result) => {
          this.formParams.bigImage = result.url
        })
      },
      tagTypeChange(value) {
        this.formParams.items.type = value;
      },
      itemDel(index) {
        this.formParams.items.splice(index, 1)
      },
      addOption(option, arr) {
        arr.push({
          value: ""
        });
      },
      delOption(option, arr) {
        arr.splice(option, 1)
      },
      //第三步添加问题
      addInfo() {
        this.formParams.items.push({
          maxSelect: "",
          name: "",
          optionsForm: [
            {
              value: ""
            }
          ],
          options: [],
          queue: "",
          type: "",
          unit: "",
        });
      },
      initData() {
        areaDetail({
          targetId: this.$route.params.id,
          token: getToken()
        }).then(json => {
          if (json.status === 200) {
            this.formParams.serviceId = json.data.id;
            this.formParams.name = json.data.name;
            // this.formParams.coverImage = json.data.coverImage;
            // this.formParams.bigImage = json.data.bigImage;
            this.formParams.enable = json.data.enable;
            this.formParams.detail = json.data.detail;
            // this.formParams.priceFormat = showDecimal(json.data.price);
            // this.formParams.ratio = json.data.ratio;
            // this.formParams.staffRatio = json.data.staffRatio;
            this.formParams.queue = json.data.queue;
            // json.data.items.forEach((item, index) => {
            //   item.type = item.type.value;
            //   item.optionsForm = [];
            //   item.options.forEach((o, idx) => {
            //     item.optionsForm.push({
            //       value: o
            //     });
            //   });
            // });
            // this.formParams.items = json.data.items;
            if (json.data.teachers) {
              json.data.teachers.forEach((t, i) => {
                this.formParams.teacherIds.push(t.id);
              });
            }
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
        if (!this.formParams.name) {
          this.$message({
            message: "请输入名称",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.detail) {
          this.$message({
            message: "请输入内容",
            type: "error"
          });
          return false;
        }
        
        if (!this.formParams.queue) {
          this.$message({
            message: "请输入排序",
            type: "error"
          });
          return false;
        }

        this.loading = true;
        let {detail,enable,name,queue,serviceId:serviceAreaId,teacherIds,token} = this.formParams
        let data = {detail,enable,name,queue,serviceAreaId,teacherIds,token}
        console.log(this.formParams);
        console.log(data);
        areaEdit(data).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });

            this.dialogTableVisible = false;
            this.$router.push({
              name: "businessArea"
            })
            this.formParams = {
              coverImage: "",
              enable: true,
              detail: "",
              items: [
                {
                  maxSelect: "",
                  name: "",
                  options: [
                    {
                      value: ""
                    }
                  ],
                  queue: "",
                  type: "",
                  unit: "",
                }
              ],
              name: "",
              price: "",
              priceFormat: "",
              queue: null,
              ratio: null,
              staffRatio: null,
              serviceId: 0,
            }
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }

        });
      },
      handleDrag() {
        // this.$refs.select.blur()
      },
      loadStaffs() {
        userStaffs(
          {
            role: 'teacher',
            enable: 1,
            jobLeave: 1,
            token: getToken(),
          }
        ).then(json => {
          if (json.status === 200) {
            json.data.forEach((item, index) => {
              this.teacherOptions.push({
                key: item.id,
                label: item.name
              })
            })
          }
        });
      }
    },
    mounted() {
      this.loadStaffs();
      if (parseInt(this.$route.params.id) > 0) {
        this.initData();
      }
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
  .businessDetail {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
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
    .container {
      background: #ffffff;
      padding-top: 20px;
      margin: 20px 20px 0;
      display: flex;
      min-height: 100vh;
    }

    .filter-container {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
    }

    .hiderow {
      visibility: hidden;
    }

    .el-table__expand-column {
      .cell {
        display: none;
      }
    }

    .logo {
      width: 60px;
    }

    .paginationBox {
      text-align: right;
      margin-top: 60px;
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
