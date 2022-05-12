<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
export default {
  name: "lineChart",
  props: ["title"],
  mounted() {
    // 初始化
    this.barCharts = echarts.init(this.$refs.charts);
    this.barCharts.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "50%",
          data: [110, 52, 220, 144, 300, 160, 220, 270, 170, 200, 130, 80],
          color: "#666",
        },
      ],
    });
  },
  watch: {
    title() {
      this.barCharts.setOption({
        title: {
          text: this.title + "趋势",
        },
      });
    },
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>
