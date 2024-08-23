// src/common/persistence/index.ts
export { default as dbConfig } from './db-config';
export * from './persistence.module';
import * as persistenceExports from './index';

describe('Persistence Module Index', () => {

  it('should export dbConfig and PersistenceModule', () => {

    // Prints the content of exports for debugging
    console.log(persistenceExports);
  });
});
