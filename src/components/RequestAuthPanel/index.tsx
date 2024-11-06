import './index.scss';
import { AuthType, RequestAuthProps } from './types';

import Dropdown from '../Dropdown';
import AuthenticationForm from '../RequestAuthForm';

import { useState } from 'react';

const RequestAuthPanel = (props: RequestAuthProps) => {
  const [authType, setAuthType] = useState(AuthType.NoAuth);

  const items = [
    {
      id: 'NoAuth',
      name: 'NO AUTH',
      onSelect: () => setAuthType(AuthType.NoAuth),
      color: '#a3a3a3',
    },
    {
      id: 'BasicAuth',
      name: 'BASIC AUTH',
      onSelect: () => setAuthType(AuthType.BasicAuth),
      color: '#a3a3a3',
    },
    {
      id: 'ApiKey',
      name: 'API KEY',
      onSelect: () => setAuthType(AuthType.ApiKey),
      color: '#a3a3a3',
    },
  ];

  const onCredentialsChange = (credentials: object) => {
    props.onCredentialsChange({...credentials, authType})
  }

  return (
    <div className="request-auth-panel">
      <Dropdown items={items} />
      <AuthenticationForm
        authType={authType}
        onCredentialsChange={onCredentialsChange}
      />
    </div>
  );
};

export default RequestAuthPanel;
