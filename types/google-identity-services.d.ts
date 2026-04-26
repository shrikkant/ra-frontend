// Minimal type surface for the bits of Google Identity Services we use.
// Full reference: https://developers.google.com/identity/gsi/web/reference/js-reference

interface GsiCredentialResponse {
  credential: string
  select_by: string
  clientId?: string
}

interface GsiInitializeConfig {
  client_id: string
  callback: (response: GsiCredentialResponse) => void
  auto_select?: boolean
  use_fedcm_for_prompt?: boolean
  ux_mode?: 'popup' | 'redirect'
  itp_support?: boolean
}

interface GsiButtonConfig {
  type?: 'standard' | 'icon'
  theme?: 'outline' | 'filled_blue' | 'filled_black'
  size?: 'large' | 'medium' | 'small'
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  shape?: 'rectangular' | 'pill' | 'circle' | 'square'
  logo_alignment?: 'left' | 'center'
  width?: number
  locale?: string
}

interface GsiId {
  initialize(config: GsiInitializeConfig): void
  renderButton(parent: HTMLElement, options: GsiButtonConfig): void
  prompt(): void
  cancel(): void
  disableAutoSelect(): void
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GsiId
      }
    }
  }
}

export {}
