#include "Database.h"

namespace watermelondb {

using platform::consoleError;
using platform::consoleLog;

Database::Database(jsi::Runtime *runtime, std::string path, std::string password, bool usesExclusiveLocking)
: runtime_(runtime), mutex_() {
    db_ = std::make_unique<SqliteDb>(path, password.c_str());

    std::string initSql = "";

#ifdef SQLITE_HAS_CODEC
    // SQLCipher initialization - must be done before any other PRAGMA
    if (!password.empty()) {
        initSql += "PRAGMA key = '" + password + "';";
        initSql += "PRAGMA cipher_page_size = 4096;";
        initSql += "PRAGMA kdf_iter = 64000;";
        initSql += "PRAGMA cipher_memory_security = ON;";
        initSql += "PRAGMA cipher_default_use_hmac = ON;";
        initSql += "PRAGMA cipher_compatibility = 4;";
    }
#endif

#ifdef ANDROID
    initSql += "pragma temp_store = memory;";
#endif

    initSql += "pragma journal_mode = WAL;";
    initSql += "pragma busy_timeout = 5000;";

#ifdef ANDROID
    initSql += "pragma synchronous = FULL;";
#endif

    if (usesExclusiveLocking) {
        initSql += "pragma locking_mode = EXCLUSIVE;";
    }

    executeMultiple(initSql);
}

void Database::destroy() {
    const std::lock_guard<std::mutex> lock(mutex_);

    if (isDestroyed_) {
        return;
    }
    isDestroyed_ = true;
    for (auto const &cachedStatement : cachedStatements_) {
        sqlite3_stmt *statement = cachedStatement.second;
        sqlite3_finalize(statement);
    }
    cachedStatements_ = {};
    db_->destroy();
}

Database::~Database() {
    destroy();
}

bool Database::isCached(std::string cacheKey) {
    return cachedRecords_.find(cacheKey) != cachedRecords_.end();
}
void Database::markAsCached(std::string cacheKey) {
    cachedRecords_.insert(cacheKey);
}
void Database::removeFromCache(std::string cacheKey) {
    cachedRecords_.erase(cacheKey);
}

void Database::unsafeResetDatabase(jsi::String &schema, int schemaVersion) {
    auto &rt = getRt();
    const std::lock_guard<std::mutex> lock(mutex_);

    // TODO: in non-memory mode, just delete the DB files
    // NOTE: As of iOS 14, selecting tables from sqlite_master and deleting them does not work
    // They seem to be enabling "defensive" config. So we use another obscure method to clear the database
    // https://www.sqlite.org/c3ref/c_dbconfig_defensive.html#sqlitedbconfigresetdatabase

    if (sqlite3_db_config(db_->sqlite, SQLITE_DBCONFIG_RESET_DATABASE, 1, 0) != SQLITE_OK) {
        throw jsi::JSError(rt, "Failed to enable reset database mode");
    }
    // NOTE: We can't VACUUM in a transaction
    executeMultiple("vacuum");

    if (sqlite3_db_config(db_->sqlite, SQLITE_DBCONFIG_RESET_DATABASE, 0, 0) != SQLITE_OK) {
        throw jsi::JSError(rt, "Failed to disable reset database mode");
    }

    beginTransaction();
    try {
        cachedRecords_ = {};

        // Reinitialize schema
        executeMultiple(schema.utf8(rt));
        setUserVersion(schemaVersion);

        commit();
    } catch (const std::exception &ex) {
        rollback();
        throw;
    }
}

void Database::migrate(jsi::String &migrationSql, int fromVersion, int toVersion) {
    auto &rt = getRt();
    const std::lock_guard<std::mutex> lock(mutex_);

    beginTransaction();
    try {
        assert(getUserVersion() == fromVersion && "Incompatible migration set");

        executeMultiple(migrationSql.utf8(rt));
        setUserVersion(toVersion);

        commit();
    } catch (const std::exception &ex) {
        rollback();
        throw;
    }
}

} // namespace watermelondb
