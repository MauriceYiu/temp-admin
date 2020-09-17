<template>
  <div id="gift">
    <el-tabs v-model="activeNameGift" @tab-click="handleClick">
      <el-tab-pane label="直播礼物" name="first" v-if="hasPerm('settings:gifts:live')">
        <giftLive ref="giftLive"></giftLive>
      </el-tab-pane>
      <el-tab-pane label="打赏礼物" name="second" v-if="hasPerm('settings:gifts:bestow')">
        <giftEvaluation ref="giftEvaluation"></giftEvaluation>
      </el-tab-pane>
      <el-tab-pane label="评价设置" name="third" v-if="hasPerm('settings:gifts:evaluate')"></el-tab-pane>
    </el-tabs>

    <div class="newAdd" @click="addTag(0)" v-if="activeNameGift =='first' && hasPerm('settings:gifts:live:add')">添加</div>
    <div class="newAdd" @click="addTag(1)" v-if="activeNameGift =='second' && hasPerm('settings:gifts:bestow:add')">添加</div>

  </div>
</template>

<script>

  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import giftLive from "./components/giftLive"; // base on element-ui
  import giftEvaluation from "./components/giftEvaluation"; // base on element-ui
  import {getToken} from "@/utils/auth";


  export default {
    name: "gift",
    directives: {
      waves,
      elDragDialog
    },
    components: {
      giftLive,
      giftEvaluation,
    },
    data() {
      return {
        activeNameGift: 'first',
      };
    },
    methods: {
      addTag(num) {
        switch (num) {
          case 0:
            this.$router.push({
              name: "giftLiveDetail", params: {
                id: 0
              }
            })
            break;
          case 1:
            this.$router.push({
              name: "giftEvaluationDetail", params: {
                id: 0
              }
            })
            break;
        }

      },
      handleClick(tab, event) {
        console.log(this.activeNameGift);
        sessionStorage.setItem('activeNameGift', this.activeNameGift)
        this.getList();
      },
      getList() {
        switch (this.activeNameGift) {
          case "first":
            this.$refs.giftLive.getList();
            break;
          case "second":
            this.$refs.giftEvaluation.getList();
            break;
          case "third":
            this.$router.push({
              name: "giftLiveDetail"
            })

            this.$router.push({name: "appraiseSet"})
            break;
        }
      },
    },
    mounted() {
      // console.log(sessionStorage.getItem('activeNameGift'));
      // if (sessionStorage.getItem('activeNameGift')) {
      //   this.activeNameGift = sessionStorage.getItem('activeNameGift')
      // }
      this.getList()
    }
  };
</script>

<style>
  #gift .el-tabs__nav {
    margin-left: 40px;
  }

  #gift .el-tabs__nav-wrap::after {
    background: none;
  }

  #gift .el-tabs__header {
    margin: 0;
  }

  #gift .el-tabs__content {
    background: rgba(245, 246, 250, 0.61);
    min-height: 100vh;
  }
  .el-table::before{
    background: none;
  }
</style>
<style lang="scss" scoped>
  #gift {
    position: relative;
    min-height: calc(100vh - 60px);

    .newAdd {
      position: absolute;
      right: 27px;
      top: 10px;
      color: #F65860;
      font-size: 14px;
      cursor: pointer;
    }

  }
</style>
