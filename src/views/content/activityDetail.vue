<template>
  <div class="activityDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">提交</div>
    </div>
    <div class="content">

      <el-form class="form-container" ref="postForm" label-width="100px">
        <div class="imgsWrap" style="display: flex">
          <el-form-item style="margin-bottom: 40px;" prop="title" label="上传封面">
            <el-upload
              class="avatar-uploader"
              :http-request="UploadCoverImage"
              action=""
              :show-file-list="false">
              <img v-if="formParams.coverImage" :src="formParams.coverImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item style="margin-left:200px;" prop="title" label="主办单位">
            <el-upload
              :http-request="Upload"
              action=""
              list-type="picture-card"
              :file-list="uploadImages"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </div>

        <el-form-item label="标题">
          <el-input
            style="width:700px;"
            v-model="formParams.title"
            placeholder="请输入标题"
          />
        </el-form-item>
        <el-form-item label="活动简介">
          <el-input
            style="width:700px"
            type="textarea"
            :rows="2"
            v-model="formParams.intro"
            placeholder="请输入活动简介"
          />
        </el-form-item>
        <el-form-item label="签到时间">
          <el-date-picker
            style="width: 700px"
            v-model="valuePicker_sign"
            type="datetime"
            value-format="timestamp"
            @change="changePicker_sign"
            placeholder="选择签到时间"
            :picker-options="pickerOptions0"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            v-model="pickerValue"
            type="datetimerange"
            @change='changePicker()'
            :picker-options="pickerOptions2"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动地址">
          <el-button @click="addAddress" type="text" class="add">选择地址</el-button>
          <br>
          <el-input v-if="formParams.address"
                    style="width: 700px" v-model="formParams.address"></el-input>
        </el-form-item>
        <el-form-item label="主讲老师">
          <el-select style="width: 400px" v-model="formParams.masterId" filterable placeholder="请选择"
                     >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="price" style="display: flex">
          <el-form-item label="预约费用" prop="title">
            <el-input
              type="number"
              style="width:200px;"
              v-model="formParams.priceFormat"
              placeholder="请输入金额"
            />

          </el-form-item>
          <el-form-item label="邀请嘉宾">
            <el-select style="width: 400px" v-model="formParams.teacherIds" filterable multiple placeholder="请选择"
                       @change="changeOption">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="总预约人数">
          <el-input
            style="width: 700px"
            type="number"
            v-model="formParams.totalUser"
            placeholder="请输入总预约人数"
          />
        </el-form-item>

        <el-form-item label="活动内容">
          <Tinymce1 id="Tinymce1" v-model="formParams.content" :height="400" :width="100"/>
        </el-form-item>
      </el-form>

    </div>
    <qqmap v-if="dialogMapVisible" @changeVisible="showMap"
           @setLoaction="setLoaction"
           :latitude="formParams.latitude"
           :province="formParams.province"
           :city="formParams.city"
           :longitude="formParams.longitude" :address="formParams.address" :dialogMapVisible="dialogMapVisible"/>

  </div>
</template>

<script>

  import {
    activityEdit,
    activityDetail,
    atcAll,
  } from "../../api/content";
  import {vipAll} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import qqmap from "@/components/qqmap/index";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "activityDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      qqmap,
      Tinymce1
    },
    data() {
      return {
        valuePicker_sign: '',  //签到时间
        pickerValue: '', //活动时间
        dialogMapVisible: false,
        uploadImages: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        options: [],
        uploadUrl: "",//你要上传视频到你后台的地址
        videoFlag: false, //是否显示进度条
        videoUploadPercent: "", //进度条的进度，
        isShowUploadVideo: false, //显示上传按钮
        onDiscounts: false, //默认不开启优惠
        tags: '',
        time: '',
        timeLimit: true,
        dynamicTags: [],
        vipOptions: [],
        inputVisible: false,
        inputValue: '',
        formParams: {
          activityId: 0,
          address: "",
          city: "",
          companies: [],
          content: "",  //活动详情
          coverImage: "",
          endTime: 0,  //活动结束时间
          intro: "",  //活动简介
          latitude: 0,
          longitude: 0,
          price: 0,
          priceFormat: null,
          province: "",
          signStartTime: 0,  //签到开始时间
          startTime: 0,  //活动开始时间
          masterId: null,  //主讲老师ID
          teacherIds: [],  //讲师列表
          title: "",
          token: getToken(),
          totalUser: null  //总预约人数
        },
        loading: false,
        valuePicker: "",
      };
    },
    methods: {
      addAddress() {
        this.dialogMapVisible = true;
      },
      showMap() {
        this.dialogMapVisible = !this.dialogMapVisible
      },
      setLoaction(data) {
        if (data) {
          console.log(data,"11111111");
          this.formParams.address = data.address
          this.formParams.city = "成都"
          this.formParams.province="四川"
          this.formParams.latitude = data.lat
          this.formParams.longitude = data.lng
          // let areaIdObj = cityUtil.getProvinceCityAreaId(
          //   data.addObj.province,
          //   data.addObj.city,
          //   data.addObj.district
          // )
          // this.formParams.areaId = areaIdObj.aId;
          this.dialogMapVisible = false
        } else {
          this.$message.error('请选择地址')
        }
      },
      changeOption(value) {
        // console.log(value);
        // console.log(this.formParams.teacherIds)
      },
      //选定活动日期
      changePicker() {
        if (this.pickerValue) {
          this.formParams.startTime = this.pickerValue[0] / 1000;
          this.formParams.endTime = this.pickerValue[1] / 1000;
        } else {
          this.formParams.startTime = ''
          this.formParams.endTime = ''
        }
      },
      //选定簽到日期
      changePicker_sign(){
        this.formParams.signStartTime = this.valuePicker_sign / 1000;
      },
      vipChange(value) {
        this.formParams.vipId = value;
      },
      //取得vip 等级列表
      getVipList() {
        vipAll().then(json => {
          if (json.status === 200) {
            json.data.forEach((item, index) => {
              this.vipOptions.push({
                key: item.id,
                label: item.name
              })
            })
          } else {

          }
        });
      },
      showInput() {
        if (this.formParams.tags.length < 5) {
          this.inputVisible = true;
          this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
          });
        } else {
          this.inputVisible = false;
        }

      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.formParams.tags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
        console.log(this.formParams.tags);
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList,"on-remove");
        this.uploadImages = fileList
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
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
          this.formParams.coverImage = result.url
        })
      },
      UploadFile(file) {
        // console.log(111);
        const that = this
        //判断扩展名
        const tmpcnt = file.file.name.lastIndexOf(".")
        const exname = file.file.name.substring(tmpcnt + 1)
        // 匹配 视频
        // var videolist = ['mp4', 'm2v', 'mkv'];
        // 匹配 音频
        // var radiolist = ['mp3', 'wav', 'wmv']
        // const names = ['video', 'mp4','mp3', 'avi', 'flv', 'wmv']
        let names = [];
        switch (this.formParams.attachmentType) {
          case "audio":
            names = ['mp3', 'wav', 'wmv'];
            break;
          case "video":
            names = ['mp4', 'm2v', 'MP4', 'mpg', 'avi', 'mkv'];
            break;
        }
        console.log(exname);
        if (names.indexOf(exname) < 0) {
          this.$message.error("不支持的格式!")
          return
        }
        //定义唯一的文件名，打印出来的uid其实就是时间戳
        //client 是第一步中的 client
        this.$upload(file.file.uid + "." + exname, file.file, (success, result) => {
          console.log(result.url, "result.url");
          this.formParams.attachmentUrl = result.url
        })
      },

      Uploadpicture(file) {
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
          this.formParams.picture = result.url
        })
      },
      Upload(file) {
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
          this.uploadImages.push({
            name: file.file.name,
            url: result.url
          });
        })
      },
      initData() {
        activityDetail({
          targetId: this.$route.params.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.formParams.address = json.data.address;
            this.formParams.activityId = json.data.id;
            this.formParams.city = json.data.city;
            this.uploadImages = [];
            json.data.companies.forEach((image, index) => {
              this.uploadImages.push({
                name: index,
                url: image
              });
            });

            this.formParams.content = json.data.content;
            this.formParams.coverImage = json.data.coverImage;
            this.formParams.datingEndTime = json.data.datingEndTime;
            this.formParams.datingStartTime = json.data.datingStartTime;
            this.formParams.endTime = json.data.endTime;
            this.formParams.startTime = json.data.startTime;
            this.formParams.intro = json.data.intro;
            this.formParams.latitude = json.data.latitude;
            this.formParams.longitude = json.data.longitude;
            this.formParams.priceFormat = json.data.price/100;
            this.formParams.province = json.data.province;
            this.formParams.masterId = json.data.master.id;
            this.formParams.remark = json.data.remark;
            this.formParams.title = json.data.title;
            json.data.teachers.forEach((item,index)=>{
              this.formParams.teacherIds.push(item.id)
            })
            this.formParams.totalUser = json.data.totalUser;
            this.pickerValue = [json.data.startTime * 1000,json.data.endTime * 1000]
            this.valuePicker_sign = json.data.signStartTime * 1000
            this.formParams.signStartTime = json.data.signStartTime

            this.formParams.title = json.data.title;
          } else {
            this.$message({
              message: json.message,
              type: "error"
            });
          }
        });


      },
      back() {
        this.$router.go(-1);//返回上一层
      },
      tagSubmitForm() {
        console.log(this.formParams);
        if (!this.formParams.coverImage) {
          this.$message({
            message: "请上传图片",
            type: "error"
          });
          return false;
        }
        if (this.uploadImages.length ===0) {
          this.$message({
            message: "请上传主办单位图片",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.title) {
          this.$message({
            message: "请输入标题",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.intro) {
          this.$message({
            message: "请输入活动简介",
            type: "error"
          });
          return false;
        }
        if (!this.valuePicker_sign) {
          this.$message({
            message: "请选择签到时间",
            type: "error"
          });
          return false;
        }
        if (!this.pickerValue) {
          this.$message({
            message: "请选择活动时间",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.address) {
          this.$message({
            message: "请选择活动地址",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.masterId) {
          this.$message({
            message: "请选择主讲老师",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.priceFormat) {
          this.$message({
            message: "请输入费用",
            type: "error"
          });
          return false;
        }
        if (this.formParams.teacherIds.length === 0) {
          this.$message({
            message: "请选择邀请嘉宾",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.totalUser) {
          this.$message({
            message: "请输入总预约人数",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.content) {
          this.$message({
            message: "请输入活动内容",
            type: "error"
          });
          return false;
        }
        this.loading = true;
        this.uploadImages.forEach((image, index) => {
          this.formParams.companies.push(image.url)
        })
        this.formParams.price = this.formParams.priceFormat * 100
        activityEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            this.$router.push({
              name: "activity"
            })
            this.formParams = {
              activityId: 0,
              address: "",
              city: "",
              companies: [],
              content: "",  //活动详情
              coverImage: "",
              endTime: 0,  //活动结束时间
              intro: "",  //活动简介
              latitude: 0,
              longitude: 0,
              price: 0,
              priceFormat: null,
              province: "",
              signStartTime: 0,  //签到开始时间
              startTime: 0,  //活动开始时间
              masterId: null,  //主讲老师ID
              teacherIds: [],  //讲师列表
              title: "",
              token: getToken(),
              totalUser: null  //总预约人数
            }
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }

        });
      },
      // 讲师列表
      getTeacherList() {
        this.listLoading = true;
        atcAll({
          enable: 0,
        }).then(json => {
          this.listLoading = false;
          if (json.status === 200) {
            console.log(json.data,"getTeacherList");
            this.teacherIds = json.data
            json.data.forEach((item,index)=>{
              this.options.push({
                value:item.id,
                label:item.name,
              })
            })
          } else {

          }
        })
      },

    },
    mounted() {
      // console.log(this.$route.params.id);
      if (parseInt(this.$route.params.id) > 0) {
        this.initData();
      }
      this.getTeacherList()
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

  .activityDetail .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .activityDetail .el-textarea {
    width: 86%;
  }

  .activityDetail .time .el-form-item__content {
    margin-left: 16px !important;
  }
</style>
<style lang="scss" scoped>
  .activityDetail {
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
