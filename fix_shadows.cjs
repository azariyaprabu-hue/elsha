const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Sky shadow to Yellow/Amber shadow (e.g., 234, 179, 8 is roughly yellow-500)
  content = content.replace(/rgba\(56,189,248/g, 'rgba(234,179,8');
  content = content.replace(/rgba\(2,132,199/g, 'rgba(202,138,4');

  fs.writeFileSync(filePath, content);
}

updateFile('src/components/NutritionPrescriptionModal.tsx');
updateFile('src/components/Unified7DayClinicalDietTable.tsx');
console.log('Fixed shadows');
