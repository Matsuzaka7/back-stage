<template>
  <div>
    <el-card style="margin: 20px 0">
      <categorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></categorySelect>
    </el-card>
    <el-card>
      <!-- 有三部分切换 -->
      <div v-show="scene == 0">
        <!-- 展示spu列表的结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click.native="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>

          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>

          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                title="增加"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改"
                @click="upDateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看"
                @click="handler(row)"
              ></el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes,total"
          :total="total"
        >
        </el-pagination>
      </div>
      <spuForm
        ref="spu"
        v-show="scene == 1"
        @changeSceneSf="changeSceneSf"
      ></spuForm>
      <skuForm
        v-show="scene == 2"
        ref="sku"
        @changeScene="changeScene"
      ></skuForm>
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的SKU列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table :data="skuList" style="width: 100%" v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="默认图片" width="width">
          <template slot-scope="{ row, $index }">
            <img :src="row.skuDefaultImg" alt="" width="100px" height="100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import spuForm from "./SpuForm";
import skuForm from "./SkuForm";
export default {
  name: "Spu",
  components: {
    spuForm,
    skuForm,
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1, // 分页器第几页
      limit: 3, //每页展示多少数据
      records: [], // spu列表数据
      total: 0, // 分页器一共条数
      scene: 0, // 0: 展示SPU列表, 1: 展示添加SPU|修改SPU, 2: 添加SKU
      dialogTableVisible: false, // 控制会话框显示隐藏
      spu: {},
      skuList: [], // sku的数据
      loading: true,
    };
  },
  methods: {
    // 三级联动子传父事件
    getCategoryId(id) {
      // categoryId获取1.2.3级分类的id,level是区分几级id
      this.category1Id = id.category1Id;
      this.category2Id = id.category2Id;
      this.category3Id = id.category3Id;
      // 获取spu数据
      this.getSpuList();
    },
    // 获取spu列表数据
    async getSpuList(page = 1) {
      this.page = page;
      // 参数:page页数.limit每页几条数据,二级id
      let res = await this.$API.spu.reqSpuList(
        this.page,
        this.limit,
        this.category3Id
      );
      if (res.code === 200) {
        this.total = res.data.total;
        this.records = res.data.records;
      }
    },
    // 分页器数据条数变化回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 点击添加SPU的回调
    addSpu() {
      this.scene = 1;
      // 通知子组件发请求
      this.$refs.spu.addSpuDate(this.category3Id);
    },
    upDateSpu(row) {
      this.scene = 1;
      // 获取子组件SpuForm
      this.$refs.spu.initSpuData(row);
    },
    // 自定义事件回调(spuForm)
    changeSceneSf({ scene, flag }) {
      console.log(scene);
      this.scene = scene;
      if (flag == "修改") {
        // 修改数据,停留在当前页
        this.getSpuList(this.page);
      } else {
        // 新增数据,回到第一页
        this.getSpuList();
      }
    },
    // 删除spu
    async deleteSpu(row) {
      let res = await this.$API.spu.reqDeleteSpu(row.id);
      if (res.code === 200) {
        this.$message.success("删除成功");
        // 如果当前的列表个数小于1,就回到上一页
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    // 添加sku按钮
    addSku(row) {
      // 切换场景
      this.scene = 2;
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    // 自定义回调(skuForm)
    changeScene(scene) {
      this.scene = scene;
    },
    // 查看sku回调
    async handler(row) {
      this.dialogTableVisible = true;
      // 保存spu信息
      this.spu = row;
      // 获取数据展示
      let res = await this.$API.spu.reqSkuList(this.spu.id);
      if (res.code === 200) {
        this.skuList = res.data;
        this.loading = false;
      }
    },
    // 关闭对话框回调
    close(done) {
      this.loading = true;
      // 清除sku数据
      this.skuList = [];
      done();
    },
  },
};
</script>

<style></style>
