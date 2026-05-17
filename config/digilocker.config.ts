export const DIGILOCKER_CONFIG = {
  GATEWAY: 'production',
  SDK_URL:
    'https://cdn.jsdelivr.net/gh/surepassio/surepass-digiboost-web-sdk@latest/index.min.js',
  BUTTON_SELECTOR: '#digilocker-button',
  LOGO_URL: 'https://rentacross.com/assets/v2/img/logo.png',
  BUTTON_STYLE: {
    backgroundColor: '#0e0e0c',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '9999px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '800',
    width: '100%',
  },
} as const
