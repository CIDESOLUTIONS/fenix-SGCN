SELECT 
    u.id,
    u.email,
    u."fullName",
    u.role,
    t.name as empresa,
    t.domain,
    t."subscriptionPlan",
    u."createdAt"
FROM users u 
JOIN tenants t ON u."tenantId" = t.id 
ORDER BY u."createdAt" DESC;
