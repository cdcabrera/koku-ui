import { css } from '@patternfly/react-styles';
import { getQuery } from 'api/ocpOnAwsQuery';
import { OcpOnAwsReport, OcpOnAwsReportType } from 'api/ocpOnAwsReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  ocpOnAwsReportsActions,
  ocpOnAwsReportsSelectors,
} from 'store/ocpOnAwsReports';
import { getTestProps, testIds } from 'testIds';
import { ComputedOcpOnAwsReportItem } from 'utils/getComputedOcpOnAwsReportItems';
import { styles } from './detailsTag.styles';
import { DetailsTagModal } from './detailsTagModal';

interface DetailsTagOwnProps {
  groupBy: string;
  id?: string;
  item: ComputedOcpOnAwsReportItem;
  project: string | number;
}

interface DetailsTagState {
  isOpen: boolean;
  showAll: boolean;
}

interface DetailsTagStateProps {
  queryString?: string;
  report?: OcpOnAwsReport;
  reportFetchStatus?: FetchStatus;
}

interface DetailsTagDispatchProps {
  fetchReport?: typeof ocpOnAwsReportsActions.fetchReport;
}

type DetailsTagProps = DetailsTagOwnProps &
  DetailsTagStateProps &
  DetailsTagDispatchProps &
  InjectedTranslateProps;

const reportType = OcpOnAwsReportType.tag;

class DetailsTagBase extends React.Component<DetailsTagProps> {
  protected defaultState: DetailsTagState = {
    isOpen: false,
    showAll: false,
  };
  public state: DetailsTagState = { ...this.defaultState };

  constructor(props: DetailsTagProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsTagProps) {
    const { fetchReport, queryString } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportType, queryString);
    }
  }

  public handleClose = (isOpen: boolean) => {
    this.setState({ isOpen });
  };

  public handleOpen = event => {
    this.setState({ isOpen: true });
    event.preventDefault();
    return false;
  };

  public render() {
    const { groupBy, id, item, project, report, t } = this.props;
    const { isOpen, showAll } = this.state;

    let charCount = 0;
    const maxChars = 50;
    const someTags = [];
    const allTags = [];

    if (report) {
      for (const tag of report.data) {
        for (const val of tag.values) {
          const prefix = someTags.length > 0 ? ', ' : '';
          const tagString = `${prefix}${(tag as any).key}: ${val}`;
          if (showAll) {
            someTags.push(tagString);
          } else if (charCount <= maxChars) {
            if (charCount + tagString.length > maxChars) {
              someTags.push(
                tagString.slice(0, maxChars - charCount).concat('...')
              );
            } else {
              someTags.push(tagString);
            }
          }
          charCount += tagString.length;
          allTags.push(`${(tag as any).key}: ${val}`);
        }
      }
    }

    return (
      <div className={css(styles.tagsContainer)} id={id}>
        {Boolean(someTags) &&
          someTags.map((tag, tagIndex) => <span key={tagIndex}>{tag}</span>)}
        {Boolean(someTags.length < allTags.length) && (
          <a
            {...getTestProps(testIds.details.tag_lnk)}
            href="#/"
            onClick={this.handleOpen}
          >
            {t('ocp_on_aws_details.more_tags', {
              value: allTags.length - someTags.length,
            })}
          </a>
        )}
        <DetailsTagModal
          groupBy={groupBy}
          isOpen={isOpen}
          item={item}
          onClose={this.handleClose}
          project={project}
        />
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsTagOwnProps,
  DetailsTagStateProps
>((state, { project }) => {
  const queryString = getQuery({
    filter: {
      project,
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
  });
  const report = ocpOnAwsReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = ocpOnAwsReportsSelectors.selectReportFetchStatus(
    state,
    reportType,
    queryString
  );
  return {
    project,
    queryString,
    report,
    reportFetchStatus,
  };
});

const mapDispatchToProps: DetailsTagDispatchProps = {
  fetchReport: ocpOnAwsReportsActions.fetchReport,
};

const DetailsTag = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsTagBase)
);

export { DetailsTag, DetailsTagProps };
