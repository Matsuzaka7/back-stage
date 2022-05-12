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
        type: "category",
        show: false,
      },
      yAxis: {
        type: "value",
        show: false,
      },
      series: [
        {
          data: [150, 300, 170, 120, 159, 215, 130, 310, 170],
          type: "bar",
          color: "#666",
        },
      ],
      global: false, // 缺省为 false
      tooltip: {},
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
