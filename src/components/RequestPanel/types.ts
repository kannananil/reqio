import { Credentials } from '../RequestAuthPanel/types';

export type Header = {
  key: string;
  value: string;
};

export type QueryParam = {
  key: string;
  value: string;
};

export type RequestPanelProps = {
  method: string;
  headers: Header[];
  params: QueryParam[];
  body: string;
  onHeadersChange: (headers: Header[]) => void;
  onNewHeaderAddition: (header: Header) => void;
  onParamsChange: (params: QueryParam[]) => void;
  onNewParamAddition: (param: QueryParam) => void;
  onBodyChange: (value: string) => void;
  onCredentialsChange: (credentials: Credentials) => void;
};
