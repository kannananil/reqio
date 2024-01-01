import './index.scss';
import RequestPanel from "../RequestPanel";
import ResponsePanel from "../ResponsePanel";
import PaneSplitter from "../PaneSplitter";
import UrlPanel from "../UrlPanel";
import { delete_req, get, patch, post, put } from "../../api/rest.ts";
import { getErrorCode, getHttpStatusText } from "../../api/statusCodes.ts";

import { useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { Header, Param } from "../RequestPanel/types.ts";


const AppBody = () => {
  const [ method, setMethod ] = useState('GET');
  const [ url, setUrl ] = useState('');
  const [ headers, setHeaders ] = useState([ {key: 'Content-Type', value: 'application/json'} ]);
  const [ params, setParams ] = useState([ {key: '', value: ''} ]);
  const [ body, setBody ] = useState('{}');
  const [ isNoRequestTriggered, setIsNoRequestTriggered ] = useState(true);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ response, setResponse ] = useState('');
  const [ statusCode, setStatusCode ] = useState(0);
  const [ statusText, setStatusText ] = useState('');

  const onSuccessResponse = (response: AxiosResponse) => {
    setIsLoading(false);
    setResponse(JSON.stringify(response.data, null, 2));
    setStatusCode(response.status);
    setStatusText(response.statusText || getHttpStatusText(response.status));
  }

  const onFailureResponse = (error: AxiosError) => {
    setIsLoading(false);
    if (error.response) {
      setResponse(JSON.stringify(error.response?.data || {}, null, 2));
      setStatusCode(error.response?.status || 0);
      setStatusText(error.response?.statusText || getHttpStatusText(statusCode));
    } else {
      setResponse(`Error: ${ error.message }`);
      setStatusText(`ERROR: ${ getErrorCode(error?.code || '') }`);
      setStatusCode(0);
    }
  }

  const onSend = () => {
    if (method === 'GET' && url !== '') {
      setIsNoRequestTriggered(false);
      setIsLoading(true);
      get(url, headers)
        .then(onSuccessResponse)
        .catch(onFailureResponse);
    }
    if (method === 'POST' && url !== '') {
      setIsNoRequestTriggered(false);
      setIsLoading(true);
      post(url, JSON.parse(body), headers)
        .then(onSuccessResponse)
        .catch(onFailureResponse);
    }
    if (method === 'PATCH' && url !== '') {
      setIsNoRequestTriggered(false);
      setIsLoading(true);
      patch(url, JSON.parse(body), headers)
        .then(onSuccessResponse)
        .catch(onFailureResponse);
    }
    if (method === 'PUT' && url !== '') {
      setIsNoRequestTriggered(false);
      setIsLoading(true);
      put(url, JSON.parse(body), headers)
        .then(onSuccessResponse)
        .catch(onFailureResponse);
    }
    if (method === 'DELETE' && url !== '') {
      setIsNoRequestTriggered(false);
      setIsLoading(true);
      delete_req(url, headers)
        .then(onSuccessResponse)
        .catch(onFailureResponse);
    }
  }

  const onNewHeaderAddition = (header: Header) => {
    setHeaders([ ...headers, header ])
  }

  const onHeadersChange = (updatedHeaders: Header[]) => {
    setHeaders(updatedHeaders)
  }

  const onNewParamAddition = (param: Param) => {
    setParams([ ...params, param ])
  }

  const onParamsChange = (updatedParams: Param[]) => {
    setParams(updatedParams)
  }

  return (
    <div className='app-body'>
      <UrlPanel
        method={ method } url={ url }
        onMethodChange={ setMethod }
        onUrlChange={ setUrl }
        onSend={ onSend }
      />
      <div className='sub-container'>
        <RequestPanel
          method={ method } headers={ headers } params={params}
          body = { body } onBodyChange={ setBody }
          onHeadersChange={ onHeadersChange } onNewHeaderAddition={ onNewHeaderAddition }
          onParamsChange={onParamsChange} onNewParamAddition={onNewParamAddition}
        />
        <PaneSplitter direction='horizontal'/>
        <ResponsePanel
          isNoRequestTriggered={ isNoRequestTriggered }
          isLoading={ isLoading } response={ response }
          statusCode={ statusCode } statusText={ statusText }
        />
      </div>
    </div>
  );
};

export default AppBody;