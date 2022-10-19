import 'reflect-metadata'

import dotenv from 'dotenv'
dotenv.config()

import { createConnection } from 'typeorm'
import { __prod__, dbConfig } from '../utils/constants'

export default async function connectDatabase(): Promise<void> {
   await createConnection({
      type: dbConfig.type,
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      ssl: true,
      entities: ['src/entity/**/*.[tj]s'],
      migrations: ['src/migration/**/*.[tj]s'],
      subscribers: ['src/subscriber/**/*.[tj]s'],
      cli: {
         entitiesDir: 'src/entity/**/*.[tj]s',
         migrationsDir: 'src/migration/**/*.[tj]s',
         subscribersDir: 'src/subscriber/**/*.[tj]s',
      },
      synchronize: true,
      dropSchema: !__prod__,
      logging: !__prod__,
   })
}
