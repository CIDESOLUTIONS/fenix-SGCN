import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configurar transporte de email con credenciales reales
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verificar la configuración
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('Error de configuración SMTP:', error);
      } else {
        console.log('✅ Servidor SMTP configurado correctamente');
      }
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"Fenix-SGCN" <comercial@cidesas.com>',
        to,
        subject,
        html,
      });

      console.log('✅ Email enviado exitosamente:', info.messageId);
      console.log('📧 Para:', to);
      console.log('📋 Asunto:', subject);
      
      return info;
    } catch (error) {
      console.error('❌ Error al enviar email:', error);
      throw new Error(`Error al enviar email: ${error.message}`);
    }
  }
}
