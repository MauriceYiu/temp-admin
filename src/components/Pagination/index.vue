<template>
  <div class="right" style="margin-top: 20px">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      limit:10,
      page:0,
    };
  },
  methods: {
    handleSizeChange(val) {
      this.limit=val
      this.$emit('fetchData',{limit:this.limit,page:this.page})
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.page=val-1
      this.$emit('fetchData',{limit:this.limit,page:this.page})
      console.log(`当前页: ${val}`);
    }
  },
  created() {

  }
}
</script>
