import { AzureReport, AzureReportType, runReport } from 'api/azureReports';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import { RootState } from 'store/rootReducer';
import { createStandardAction } from 'typesafe-actions';
import { dropCurrentMonthData } from 'utils/dropCurrentMonthData';
import { getReportId } from './azureReportsCommon';
import { selectReport, selectReportFetchStatus } from './azureReportsSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface AzureReportActionMeta {
  reportId: string;
}

export const fetchAzureReportRequest = createStandardAction(
  'azureReports/request'
)<AzureReportActionMeta>();
export const fetchAzureReportSuccess = createStandardAction(
  'azureReports/success'
)<AzureReport, AzureReportActionMeta>();
export const fetchAzureReportFailure = createStandardAction(
  'azureReports/failure'
)<AxiosError, AzureReportActionMeta>();

export function fetchReport(
  reportType: AzureReportType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isReportExpired(getState(), reportType, query)) {
      return;
    }

    const meta: AzureReportActionMeta = {
      reportId: getReportId(reportType, query),
    };

    dispatch(fetchAzureReportRequest(meta));
    runReport(reportType, query)
      .then(res => {
        const repsonseData = dropCurrentMonthData(res, query);
        dispatch(fetchAzureReportSuccess(repsonseData, meta));
      })
      .catch(err => {
        dispatch(fetchAzureReportFailure(err, meta));
      });
  };
}

function isReportExpired(
  state: RootState,
  reportType: AzureReportType,
  query: string
) {
  const report = selectReport(state, reportType, query);
  const fetchStatus = selectReportFetchStatus(state, reportType, query);
  if (fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!report) {
    return true;
  }

  const now = Date.now();
  return now > report.timeRequested + expirationMS;
}
