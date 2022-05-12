<template>
  <div>
    <el-card style="margin: 20px 0">
      <categorySelect
        :show="!isShowTable"
        @getCategoryId="getCategoryId"
      ></categorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格 -->
        <el-table border :data="attrList" style="width: 100">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>

          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>

          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0px 10px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="180">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
                >修改
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                @keydown.native.enter="row.flag = false"
                :ref="$index"
              ></el-input>
              <div
                v-if="!row.flag"
                @blur="toLook(row, $index)"
                @click="toEdit(row, $index)"
              >
                {{ row.valueName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "attr",
  data() {
    return {
      flag: true,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [], // 接收服务器的数据
      isShowTable: true, // 控制表格显示隐藏
      // 收集新增属性
      attrInfo: {
        attrName: "", // 属性名
        attrValueList: [
          // 属性值
        ],
        categoryId: 0, // 值的id
        categoryLevel: 3, // 代表几级分类的id
      },
    };
  },
  methods: {
    // 自定义事件，子传给父的id
    getCategoryId(id) {
      this.category1Id = id.category1Id;
      this.category2Id = id.category2Id;
      this.category3Id = id.category3Id;
      this.getAttrList();
    },
    // 获取平台属性的数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let res = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (res.code === 200) {
        this.attrList = res.data;
      }
    },
    // 添加属性值
    addAttrValue() {
      // 添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 属性id，id就是服务器返回的数据属性名id。
        valueName: "",
        flag: true,
      });
      // 添加属性也需要给新增的这个ipt获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 添加属性按钮
    addAttr() {
      this.isShowTable = false; // 切换table显示隐藏
      // 清空数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 修改属性
    updateAttr(row) {
      this.isShowTable = false;
      this.attrInfo = JSON.parse(JSON.stringify(row));
      this.attrInfo.attrValueList.forEach((item) => {
        // 添加flag属性 用于给点击之后进入修改模式，直接push可以添加，但不是响应式的，需要用vue.$set
        this.$set(item, "flag", false);
      });
    },
    // 失去焦点回调
    toLook(row, index) {
      // 如果用户输入的是空串那么就不能切换
      if (row.valueName == "") {
        this.$message("不能为空");
        this.$refs[index].focus();
        return;
      }
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        // 如果数组中有这个值就不新增
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) return true;
      row.flag = false;
    },
    // 点击div 将ipt变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      // 点击div之后，浏览器需要重新渲染，不可能立马得到ipt标签
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
      //
    },
    // 气泡确认框确定按钮的回调
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 保存按钮，添加属性或修改
    async addOrUpdateAttr() {
      // 将属性值为空的删掉，将属性中的flag删除再提交
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // 过滤空的
          if (item.valueName != "") {
            // 删除flag属性
            delete item.flag;
            return true;
          }
        }
      );
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.isShowTable = true;
        this.$message.success("保存成功");
        // 保存成功后需要再次获取平台属性展示
        this.getAttrList();
      } catch (err) {
        this.isShowTable = true;
      }
    },
  },
};
</script>

<style>
</style>