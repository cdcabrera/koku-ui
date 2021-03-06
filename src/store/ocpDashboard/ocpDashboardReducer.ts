import { ActionType, getType } from 'typesafe-actions';
import { setWidgetTab } from './ocpDashboardActions';
import { OcpDashboardWidget } from './ocpDashboardCommon';
import {
  costSummaryWidget,
  cpuWidget,
  memoryWidget,
  volumeWidget,
} from './ocpDashboardWidgets';

export type OcpDashboardAction = ActionType<typeof setWidgetTab>;

export type OcpDashboardState = Readonly<{
  widgets: Record<number, OcpDashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OcpDashboardState = {
  currentWidgets: [
    costSummaryWidget.id,
    cpuWidget.id,
    memoryWidget.id,
    volumeWidget.id,
  ],
  widgets: {
    [costSummaryWidget.id]: costSummaryWidget,
    [cpuWidget.id]: cpuWidget,
    [memoryWidget.id]: memoryWidget,
    [volumeWidget.id]: volumeWidget,
  },
};

export function ocpDashboardReducer(
  state = defaultState,
  action: OcpDashboardAction
): OcpDashboardState {
  switch (action.type) {
    case getType(setWidgetTab):
      return {
        ...state,
        widgets: {
          ...state.widgets,
          [action.payload.id]: {
            ...state.widgets[action.payload.id],
            currentTab: action.payload.tab,
          },
        },
      };
    default:
      return state;
  }
}
