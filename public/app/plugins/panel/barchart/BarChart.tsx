import React from 'react';
import { cloneDeep } from 'lodash';
import { DataFrame, TimeRange } from '@grafana/data';
import { GraphNG, GraphNGProps, PlotLegend, UPlotConfigBuilder, usePanelContext, useTheme2 } from '@grafana/ui';
import { LegendDisplayMode } from '@grafana/schema';
import { BarChartOptions } from './types';
import { preparePlotConfigBuilder, preparePlotFrame } from './utils';
import { PropDiffFn } from '../../../../../packages/grafana-ui/src/components/GraphNG/GraphNG';

/**
 * @alpha
 */
export interface BarChartProps
  extends BarChartOptions,
    Omit<GraphNGProps, 'prepConfig' | 'propsToDiff' | 'renderLegend' | 'theme'> {}

const propsToDiff: Array<string | PropDiffFn> = [
  'orientation',
  'barWidth',
  'groupWidth',
  'stacking',
  'showValue',
  (prev: BarChartProps, next: BarChartProps) => next.text?.valueSize === prev.text?.valueSize,
];

export const BarChart: React.FC<BarChartProps> = (props) => {
  const theme = useTheme2();
  const { eventBus } = usePanelContext();

  const renderLegend = (config: UPlotConfigBuilder) => {
    if (!config || props.legend.displayMode === LegendDisplayMode.Hidden) {
      return null;
    }

    return <PlotLegend data={props.frames} config={config} maxHeight="35%" maxWidth="60%" {...props.legend} />;
  };

  const prepConfig = (alignedFrame: DataFrame, allFrames: DataFrame[], getTimeRange: () => TimeRange) => {
    const { timeZone, orientation, barWidth, showValue, groupWidth, stacking, legend, tooltip, text } = props;

    return preparePlotConfigBuilder({
      frame: alignedFrame,
      getTimeRange,
      theme,
      timeZone,
      eventBus,
      orientation,
      barWidth,
      showValue,
      groupWidth,
      stacking,
      legend,
      tooltip,
      text,
      allFrames: props.frames,
    });
  };

  return (
    <GraphNG
      // My heart is bleeding with the clone deep here, but nested options...
      {...cloneDeep(props)}
      theme={theme}
      frames={props.frames}
      prepConfig={prepConfig}
      propsToDiff={propsToDiff}
      preparePlotFrame={preparePlotFrame}
      renderLegend={renderLegend}
    />
  );
};
BarChart.displayName = 'BarChart';
