import './index.scss';
import { AuthenticationFormProps, BasicAuthFormProps } from './types';

import { AuthType } from '../RequestAuthPanel/types';
import { useState } from 'react';

const BasicAuthForm = (props: BasicAuthFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    props.onCredentialsChange({ username: event.target.value, password });
  };
  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    props.onCredentialsChange({ username, password: event.target.value });
  };

  return (
    <div className="authentication-form">
      <input
        value={username}
        className="input"
        placeholder="Username"
        onChange={onUsernameChange}
      />
      <input
        value={password}
        className="input"
        placeholder="Password"
        onChange={onPasswordChange}
      />
    </div>
  );
};

const AuthenticationForm = (props: AuthenticationFormProps) => {
  if (props.authType == AuthType.NoAuth) {
    return <div className="auth-placeholder">Select authentication type!</div>;
  }
  if (props.authType == AuthType.BasicAuth) {
    return <BasicAuthForm onCredentialsChange={props.onCredentialsChange} />;
  }
  return <div className="auth-placeholder">Selected authentication type is not supported yet!</div>;
};

export default AuthenticationForm;
