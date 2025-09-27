#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function findDTOs(dir, results = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findDTOs(fullPath, results);
    } else if (file.startsWith('create-') && file.endsWith('.dto.ts')) {
      results.push(fullPath);
    }
  });
  
  return results;
}

const srcPath = path.join(__dirname, '..', 'src');
const dtoFiles = findDTOs(srcPath);

console.log(`🔍 Encontrados ${dtoFiles.length} DTOs\n`);

dtoFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const originalContent = content;

  // Remover tenantId del DTO
  content = content.replace(/@IsString\(\)\s+tenantId:\s+string;/g, '');
  content = content.replace(/\s+tenantId:\s+string;/g, '');
  
  // Limpiar líneas vacías extras
  content = content.replace(/\n\n\n+/g, '\n\n');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ Cleaned: ${path.basename(file)}`);
  }
});

console.log('\n✅ Proceso completado');
