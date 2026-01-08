
# Tenant-Isolated Vector Stores

Design:
- One vector namespace per tenant
- Encryption at rest
- Access scoped by orgId

Implementation:
- Qdrant collections per tenant
- IAM-enforced access
- No cross-tenant queries
