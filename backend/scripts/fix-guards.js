#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Controllers que NO necesitan guard
const skipControllers = [
  'auth.controller.ts',
  'app.controller.ts', 
  'contact.controller.ts',
  'mail.controller.ts'
];

function addGuardToController(filePath) {
  const fileName = path.basename(filePath);
  
  if (skipControllers.includes(fileName)) {
    console.log(`⏭️  Skipping: ${fileName}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Verificar si ya tiene guard correctamente
  if (content.includes('@UseGuards(JwtGuard)')) {
    console.log(`✅ Already protected: ${fileName}`);
    return;
  }

  // Limpiar imports rotos previos
  content = content.replace(/import { JwtAuthGuard } from.*?;/g, '');
  content = content.replace(/@UseGuards\(JwtAuthGuard\)/g, '');
  content = content.replace(/\s*,\s*UseGuards\s*}\s*from '@nestjs\/common';/, " } from '@nestjs/common';");

  // Agregar UseGuards al import de @nestjs/common
  if (!content.includes('UseGuards')) {
    content = content.replace(
      /} from '@nestjs\/common'/,
      ", UseGuards } from '@nestjs/common'"
    );
  }

  // Agregar import de JwtGuard
  if (!content.includes('JwtGuard')) {
    const importLine = "import { JwtGuard } from '../auth/guard/jwt.guard';\n";
    const lastImportIndex = content.lastIndexOf('import ');
    const endOfLastImport = content.indexOf(';', lastImportIndex);
    content = content.slice(0, endOfLastImport + 1) + '\n' + importLine + content.slice(endOfLastImport + 1);
  }

  // Agregar @UseGuards justo antes de @Controller
  if (!content.includes('@UseGuards(JwtGuard)')) {
    content = content.replace(
      /@Controller\(/,
      '@UseGuards(JwtGuard)\n@Controller('
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Protected: ${fileName}`);
}

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

console.log('🔐 Corrigiendo guards en controllers...\n');
findControllers(srcPath);
console.log('\n✅ Proceso completado');
