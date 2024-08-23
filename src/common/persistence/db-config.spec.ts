import dbConfig from "./db-config";

describe('DB Config', () => {

    it('define the database configuration', () => {

        const config = dbConfig();

        // Check that the setting is not Indefinite.
        expect(config).toBeDefined();

        // Verify the properties
        expect(config).toHaveProperty('db');
        expect(config.db).toHaveProperty('host');
        expect(config.db).toHaveProperty('name');
        expect(config.db).toHaveProperty('user');
        expect(config.db).toHaveProperty('password');
        expect(config.db).toHaveProperty('connection');
    });
});