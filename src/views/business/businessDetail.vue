<template>
  <div class="businessDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">保存</div>
    </div>
    <div class="container">
      <el-form class="form-container" ref="postForm" label-width="154px">
        <el-form-item label="业务名称" required>
          <el-input
            style="width:600px;"
            v-model="formParams.name"
            maxlength="12"
            placeholder="12字以内"
          />
        </el-form-item>
        <el-form-item label="业务价格" required>
          <el-input
            style="width:600px;"
            type="number"
            v-model="formParams.priceFormat"
            placeholder="请输入业务价格"
          />
        </el-form-item>
        <el-form-item label="分成比例" required>
          <el-input
            style="width:600px;"
            type="number"
            v-model="formParams.ratio"
            placeholder="请输入业务老师分成比例"
          /> %
        </el-form-item>
        <el-form-item label="销售分成" required>
          <el-input
            style="width:600px;"
            type="number"
            v-model="formParams.staffRatio"
            placeholder="请输入业务销售分成比例"
          /> %
        </el-form-item>
        <el-form-item label="服务内容" required>
           <el-input
            style="width:600px;"
            type="textarea"
            :rows="4"
            v-model="formParams.intro"
            placeholder="请输入服务内容"
          />
          <!--<Tinymce1 v-model="formParams.intro"/>-->
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" prop="title" label="合同背景图">
          <el-upload
            class="avatar-uploader"
            :http-request="UploadContractImage"
            action=""
            :show-file-list="false">
            <img v-if="formParams.contractImage" :src="formParams.contractImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" prop="title" label="封面图">
          <el-upload
            class="avatar-uploader"
            :http-request="UploadCoverImage"
            action=""
            :show-file-list="false">
            <img v-if="formParams.coverImage" :src="formParams.coverImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item style="margin-bottom: 40px;" prop="title" label="业务大图">
          <el-upload
            class="avatar-uploader"
            :http-request="UploadCoverBigImage"
            action=""
            :show-file-list="false">
            <img v-if="formParams.bigImage" :src="formParams.bigImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="指导老师">
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
        <!-- 2020.5.5 start -->
        <el-form-item label="领域选择">
          <el-select
            class="filter-item"
            style="width: 600px"
            v-model="formParams.areaIds"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in areaOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 2020.5.5 end -->
        <el-form-item required label="排序">
          <el-input
            style="width:600px;"
            v-model="formParams.queue"
            maxlength="3"
            placeholder="数字越大越靠前"
          />
        </el-form-item>

        <el-form-item prop="title" label="提交信息" required>
          <div class="information">


            <div class="informationWrap" v-for="(item,index) in formParams.items" :key="index">
              <div class="infoContent">
                <div class="question_text">
                  <label>资料{{index+1}}</label>
                  <span v-if="index>0" @click="itemDel(index)"
                        style="color: red;margin-left: 20px;cursor: pointer;">删除</span>

                  <el-form class="form-container" ref="postForm" label-width="120px">

                    <el-form-item label="信息类型" required style="margin-bottom: 10px">
                      <el-select
                        class="filter-item"
                        style="width:300px;"
                        v-model="item.type"
                        placeholder="请选择信息类型"
                        @change="tagTypeChange"
                      >
                        <el-option
                          v-for="option in formOptions"
                          :key="option.key"
                          :label="option.label"
                          :value="option.key"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <!--//选择的文本信息-->
                    <div class="textType" v-if="item.type=='input'">
                      <el-form-item label="文本名称" required style="margin-bottom: 10px">
                        <el-input
                          maxlength="10"
                          minlength="2"
                          style="width:300px;"
                          v-model="item.name"
                          placeholder="请输入文本名称，2到10字"
                        />
                      </el-form-item>
                      <el-form-item label="文本单位" style="margin-bottom: 10px">
                        <el-input
                          maxlength="4"
                          minlength="1"
                          style="width:300px;"
                          v-model="item.unit"
                          placeholder="请输入文本单位，1到4字"
                        />
                      </el-form-item>
                      <el-form-item label="排序" required style="margin-bottom: 10px">
                        <el-input
                          type="number"
                          style="width:300px;"
                          v-model="item.queue"
                          placeholder="数字越大越靠前"
                        />
                      </el-form-item>
                    </div>

                    <!--//选择的选项信息-->
                    <div class="textType" v-if="item.type=='select'" style="margin-bottom: 10px">
                      <el-form-item label="选项名称" required style="margin-bottom: 10px">
                        <el-input
                          maxlength="10"
                          minlength="2"
                          style="width:300px;"
                          v-model="item.name"
                          placeholder="请输入选项名称，2到10字"
                        />
                      </el-form-item>
                      <el-form-item label="可选个数" required style="margin-bottom: 10px">
                        <el-input
                          maxlength="4"
                          minlength="1"
                          type="number"
                          style="width:300px;"
                          v-model="item.maxSelect"
                          placeholder="请输入选项可选个数"
                        />
                      </el-form-item>
                      <el-form-item label="排序" required style="margin-bottom: 10px">
                        <el-input
                          type="number"
                          style="width:300px;"
                          v-model="item.queue"
                          placeholder="数字越大越靠前"
                        />
                      </el-form-item>
                      <div class="optionArr" v-for="(o,i) in item.optionsForm" :key="i">
                        <el-form-item required label="选项内容" style="margin-bottom: 10px">
                          <label>{{i+1}}</label>
                          <el-input
                            style="width:300px;"
                            v-model="o.value"
                            placeholder="请输入选项内容，1到10个字"
                          />
                          <el-button icon="el-icon-plus" style="margin-left: 10px;" type="text"
                                     @click="addOption(o.value,item.optionsForm)">增加
                          </el-button>
                          <el-button style="margin-left: 10px;color: red" type="text"
                                     v-if="i>0"
                                     @click="delOption(i,item.optionsForm)">删除
                          </el-button>
                        </el-form-item>
                      </div>

                    </div>


                  </el-form>
                </div>

              </div>
            </div>
            <el-button icon="el-icon-plus" style="margin-left: 10px;" type="text"
                       @click="addInfo">增加
            </el-button>

          </div>
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

  import {serviceDetail, serviceEdit,areaList} from "../../api/business";
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
        TinymceId: "",
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
        teacherOptions: [],//教师
        areaOptions: [],//领域
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
          contractImage: "",
          enable: true,
          intro: "",
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
      UploadContractImage(file) {
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
          this.formParams.contractImage = result.url
        })
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
        serviceDetail({
          targetId: this.$route.params.id,
          token: getToken()
        }).then(json => {
          if (json.status === 200) {
            this.formParams.serviceId = json.data.id;
            this.formParams.name = json.data.name;
            this.formParams.coverImage = json.data.coverImage;
            this.formParams.bigImage = json.data.bigImage;
            this.formParams.contractImage = json.data.contractImage;
            this.formParams.enable = json.data.enable;
            this.formParams.intro = json.data.intro;
            this.formParams.priceFormat = showDecimal(json.data.price);
            this.formParams.ratio = json.data.ratio;
            this.formParams.staffRatio = json.data.staffRatio;
            this.formParams.queue = json.data.queue;
            json.data.items.forEach((item, index) => {
              item.type = item.type.value;
              item.optionsForm = [];
              item.options.forEach((o, idx) => {
                item.optionsForm.push({
                  value: o
                });
              });
            });
            this.formParams.items = json.data.items;
            if (json.data.teachers) {
              json.data.teachers.forEach((t, i) => {
                this.formParams.teacherIds.push(t.id);
              });
            }
            if (json.data.areas) {
              json.data.areas.forEach((t, i) => {
                this.formParams.areaIds.push(t.id);
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
            message: "请输入业务名称",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.priceFormat) {
          this.$message({
            message: "请输入业务价格",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.ratio) {
          this.$message({
            message: "请输入分成比例",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.staffRatio) {
          this.$message({
            message: "请输入销售分成比例",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.intro) {
          this.$message({
            message: "请输入服务内容",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.coverImage) {
          this.$message({
            message: "请上传封面图",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.bigImage) {
          this.$message({
            message: "请上传业务大图",
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
        let itemsArr = this.formParams.items;
        for (let i = 0; i < itemsArr.length; i++) {
          if (!itemsArr[i].type) {
            this.$message({
              message: "请选择信息类型",
              type: "error"
            });
            return false;
          }
          switch (itemsArr[i].type) {
            case 'input':
              if (!itemsArr[i].name) {
                this.$message({
                  message: "请输入文本名称",
                  type: "error"
                });
                return false;
              }
              // if (!itemsArr[i].unit) {
              //   this.$message({
              //     message: "请输入文本单位",
              //     type: "error"
              //   });
              //   return false;
              // }
              break;
            case 'select':
              if (!itemsArr[i].name) {
                this.$message({
                  message: "请输入选项名称",
                  type: "error"
                });
                return false;
              }
              itemsArr[i].options = [];
              itemsArr[i].optionsForm.forEach((o, idx) => {
                if (o.value && itemsArr[i].options.indexOf(o.value) === -1) {
                  itemsArr[i].options.push(o.value);
                }
              });
              if (itemsArr[i].options.length === 0) {
                this.$message({
                  message: "请至少输入一个选项内容",
                  type: "error"
                });
                return false;
              }
              console.log(itemsArr[i].options);
              if (itemsArr[i].maxSelect > itemsArr[i].options.length) {
                this.$message({
                  message: "可选个数不能大于选项总数",
                  type: "error"
                });
                return false;
              }
              break;
          }
        }

        this.loading = true;
        this.formParams.price = this.formParams.priceFormat * 100;
        console.log(this.formParams);
        serviceEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });

            this.dialogTableVisible = false;
            this.$router.push({
              name: "businessProduct"
            })
            this.formParams = {
              coverImage: "",
              enable: true,
              intro: "",
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
      },
      loadAreaOptions() {
        areaList({enable:1}).then(json => {
          if (json.status === 200) {
            json.data.forEach((item, index) => {
              this.areaOptions.push({
                key: item.id,
                label: item.name
              })
            })
            console.log(this.areaOptions)
          }
        });
      }
    },
    mounted() {
      this.loadStaffs();
      this.loadAreaOptions();
      if (parseInt(this.$route.params.id) > 0) {
        this.initData();
      }
      this.TinymceId = this.$route.params.id;
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
