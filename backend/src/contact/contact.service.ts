import { Injectable } from '@nestjs/common';

@Injectable()
export class ContactService {
  async sendEnterpriseEmail(data: any) {
    // Aquí iría la integración con servicio de email (SendGrid, Mailgun, etc.)
    console.log('Enviando email de contacto empresarial:', data);
    
    // Por ahora solo simulamos el envío
    return {
      success: true,
      message: 'Email de contacto enviado exitosamente'
    };
  }
}
