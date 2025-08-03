export const DIGILOCKER_CONFIG = {
  GATEWAY: 'production',
  SDK_URL:
    'https://cdn.jsdelivr.net/gh/surepassio/surepass-digiboost-web-sdk@latest/index.min.js',
  BUTTON_SELECTOR: '#digilocker-button',
  LOGO_URL: 'https://rentacross.com/assets/v2/img/logo.png',
  BUTTON_STYLE: {
    backgroundColor: '#613AF5',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    width: '100%',
    maxWidth: '300px',
  },
} as const
