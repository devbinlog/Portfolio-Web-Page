import type { Config } from 'tailwindcss'
import baseConfig from '@portfolio/config/tailwind'
import typography from '@tailwindcss/typography'

const config: Config = {
  ...baseConfig,
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [typography],
}

export default config
