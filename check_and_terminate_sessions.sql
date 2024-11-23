-- View all active sessions
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    backend_start,
    state,
    query
FROM pg_stat_activity
WHERE state IS NOT NULL;

-- Terminate all sessions except your current one
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE 
    -- Don't kill your own connection
    pid <> pg_backend_pid()
    -- Don't kill the connections for other databases
    AND datname = current_database()
    -- Don't kill replica connections
    AND usename != 'rdsrepladmin';

-- Verify no remaining sessions
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    backend_start,
    state,
    query
FROM pg_stat_activity
WHERE state IS NOT NULL
AND pid <> pg_backend_pid();
