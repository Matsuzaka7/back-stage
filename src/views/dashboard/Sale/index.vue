<template>
  <div>
    <el-card style="margin: 10px 0">
      <div slot="header" class="flex">
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visited"></el-tab-pane>
        </el-tabs>
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <el-date-picker
            v-model="date"
            value-format="yyyy-MM-dd"
            class="date"
            size="mini"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
      </div>
      <div style="height: 300px">
        <el-row :gutter="10">
          <el-col :span="18">
            <div class="charts"><Bar :title="title"></Bar></div>
          </el-col>
          <el-col :span="6">
            <h3 style="margin: 0; color: #464646">门店{{ title }}排名</h3>
            <ul>
              <li class="rflex">
                <span class="rindex">1</span>
                <span class="rcontent">麦当劳</span>
                <span class="rvalue">312,148</span>
              </li>
              <li class="rflex">
                <span class="rindex">2</span>
                <span class="rcontent">海底捞</span>
                <span class="rvalue">299,123</span>
              </li>
              <li class="rflex">
                <span class="rindex">3</span>
                <span class="rcontent">汉堡王</span>
                <span class="rvalue">258,184</span>
              </li>
              <li class="rflex">
                <span class="rindex o">4</span>
                <span class="rcontent">真功夫</span>
                <span class="rvalue">214,652</span>
              </li>
              <li class="rflex">
                <span class="rindex o">5</span>
                <span class="rcontent">康师傅</span>
                <span class="rvalue">196,224</span>
              </li>
              <li class="rflex">
                <span class="rindex o">6</span>
                <span class="rcontent">绝味鸭脖</span>
                <span class="rvalue">153,548</span>
              </li>
              <li class="rflex">
                <span class="rindex o">7</span>
                <span class="rcontent">古茗奶茶</span>
                <span class="rvalue">102,367</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import Bar from "./bar/index.vue";
import dayJs from "dayjs";
export default {
  name: "sale",
  components: {
    Bar,
  },
  data() {
    return {
      activeName: "sale", // 默认展示
      date: [], // 收集时间数据
    };
  },
  computed: {
    // 计算标题
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
  },
  methods: {
    // 本天
    setDay() {
      const day = dayJs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    // 本周
    setWeek() {
      const Start = dayJs().day(1).format("YYYY-MM-DD");
      const End = dayJs().day(7).format("YYYY-MM-DD");
      this.date = [Start, End];
    },
    // 本月
    setMonth() {
      const Start = dayJs().startOf("month").format("YYYY-MM-DD");
      const End = dayJs().endOf("month").format("YYYY-MM-DD");
      this.date = [Start, End];
    },
    // 本年
    setYear() {
      const Start = dayJs().startOf("year").format("YYYY-MM-DD");
      const End = dayJs().endOf("year").format("YYYY-MM-DD");
      this.date = [Start, End];
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 300px;
  margin-top: 18px;
}
ul li {
  height: 12%;
  padding-left: 14px;
}
.o {
  color: #303133 !important;
  background-color: transparent !important;
}
.rflex {
  display: flex;
  line-height: 20px;
}
.rindex {
  display: inline-block;
  margin-right: 20px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  background-color: #444;
  color: #fff;
  text-align: center;
}
.rcontent {
  flex: 1;
}
.rvalue {
  display: inline-block;
  text-align: right;
}
.charts {
  width: 100%;
  height: 300px;
}
.flex {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}

.right span {
  cursor: pointer;
  margin: 0 20px;
  font-size: 14px;
  color: #303133;
}
.right span:hover {
  color: #409eff;
  text-decoration: underline;
}
.date {
  width: 250px;
  margin: 0 20px;
}
</style>
