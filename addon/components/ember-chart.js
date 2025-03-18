import Component from '@glimmer/component';
import { action } from '@ember/object';
import Chart from 'chart.js/auto';

export default class EmberChart extends Component {
  constructor() {
    super(...arguments);

    this.plugins = this.args.plugins || [];
  }

  @action
  drawChart(element) {
    let { data, type, options, plugins, globals } = this.args;
    let chart = new Chart(element, {
      type,
      data,
      options,
      plugins,
      globals,
    });

    if (globals) {
      globals.forEach((plugin) => {
        Chart.pluginService.register(plugin);
      });
    }

    this.chart = chart;
  }

  @action
  updateChart() {
    let { chart, animate } = this.chart;
    let { data, options } = this.args;

    if (chart) {
      chart.data = data;
      chart.options = options;
      if (animate) {
        chart.update();
      } else {
        chart.update(0);
      }

      if (this.customLegendElement) {
        this.customLegendElement.innerHTML = chart.generateLegend();
      }
    }
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.chart.destroy();
  }
}
