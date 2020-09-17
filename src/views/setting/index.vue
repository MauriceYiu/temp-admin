<template>
  <div class="systemSet">
    <el-form class="form-container">
      <el-tag>该页面设置为全局变量设置，设置完成马上生效，请谨慎操作！</el-tag>
      <el-form-item
        style="margin-bottom: 40px;"
        prop="title"
        v-for="(item,index) in fields"
        :key="index"
        :label="item.description+'('+item.type+')'"
      >
        <el-input v-model="rules[item.key]" />
      </el-form-item>
      <el-form-item>
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="submitForm"
        >发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  globalRuleGet,
  globalRuleEdit
} from "../../api/settings";
import { parseTime } from "@/utils";
import {getToken} from "@/utils/auth";
export default {
  name: "index",
  data() {
    return {
      fields: [],
      rules: {
        token:getToken()
      },
      loading: false,
      dialogTableVisible: false
    };
  },
  methods: {
    initData() {
      globalRuleGet().then(json => {
        if (json.status ===200) {
          this.rules = json.data.rule;
          this.fields = json.data.params;
        } else {

        }
      });
    },
    submitForm() {
      this.loading = true;
      this.rules.token = getToken();
      globalRuleEdit(this.rules).then(json => {
        if (json.status ===200) {
          this.$message({
            message: "保存成功！",
            type: json.status ? "success" : "error"
          });
        } else {
          this.$message({
            message: json.message,
            type: json.status ? "success" : "error"
          });
        }
        this.loading = false;
      });
    },
    handleDrag() {
      // this.$refs.select.blur()
    }
  },
  mounted() {
    this.initData();
  }
};
</script>

<style lang="scss" scoped>
.systemSet {
  padding: 10px 15px;
  .hiderow {
    visibility: hidden;
  }
  .el-table__expand-column {
    .cell {
      display: none;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }

  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
}
</style>
