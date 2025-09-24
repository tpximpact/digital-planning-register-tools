import { baseConfig } from '@dpr/api'

type Config = baseConfig.BaseConfig

export const config: Config = {
  ...baseConfig.config
}

export type { Config }
