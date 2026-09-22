import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'

// biome-ignore lint/style/noProcessEnv: build config file needs env access
const env = process.env

const apiUrl = new URL(
  env.VITE_PUBLIC_BROWSEROS_API?.trim() || 'http://127.0.0.1:9100',
)
const apiPattern = apiUrl.port
  ? `${apiUrl.hostname}:${apiUrl.port}`
  : apiUrl.hostname

// See https://wxt.dev/api/config.html
// Extension ID will be bflpfmnmnokmjhmgnolecpppdbdophmk
export default defineConfig({
  outDir: 'dist',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Assistant',
    key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvBDAaDRvv61NpBeLR8etBRw82lv9VJO3sz/mA26gDzWKtVuzW4DXCl8Zfj5oWmoXLTfv3aiTigUXo/LHOoGpSucEVroMmAc7cgu2KuQ1fZPpMvYa0npD/m4h89360q8Oz0oKKaZGS905IJ04M2IkF4CuU3YEHFJBWb+cUyK9H8YVugelYbPD0IVs63T1SkGbh/t/Tfb2DpkinduSO8+x26sKydm30SRt+iZ2+7Nolcdum3LExInUiX2Pgb65Jb+mVw8NqyTVJyCEp8uq0cSHomWFQirSJ80tsDhISp4btwaRKHrXqovQx9XHQv4hCd+3LuB830eUEVMUNuCO+OyPxQIDAQAB',
    update_url: undefined,
    externally_connectable: {
      matches: [`https://${apiPattern}/*`, `https://*.${apiPattern}/*`],
    },
    chrome_url_overrides: {
      newtab: 'app.html',
    },
    options_ui: {
      page: 'app.html#/settings',
      open_in_tab: true,
    },
    action: {
      default_icon: {
        16: 'icon/16.png',
        32: 'icon/32.png',
        48: 'icon/48.png',
        128: 'icon/128.png',
      },
      default_title: 'Ask BrowserOS',
    },
    permissions: [
      'topSites',
      'storage',
      'unlimitedStorage',
      'scripting',
      'tabs',
      'tabGroups',
      'sidePanel',
      'bookmarks',
      'history',
      'alarms',
      'webNavigation',
      'downloads',
    ],
    host_permissions: ['http://127.0.0.1/*'],
  },
  vite: () => ({
    build: {
      sourcemap: 'hidden',
    },
    plugins: [tailwindcss()],
  }),
})
