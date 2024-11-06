export enum AuthType {
  NoAuth = 'NO AUTH',
  ApiKey = 'API KEY',
  BasicAuth = 'BASIC AUTH',
}

export type Credentials = {
  authType: AuthType;
  username?: string;
  password?: string;
  key?: string;
  value?: string;
};

export type RequestAuthProps = {
  onCredentialsChange: (credentials: Credentials) => void;
};
