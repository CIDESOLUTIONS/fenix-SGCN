import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FenixAdminClientService {
  private readonly adminApiUrl = process.env.ADMIN_API_URL || 'http://localhost:3101';
  private readonly apiKey = process.env.ADMIN_API_KEY || 'fenix-integration-key-2025';

  async registerTenant(tenant: any) {
    try {
      const response = await axios.post(
        `${this.adminApiUrl}/api/integration/client/register-from-app`,
        {
          tenantId: tenant.id,
          companyName: tenant.companyName,
          contactEmail: tenant.contactEmail,
          contactName: tenant.contactName || 'Admin',
          plan: tenant.subscriptionPlan || 'STANDARD'
        },
        {
          headers: { 'X-API-Key': this.apiKey },
          timeout: 10000
        }
      );

      console.log('✅ Tenant registrado en fenix-admin:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error registrando tenant en fenix-admin:', error.message);
      throw new HttpException(
        error.response?.data || 'Error comunicándose con Admin API',
        error.response?.status || 500
      );
    }
  }

  async validateLicense(tenantId: string, licenseKey: string) {
    try {
      const response = await axios.post(
        `${this.adminApiUrl}/api/integration/licenses/validate`,
        { tenantId, licenseKey },
        {
          headers: { 'X-API-Key': this.apiKey },
          timeout: 5000
        }
      );

      console.log(`✅ Licencia validada para tenant ${tenantId}:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error validando licencia:', error.message);
      // En caso de error, permitir acceso temporalmente (modo degradado)
      return {
        valid: true,
        status: 'ACTIVE',
        message: 'Validación en modo degradado'
      };
    }
  }

  async sendUsageMetrics(tenantId: string, metrics: any) {
    try {
      await axios.post(
        `${this.adminApiUrl}/api/integration/metrics/usage`,
        { tenantId, ...metrics },
        {
          headers: { 'X-API-Key': this.apiKey },
          timeout: 5000
        }
      );

      console.log(`✅ Métricas enviadas para tenant ${tenantId}`);
    } catch (error: any) {
      console.error('❌ Error enviando métricas:', error.message);
      // No lanzar error, solo logear
    }
  }
}
