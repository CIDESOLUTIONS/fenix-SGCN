#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Controllers que NO necesitan guard (públicos o auth)
const skipControllers = [
  'auth.controller.ts',
  'app.controller.ts', 
  'contact.controller.ts',
  'mail.controller.ts'
];

// Función para agregar guard a un controller
function addGuardToController(filePath) {
  const fileName = path.basename(filePath);
  
  if (skipControllers.includes(fileName)) {
    console.log(`⏭️  Skipping: ${fileName}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Verificar si ya tiene UseGuards
  if (content.includes('UseGuards(JwtAuthGuard)') || content.includes('@UseGuards(')) {
    console.log(`✅ Already protected: ${fileName}`);
    return;
  }

  // Agregar import de UseGuards si no existe
  if (!content.includes('UseGuards')) {
    content = content.replace(
      /from '@nestjs\/common'/,
      ", UseGuards } from '@nestjs/common'"
    );
  }

  // Agregar import de JwtAuthGuard
  if (!content.includes('JwtAuthGuard')) {
    const importLine = "import { JwtAuthGuard } from '../auth/guard/jwt.guard';\n";
    const firstImportMatch = content.match(/^import .+ from .+;$/m);
    if (firstImportMatch) {
      content = content.replace(firstImportMatch[0], firstImportMatch[0] + '\n' + importLine);
    }
  }

  // Agregar @UseGuards al controller class
  content = content.replace(
    /@Controller\(/,
    '@UseGuards(JwtAuthGuard)\n@Controller('
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Protected: ${fileName}`);
}

// Obtener todos los controllers
const srcPath = path.join(__dirname, '..', 'src');

function findControllers(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findControllers(fullPath);
    } else if (file.endsWith('controller.ts')) {
      addGuardToController(fullPath);
    }
  });
}

console.log('🔐 Aplicando guards a controllers...\n');
findControllers(srcPath);
console.log('\n✅ Proceso completado');
