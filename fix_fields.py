import re
import os

files = [
    'src/data/dietDomainsMasterData.ts',
    'src/data/initialData.ts',
    'src/components/IngredientAndAyurSiddhaSection.tsx'
]

for file in files:
    with open(file, 'r') as f:
        text = f.read()

    text = re.sub(r"tamilName:\s*'.*?',", "tamilName: '',", text)
    text = re.sub(r"tamilFocusFood:\s*'.*?',", "tamilFocusFood: '',", text)
    text = re.sub(r"tamilCommonName:\s*'.*?',", "tamilCommonName: '',", text)
    
    # Also clean up the traditionalName in IngredientAndAyurSiddhaSection
    if 'IngredientAndAyurSiddhaSection' in file:
        text = re.sub(r"traditionalName:\s*'.*?',", "traditionalName: '',", text)

    with open(file, 'w') as f:
        f.write(text)
