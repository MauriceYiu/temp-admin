<template>
  <div class="signDetail">
    <el-form class="form-container" ref="postForm" label-width="154px">
      <el-form-item label="签到天数" required>
        <el-input
          style="width:600px;"
          type="number"
          v-model="formParams.days"
          placeholder="请输入连续签到天数"
        />
      </el-form-item>


      <el-form-item prop="title" label="优惠券信息" required>
        <div class="information">
          <div class="item" v-for="(item,index) in formParams.items" :key="index">
            <div class="itemsub">
              <el-button v-if="index>0" @click="itemDel(index)" style="color: red;margin-left: 20px;cursor: pointer;" type="text">删除
              </el-button>
              <el-form class="form-container" ref="postForm" label-width="120px">
                <div class="textType">
                  <el-form-item label="优惠券ID" style="margin-bottom: 10px">
                    <el-input
                      maxlength="10"
                      minlength="2"
                      style="width:300px;"
                      v-model="item.couponId"
                      placeholder="请输入优惠券ID"
                    />
                  </el-form-item>
                  <el-form-item label="发放张数" style="margin-bottom: 10px">
                    <el-input
                      maxlength="4"
                      minlength="1"
                      style="width:300px;"
                      v-model="item.amount"
                      placeholder="请输入发放张数，大于0"
                    />
                  </el-form-item>
                </div>
              </el-form>

              <!--<span v-if="index>0" @click="itemDel(index)"-->
              <!--style="color: red;margin-left: 20px;cursor: pointer;">删除</span>-->


            </div>
          </div>
          <el-button icon="el-icon-plus" style="margin-left: 10px;" type="text"
                     @click="addInfo">增加
          </el-button>

        </div>
      </el-form-item>

      <el-form-item label="启用" prop="enable">
        <el-checkbox v-model="formParams.enable">开启</el-checkbox>
      </el-form-item>


      <el-form-item>
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="info"
          @click="submitForm"
        >提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  import {
    crcEdit,
    crcDetail,
  } from "../../api/settings";
  import waves from "@/directive/waves"; // 水波纹指令
  import {parseTime, showDecimal} from "@/utils/index";
  import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
  import {getToken} from "@/utils/auth";
  import pagination from '@/components/Pagination/index'
  import Tinymce1 from '@/components/Tinymce'


  export default {
    name: "signDetail",
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
        loading: false,
        formParams: {
          days: null,
          enable: true,
          rewardId: 0,
          items: [
            {
              couponId: null,
              amount: null,
            }
          ],
          token: getToken(),
          type: "register",
        },
      };
    },
    methods: {
      changeEnable() {
        this.formParams.enable = !this.formParams.enable;
      },
      itemDel(index) {
        this.formParams.items.splice(index, 1)
      },
      //第三步添加问题
      addInfo() {
        this.formParams.items.push({
          id: null,
          num: null,
        });
      },
      initData() {
        crcDetail({
          targetId: this.$route.params.id,
          token: getToken()
        }).then(json => {
          if (json.status === 200) {
            this.formParams.days = json.data.days;
            this.formParams.enable = json.data.enable;
            this.formParams.rewardId = json.data.id;
            this.formParams.items = json.data.items;
          } else {

          }
        });


      },
      submitForm() {
        console.log(this.formParams);
        if (!this.formParams.days) {
          this.$message({
            message: "请输入连续签到天数",
            type: "error"
          });
          return false;
        }

        let itemsArr = this.formParams.items;
        for (let i = 0; i < itemsArr.length; i++) {
          if (!itemsArr[i].couponId) {
            this.$message({
              message: "请输入优惠券ID",
              type: "error"
            });
            return false;
          }
          if (!itemsArr[i].amount) {
            this.$message({
              message: "请输入发放张数",
              type: "error"
            });
            return false;
          }
        }

        this.loading = true;
        crcEdit(this.formParams).then(json => {
          this.loading = false;
          if(json.status ===200){
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });

            this.$router.push({
              name: "couponReward"
            })
            this.formParams = {
              days: null,
              enable: true,
              rewardId: 0,
              items: [
                {
                  couponId: null,
                  amount: null,
                }
              ],
              token: getToken(),
              type: "register",
            }
          }else {

          }
        });
      },
    },
    mounted() {
      // console.log(this.$route.params.id);
      if (parseInt(this.$route.params.id) > 0) {
        this.initData();
      }
    }
  };
</script>
<style lang="scss" scoped>
  .signDetail {
    padding: 15px;
    .item{
      width: 600px;
      border: 1px solid #DCDFE6;
      margin-bottom: 20px;
      .itemsub{
        padding-top: 10px;
      }
    }


  }
</style>
