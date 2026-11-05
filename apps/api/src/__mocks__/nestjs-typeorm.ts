/**
 * CJS-compatible mock for @nestjs/typeorm.
 * @nestjs/typeorm v12 is pure ESM (uses import.meta.url) which cannot be
 * compiled to CommonJS by ts-jest. This mock replaces it in the Jest
 * test environment while preserving the DI token contract used by NestJS.
 */
import { Inject } from '@nestjs/common';

type EntityClass = { name: string };

export const getRepositoryToken = (entity: EntityClass): string =>
  `${entity.name}Repository`;

export const getDataSourceToken = (): string => 'DataSource';

export const InjectRepository =
  (entity: EntityClass) =>
  (target: object, key: string | symbol | undefined, index?: number) => {
    Inject(getRepositoryToken(entity))(target, key, index as number);
  };

export const InjectDataSource =
  () =>
  (target: object, key: string | symbol | undefined, index?: number) => {
    Inject(getDataSourceToken())(target, key, index as number);
  };

export const TypeOrmModule = {
  forRoot: () => ({ module: class TypeOrmRootModule {} }),
  forRootAsync: () => ({ module: class TypeOrmRootModule {} }),
  forFeature: () => ({ module: class TypeOrmFeatureModule {}, imports: [], exports: [] }),
};
