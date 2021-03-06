import { Title } from '@patternfly/react-core';
import { getQuery, OcpQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import {
  OcpReportSummaryItem,
  OcpReportSummaryItems,
} from 'components/reports/ocpReportSummary';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpReportsActions, ocpReportsSelectors } from 'store/ocpReports';
import { formatValue } from 'utils/formatValue';
import { formatCurrency } from 'utils/formatValue';
import { ComputedOcpReportItem } from 'utils/getComputedOcpReportItems';
import { styles } from './detailsWidgetModal.styles';

interface DetailsWidgetViewOwnProps {
  groupBy: string;
  item: ComputedOcpReportItem;
}

interface DetailsWidgetViewStateProps {
  queryString?: string;
  report?: OcpReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsWidgetViewDispatchProps {
  fetchReport?: typeof ocpReportsActions.fetchReport;
}

type DetailsWidgetViewProps = DetailsWidgetViewOwnProps &
  DetailsWidgetViewStateProps &
  DetailsWidgetViewDispatchProps &
  InjectedTranslateProps;

const reportType = OcpReportType.cost;

class DetailsWidgetViewBase extends React.Component<DetailsWidgetViewProps> {
  constructor(props: DetailsWidgetViewProps) {
    super(props);
  }

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsWidgetViewProps) {
    const { fetchReport, queryString } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportType, queryString);
    }
  }

  public render() {
    const { report, reportFetchStatus, t } = this.props;

    const cost = formatCurrency(
      report && report.meta && report.meta.total
        ? report.meta.total.cost.value
        : 0
    );

    return (
      <>
        <div className={styles.subTitle}>
          <Title size="lg">
            {t('ocp_details.cost_value', { value: cost })}
          </Title>
        </div>
        <div className={styles.mainContent}>
          <OcpReportSummaryItems
            idKey="project"
            report={report}
            status={reportFetchStatus}
          >
            {({ items }) =>
              items.map(_item => (
                <OcpReportSummaryItem
                  key={_item.id}
                  formatOptions={{}}
                  formatValue={formatValue}
                  label={_item.label ? _item.label.toString() : ''}
                  totalValue={report.meta.total.cost.value}
                  units={_item.units}
                  value={_item.cost}
                />
              ))
            }
          </OcpReportSummaryItems>
        </div>
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsWidgetViewOwnProps,
  DetailsWidgetViewStateProps
>((state, { groupBy, item }) => {
  const query: OcpQuery = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'monthly',
    },
    group_by: {
      project: '*',
      [groupBy]: item.label || item.id,
    },
  };
  const queryString = getQuery(query);
  const report = ocpReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    reportType,
    queryString
  );
  return {
    queryString,
    report,
    reportFetchStatus,
  };
});

const mapDispatchToProps: DetailsWidgetViewDispatchProps = {
  fetchReport: ocpReportsActions.fetchReport,
};

const DetailsWidgetView = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsWidgetViewBase)
);

export { DetailsWidgetView, DetailsWidgetViewProps };
