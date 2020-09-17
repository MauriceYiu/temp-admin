<template>
  <div class="signDetail">
    <el-form class="form-container" ref="postForm" label-width="154px">
      <el-form-item label="业务员" required>
        <el-cascader
          style="width: 600px"
          placeholder="请选择业务员"
          :options="options"
          :props="{ multiple: true }"
          filterable></el-cascader>
      </el-form-item>


      <el-form-item prop="title" label="优惠券信息" required>
        <div class="information">
          <div class="item" v-for="(item,index) in formParams.items" :key="index">
            <div class="itemsub">
              <el-button v-if="index>0" @click="itemDel(index)" style="color: red;margin-left: 20px;cursor: pointer;"
                         type="text">删除
              </el-button>
              <el-form class="form-container" ref="postForm" label-width="120px">
                <div class="textType">
                  <el-form-item label="优惠券ID" style="margin-bottom: 10px">
                    <el-input
                      maxlength="10"
                      minlength="2"
                      style="width:300px;"
                      v-model="item.name"
                      placeholder="请输入优惠券ID"
                    />
                  </el-form-item>
                  <el-form-item label="发放张数" style="margin-bottom: 10px">
                    <el-input
                      maxlength="4"
                      minlength="1"
                      style="width:300px;"
                      v-model="item.unit"
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
    serviceEdit,
    serviceDetail,
  } from "../../api/business";
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
        options: [
          {
            value: 'zhinan',
            label: '指南',
            children: [
              {
                value: 'yizhi',
                label: '一致'
              }, {
                value: 'fankui',
                label: '反馈'
              },
            ]
          },
          {
            value: 'daohang',
            label: '导航',
            children: [
              {
                value: 'cexiangdaohang',
                label: '侧向导航'
              }, {
                value: 'dingbudaohang',
                label: '顶部导航'
              }
            ]
          },
        ],
        loading: false,
        formParams: {
          days: null,
          enable: true,
          items: [
            {
              id: null,
              num: null,
            }
          ],
          token: getToken(),
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
        serviceDetail({
          targetId: this.$route.params.id,
          token: getToken()
        }).then(json => {
          if (json.status === 200) {
            this.formParams.serviceId = json.data.id;
            this.formParams.name = json.data.name;

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
          } else {

          }
        });


      },
      submitForm() {
        console.log(this.formParams);
        if (!this.formParams.days) {
          this.$message({
            message: "请输入业务名称",
            type: "error"
          });
          return false;
        }

        if (!this.formParams.days) {
          this.$message({
            message: "请输入业务价格",
            type: "error"
          });
          return false;
        }


        let itemsArr = this.formParams.items;
        for (let i = 0; i < itemsArr.length; i++) {
          if (!itemsArr[i].id) {
            this.$message({
              message: "请输入文本名称",
              type: "error"
            });
            return false;
          }
          if (!itemsArr[i].num) {
            this.$message({
              message: "请输入文本单位",
              type: "error"
            });
            return false;
          }
        }

        this.loading = true;
        serviceEdit(this.formParams).then(json => {
          this.loading = false;
          if (json.status === 200) {
            this.$message({
              message: "保存成功！",
              type: json.status ? "success" : "error"
            });

            this.dialogTableVisible = false;
            this.$router.push({
              name: "business"
            })
            this.formParams = {
              days: null,
              enable: true,
              items: [
                {
                  id: null,
                  num: null,
                }
              ],
            }
          }else {
            this.$message({
              message: json.message,
              type: "error"
            });
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
    .item {
      width: 600px;
      border: 1px solid #DCDFE6;
      margin-bottom: 20px;
      .itemsub {
        padding-top: 10px;
      }
    }

  }
</style>
