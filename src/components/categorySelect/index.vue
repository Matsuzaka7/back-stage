<template>
  <div>
    <!--
      :inline: 行内表单
     -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类" value="">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="getCateGory2List(cForm.category1Id)"
          :disabled="show"
        >
          <el-option
            v-for="c1 in category1List"
            :label="c1.name"
            :value="c1.id"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类" value="">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          @change="getCateGory3List(cForm.category2Id)"
          :disabled="show"
        >
          <el-option
            v-for="c2 in category2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类" value="">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="CateGory3List"
          :disabled="show"
        >
          <el-option
            v-for="c3 in category3List"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "categorySelect",
  props: ["show"],
  data() {
    return {
      category1List: [], // 一级分类列表
      category2List: [], // 2级分类列表
      category3List: [], // 3级分类列表
      cForm: {
        category1Id: "", // 一级分类列表选择的id
        category2Id: "", // 2级分类列表选择的id
        category3Id: "", // 3级分类列表选择的id
      },
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    // 获取1级数据
    async getCategory1List() {
      let res = await this.$API.attr.reqCategory1List();
      if (res.code === 200) {
        this.category1List = res.data;
      }
    },
    // 获取2级数据
    async getCateGory2List(id) {
      // 清空数据
      if (this.category2List) {
        this.category2List = [];
        this.category3List = [];
        this.cForm.category2Id = "";
        this.cForm.category3Id = "";
      }
      let res = await this.$API.attr.reqCategory2List(id);
      if (res.code === 200) {
        this.category2List = res.data;
      }
    },
    // 获取3级数据
    async getCateGory3List(id) {
      // 清空数据
      if (this.category3List) {
        this.category3List = [];
        this.cForm.category3Id = "";
      }
      let res = await this.$API.attr.reqCategory3List(id);
      if (res.code === 200) {
        this.category3List = res.data;
      }
    },
    // 点击三级数据后
    CateGory3List() {
      this.$emit("getCategoryId", this.cForm);
    },
  },
};
</script>

<style>
</style>