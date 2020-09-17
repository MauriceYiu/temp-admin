<template>
  <div class="sign-detail" @click.stop="showSignItemDetail=false">
    <div class="tip-info">
      <span class="tip-item" v-if="infoData.timeRanges">
        <b>会签时间段:</b>
        {{infoData.timeRanges[0].start | parseTime}}---{{infoData.timeRanges[infoData.timeRanges.length - 1].end | parseTime}}
      </span>
      <span class="tip-item">
        <b>签到地址:</b>
        {{infoData.address}}
      </span>
      <span class="tip-item">
        <b>创建备注:</b>
        {{infoData.remark}}
      </span>
    </div>
    <div class="top-panle">
      <div class="left-cont">
        <span class="tit" @click.stop="$router.go(-1)"><返回</span>
        <el-select v-model="signType" style="margin-right:10px;width:20%" placeholder="签到状态">
          <el-option
            v-for="item in signOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="jobAddress" style="width:20%" placeholder="工作确认地">
          <el-option
            v-for="item in jobAddressOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="center-cont">
        <!-- <span class="top-info-item">应签:81人</span>
        <span class="top-info-item">实签:81人</span>
        <span class="top-info-item">未签:81人</span>-->
      </div>
      <div class="right-cont">
        <el-input style="width:30%;" v-model="searchVal" @keyup.enter.native="search" placeholder="请输入内容"></el-input>
        <el-button type="primary" class="search" @click="search">搜索</el-button>
        <el-button type="primary" @click.stop="exportData">导出</el-button>
      </div>
    </div>
    <div class="bottom-panle">
      <commonTable>
        <template v-slot:tableTop>
          <div class="common-table-top">
            <table style="width:100%;" class="tit">
              <tr>
                <th style="width:4%;">ID</th>
                <th style="width:8%;">姓名</th>
                <th style="width:8%;">联系电话</th>
                <th style="width:6%;">性别</th>
                <th style="width:8%;">部门</th>
                <th style="width:20%;">签到状态</th>
                <th style="width:8%;">工作确认地</th>
                <th style="width:8%;">签到备注</th>
                <th style="width:8%;">类型</th>
              </tr>
            </table>
          </div>
        </template>
        <template v-slot:tableBottom>
          <div class="cont-table-bot">
            <div class="table-item">
              <div class="table-item-wrap" v-for="(item,index) in list" :key="index">
                <span style="width:4%;">{{item.id}}</span>
                <span style="width:8%;">{{item.name}}</span>
                <span style="width:8%;">{{item.mobile}}</span>
                <span style="width:6%;">{{item.gender?item.gender.text:""}}</span>
                <span style="width:8%;">{{item.job}}</span>
                <span style="width:20%;" class="signs" @click.stop="showDetail(index)">
                  {{signStatus(item).name}} - {{signStatus(item).createTime | parseTime}} -
                  <i
                    class="is-sign"
                    :class="statusaActiveCss[signStatus(item).isSign]"
                  >{{statusOptions[signStatus(item).isSign]}}</i>
                  <i class="el-icon-arrow-down" style="font-weight:600;padding-left:10px;color:"></i>
                  <div
                    class="sign-item-detail"
                    v-if="showSignItemDetail&&index==nowSelIndex"
                    @click.stop
                  >
                    <div
                      class="sign-item"
                      v-for="(timeItem,timeIndex) in signStatus(item,'all')"
                      :key="timeIndex"
                    >
                      <!-- {{timeItem.name}} - {{timeItem.start | parseTime}} - {{(Number(timeItem.end)+Number(timeItem.flexibleTime)) | parseTime}} -->
                      <i class="item-detail">
                        {{timeItem.name}} - {{timeItem.start | parseTime}} - {{timeItem.end | parseTime}} -
                        <i
                          class="is-sign"
                          :class="statusaActiveCss[timeItem.isSign]"
                        >{{statusOptions[timeItem.isSign]}}</i>
                      </i>
                    </div>
                  </div>
                </span>
                <span style="width:8%;cursor:pointer;">{{jobAddressFormat[item.jobAddress]}}</span>
                <span style="width:8%;">{{item.memberRemark}}</span>
                <span style="width:8%;">{{signOptionsFormat[infoData.type]}}</span>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:otherTmp>
          <div class="pagination-wrap">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="nowPage"
              :page-sizes="[10, 15, 20, 25]"
              :page-size="limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount"
            ></el-pagination>
            <!-- <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="nowPage"
              :page-size="limit"
              layout="prev, pager, next, jumper"
              :total="totalCount"
            ></el-pagination>-->
          </div>
        </template>
      </commonTable>
    </div>
  </div>
</template>

<script>
import commonTable from "./../../commonTable/commonTable";
import {
  vipSignMemList,
  getSignInfo,
  exportSignList
} from "./../../../../api/vipSign";
import { parseTime } from "./../../../../utils/index";
export default {
  name: "signInfo",
  components: { commonTable },
  data() {
    return {
       signOptionsFormat: {
        0: "培训签到",
        1: "会议签到",
      },
      showSignItemDetail: false,
      nowSelIndex: -1,
      jobAddressFormat:{
          1:"锦江区汇融国际广场F座（琉璃厂地铁站）",
          // 2:"武侯区中航国际广场A座（金融城地铁站）",
          3:"高新区东方希望天祥广场A座（世纪城地铁站）",
          4:"高新区中航国际交流中心A座（孵化园地铁站）",
      },
      statusOptions:{
        0:"未签到",
        1:"已签到",
        2:"迟到",
      },
      statusaActiveCss:{
        0:"",
        1:"active",
        2:"late"
      },
      jobAddressOptions: [
        {
          label: "不限",
          value: 0
        },
        {
          label: "锦江区汇融国际广场F座（琉璃厂地铁站）",
          value: 1
        },
        {
          label: "武侯区中航国际广场A座（金融城地铁站）",
          value: 2
        },
        {
          label: "高新区东方希望天祥广场A座（世纪城地铁站）",
          value: 3
        },
        {
          label: "高新区中航国际交流中心A座（孵化园地铁站）",
          value: 4
        }
      ],
      jobAddress: "",
      signType: "",
      searchVal: "",
      signOptions: [
        {
          label: "不限",
          value: 0
        },
        // {
        //   label: "待签到",
        //   value: 1
        // },
        {
          label: "已签到",
          value: 2
        },
        // {
        //   label: "未签到",
        //   value: 3
        // },
        {
          label: "迟到",
          value: 4
        }
      ],
      list: [],
      nowPage: 1,
      limit: 10,
      totalCount: 0,
      infoData: {},
      isSearch: false,
      timeList: [],
      filterData:{}
    };
  },
  watch: {
    searchVal(val) {
      if (val == "") {
        this.getList();
      }
    },
    signType(val) {
      this.getList();
    },
    jobAddress(val) {
      this.getList();
    },
    showSignItemDetail(val) {
      if (!val) {
        this.nowSelIndex = -1;
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.limit = val;
      this.getList();
    },
    showDetail(index) {
      this.nowSelIndex = index;
      this.showSignItemDetail = !this.showSignItemDetail;
    },
    getUrl(encoded, options) {
      const dataBlob = new Blob([`\ufeff${encoded}`], { type: 'text/plain;charset=utf-8' });//返回的格式
      return window.URL.createObjectURL(dataBlob);
    },
    exportData(){
      exportSignList(this.filterData).then(res=>{
        let a = document.createElement('a');
        let url = this.getUrl(res, {});
        a.href = url;
        a.download = "会签信息.csv";
        a.click();
        window.URL.revokeObjectURL(url);
      });
    },
    // exportData() {
    //   let url =
    //     window.API_BASE_URI +
    //     "/api/v1/countersign/export/" +
    //     this.$route.query.id;
    //   if (url) window.open(url, "_blank");
    // },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.nowPage = val;
      this.getList();
    },
    search() {
      this.nowPage = 1;
      this.isSearch = true;
      this.getList();
    },
    signStatus(item, type = "first") {
      if (item.signs.length == 0) {
        return {
          id: -1,
          name:"未签到",
          isSign: false
        };
      } else {
        let statusArr = [];
        for (let i = 0; i < this.timeList.length; i++) {
          let obj = {
            id: this.timeList[i].id,
            name: this.timeList[i].name,
            start: this.timeList[i].start,
            end: this.timeList[i].end,
            flexibleTime: this.timeList[i].flexibleTime,
            isSign: 0,
            createTime:""
          };
          statusArr.push(obj);
        }
        //isSign:0代表未签到，1代表签到，2代表迟到
        for (let i = 0; i < statusArr.length; i++) {
          for (let j = 0; j < item.signs.length; j++) {
            if ((statusArr[i].id == item.signs[j].timeRange.id) && (item.signs[j].createTime <= item.signs[j].timeRange.end)) {
              statusArr[i].isSign = 1;
              statusArr[i].createTime = item.signs[j].createTime;
            }else if((statusArr[i].id == item.signs[j].timeRange.id) && (item.signs[j].createTime > item.signs[j].timeRange.end)){
              statusArr[i].isSign = 2;
              statusArr[i].createTime = item.signs[j].createTime;
            }
          }
        }
        if (type == "first") {
          return statusArr[0];
        }
        return statusArr;
      }
    },
    getList() {
      let data = {
        keyword: this.searchVal, //这里的搜索是组合前面的条件筛选的搜索
        countersignId: this.$route.query.id,
        limit: this.limit,
        page: this.nowPage - 1,
        type: 0, //人员类型：0不限，1导入，2手动添加
        jobAddress: this.jobAddress === "" ? 0 : this.jobAddress,
        status: this.signType === "" ? 0 : this.signType
      };
      this.filterData = data;
      vipSignMemList(data).then(res => {
        this.list = res.data;
        this.totalCount = res.total;
      });
    },
    getInfo() {
      getSignInfo({
        targetId: this.$route.query.id
      }).then(res => {
        this.infoData = res.data;
        this.timeList = res.data.timeRanges;
      });
    }
  },
  mounted() {
    this.getList();
    this.getInfo();
  }
};
</script>

<style lang="scss" scoped>
@import "./signInfo.scss";
</style>