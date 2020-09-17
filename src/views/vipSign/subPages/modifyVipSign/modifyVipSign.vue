<template>
  <div class="modify-sign">
    <div class="top-panle">
      <div class="left-cont">
        <span class="tit" @click.stop="$router.go(-1)"><返回</span>
        <a v-if="signOptionsEnableValiPhone[form.signType]" href="http://wukong-files.oss-cn-hangzhou.aliyuncs.com/web/1592213556205.xls" style="font-size:16px;color:red;margin-left:100px;">点击下载附件模板</a>
      </div>
      <div class="right-cont">
        <el-button type="primary" @click.stop="modify">确定</el-button>
      </div>
    </div>
    <div class="bottom-panle">
      <div class="left-cont">
        <div class="info-item">
          <span class="item-name item">选择签到类型</span>
          <div class="item-cont item">
            <el-select v-model="form.signType" placeholder="签到类型">
              <el-option
                v-for="item in signOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="info-item">
          <span class="item-name item">会签名称</span>
          <div class="item-cont item">
            <el-input style="width:20%;" v-model="form.signName" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="info-item">
          <span class="item-name item">活动地点</span>
          <div class="item-cont item">
            <el-input style="width:50%;" v-model="form.signAddress" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="info-item" v-if="signOptionsEnableValiPhone[form.signType]">
          <span class="item-name item">上传附件</span>
          <div class="item-cont item">
            <span class="up">
              <el-upload
                class="avatar-uploader"
                action
                :http-request="uploadFile"
                :show-file-list="true"
                multiple
                :limit="1"
              >
                <span class="add-item">点击添加(多次上传会覆盖附件)</span>
              </el-upload>
            </span>
          </div>
        </div>
        <div class="info-item" v-if="$route.query.type == 'edit'&&signOptionsEnableValiPhone[form.signType]">
          <span class="item-name item">下载附件</span>
          <div class="item-cont item">
            <a class="dl" target="_blank" :href="form.fileUrl">点击下载</a>
          </div>
        </div>
        <div class="info-item">
          <span class="item-name item">创建备注</span>
          <div class="item-cont item">
            <el-input style="width:50%;" v-model="form.signNote" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="info-item">
          <span class="item-name item">立即启用</span>
          <div class="item-cont item">
            <el-switch v-model="form.isActive" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </div>
        </div>
        <div class="info-item">
          <span class="item-name item">签到场次</span>
          <div class="item-cont item">
            <div class="images-item">
              <div class="upload-btn">
                <span class="add-item" @click.stop="modifyType='add';showAddSignItem=true">点击添加</span>
              </div>
            </div>
          </div>
        </div>
        <div class="signs">
          <div class="info-item" v-for="(item,index) in signCounts" :key="index">
            <span class="item-name item">{{item.name}}</span>
            <div class="item-cont item">
              <el-date-picker
                v-model="item.timeRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:60%"
              ></el-date-picker>
              <span>延时</span>
              <el-input-number
                style="width:15%"
                v-model="item.flexibleTime"
                controls-position="right"
                :min="0"
              ></el-input-number>
              <span>分钟</span>
              <span class="modify-sign">
                <span class="del" @click.stop="delSignItem(item,index)">删除</span>
                <span class="edit" @click.stop="modifySignItem(item,index)">编辑</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="right-cont" v-if="$route.query.type == 'edit'">
        <div class="right-tit">
          <span class="tit">手动添加签到名单</span>
          <span class="btn">
            <span @click.stop="showAddHandleItem = true">添加</span>
          </span>
        </div>
        <div class="cont-wrap">
          <commonTable>
            <template v-slot:tableTop>
              <div class="common-table-top">
                <table style="width:100%;" class="tit">
                  <tr>
                    <th style="width:4%;">ID</th>
                    <th style="width:8%;">姓名</th>
                    <th style="width:8%;">联系电话</th>
                    <th style="width:4%;">备注</th>
                  </tr>
                </table>
              </div>
            </template>
            <template v-slot:tableBottom>
              <div class="cont-table-bot">
                <div class="table-item" v-for="(item,index) in handleList" :key="index">
                  <div class="table-item-wrap">
                    <span style="width:4%;">{{item.id}}</span>
                    <span style="width:8%;">{{item.name}}</span>
                    <span style="width:8%;">{{item.mobile}}</span>
                    <span style="width:4%;">{{item.remark}}</span>
                  </div>
                </div>
              </div>
            </template>
            <template v-slot:otherTmp>
              <div class="pagination-wrap">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page.sync="nowPage"
                  :page-size="limit"
                  layout="prev, pager, next, jumper"
                  :total="totalCount"
                ></el-pagination>
              </div>
            </template>
          </commonTable>
        </div>
      </div>
    </div>
    <el-dialog :title="modifyType=='add'?'添加签到场次':'修改签到场次'" :visible.sync="showAddSignItem" width="30%">
      <div class="info-item">
        <span class="item-name item">场次名称</span>
        <div class="item-cont item">
          <el-input style="width:100%;" v-model="signCount.name" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="info-item">
        <span class="item-name item">签到时间段</span>
        <div class="item-cont item">
          <el-date-picker
            style="width:100%"
            v-model="signCount.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddSignItem = false">取 消</el-button>
        <el-button type="primary" @click="modifySignCount">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加签到名单" :visible.sync="showAddHandleItem" width="30%">
      <div class="info-item">
        <span class="item-name item">姓名</span>
        <div class="item-cont item">
          <el-input style="width:100%;" v-model="handleOption.name" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="info-item">
        <span class="item-name item">电话</span>
        <div class="item-cont item">
          <el-input style="width:100%;" v-model="handleOption.phone" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="info-item">
        <span class="item-name item">备注</span>
        <div class="item-cont item">
          <el-input style="width:100%;" v-model="handleOption.note" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddHandleItem = false">取 消</el-button>
        <el-button type="primary" @click="sureAddHandleItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import commonTable from "./../../commonTable/commonTable";
import {
  modifyVipSign,
  vipSignMemList,
  getSignInfo,
  addHandleItem
} from "./../../../../api/vipSign";
export default {
  name: "modifyVipSign",
  components: { commonTable },
  data() {
    return {
      handleList: [],
      handleOption: {
        name: "",
        phone: "",
        note: ""
      },
      showAddHandleItem: false,
      infoData: {},
      signCounts: [],
      signCount: {
        name: "",
        timeRange: ["", ""],
        flexibleTime: "" //弹性时间
      },
      showAddSignItem: false,
      form: {
        signType: 0,
        signName: "",
        signAddress: "",
        signNote: "",
        isActive: true,
        fileUrl: ""
      },
      signOptions: [
        {
          label: "培训签到",
          value: 0
        },{
          label: "会议签到",
          value: 1
        }
      ],
      signOptionsEnableValiPhone:{
        0:false,
        1:true,
      },
      signOptionsFormat: {
        0: "培训签到",
        1: "会议签到"
      },
      limit: 10,
      nowPage: 1,
      totalCount: 0,
      modifyType:"add",
      modifyIndex:-1,
    };
  },
  watch: {
    showAddSignItem(val) {
      if (!val) {
        this.signCount = {
          name: "",
          timeRange: ["", ""],
          flexibleTime: ""
        };
        this.modifyIndex = -1;
      }
    },
    nowPage(val) {
      this.getList();
    }
  },
  methods: {
    modifySignItem(item,index){
      this.modifyType = "edit";
      this.modifyIndex = index;
      this.signCount.name = item.name;
      this.signCount.timeRange = item.timeRange;
      // this.signCounts.splice(index,1);
      // signCounts = JSON.parse(signCounts);
      this.showAddSignItem = true;
    },
    sureAddHandleItem() {
      if (this.handleOption.phone == "") {
        this.$message({
          type: "error",
          message: "请填写电话"
        });
        return;
      }
      if (this.handleOption.name == "") {
        this.$message({
          type: "error",
          message: "请填写姓名"
        });
        return;
      }
      let data = {
        countersignId: this.$route.query.id,
        mobile: this.handleOption.phone,
        name: this.handleOption.name,
        remark: this.handleOption.note
      };
      addHandleItem(data).then(res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: res.message
          });
          this.handleOption = {
            name: "",
            phone: "",
            note: ""
          };
          this.getList();
        }
      });
    },
    handleCurrentChange(val) {
      this.nowPage = val;
    },

    delSignItem(item, index) {
      this.$confirm("确认删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        console.log(item);
        console.log(index);
        let signCounts = this.signCounts;
        signCounts.splice(index, 1);
        this.signCounts = signCounts;
      });
    },
    modifySignCount() {
      let signCounts = this.signCounts;

      if (!this.signCount.timeRange[0] || !this.signCount.timeRange[1]) {
        this.$message({
          message: "请选择时间",
          customClass: "error"
        });
        return;
      }
      if (this.signCount.name == "") {
        this.$message({
          message: "请填写名称",
          customClass: "error"
        });
        return;
      }
      //
      // let flag = false;
      // if (signCounts.length > 0) {
      //   for (let i = 0; i < signCounts.length; i++) {
      //     let tempArrMax = [
      //       this.signCount.timeRange[0],
      //       signCounts[i].timeRange[0]
      //     ];
      //     let tempArrMin = [
      //       this.signCount.timeRange[1],
      //       signCounts[i].timeRange[1]
      //     ];
      //     if (
      //       Math.max.apply(null, tempArrMax) <= Math.min.apply(null, tempArrMin)
      //     ) {
      //       flag = true;
      //     }
      //   }
      // }
      // if (flag) {
      //   this.$message({
      //     message: "时间不允许重叠，请重新选择",
      //     customClass: "error"
      //   });
      //   return;
      // }
      //
      if(this.modifyType=="add"){
        let signCount = {
          name: this.signCount.name,
          timeRange: this.signCount.timeRange,
          start: this.signCount.timeRange[0],
          end: this.signCount.timeRange[1],
          flexibleTime: 0 //弹性时间
        };
        signCounts.push(signCount);
      }else{
        console.log(signCounts[this.modifyIndex])
        signCounts[this.modifyIndex].name = this.signCount.name;
        signCounts[this.modifyIndex].timeRange = this.signCount.timeRange;
        signCounts[this.modifyIndex].start = this.signCount.timeRange[0];
        signCounts[this.modifyIndex].end = this.signCount.timeRange[1];
      }
      this.signCounts = signCounts;
      this.showAddSignItem = false;
    },
    uploadFile(file) {
      const tmpcnt = file.file.name.lastIndexOf(".");
      const exname = file.file.name.substring(tmpcnt + 1);
      const names = ["xls"];
      if (names.indexOf(exname) < 0) {
        this.$message.error("不支持的格式!,请上传xls格式的文件");
        return;
      }
      this.$upload(
        file.file.uid + "." + exname,
        file.file,
        (success, result) => {
          this.$set(this.form, "fileUrl", result.url);
        }
      );
    },
    check() {
      if (this.form.signName == "") {
        this.$message.error("请输入会签名称!");
        return false;
      }
      if (this.form.signAddress == "") {
        this.$message.error("请填写签到地址!");
        return false;
      }
      if(this.signOptionsEnableValiPhone[this.form.signType]){
        if (this.form.fileUrl == "") {
          this.$message.error("请选择文件上传!");
          return false;
        }
      }
      if (this.form.signNote == "") {
        this.$message.error("请填写备注!");
        return false;
      }
      if (this.signCounts.length == 0) {
        this.$message.error("请选择时间段!");
        return false;
      }
      //
      let flag = false;
      let signCounts = this.signCounts;
      if (signCounts.length > 0) {
        for (let i = 1; i < signCounts.length; i++) {
          let tempArrMax = [
            signCounts[0].timeRange[0],
            signCounts[i].timeRange[0]
          ];
          let tempArrMin = [
            signCounts[0].timeRange[1],
            signCounts[i].timeRange[1]
          ];
          if (
            Math.max.apply(null, tempArrMax) <= Math.min.apply(null, tempArrMin)
          ) {
            flag = true;
          }
        }
      }
      if (flag) {
        this.$message({
          message: "时间不允许重叠，请重新选择",
          customClass: "error"
        });
        return false;
      }
      //

      return true;
    },
    modify() {
      if (!this.check()) {
        return;
      }
      let timeRangeParams = [];
      for (let i = 0; i < this.signCounts.length; i++) {
        console.log(new Date(this.signCounts[i].timeRange[1]).getMonth());
        let obj = {
          end: new Date(this.signCounts[i].timeRange[1]).getTime() / 1000,
          flexibleTime: this.signCounts[i].flexibleTime * 60,
          start: new Date(this.signCounts[i].timeRange[0]).getTime() / 1000,
          name: this.signCounts[i].name
        };
        timeRangeParams.push(obj);
      }
      let data = {
        type:this.form.signType,
        address: this.form.signAddress,
        enable: this.form.isActive,
        mobileValidate:this.signOptionsEnableValiPhone[this.form.signType],
        // excelUrl: this.form.fileUrl,
        name: this.form.signName,
        remark: this.form.signNote,
        timeRangeParams
      };
      if(this.signOptionsEnableValiPhone[this.form.signType]){
        data = Object.assign(data, {
          excelUrl: this.form.fileUrl
        });
      }
      if (this.$route.query.type == "edit") {
        data = Object.assign(data, {
          formId: this.$route.query.id
        });
      }
      modifyVipSign(data).then(res => {
        console.log(res);
        if (res.code == 200) {
          // if(!res.data.handleInfo){
          //   alert("上传附件有误，请检查后重新上传。");
          //   return;
          // }
          this.$router.go(-1);
        }
      });
    },
    // 获取手动添加的
    getList() {
      let data = {
        countersignId: this.$route.query.id,
        limit: this.limit,
        page: this.nowPage - 1,
        type: 2 //人员类型：0不限，1导入，2手动添加
      };
      vipSignMemList(data).then(res => {
        this.handleList = res.data;
        this.totalCount = res.total;
      });
    },
    getInfo() {
      getSignInfo({
        targetId: this.$route.query.id
      }).then(res => {
        this.infoData = res.data;
        this.form = {
          signType: res.data.type,
          signName: res.data.name,
          signAddress: res.data.address,
          signNote: res.data.remark,
          isActive: res.data.enable,
          fileUrl: res.data.excelUrl
        };
        let timeRanges = res.data.timeRanges;
        let signCounts = [];
        for (let i = 0; i < timeRanges.length; i++) {
          let obj = {
            name: timeRanges[i].name,
            timeRange: [timeRanges[i].start * 1000, timeRanges[i].end * 1000],
            start: timeRanges[i].start * 1000,
            end: timeRanges[i].end * 1000,
            flexibleTime: timeRanges[i].flexibleTime / 60 //弹性时间
          };
          signCounts.push(obj);
        }
        this.signCounts = signCounts;
      });
    }
  },
  mounted() {
    if (this.$route.query.type == "edit") {
      this.getInfo();
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./modifyVipSign.scss";
</style>