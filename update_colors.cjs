const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Sky -> Gold
  content = content.replace(/sky-500/g, 'yellow-500');
  content = content.replace(/sky-400/g, 'yellow-400');
  content = content.replace(/sky-300/g, 'yellow-200');
  content = content.replace(/sky-950/g, 'yellow-950');
  content = content.replace(/sky-600/g, 'yellow-600');
  
  // Dark blues -> Black/Zinc
  content = content.replace(/bg-\[#070d1e\]/g, 'bg-black');
  content = content.replace(/bg-\[#0b1633\]/g, 'bg-[#111]');
  content = content.replace(/bg-\[#0a1329\]/g, 'bg-[#0a0a0a]');

  fs.writeFileSync(filePath, content);
}

updateFile('src/components/NutritionPrescriptionModal.tsx');
updateFile('src/components/Unified7DayClinicalDietTable.tsx');
console.log('Updated colors');
