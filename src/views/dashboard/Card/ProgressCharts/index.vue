<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
export default {
  name: "lineChart",
  mounted() {
    // 初始化
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: {
        show: false,
        min: 0,
        max: 100,
      },
      yAxis: {
        type: "value",
        type: "category",
        show: false,
      },
      series: [
        {
          data: [78],
          type: "bar",
          showBackground: true,
          color: "#666",
          barWidth: 10, // 宽度
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.4)",
          },
        },
      ],
      grid: {
        right: 10,
        top: 0,
        left: 10,
        bottom: 0,
      },
    });
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>
