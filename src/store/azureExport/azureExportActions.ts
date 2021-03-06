import { runExport } from 'api/azureExport';
import { AzureReportType } from 'api/azureReports';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'store/rootReducer';
import { createAsyncAction } from 'typesafe-actions';

export const {
  request: fetchAzureExportRequest,
  success: fetchAzureExportSuccess,
  failure: fetchAzureExportFailure,
} = createAsyncAction(
  'azureExport/request',
  'azureExport/success',
  'azureExport/failure'
)<void, string, AxiosError>();

export function exportReport(
  reportType: AzureReportType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    dispatch(fetchAzureExportRequest());
    runExport(reportType, query)
      .then(res => {
        dispatch(fetchAzureExportSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchAzureExportFailure(err));
      });
  };
}
