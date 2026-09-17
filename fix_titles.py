import re
with open('src/data/gutHealth40QuestionsData.ts', 'r') as f:
    text = f.read()

text = re.sub(r"tamilTitle:\s*'.*?',", "tamilTitle: '',", text)

with open('src/data/gutHealth40QuestionsData.ts', 'w') as f:
    f.write(text)
