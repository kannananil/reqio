import { AuthType } from "../RequestAuthPanel/types"

export type AuthenticationFormProps = {
  authType: AuthType,
  onCredentialsChange: (credentials: object) => void
}

export type BasicAuthFormProps = {
  onCredentialsChange: (credentials: object) => void
}