import os
import re

tamil_pattern = re.compile(r'[\u0b80-\u0bff]+')

def strip_tamil_from_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # For localName in masterFoodList.ts: e.g., 'குதிரைவாலி / Sanwa' -> 'Sanwa'
    # Actually, let's just remove Tamil letters, then clean up leading " / " or " (Tamil)"
    
    if tamil_pattern.search(content):
        # We can just remove Tamil characters
        content = tamil_pattern.sub('', content)
        
        # Clean up dangling punctuation
        content = content.replace(" (Tamil)", "")
        content = content.replace(" /  (Sanskrit)", " (Sanskrit)")
        content = content.replace("  / ", " ")
        content = content.replace(" / ", "")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            strip_tamil_from_file(os.path.join(root, file))
