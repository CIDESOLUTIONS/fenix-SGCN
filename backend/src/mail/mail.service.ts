import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: parseInt(this.config.get('SMTP_PORT')),
      secure: this.config.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });
  }

  async sendPasswordResetOTP(email: string, otp: string) {
    const mailOptions = {
      from: this.config.get('EMAIL_FROM'),
      to: email,
      subject: 'Recuperación de Contraseña - Fenix SGCN',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-code { background: #667eea; color: white; font-size: 32px; font-weight: bold; padding: 20px; text-align: center; border-radius: 8px; letter-spacing: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Recuperación de Contraseña</h1>
              <p>Fenix - Sistema de Gestión de Continuidad de Negocio</p>
            </div>
            <div class="content">
              <p>Hola,</p>
              <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
              <p>Tu código de verificación (OTP) es:</p>
              <div class="otp-code">${otp}</div>
              <div class="warning">
                <strong>⚠️ Importante:</strong>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>Este código expira en <strong>15 minutos</strong></li>
                  <li>No compartas este código con nadie</li>
                  <li>Si no solicitaste este cambio, ignora este email</li>
                </ul>
              </div>
              <p>Para completar el proceso:</p>
              <ol>
                <li>Ingresa el código en la página de recuperación</li>
                <li>Define tu nueva contraseña</li>
              </ol>
            </div>
            <div class="footer">
              <p>Este es un correo automático, por favor no responder.</p>
              <p>&copy; ${new Date().getFullYear()} Fenix SGCN. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email enviado a ${email} con OTP: ${otp}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      // Fallback: loguear en consola si falla el email
      console.log(`🔐 OTP para ${email}: ${otp}`);
      return { success: false, error: error.message };
    }
  }
}
