import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validar datos requeridos
    const { nombreEmpresa, nombreContacto, email, telefono, pais, ciudad, tipoSolicitud } = data;
    
    if (!nombreEmpresa || !nombreContacto || !email || !telefono || !pais || !ciudad) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Preparar el contenido del correo
    const tipoTextoMap: Record<string, string> = {
      demo: 'Solicitud de Demo Personalizada',
      sales: 'Contacto con Ventas',
      schedule: 'Programar Demostración'
    };
    
    const tipoTexto = tipoTextoMap[tipoSolicitud] || 'Consulta General';

    // Correo para el equipo comercial
    const emailToTeam = {
      to: 'comercial@cidesas.com',
      subject: `${tipoTexto} - ${nombreEmpresa}`,
      html: `
        <h2>Nueva ${tipoTexto}</h2>
        <p><strong>Empresa:</strong> ${nombreEmpresa}</p>
        <p><strong>Contacto:</strong> ${nombreContacto}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Ubicación:</strong> ${ciudad}, ${pais}</p>
        <p><strong>Tipo de Solicitud:</strong> ${tipoTexto}</p>
        <hr/>
        <p><small>Enviado desde Fenix-SGCN Landing Page</small></p>
      `
    };

    // Correo de confirmación para el cliente
    const emailToClient = {
      to: email,
      subject: `Confirmación de ${tipoTexto} - Fenix-SGCN`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #4F46E5, #10B981); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Fenix-SGCN</h1>
            <p style="color: white; margin: 5px 0;">Sistema de Gestión de Continuidad del Negocio</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937;">Hola ${nombreContacto},</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              Gracias por tu interés en Fenix-SGCN. Hemos recibido tu solicitud de <strong>${tipoTexto}</strong> 
              y uno de nuestros representantes se pondrá en contacto contigo pronto.
            </p>
            
            <div style="background: white; border-left: 4px solid #4F46E5; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #4b5563;"><strong>Datos de tu solicitud:</strong></p>
              <p style="margin: 5px 0; color: #6b7280;">Empresa: ${nombreEmpresa}</p>
              <p style="margin: 5px 0; color: #6b7280;">Ubicación: ${ciudad}, ${pais}</p>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              Mientras tanto, te invitamos a explorar nuestra <a href="https://fenix-sgcn.com" style="color: #4F46E5;">documentación</a> 
              y conocer más sobre cómo Fenix-SGCN puede ayudar a tu organización a implementar un Sistema de Gestión de 
              Continuidad del Negocio conforme a ISO 22301.
            </p>
            
            <p style="color: #4b5563; line-height: 1.6;">
              Si tienes alguna pregunta urgente, no dudes en contactarnos directamente a 
              <a href="mailto:comercial@cidesas.com" style="color: #4F46E5;">comercial@cidesas.com</a>
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                Saludos cordiales,<br/>
                <strong>Equipo Fenix-SGCN</strong><br/>
                CIDE SAS
              </p>
            </div>
          </div>
          
          <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>© ${new Date().getFullYear()} CIDE SAS. Todos los derechos reservados.</p>
            <p>
              <a href="https://cidesas.com" style="color: #10B981; text-decoration: none;">www.cidesas.com</a> | 
              <a href="tel:+573157651063" style="color: #10B981; text-decoration: none;">+57 315 765 1063</a>
            </p>
          </div>
        </div>
      `
    };

    // Aquí integramos con el backend para enviar los correos
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://fenix_backend:3001';
    
    const response = await fetch(`${backendUrl}/api/mail/send-contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailToTeam,
        emailToClient
      })
    });

    if (!response.ok) {
      throw new Error('Error al enviar correos');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Solicitud enviada exitosamente' 
    });

  } catch (error) {
    console.error('Error en API de contacto:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
