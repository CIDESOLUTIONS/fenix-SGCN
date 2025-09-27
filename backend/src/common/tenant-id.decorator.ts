import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    
    // 1. Intentar obtener del usuario autenticado (JWT)
    if (request.user) {
      // Puede venir como user.tenantId o user.tenant.id
      const tenantId = request.user.tenantId || request.user.tenant?.id;
      if (tenantId) {
        return tenantId;
      }
    }
    
    // 2. Fallback: Header personalizado (para casos especiales)
    const headerTenantId = request.headers['x-tenant-id'];
    if (headerTenantId) {
      return headerTenantId;
    }
    
    // 3. Error si no hay tenant
    throw new UnauthorizedException('Tenant ID not found. User must be authenticated.');
  },
);
