import path from 'path'

export const APP_PATH = process.cwd()
export const PORT = process.env.PORT || 8080
export const DEV_PORT = process.env.DEV_PORT || 8081
export const PUBLIC_DIR = path.join(APP_PATH, '.build')

