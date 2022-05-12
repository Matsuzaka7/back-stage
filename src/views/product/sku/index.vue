<template>
  <div>
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" align="center" label="序号" width="80">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="110">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" width="80px" height="80px" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="weight" label="重量" width="80">
      </el-table-column>
      <el-table-column align="center" prop="price" label="价格" width="80">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="success"
            icon="el-icon-bottom"
            size="mini"
            v-if="row.isSale == 0"
            @click="sale(row)"
            style="background: #666; border: #666 solid 1px"
            >下架</el-button
          >
          <el-button
            type="success"
            icon="el-icon-top"
            size="mini"
            v-else
            @click="cancel(row)"
            >上架</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="getSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="getSkuList"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes,total"
      :total="total"
    >
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="(attr, index) in skuInfo.skuAttrValueList"
            :key="attr.id"
            style="margin-right: 10px"
            >{{ attr.attrId }} - {{ attr.valueId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" width="100%" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1, // 当前页数
      limit: 10, // 当前页面的数据条数
      records: [], // 存储sku列表的数据
      total: 0, // 存储分页器展示的数据
      skuInfo: {}, // sku详情数据
      drawer: false, // 显示抽屉的
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    async getSkuList(page = 1) {
      this.page = page;
      let res = await this.$API.sku.reqSkuList(this.page, this.limit);
      if (res.code === 200) {
        this.total = res.data.total;
        this.records = res.data.records;
      }
    },
    handleSizeChange(limit) {
      // 修改参数
      this.limit = limit;
      this.getSkuList();
    },
    // 上架
    async sale(row) {
      let res = await this.$API.sku.reqSale(row.id);
      if (res.code === 200) {
        this.$message.success("上架成功");
        this.getSkuList();
      }
    },
    // 下架
    async cancel(row) {
      let res = await this.$API.sku.reqCancel(row.id);
      if (res.code === 200) {
        this.$message.success("下架成功");
        this.getSkuList();
      }
    },
    // edit
    edit() {
      this.$message("正在开发中");
    },
    // 获取详情的方法
    async getSkuInfo(row) {
      // 展示抽屉
      this.drawer = true;
      let res = await this.$API.sku.reqSkuById(row.id);
      if (res.code === 200) {
        this.skuInfo = res.data;
      }
    },
  },
};
</script>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}

.el-col {
  margin: 10px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
