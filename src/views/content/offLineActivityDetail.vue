<template>
  <!--活动名称、预约价格(悟空币)、活动时间(时间段)、-->
  <!--封面、活动简介、活动讲师(讲师如下三个参数：姓名、头像、讲师标签)、活动详情(富文本编辑框)、举办单位(图片)-->
  <div class="offLineActivityDetail">
    <el-form class="form-container" ref="postForm" label-width="154px">
      <el-form-item label="活动名称">
        <el-input
          style="width:600px;"
          v-model="formParams.title"
          placeholder="请输入活动名称"
        />
      </el-form-item>
      <el-form-item label="预约价格(悟空币)">
        <el-input
          style="width:600px;"
          type="number"
          v-model="formParams.priceFormat"
          placeholder="请输入预约价格(悟空币)"
        />
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
      <el-form-item label="预约时间">
        <el-date-picker
          v-model="pickerValueDating"
          type="datetimerange"
          @change='changePickerDating()'
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
                  style="width: 600px" v-model="formParams.address"></el-input>
      </el-form-item>
      <el-form-item label="活动简介">
        <el-input
          style="width: 600px"
          v-model="formParams.intro"
          placeholder="请输入活动简介"
        />
      </el-form-item>
      <el-form-item label="总预约人数">
        <el-input
          style="width: 600px"
          v-model="formParams.totalUser"
          placeholder="请输入总预约人数"
        />
      </el-form-item>
      <!--封面、活动简介、-->
      <el-form-item style="margin-bottom: 40px;" prop="title" label="活动封面">
        <el-upload
          class="avatar-uploader"
          :http-request="UploadCoverImage"
          action=""
          :show-file-list="false">
          <img v-if="formParams.coverImage" :src="formParams.coverImage" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <!--活动详情(富文本编辑框)、举办单位(图片)&ndash;&gt;-->
      <el-form-item label="活动详情">
        <Tinymce1 id="Tinymce1" v-model="formParams.content" :height="300"/>
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" prop="title" label="举办单位">
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
      <el-form-item label="主讲人">
        <el-input
          style="width:600px;"
          v-model="formParams.teacherName"
          placeholder="请输入主讲人姓名"
        />
      </el-form-item>
      <!--活动讲师(讲师如下三个参数：姓名、头像、讲师标签)、-->
      <el-form-item label="活动讲师">
        <div class="teachersBox" v-for="(item,i) in formParams.teachers" :key="i">
          <el-form-item label="姓名">
            <el-input
              style="width:178px"
              v-model="item.name"
              placeholder="请输入讲师姓名"
            />
          </el-form-item>

          <el-form-item style="margin-bottom: 40px;" prop="title" label="头像">
            <el-upload
              class="avatar-uploader"
              :http-request="(file)=>{return UploadAvatar(file,i)}"
              action=""
              :show-file-list="false">
              <img v-if="item.avatar" :src="item.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="标签">
            <el-input
              style="width: 300px"
              v-model="item.tagsText"
              placeholder="请输入讲师标签"
            />
          </el-form-item>

          <el-button icon="el-icon-plus" style="margin-left: 10px;" type="text"
                     @click="addOption(item,formParams.teachers)">增加
          </el-button>
          <el-button style="margin-left: 10px;color: red" type="text"
                     v-if="i>0"
                     @click="delOption(i,formParams.teachers)">删除
          </el-button>
        </div>


      </el-form-item>
      <el-form-item>
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="tagSubmitForm"
        >保存
        </el-button>
      </el-form-item>
    </el-form>

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
  } from "../../api/content";
  import {vipAll} from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import qqmap from "@/components/qqmap/index";
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "offLineActivityDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1,
      qqmap
    },
    data() {
      return {
        dialogMapVisible: false,
        pickerValue: '',
        pickerValueDating: '',
        vipOptions: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        typeOptions: [
          {
            key: "pub",
            label: "公开"
          },
        ],
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
        uploadImages: [],
        formParams: {
          activityId: 0,
          address: "",
          city: "",
          companies: [],
          content: "",
          coverImage: "",
          datingEndTime: 0,
          datingStartTime: 0,
          endTime: 0,
          intro: "",
          latitude: 0,
          longitude: 0,
          price: 0,
          priceFormat: null,
          province: "",
          remark: "",
          startTime: 0,
          teacherName: "",
          teachers: [
            {
              avatar: "",
              name: "",
              tagsText: "",
              tags: [],
            }
          ],
          title: "",
          token: getToken(),
          totalUser: null
        },
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
      addOption(option, arr) {
        arr.push({
          value: ""
        });
      },
      delOption(option, arr) {
        arr.splice(option, 1)
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
      //选定预约日期
      changePickerDating() {
        if (this.pickerValueDating) {
          this.formParams.datingStartTime = this.pickerValueDating[0] / 1000;
          this.formParams.datingEndTime = this.pickerValueDating[1] / 1000;
        } else {
          this.formParams.datingStartTime = ''
          this.formParams.datingEndTime = ''
        }
      },
      typeChange(value) {
        this.formParams.typeId = value;
      },
      vipChange(value) {
        this.formParams.vipId = value;
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList,"on-remove");
        this.uploadImages = fileList
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
      },
      beforeUpload() {

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
      UploadAvatar(file, i) {
        console.log(i);
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
        this.$upload(file.file.uid + "." + exname, file.file, (success, result) => {
          this.formParams.teachers[i].avatar = result.url
          this.$forceUpdate()
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
            this.formParams.remark = json.data.remark;
            this.formParams.teacherName = json.data.teacherName;
            this.formParams.title = json.data.title;
            this.formParams.teachers = json.data.teachers;
            this.formParams.totalUser = json.data.totalUser;
            json.data.teachers.forEach((item,index)=>{
              item.tagsText = item.tags.join("、")
            })
            this.pickerValue = [json.data.startTime * 1000,json.data.endTime * 1000]
            this.pickerValueDating = [json.data.datingStartTime * 1000,json.data.datingEndTime * 1000]
            this.formParams.title = json.data.title;
          } else {

          }
        });


      },
      tagSubmitForm() {
        if (!this.formParams.title) {
          this.$message({
            message: "请输入活动名称",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.priceFormat) {
          this.$message({
            message: "请输入预约价格(悟空币)",
            type: "error"
          });
          return false;
        }

        if (!this.pickerValue) {
          this.$message.error('选择活动时间！')
          return
        }

        if (!this.formParams.address) {
          this.$message({
            message: "请选择活动地址",
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
        if (!this.formParams.totalUser) {
          this.$message({
            message: "请输入总预约人数",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.coverImage) {
          this.$message({
            message: "请上传活动封面",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.content) {
          this.$message({
            message: "请输入活动详情",
            type: "error"
          });
          return false;
        }
        this.uploadImages.forEach((image, index) => {
          this.formParams.companies.push(image.url)
        })

        if (this.uploadImages.length===0) {
          this.$message({
            message: "请上传举办单位",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.teacherName) {
          this.$message({
            message: "请输入主讲人姓名",
            type: "error"
          });
          return false;
        }
        console.log(this.formParams.teachers);
        if (this.formParams.teachers.length ===0) {
          this.$message({
            message: "请至少提交一位讲师信息",
            type: "error"
          });
          return false;
        }
        if (this.formParams.teachers.length >0) {

          for(let i=0;i<this.formParams.teachers.length;i++){

            if(!this.formParams.teachers[i].name){
              this.$message({
                message: "请输入讲师姓名",
                type: "error"
              });
              return false;
            }
            if(!this.formParams.teachers[i].avatar){
              this.$message({
                message: "请上传讲师头像",
                type: "error"
              });
              return false;
            }
            if(!this.formParams.teachers[i].tagsText){
              this.$message({
                message: "请输入讲师标签",
                type: "error"
              });
              return false;
            }
            this.formParams.teachers[i].tags = this.formParams.teachers[i].tagsText.split("、")
          }
        }


        this.loading = true;
        this.formParams.price = this.formParams.priceFormat * 100
        activityEdit(this.formParams).then(json => {
          this.loading = false;
          // const json = response.data;
          if(json.status ===200){
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });

            this.dialogTableVisible = false;
            this.$router.push({
              name: "offLineActivity"
            })
            this.formParams = {
              liveType: "",
              liveId: 0,
              coverImage: "",
              intro: "",
              price: 0,
              priceFormat: null,
              startTime: 0,
              title: "",
              token: getToken(),
            }
          }else {
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

    },
    mounted() {
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
  .offLineActivityDetail {
    padding: 15px;
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
    .teachersBox {
      display: flex;
    }

  }
</style>
