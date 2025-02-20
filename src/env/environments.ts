enum Environment {
  TEST = 'test',
  DEV = 'development',
  PRODUCTION = 'production',
}

enum DATABASE_CLIENT {
  POSTGRES = 'pg',
  SQLITE = 'sqlite',
}

enum EnvironmentFilesName {
  TEST = '.env.test',
  DEV = '.env',
}

export { Environment, EnvironmentFilesName, DATABASE_CLIENT }