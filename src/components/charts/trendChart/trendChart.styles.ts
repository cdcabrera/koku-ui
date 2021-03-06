import { StyleSheet } from '@patternfly/react-styles';
import {
  chart_color_green_100,
  chart_color_green_200,
  chart_color_green_300,
  chart_color_green_400,
  chart_color_green_500,
  global_disabled_color_200,
  global_FontFamily_sans_serif,
} from '@patternfly/react-tokens';

export const chartStyles = {
  // See: https://github.com/project-koku/koku-ui/issues/241
  colorScale: [
    global_disabled_color_200.value,
    chart_color_green_100.value,
    chart_color_green_200.value,
    chart_color_green_300.value,
    chart_color_green_400.value,
    chart_color_green_500.value,
  ],
  legend: {
    labels: {
      fontFamily: global_FontFamily_sans_serif.value,
      fontSize: 14,
    },
    minWidth: 175,
  },
  previousMonth: {
    data: {
      fill: 'none',
      stroke: global_disabled_color_200.value,
    },
  },
  currentMonth: {
    data: {
      fill: 'none',
      stroke: '#A2DA9C',
    },
  },
  yAxis: {
    axisLabel: {
      padding: 15,
    },
    grid: {
      stroke: 'none',
    },
    ticks: {
      stroke: 'none',
    },
    tickLabels: {
      fontSize: 0,
    },
  },
  xAxis: {
    axisLabel: {
      padding: 40,
    },
    grid: {
      stroke: 'none',
    },
    ticks: {
      stroke: 'none',
    },
  },
};

export const styles = StyleSheet.create({
  chartContainer: {
    ':not(foo) svg': {
      overflow: 'visible',
    },
  },
});
