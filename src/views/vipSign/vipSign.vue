<template>
  <div class="vip-sign">
    <div class="top-panle">
      <div class="left-cont">
        <span class="tit">签到列表</span>
        <el-select v-model="signType" placeholder="签到类型">
          <el-option
            v-for="item in signOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="right-cont">
        <el-input style="width:20%;" v-model="searchVal" @keyup.enter.native="search" placeholder="请输入内容"></el-input>
        <el-button type="primary" class="search" @click="search">搜索</el-button>
        <el-button type="primary" @click.stop="$router.push({name:'modifyVipSign',query:{type:'add'}})" v-if="hasPerm('countersign:list:add')">创建签到</el-button>
      </div>
    </div>
    <div class="bottom-panle">
      <commonTable>
        <template v-slot:tableTop>
          <div class="common-table-top">
            <table style="width:100%;" class="tit">
              <tr>
                <th style="width:4%;">ID</th>
                <th style="width:8%;">名称</th>
                <th style="width:8%;">签到类型</th>
                <th style="width:6%;">签到地址</th>
                <th style="width:8%;">签到场次</th>
                <th style="width:8%;">场次签到时间段</th>
                <th style="width:8%;">创建时间</th>
                <th style="width:8%;">创建备注</th>
                <th style="width:8%;">状态</th>
                <th style="width:8%;">二维码信息</th>
                <th style="width:10%;">操作</th>
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
                <span style="width:8%;">{{signOptionsFormat[item.type]}}</span>
                <span style="width:6%;">{{item.address}}</span>
                <span style="width:8%;">{{(nowSign(item)).name}}/共{{item.timeRanges.length}}场</span>
                <span
                  style="width:8%;"
                >{{(nowSign(item)).start | parseTime('{y}/{m}/{d}')}}--{{(nowSign(item)).end | parseTime('{y}/{m}/{d}')}}</span>
                <span style="width:8%;">{{item.createTime | parseTime('{y}/{m}/{d}')}}</span>
                <span style="width:8%;">{{item.remark}}</span>
                <span style="width:8%;">
                  {{item.enable?"启用":"禁用"}}
                  <el-switch
                    v-model="item.enable"
                    v-if="hasPerm('countersign:list:enable')"
                    @change="(value)=>{changeStatus(value,item)}"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  ></el-switch>
                </span>
                <span
                  style="width:8%;color:#FFB026;cursor:pointer;"
                  @click.stop="showCodeImg(item)"
                  :style="item.handleInfo?'color:red !important':''"
                >{{item.handleInfo?item.handleInfo:"查看"}}</span>
                <span style="width:10%;" class="modify">
                  <b class="del" @click.stop="delSignItem(item)" v-if="hasPerm('countersign:list:delete')">删除</b>
                  <b class="edit" @click.stop="$router.push({name:'modifyVipSign',query:{type:'edit',id:item.id}})" v-if="hasPerm('countersign:list:edit')">编辑</b>
                  <b class="detail" @click.stop="$router.push({name:'signInfo',query:{id:item.id}})" v-if="hasPerm('countersign:list:detail')">查看详情</b>
                </span>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:otherTmp>
          <div class="pagination-wrap">
            <!-- <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="nowPage"
              :page-size="limit"
              layout="prev, pager, next, jumper"
              :total="totalCount"
            ></el-pagination> -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="nowPage"
              :page-sizes="[10, 15, 20, 25]"
              :page-size="limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount"
            ></el-pagination>
          </div>
        </template>
      </commonTable>
    </div>
    <el-dialog title="二维码查看" :visible.sync="showQrcode" class="code" width="30%">
      <div id="qr-code"></div>
    </el-dialog>
  </div>
</template>

<script>
import commonTable from "./commonTable/commonTable";
import { vipSignList, enableSign, delSign } from "./../../api/vipSign";
export default {
  name: "vipSign",
  components: { commonTable },
  data() {
    return {
      searchVal:"",
      showQrcode: false,
      list: [],
      signType: -1,
      signOptions: [
        {
          label: "全部",
          value: -1
        },
        {
          label: "培训签到",
          value: 0
        },{
          label: "会议签到",
          value: 1
        }
      ],
      signOptionsFormat: {
        0: "培训签到",
        1: "会议签到",
      },
      limit: 10,
      nowPage: 1,
      totalCount: 0
    };
  },
  watch: {
    searchVal(val){
      if(val==""){
        this.getList()
      }
    },
    signType(val){
      this.getList();
    }
  },
  methods: {
    handleSizeChange(val) {
      this.limit = val;
      this.getList();
    },
    search(){
      this.nowPage = 1;
      this.getList();
    },
    delSignItem(item) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delSign({
          targetId:item.id
        }).then(res=>{
          if(res.code == 200){
            this.$message({
              type: "success",
              message: res.message
            });
            this.getList();
          }
        })
      });
    },
    nowSign(item) {
      let nowDate = new Date().getTime() / 1000;
      for (let i = 0; i < item.timeRanges.length; i++) {
        if (
          nowDate >= item.timeRanges[i].start &&
          // nowDate <= item.timeRanges[i].end + item.timeRanges[i].flexibleTime
          nowDate <= item.timeRanges[i].end
        ) {
          return item.timeRanges[i];
        }
      }
      return item.timeRanges[0];
    },
    showCodeImg(item) {
      if(item.handleInfo){
        return;
      }
      setTimeout(() => {
        $("#qr-code")[0].innerHTML = "";
      }, 300);
      setTimeout(() => {
        let qrcode = new QRCode("qr-code", {
          text: item.codeUrl,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      }, 500);
      this.showQrcode = true;
    },
    changeStatus(value, item) {
      console.log(item);
      enableSign({
        targetId: item.id,
        yes: value
      }).then(res => {
        this.$message({
          type: "success",
          message: res.message
        });
        this.getList();
      });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.nowPage = val;
      this.getList();
    },
    getList() {
      let data = {
        limit: this.limit,
        page: this.nowPage - 1,
        type: this.signType != null ? this.signType : -1,//类型：-1为全部，0为培训签到
        keyword:this.searchVal
      };
      vipSignList(data).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.list = res.data;
          this.totalCount = res.total;
        }
      });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style lang="scss" scoped>
@import "./vipSign.scss";
</style>