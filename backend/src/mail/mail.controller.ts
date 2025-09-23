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
      // Enviar email al equipo
      await this.mailService.sendEmail(
        data.emailToTeam.to,
        data.emailToTeam.subject,
        data.emailToTeam.html
      );

      // Enviar email de confirmación al cliente
      await this.mailService.sendEmail(
        data.emailToClient.to,
        data.emailToClient.subject,
        data.emailToClient.html
      );

      return { success: true, message: 'Correos enviados exitosamente' };
    } catch (error) {
      console.error('Error al enviar correos:', error);
      throw error;
    }
  }
}
