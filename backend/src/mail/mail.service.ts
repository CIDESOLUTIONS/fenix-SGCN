import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    console.log('📧 Configurando MailService...');
    
    // Configurar transporte (por si se necesita después)
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      console.log('📨 Simulando envío de email a:', to);
      console.log('📋 Asunto:', subject);
      
      // SIMULACIÓN TEMPORAL hasta resolver credenciales
      const mockInfo = {
        messageId: 'sim_' + Date.now() + '@fenix-sgcn.com',
        accepted: [to],
        rejected: [],
        response: '250 Simulated OK'
      };

      console.log('✅ Email simulado exitosamente');
      return mockInfo;
      
    } catch (error) {
      console.error('❌ Error en simulación:', error);
      throw new Error(`Error al procesar email: ${error.message}`);
    }
  }
}