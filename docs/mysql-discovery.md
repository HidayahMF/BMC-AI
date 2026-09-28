# MySQL Discovery

Run `npm run discover:mysql` after supplying local `.env` read-only credentials. The script queries `information_schema` and writes only a keyword-filtered shortlist, not a full data dump.

Current status: connection reached `192.168.10.51:3306`, but authentication was rejected for the configured account from source host `10.103.10.110`. No alternate credentials were tried and no server change was attempted. Administrator requirement: verify the legacy runtime source configuration, effective environment overrides, host/port or socket, and the MySQL account host rule/password for this BMC AI machine. Stop diagnosis until those values are confirmed.
