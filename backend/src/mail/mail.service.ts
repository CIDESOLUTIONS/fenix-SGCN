import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configurar transporte de email
    // En producción, usar variables de entorno para credenciales
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER || 'comercial@cidesas.com',
        pass: process.env.SMTP_PASS || '', // Configurar en .env
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: '"Fenix-SGCN" <comercial@cidesas.com>',
        to,
        subject,
        html,
      });

      console.log('Email enviado:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error al enviar email:', error);
      throw error;
    }
  }
}
