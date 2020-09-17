<template>
  <div class="LiveDetail">
    <div class="head">
      <div class="back" @click="back"><i class="el-icon-arrow-left"></i> 返回</div>
      <div class="save" @click="tagSubmitForm">提交</div>
    </div>
    <div class="content">

      <el-form class="form-container" ref="postForm" label-width="100px">
        <el-form-item style="margin-bottom: 40px;" prop="title" label="上传图片">
          <el-upload
            class="avatar-uploader"
            :http-request="UploadCoverImage"
            action=""
            :show-file-list="false">
            <img v-if="formParams.coverImage" :src="formParams.coverImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="标题">
          <el-input
            style="width:700px;"
            v-model="formParams.title"
            placeholder="请输入标题"
          />
        </el-form-item>

        <div class="price" style="display: flex">
          <el-form-item label="直播类型" prop="title">
            <el-select
              class="filter-item"
              style="width: 260px"
              v-model="formParams.liveType"
              placeholder="请选择直播类型"
              @change="selectLiveType"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>

          </el-form-item>
        </div>

        <div class="price" style="display: flex">
          <el-form-item label="开播人" prop="title">
            <el-select
              class="filter-item"
              style="width: 260px"
              filterable
              v-model="formParams.teacherId"
              placeholder="请选择开播人"
              @change="selectTeacher"
            >
              <el-option
                v-for="item in teacherOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>

          </el-form-item>
        </div>
        <el-form-item label="直播时间">
          <el-date-picker
            style="width: 700px"
            v-model="valuePicker"
            type="datetime"
            value-format="timestamp"
            @change="changePicker"
            placeholder="选择开播时间"
            :picker-options="pickerOptions0"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="进场费用">
          <el-input
            type="number"
            style="width:700px;"
            v-model="formParams.priceFormat"
            placeholder="请输入金额"
          />
        </el-form-item>

        <el-form-item label="提成比例">
          <el-input
            type="number"
            style="width:700px;"
            v-model="formParams.ratio"
            placeholder="请输入提成比例"
          />
          %
        </el-form-item>

        <el-form-item label="直播说明">
          <el-input
            style="width:700px"
            type="textarea"
            :rows="3"
            v-model="formParams.intro"
            placeholder="请输入直播说明"
          />
        </el-form-item>
        <el-form-item label="购买显示基数">
          <el-input
            style="width:700px"
            type="number"
            :rows="3"
            v-model="formParams.baseUser"
            placeholder="请输入购买显示基数"
          />
        </el-form-item>
        <el-form-item label="密训密钥" v-if="formParams.liveType === 'secret'">
          <el-input
            style="width:700px"
            type="number"
            :rows="3"
            v-model="formParams.secret"
            placeholder="请输入密训密钥"
          />
        </el-form-item>
        <!--<el-form-item label="受邀好友">-->
        <el-form-item label="受邀好友" v-if="formParams.liveType ==='dating'">
          <span style="color: #1B9AF7;cursor: pointer;margin-right: 20px" @click="oppDatingDialog">点击选择</span> <span>{{multipleSelection.length}}人</span>
          <!--<div v-if="multipleSelection.length >0">
            <p style="line-height: 24px;display: inline-block" v-for="(item,index) in multipleSelection"
               :key="item.id">{{item.name }} <span v-if="index <  multipleSelection.length-1">、</span></p>
          </div>-->
          <!--<el-select style="width: 700px;margin-right: 20px" v-model="formParams.inviteUsers" filterable multiple placeholder="请选择"-->
          <!--@change="changeOption">-->
          <!--<el-option-->
          <!--v-for="item in options"-->
          <!--:key="item.userId"-->
          <!--:label="item.userName"-->
          <!--:value="item.userId">-->
          <!--</el-option>-->
          <!--</el-select>-->

        </el-form-item>


      </el-form>
    </div>


    <el-dialog title="客户列表" :visible.sync="datingDialog">
      VIP范围：
      <el-select v-model="listQueryUser.rechargeStart" clearable placeholder="请选择" style="width:100px">
        <el-option
          v-for="item in vipOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      -
      <el-select v-model="listQueryUser.rechargeEnd" clearable placeholder="请选择" style="width:100px">
        <el-option
          v-for="item in vipOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input @keyup.enter.native="getUserList" style="width: 200px;text-align: right;margin-left: 50px"
                class="filter-item"
                placeholder="搜索你想要的内容"
                v-model="listQueryUser.keyword">
      </el-input>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getUserList">
        搜索
      </el-button>
      <el-table :data="userList" highlight-current-row @selection-change="handleSelectionChange" ref="multipleTable"
                :row-key="rowKey">
        <el-table-column type="selection" property="id" label="ID" width="80"
                         :reserve-selection="true"></el-table-column>
        <el-table-column label="头像">
          <template slot-scope="scope">
            <img style="width: 50px;height: 50px;border-radius: 50%" :src="scope.row.extra.trueAvatar" alt="">
          </template>
        </el-table-column>
        <el-table-column label="注册时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.extra.trueName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            <span>{{scope.row.gender.text}}</span>
          </template>
        </el-table-column>
        <el-table-column label="VIP等级">
          <template slot-scope="scope">
            <span>{{vipString(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column property="mobile" label="电话"></el-table-column>
        <!--<el-table-column-->
        <!--type="selection"-->
        <!--width="55">-->
        <!--</el-table-column>-->
      </el-table>
      <div class="paginationBox">
        <el-pagination
          background
          @size-change="handleSizeChange_Dialog"
          @current-change="handleCurrentChange_Dialog"
          :current-page="page_Dialog"
          :page-sizes="[10,20,30, 50]"
          :page-size="listQueryUser.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total_Dialog"
        ></el-pagination>

        <div style="margin-top: 26px;display: flex;justify-content: flex-end">
          <el-button @click="$refs.multipleTable.clearSelection()">取消选择</el-button>
          <el-button type="danger" :loading="allSelecting" @click="allSelected">全部选择</el-button>
          <el-button v-waves class="filter-item" type="primary" style="margin-left: 40px" @click="toggleSelection">
            确定
          </el-button>
        </div>
      </div>
    </el-dialog>


  </div>
</template>

<script>

  import {liveDetail, liveEdit,} from "../../api/content";
  import {list, userStaffs, idList} from "@/api/user";
  import {settingRuleGet, vipAll} from "../../api/settings";
  import {friendFollowMes} from "../../api/user";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "LiveDetail",
    directives: {
      waves,
    },
    components: {
      pagination,
      Tinymce1
    },
    data() {
      return {
        typeOptions: [
          {
            value: 'pub',
            label: '公开',
          }, {
            value: 'secret',
            label: '密训',
          }, {
            value: 'dating',
            label: '邀约',
          },
        ],
        teacherOptions: [],
        datingDialog: false,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        options: [],
        multipleSelection: [],
        adTypeOptions: [
          {
            key: "collegeCourse",
            name: "学院课程广告"
          },
          {
            key: "collegeNews",
            name: "学院资讯广告"
          },
          {
            key: "collegeTech",
            name: "学院技术广告"
          }
        ],
        uploadUrl: "",//你要上传视频到你后台的地址
        videoFlag: false, //是否显示进度条
        videoUploadPercent: "", //进度条的进度，
        isShowUploadVideo: false, //显示上传按钮
        onDiscounts: false, //默认不开启优惠
        attachmentOptions: [
          {
            key: "text",
            name: "图文"
          },
          {
            key: "audio",
            name: "音频"
          },
          {
            key: "video",
            name: "视频"
          }
        ],
        tags: '',
        time: '',
        timeLimit: true,
        dynamicTags: [],
        vipOptions: [],
        gridParams: [],
        userList: [],
        page_Dialog: 1,
        total_Dialog: 0,
        inputVisible: false,
        inputValue: '',
        friendFollowMesParams: {
          limit: 500,
          page: 0,
          // userId: 0,
          token: getToken(),
        },
        listQueryUser: {
          app: "app",
          keyword: "",
          limit: 10,
          page: 0,
          departmentId: 0,
          rechargeStart: null,
          rechargeEnd: null,
          token: getToken()
        },
        currentRow: {},
        formParams: {
          coverImage: "",
          intro: "",
          inviteUsers: [],
          //pub公开、secret密训、dating邀约
          liveType: "pub",
          teacherId: null,
          liveId: 0,
          price: 0,
          ratio: 0,
          priceFormat: null,
          startTime: 0,
          title: "",
          baseUser: 0,
          secret: null,
          token: getToken(),
        },
        uploadImages: [],
        // 广告跳转类型：none不跳转，url链接，tool辅助工具，guide智能攻略，course课程，live直播，activity线下活动
        loading: false,
        allSelecting: false,
        valuePicker: "",
        vipData: [],
      };
    },
    methods: {
      allSelected() {
        this.allSelecting = true
        idList(this.listQueryUser).then(json => {
          this.allSelecting = false
          this.datingDialog = false
          this.multipleSelection = []
          json.data.forEach((id, index) => {
            this.multipleSelection.push({id: id})
          })
        }).catch(e => {
          this.allSelecting = false

        })
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
                id: item.id,
                name: item.name
              })
            })
          }
        });
      },
      rowKey(row) {
        return row.id + ''
      },
      toggleSelection() {
        this.datingDialog = false
        this.listQueryUser.keyword = ''
        // this.$refs.multipleTable.toggleRowSelection(row);
      },
      handleSelectionChange(val) {
        console.log(val, "val");
        this.multipleSelection = [];
        val.forEach((item, index) => {
          this.multipleSelection.push({
            id: item.id,
            name: item.extra ? item.extra.trueName : ''
          })
        });
      },
      oppDatingDialog(data) {
        this.datingDialog = true
        this.getUserList();
      },
      handleSizeChange_Dialog(val) {
        this.listQueryUser.limit = val;
        this.getUserList()
      },
      handleCurrentChange(val) {
        console.log(111);
        this.currentRow = val;
      },
      handleCurrentChange_Dialog(val) {
        this.listQueryUser.page = val - 1
        this.page_Dialog = this.listQueryUser.page + 1
        this.getUserList()
      },
      settingRuleGet() {
        settingRuleGet(this.formParams).then(json => {
          if (json.status === 200) {
            this.formParams.ratio = json.data.rule.dividedOfLive;
          }
        });
      },
      changeOption(value) {
        // console.log(value);
        // console.log(this.formParams.inviteUsers)
      },
      changePicker() {
        this.formParams.startTime = this.valuePicker / 1000
      },
      selectTeacher() {
        // this.friendFollowMesParams.userId = this.formParams.teacherId
        this.getFriend();
        this.formParams.inviteUsers = [];
      },
      selectLiveType() {
        this.formParams.inviteUsers = [];
      },
      vipChange(value) {
        this.formParams.vipId = value;
      },
      // 所有客户列表
      getUserList() {
        list(this.listQueryUser).then(json => {
          if (json.status === 200) {
            this.userList = json.data;
            this.total_Dialog = json.total;
            json.data.forEach((item) => {
              item.enable = false
            })

          }
        })
      },
      //取得vip 等级列表
      getVipList() {
        vipAll().then(json => {
          if (json.status === 200) {
            this.vipData = json.data;
            json.data.forEach((item, index) => {
              this.vipOptions.push({
                key: item.id,
                label: item.name,
                value: item.value
              })
            })
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
        liveDetail({
          targetId: this.$route.params.id,
          token: getToken(),
        }).then(json => {
          if (json.status === 200) {
            this.formParams.liveType = json.data.liveType.value;
            this.formParams.teacherId = json.data.teacherId;
            this.formParams.coverImage = json.data.coverImage;
            if (json.data.inviteUsers) {
              json.data.inviteUsers.forEach((item, index) => {
                this.formParams.inviteUsers.push(item)
              })
            }
            this.formParams.intro = json.data.intro;
            this.formParams.liveId = json.data.id;
            this.formParams.ratio = json.data.ratio;
            this.formParams.priceFormat = showDecimal(json.data.price);
            this.valuePicker = json.data.startTime * 1000
            this.formParams.title = json.data.title;
            this.formParams.baseUser = json.data.baseUser;
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
          }
        });
      },

      //关注我的好友
      getFriend() {
        friendFollowMes(this.friendFollowMesParams).then(json => {
          if (json.status === 200) {
            // console.log(json.data);
            if (json.data) {
              this.options = []
              json.data.forEach((item, index) => {
                this.options.push({
                  userId: item.userId,
                  userName: item.name,
                })
              })
            }
            // console.log(this.options);
          } else {
            // this.$message({
            //   message: json.message,
            //   type: "error"
            // });
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
        if (!this.formParams.title) {
          this.$message({
            message: "请输入标题",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.liveType) {
          this.$message({
            message: "请选择直播类型",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.teacherId) {
          this.$message({
            message: "请选择开播人",
            type: "error"
          });
          return false;
        }

        if (!this.valuePicker) {
          this.$message.error('选择开播时间！')
          return
        }
        if (!this.formParams.priceFormat) {
          this.$message({
            message: "请输入价格",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.ratio) {
          this.$message({
            message: "请输入提成比例",
            type: "error"
          });
          return false;
        }
        if (!this.formParams.intro) {
          this.$message({
            message: "请输入直播说明",
            type: "error"
          });
          return false;
        }

        this.multipleSelection.forEach((item, index) => {
          this.formParams.inviteUsers.push(item.id)
        })

        if (this.formParams.inviteUsers.liveType === 'dating' && this.formParams.inviteUsers.length === 0) {
          this.$message({
            message: "请选择受邀好友",
            type: "error"
          });
          return false;
        }
        this.loading = true;
        this.formParams.price = this.formParams.priceFormat * 100
        this.formParams.startTime = this.valuePicker / 1000
        this.formParams.preferTime = this.valuePicker / 1000
        liveEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status === 200 ? "success" : "error"
            });

            this.$router.push({
              name: "Live"
            })
            this.formParams = {
              coverImage: "",
              intro: "",
              inviteUsers: [],
              //pub公开、secret密训、dating邀约
              liveType: "pub",
              liveId: 0,
              price: 0,
              priceFormat: null,
              startTime: 0,
              title: "",
              token: getToken(),
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
      vipString(item) {
        console.log(item, "item");
        if (this.vipData) {
          for (let i = this.vipData.length - 1; i >= 0; i--) {
            // console.log(-item.offset);
            if (item.recharge >= this.vipData[i].value) {
              return this.vipData[i].name;
            }
          }
        }
        return '--'
      },

    },
    mounted() {
      // console.log(this.$route.params.id);
      this.loadStaffs();
      if (parseInt(this.$route.params.id) > 0) {
        this.initData();
      }
      this.getVipList();
      this.getFriend();
      this.settingRuleGet();
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

  .LiveDetail .timeLimit .el-form-item__content {
    margin-left: 30px !important;
  }

  .LiveDetail .el-textarea {
    width: 86%;
  }

  .LiveDetail .time .el-form-item__content {
    margin-left: 16px !important;
  }
</style>
<style lang="scss" scoped>
  .LiveDetail {
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

    .el-table {
      height: 500px;
      overflow: auto;
    }

    /* 滚动条样式 */
    .el-table .el-dialog__body::-webkit-scrollbar {
      display: none;
    }

    .paginationBox {
      margin: 10px auto;
      text-align: center;
    }

  }
</style>
