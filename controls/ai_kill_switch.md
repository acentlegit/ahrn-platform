
# AI Kill Switch & Rate Limiting

Kill Switch:
- Global ENV flag: AI_ENABLED=false
- Per-service toggle in admin UI

Rate Limits:
- Per-tenant requests/sec
- Per-user daily caps

Fail-Safe:
- On AI failure, system reverts to rules-only mode
