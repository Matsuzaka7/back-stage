<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- on-preview: 预览图片回调
        
         -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            v-for="(unselect, index) in unSelectSaleAttr"
            :key="unselect.id"
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table style="width: 100%" :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            prop="prop"
            label="序号"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!-- @close="handleClose(tag)" 点击删除的回调 -->
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "spuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        // 存储spu的信息
        category3Id: 0,
        description: "", // 描述
        spuName: "", // spu名称
        tmId: "", // 品牌id
        spuImageList: [
          // spu图片的信息
        ],
        spuSaleAttrList: [
          // 平台属性与属性值
        ],
      },
      tradMarkList: [], // 存储品牌信息
      spuImageList: [], // 存储spu图片
      saleAttrList: [], // 销售属性的数据
      attrIdAndAttrName: "", // 收集未选择的销售属性的id
    };
  },
  methods: {
    // 删除照片墙回调
    handleRemove(file, fileList) {
      // file 代表删除的图片 fileList 剩余的图
      // 收集照片墙图片
      this.spuImageList = fileList;
    },
    // 预览照片墙回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url; // 地址赋值
      this.dialogVisible = true; // 对话框显示
    },
    // 初始化spuForm数据
    async initSpuData(row) {
      // 获取SPU信息
      let res = await this.$API.spu.reqSpu(row.id);
      if (res.code === 200) {
        this.spu = res.data;
      }
      // 获取品牌信息
      let tradMarkResult = await this.$API.spu.reqTradMarkList();
      if (tradMarkResult.code === 200) {
        this.tradMarkList = tradMarkResult.data;
      }
      // 获取spu图片信息
      let spuImageResult = await this.$API.spu.reqSpuImageList(row.id);
      if (spuImageResult.code === 200) {
        // 因为展示的数据需要name与url属性,因此需要处理之后再添加
        let listArr = spuImageResult.data;
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
      // 获取全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 照片墙上传成功的回调
    handlerSuccess(response, file, fileList) {
      // 收集图片信息
      console.log(response, file, fileList);
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 将 attrIdAndAttrName 进行: 分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      // 添加新的销售属性
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      // 清空数据
      this.attrIdAndAttrName = "";
    },
    // 添加按钮的回调
    addSaleAttrValue(row) {
      this.$set(row, "inputVisible", true); // 控制btn与ipt的切换
      this.$set(row, "inputValue", "");
    },
    // 失去焦点
    handleInputConfirm(row) {
      // 判断是不是空串
      if (row.inputValue.trim() == "") {
        this.$message.error("属性值不能为空");
        return;
      }
      // 属性值不能重复
      let result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != row.inputValue
      );
      if (!result) return;
      // 整理数据
      let newSaleAttrValue = {
        baseSaleAttrId: row.baseSaleAttrId,
        saleAttrValueName: row.inputValue,
      };
      // 给属性值列表新增属性
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      row.inputVisible = false;
    },
    // 保存的回调
    async addOrUpdateSpu() {
      // 整理参数，照片墙的数据
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      let res = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (res.code === 200) {
        this.$message.success("保存成功");
        this.$emit("changeSceneSf", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
      }
      // 清楚数据
      Object.assign(this._data, this.$options.data());
    },
    // 点击添加按钮发请求
    async addSpuDate(id) {
      // 收集三级分类的id
      this.spu.category3Id = id;
      // 获取品牌属性
      let tradMarkResult = await this.$API.spu.reqTradMarkList();
      if (tradMarkResult.code === 200) {
        this.tradMarkList = tradMarkResult.data;
      }
      // 获取全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 取消按钮
    cancel() {
      // 切换场景
      this.$emit("changeSceneSf", { scene: 0, flag: "" });
      // 清理数据,
      // this.$options 可以获取配置对象的初始状态
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    // 计算未选择的销售属性
    unSelectSaleAttr() {
      // 过滤
      return this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name !== item1.saleAttrName; // 未选择的
        });
      });
    },
  },
};
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
