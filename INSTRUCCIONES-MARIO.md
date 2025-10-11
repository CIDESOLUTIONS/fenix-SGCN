# 🎯 INSTRUCCIONES PARA MARIO - DEPLOYMENT FENIX ECOSYSTEM

## ✅ ESTADO ACTUAL

**Build exitoso:** Frontend + Backend compilados sin errores  
**Siguiente paso:** Build Docker y deployment

---

## 📋 PASO A PASO PARA DEPLOYMENT

### **PASO 1: Preparación (5 minutos)**

#### 1.1 Verificar que Docker Desktop esté corriendo
```powershell
# Abrir Docker Desktop
# Verificar que esté activo
docker --version
```

#### 1.2 Ir al directorio del proyecto
```powershell
cd C:\Users\meciz\Documents\fenix-SGCN
```

#### 1.3 Verificar que fenix-admin existe
```powershell
ls ..\fenix-admin
# Debe mostrar las carpetas admin-backend y admin-frontend
```

---

### **PASO 2: Build Docker (10-15 minutos)**

#### 2.1 Ejecutar build
```powershell
docker compose -f docker-compose.ecosystem.yml build --no-cache
```

**Qué va a pasar:**
- Se van a descargar imágenes base (Node, PostgreSQL, etc)
- Se van a compilar 4 aplicaciones (2 frontends + 2 backends)
- Puede tomar 10-15 minutos la primera vez
- Verás mucho texto en consola (es normal)

**Si hay error:**
```powershell
# Limpiar caché de Docker
docker system prune -a

# Volver a intentar
docker compose -f docker-compose.ecosystem.yml build --no-cache
```

---

### **PASO 3: Configurar Variables (2 minutos)**

#### 3.1 Copiar archivo de ejemplo
```powershell
copy .env.ecosystem .env
```

#### 3.2 Editar valores (OPCIONAL para desarrollo)
```powershell
notepad .env
```

**Para desarrollo local puedes dejar los valores por defecto.**

**Para producción DEBES cambiar:**
- POSTGRES_PASSWORD
- JWT_SECRET
- ADMIN_JWT_SECRET
- ADMIN_API_KEY
- MINIO_ACCESS_KEY
- MINIO_SECRET_KEY

---

### **PASO 4: Iniciar Servicios (2 minutos)**

#### 4.1 Usar el script automatizado
```powershell
.\start-ecosystem.ps1
```

**O manualmente:**
```powershell
docker compose -f docker-compose.ecosystem.yml up -d
```

#### 4.2 Ver logs en tiempo real
```powershell
docker compose -f docker-compose.ecosystem.yml logs -f
```

**Presiona Ctrl+C para salir de los logs**

---

### **PASO 5: Verificar que Todo Funcione (5 minutos)**

#### 5.1 Verificar estado de servicios
```powershell
docker compose -f docker-compose.ecosystem.yml ps
```

**Debes ver todos los servicios como "running" o "healthy"**

#### 5.2 Abrir las aplicaciones en el navegador

**SGCN (App Principal):**
- Ir a: http://localhost
- Crear cuenta de prueba
- Explorar la aplicación

**Admin (Panel de Administración):**
- Ir a: http://localhost:8080
- Login: admin@fenix.com
- Password: Admin2024!
- Verificar que aparezca el cliente que creaste

#### 5.3 Verificar integración

**Cuando crees una cuenta en SGCN:**
1. Se debe crear el usuario en SGCN ✅
2. Se debe registrar automáticamente en Admin ✅
3. Se debe generar una licencia ✅
4. Verás la licencia en Admin → Clientes ✅

---

## 🔧 COMANDOS ÚTILES

### **Ver logs de un servicio específico:**
```powershell
# Backend SGCN
docker compose -f docker-compose.ecosystem.yml logs -f fenix_backend

# Backend Admin
docker compose -f docker-compose.ecosystem.yml logs -f admin_backend

# Frontend SGCN
docker compose -f docker-compose.ecosystem.yml logs -f fenix_frontend
```

### **Reiniciar un servicio:**
```powershell
# Reiniciar backend SGCN
docker compose -f docker-compose.ecosystem.yml restart fenix_backend

# Reiniciar todo
docker compose -f docker-compose.ecosystem.yml restart
```

### **Detener todo:**
```powershell
# Detener sin eliminar datos
docker compose -f docker-compose.ecosystem.yml down

# Detener y eliminar TODOS los datos (¡CUIDADO!)
docker compose -f docker-compose.ecosystem.yml down -v
```

### **Ver qué está usando memoria:**
```powershell
docker stats
```

---

## 🐛 PROBLEMAS COMUNES

### **Error: Puerto 3001 ya está en uso**
```powershell
# Ver qué proceso usa el puerto
netstat -ano | findstr :3001

# Matar el proceso (reemplaza PID con el número que aparece)
taskkill /PID <numero> /F

# O cambiar el puerto en .env
# PORT=3002
```

### **Error: No hay espacio en disco**
```powershell
# Limpiar imágenes y contenedores viejos
docker system prune -a

# Ver uso de espacio
docker system df
```

### **Error: Build se queda pegado**
```powershell
# Ctrl+C para cancelar
# Limpiar todo
docker system prune -a

# Intentar de nuevo
docker compose -f docker-compose.ecosystem.yml build --no-cache
```

### **Frontend no compila**
```powershell
# Entrar al contenedor
docker compose -f docker-compose.ecosystem.yml exec fenix_frontend sh

# Dentro del contenedor
rm -rf .next
npm run build
exit

# Reiniciar
docker compose -f docker-compose.ecosystem.yml restart fenix_frontend
```

---

## 🎯 CHECKLIST DE VERIFICACIÓN

### **Después del deployment:**

- [ ] Todos los servicios en estado "healthy"
- [ ] http://localhost muestra el login de SGCN
- [ ] http://localhost:8080 muestra el login de Admin
- [ ] Puedo registrar un usuario en SGCN
- [ ] El usuario aparece en Admin
- [ ] Puedo hacer login con el usuario creado
- [ ] Veo el dashboard principal de SGCN
- [ ] Puedo crear un proceso de negocio
- [ ] Puedo crear un riesgo
- [ ] El Admin muestra la licencia del tenant

---

## 📊 MONITOREO

### **URLs importantes:**
- **SGCN Frontend:** http://localhost
- **SGCN Backend API:** http://localhost:3001
- **Admin Frontend:** http://localhost:8080
- **Admin Backend API:** http://localhost:3101
- **Dgraph UI:** http://localhost:8080/ui
- **MinIO Console:** http://localhost:9001

### **Bases de datos:**
```powershell
# Conectar a PostgreSQL SGCN
docker exec -it fenix_db_prod psql -U fenix -d fenix_sgcn

# Conectar a PostgreSQL Admin
docker exec -it admin_db_prod psql -U admin_user -d fenix_admin

# Dentro de PostgreSQL:
\dt              # Ver tablas
\q               # Salir
```

---

## 📞 SI NECESITAS AYUDA

### **Opción 1: Revisar logs**
```powershell
# Ver todos los logs
docker compose -f docker-compose.ecosystem.yml logs -f

# Ver solo errores
docker compose -f docker-compose.ecosystem.yml logs | Select-String "error"
```

### **Opción 2: Captura de pantalla**
- Toma screenshot del error
- Copia el mensaje de error completo
- Envíame por WhatsApp: +57 315 765 1063

### **Opción 3: Crear ticket**
- Email: soporte@cidesolutions.com
- Incluye: screenshots, logs, pasos que seguiste

---

## 🚀 PRÓXIMOS PASOS (DESPUÉS DE VERIFICAR)

### **Para Desarrollo:**
1. Familiarizarte con la aplicación
2. Crear datos de prueba
3. Probar todos los módulos
4. Reportar bugs o mejoras

### **Para Producción:**
1. Configurar dominio (sgcn.empresa.com)
2. Configurar SSL/HTTPS
3. Cambiar todos los passwords
4. Configurar SMTP para emails
5. Configurar backups automáticos

---

## 📚 DOCUMENTACIÓN DE REFERENCIA

- `README.md` - Documentación principal
- `RESUMEN-EJECUTIVO.md` - Resumen para tomar decisiones
- `INTEGRATION-README.md` - Detalles técnicos de integración
- `DEPLOYMENT-CHECKLIST.md` - Checklist completo
- `BUILD-STATUS.md` - Estado actual del build

---

## ✅ RESUMEN RÁPIDO

```powershell
# 1. Build (10-15 min)
docker compose -f docker-compose.ecosystem.yml build --no-cache

# 2. Iniciar (1 min)
.\start-ecosystem.ps1

# 3. Verificar (navegador)
# http://localhost
# http://localhost:8080

# 4. Ver logs
docker compose -f docker-compose.ecosystem.yml logs -f
```

---

**¡TODO LISTO!** 🎉  
Cualquier duda, estoy disponible por WhatsApp: +57 315 765 1063

**Desarrollado con 💙 por CIDE Solutions**
