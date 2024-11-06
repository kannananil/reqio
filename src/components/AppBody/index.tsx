import './index.scss';
import { Method } from './types.ts';

import { delete_req, get, patch, post, put } from '../../api/rest.ts';
import { getErrorCode, getHttpStatusText } from '../../api/statusCodes.ts';
import { Header, QueryParam } from '../RequestPanel/types.ts';

import RequestPanel from '../RequestPanel';
import ResponsePanel from '../ResponsePanel';
import PaneSplitter from '../PaneSplitter';
import UrlPanel from '../UrlPanel';

import { useState } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { AuthType, Credentials } from '../RequestAuthPanel/types.ts';

const AppBody = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json' },
  ]);
  const [queryParams, setQueryParams] = useState<QueryParam[]>([]);
  const [credentials, setCredentials] = useState<Credentials>({ authType: AuthType.NoAuth });
  const [body, setBody] = useState('{}');
  const [isNoRequestTriggered, setIsNoRequestTriggered] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [statusCode, setStatusCode] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [timeTaken, setTimeTaken] = useState(0);

  const onSuccessResponse = (response: AxiosResponse, startTime: number) => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    setTimeTaken(duration);

    setIsLoading(false);
    setResponse(JSON.stringify(response.data, null, 2));
    setStatusCode(response.status);
    setStatusText(response.statusText || getHttpStatusText(response.status));
  };

  const onFailureResponse = (error: AxiosError) => {
    setIsLoading(false);
    if (error.response) {
      setResponse(JSON.stringify(error.response?.data || {}, null, 2));
      setStatusCode(error.response?.status || 0);
      setStatusText(error.response?.statusText || getHttpStatusText(statusCode));
    } else {
      setResponse(`Error: ${error.message}`);
      setStatusText(`ERROR: ${getErrorCode(error?.code || '')}`);
      setStatusCode(0);
    }
  };

  const constructUrlWithQueryParams = () => {
    if (queryParams.length == 0) {
      return url;
    }
    const queryParamStrings = queryParams.map(
      (queryParam: QueryParam) => `${queryParam.key}=${queryParam.value}`
    );
    const combinedQuery = queryParamStrings.join('&');
    return `${url}?${combinedQuery}`;
  };

  const onSend = () => {
    setIsNoRequestTriggered(false);
    setIsLoading(true);
    const combinedUrl = constructUrlWithQueryParams();
    const consolidatedHeaders = headers.slice();

    if (credentials.authType == AuthType.BasicAuth) {
      const encodedHeaderValue = btoa(`Basic ${credentials.username}:${credentials.password}`);
      consolidatedHeaders.push({ key: 'Authorization', value: encodedHeaderValue });
    }

    const startTime = performance.now();

    if (method === Method.Get && url !== '') {
      get(combinedUrl, consolidatedHeaders)
        .then((response) => onSuccessResponse(response, startTime))
        .catch(onFailureResponse);
    }
    if (method === Method.Post && url !== '') {
      post(combinedUrl, JSON.parse(body), consolidatedHeaders)
        .then((response) => onSuccessResponse(response, startTime))
        .catch(onFailureResponse);
    }
    if (method === Method.Patch && url !== '') {
      patch(combinedUrl, JSON.parse(body), consolidatedHeaders)
        .then((response) => onSuccessResponse(response, startTime))
        .catch(onFailureResponse);
    }
    if (method === Method.Put && url !== '') {
      put(combinedUrl, JSON.parse(body), consolidatedHeaders)
        .then((response) => onSuccessResponse(response, startTime))
        .catch(onFailureResponse);
    }
    if (method === Method.Delete && url !== '') {
      delete_req(combinedUrl, consolidatedHeaders)
        .then((response) => onSuccessResponse(response, startTime))
        .catch(onFailureResponse);
    }
  };

  const onNewHeaderAddition = (header: Header) => {
    setHeaders([...headers, header]);
  };

  const onHeadersChange = (updatedHeaders: Header[]) => {
    setHeaders(updatedHeaders);
  };

  const onNewParamAddition = (param: QueryParam) => {
    setQueryParams([...queryParams, param]);
  };

  const onParamsChange = (updatedParams: QueryParam[]) => {
    setQueryParams(updatedParams);
  };

  const onCredentialsChange = (credentials: Credentials) => {
    setCredentials(credentials);
  };

  return (
    <div className="app-body">
      <UrlPanel url={url} onMethodChange={setMethod} onUrlChange={setUrl} onSend={onSend} />
      <div className="sub-container">
        <RequestPanel
          method={method}
          headers={headers}
          params={queryParams}
          body={body}
          onBodyChange={setBody}
          onHeadersChange={onHeadersChange}
          onNewHeaderAddition={onNewHeaderAddition}
          onParamsChange={onParamsChange}
          onNewParamAddition={onNewParamAddition}
          onCredentialsChange={onCredentialsChange}
        />
        <PaneSplitter direction="horizontal" />
        <ResponsePanel
          isNoRequestTriggered={isNoRequestTriggered}
          isLoading={isLoading}
          response={response}
          statusCode={statusCode}
          statusText={statusText}
          timeTaken={timeTaken}
        />
      </div>
    </div>
  );
};

export default AppBody;
