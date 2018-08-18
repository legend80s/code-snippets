import d3 from 'd3';
import nv from 'nvd3';

const Chart = {
  LineChart: 'lineChart',
};

export default class OSNvd3Controller {
  constructor(scope) {
    this.scope = scope;

    this.init();
    this.render();
  }

  init() {
    const defaultChartOptions = {
      type: Chart.LineChart,
      useInteractiveGuideline: true,
      showLegend: true,
      showYAxis: true,
      showXAxis: true,
    };

    // 给 options 设置默认值
    if (typeof this.options !== 'object') { this.options = {}; }

    // 给 chart 设置默认值
    this.options.chart = Object.assign({}, defaultChartOptions, this.options.chart);

    this.initChartConfig(this.options);
  }

  initChartConfig(options) {
    switch (options.chart.type) {
      case Chart.LineChart:
        this.initLineChart(options);
        break;
      default:
        throw new RangeError(`图表类型（${options.chart.type}）不支持，目前仅支持 ${Chart.LineChart}`);
    }
  }

  initLineChart(options) {
    const chartOptions = options.chart;

    nv.addGraph(() => {
      const chart = nv.models.lineChart();

      /* eslint-disable no-unused-expressions */
      chartOptions.x && chart.x(chartOptions.x);
      chartOptions.y && chart.y(chartOptions.y);

      chartOptions.useInteractiveGuideline && chart.useInteractiveGuideline(true);

      chartOptions.showLegend && chart.showLegend(true);
      chartOptions.showYAxis && chart.showYAxis(true);
      chartOptions.showXAxis && chart.showXAxis(true);

      typeof chartOptions.noData === 'string' ? chart.noData(chartOptions.noData) : chart.noData('暂无数据');

      if (chartOptions.xAxis) {
        chartOptions.xAxis.axisLabel && chart.xAxis.axisLabel(chartOptions.xAxis.axisLabel);
        chartOptions.xAxis.tickFormat && chart.xAxis.tickFormat(chartOptions.xAxis.tickFormat);
      }

      if (chartOptions.yAxis) {
        chartOptions.yAxis.axisLabel && chart.yAxis.axisLabel(chartOptions.yAxis.axisLabel);
        chartOptions.yAxis.tickFormat && chart.yAxis.tickFormat(chartOptions.yAxis.tickFormat);
      }
      /* eslint-enable no-unused-expressions */

      nv.utils.windowResize(() => { chart.update(); });

      this.chart = chart;
      this.selector = d3.select('.os-nvd3 svg');

      if (this.data) {
        this.draw(this.data);
      }
    });
  }

  render() {
    this.scope.$on('$destroy', () => {
      this.beforeDestroy();
    });
  }

  draw(data) {
    // console.log('draw with data', data);
    this.selector
      .datum(data)
      .call(this.chart);
  }

  /**
   * 组件 destroy 之前移除残留的 tooltip
   * @see [Tooltips show on hover but don't disappear correctly](https://github.com/krispo/angular-nvd3/issues/427)
   *
   * @return {void}
   */
  beforeDestroy() {
    // remove ghost tooltip after modal closed
    d3.select('.nvtooltip').remove();
  }
}

OSNvd3Controller.$inject = ['$scope'];
