<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in spuAttrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item label="无线通讯">
            <el-select placeholder="请选择" value="">
              <el-option label="label" value="value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="(saleAttr, index) in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          border
          style="width: 100%"
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            prop="prop"
            label="label"
            width="80"
          >
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                v-if="row.isDefault == 0"
                type="primary"
                @click="changeDefault(row)"
                >设置默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "skuForm",
  data() {
    return {
      spuImageList: [], // 存储图片信息
      spuSaleAttrList: [], // 销售属性数据
      spuAttrInfoList: [], // 存储平台属性
      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        price: 0,
        skuDesc: "",
        skuName: "",
        weight: "",
        skuDefaultImg: "", // 默认图片
        skuImageList: [], // 收集图片
        skuAttrValueList: [], // 平台属性
        skuSaleAttrValueList: [], // 销售属性
      },
      spu: {},
      imageList: [],
    };
  },
  methods: {
    // 获取sku form数据
    async getData(category1Id, category2Id, spu) {
      // 收集父组件给的数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      // 获取图片
      let res = await this.$API.spu.reqSpuImageList(spu.id);
      if (res.code === 200) {
        let list = res.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      // 获取销售属性数据
      let res1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (res1.code === 200) {
        this.spuSaleAttrList = res1.data;
      }
      // 获取平台属性数据
      let res2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (res2.code === 200) {
        this.spuAttrInfoList = res2.data;
      }
    },
    // table 复选框按钮的回调
    handleSelectionChange(params) {
      // 获取到用户选中的数据
      this.imageList = params;
    },
    // 排他操作
    changeDefault(row) {
      // 变为
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 取消
    cancel() {
      this.$emit("changeScene", 0);
      // 清数据
      Object.assign(this._data, this.$options.data());
    },
    // 保存
    async save() {
      // 整理参数
      this.skuInfo.skuAttrValueList = this.spuAttrInfoList.reduce(
        (prev, item) => {
          if (item.attrIdAndValueId) {
            const [attrId, valueId] = item.attrIdAndValueId.split(":");
            prev.push({ attrId, valueId });
          }
          return prev;
        },
        []
      );
      // 整理销售属性
      this.skuInfo.skuSaleAttrValueList = this.spuSaleAttrList.reduce(
        (prev, item) => {
          if (item.attrIdAndValueId) {
            const [saleAttrId, saleAttrValueId] =
              item.attrIdAndValueId.split(":");
            prev.push({ saleAttrId, saleAttrValueId });
          }
          return prev;
        },
        []
      );
      // 整理图片数据
      this.skuInfo.skuImageList = this.imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      let res = await this.$API.spu.reqAddSku(this.skuInfo);
      if (res.code === 200) {
        this.$message.success("添加SKU成功");
        this.$emit("changeScene", 0);
      }
    },
  },
};
</script>

<style></style>
