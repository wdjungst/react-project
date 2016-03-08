import path from 'path'

export const APP_PATH = process.cwd()
export const PORT = process.env.PORT || 8080
export const DEV_HOST = process.env.DEV_HOST || 'localhost'
export const DEV_PORT = process.env.DEV_PORT || 8081
export const PUBLIC_PATH = process.env.PUBLIC_PATH || '/'
export const PUBLIC_DIR = path.join(APP_PATH, '.build')
export const SERVER_RENDERING = process.env.SERVER_RENDERING === 'on'
export const AUTO_RELOAD = process.env.AUTO_RELOAD

