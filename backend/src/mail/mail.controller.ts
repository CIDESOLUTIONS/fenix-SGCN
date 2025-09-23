import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('api/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-contact')
  async sendContactEmail(@Body() data: {
    emailToTeam: {
      to: string;
      subject: string;
      html: string;
    };
    emailToClient: {
      to: string;
      subject: string;
      html: string;
    };
  }) {
    try {
      console.log('📨 Procesando solicitud de contacto...');
      
      // Enviar email al equipo
      await this.mailService.sendEmail(
        data.emailToTeam.to,
        data.emailToTeam.subject,
        data.emailToTeam.html
      );
      console.log('✅ Email enviado al equipo comercial');

      // Enviar email de confirmación al cliente
      await this.mailService.sendEmail(
        data.emailToClient.to,
        data.emailToClient.subject,
        data.emailToClient.html
      );
      console.log('✅ Email de confirmación enviado al cliente');

      return { 
        success: true, 
        message: 'Correos enviados exitosamente' 
      };
    } catch (error) {
      console.error('❌ Error en controlador de correo:', error);
      return {
        success: false,
        error: 'Error al enviar la solicitud. Por favor, intenta nuevamente o contacta directamente a comercial@cidesas.com'
      };
    }
  }
}
