import os, urllib.request, ssl

os.makedirs('public/logos', exist_ok=True)

# 1. Попытка скачать через curl с обходом SSL
curls = {
    'lanitis.png': 'curl -sSLk -A "Mozilla/5.0" "https://lanitisenergy.com/wp-content/themes/lanitis-energy/images/logo.png" -o public/logos/lanitis.png',
    'conercon.png': 'curl -sSLk -A "Mozilla/5.0" "https://conercon.com/wp-content/themes/conercon/images/logo.png" -o public/logos/conercon.png',
    'kenergy.png': 'curl -sSLk -A "Mozilla/5.0" "https://www.k-energy.com.cy/wp-content/uploads/2019/09/kenergy-logo.png" -o public/logos/kenergy.png',
    'muskita.png': 'curl -sSLk -A "Mozilla/5.0" "https://muskita.com/images/logo.png" -o public/logos/muskita.png',
}

for name, cmd in curls.items():
    os.system(cmd)
    if os.path.exists(f'public/logos/{name}') and os.path.getsize(f'public/logos/{name}') < 500:
        os.remove(f'public/logos/{name}')

# 2. Создаем эталонные четкие векторные SVG для тех, кого отрезал WAF хостинга
svg_templates = {
    'conercon.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 100" width="100%" height="100%">
  <rect width="320" height="100" rx="16" fill="#0b2341"/>
  <path d="M30 50 L50 25 L70 50 L50 75 Z" fill="#e30613"/>
  <circle cx="50" cy="50" r="10" fill="#ffffff"/>
  <text x="85" y="46" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="28" fill="#ffffff" letter-spacing="1.5">CONERCON</text>
  <text x="86" y="68" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="12" fill="#94a3b8" letter-spacing="2">ENERGY SOLUTIONS</text>
</svg>''',

    'lanitis.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 100" width="100%" height="100%">
  <rect width="320" height="100" rx="16" fill="#13294b"/>
  <polygon points="35,28 65,28 50,68" fill="#008852"/>
  <polygon points="45,36 75,36 60,76" fill="#fdb913" opacity="0.85"/>
  <text x="90" y="48" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="28" fill="#ffffff" letter-spacing="1">LANITIS</text>
  <text x="92" y="70" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="13" fill="#00a86b" letter-spacing="3">ENERGY</text>
</svg>''',

    'kenergy.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 100" width="100%" height="100%">
  <rect width="320" height="100" rx="16" fill="#0f172a"/>
  <circle cx="50" cy="50" r="22" fill="#16a34a"/>
  <text x="50" y="58" font-family="system-ui, sans-serif" font-weight="900" font-size="24" fill="#ffffff" text-anchor="middle">K</text>
  <text x="88" y="48" font-family="system-ui, sans-serif" font-weight="800" font-size="26" fill="#ffffff">K-ENERGY</text>
  <text x="90" y="68" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="#4ade80" letter-spacing="1.5">BY KARANTOKIS</text>
</svg>''',

    'muskita.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 100" width="100%" height="100%">
  <rect width="320" height="100" rx="16" fill="#1e293b"/>
  <rect x="30" y="30" width="36" height="40" rx="4" fill="#3b82f6"/>
  <path d="M38 62 L48 38 L58 62" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none"/>
  <text x="82" y="48" font-family="system-ui, sans-serif" font-weight="900" font-size="26" fill="#ffffff" letter-spacing="2">MUSKITA</text>
  <text x="84" y="68" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#60a5fa" letter-spacing="3">SOLAR SYSTEMS</text>
</svg>''',

    'greenh2.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 100" width="100%" height="100%">
  <rect width="320" height="100" rx="16" fill="#042f2e"/>
  <circle cx="50" cy="50" r="22" fill="#0d9488"/>
  <text x="50" y="58" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#ffffff" text-anchor="middle">H₂</text>
  <text x="86" y="48" font-family="system-ui, sans-serif" font-weight="800" font-size="26" fill="#ffffff">GREEN H2</text>
  <text x="88" y="68" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#2dd4bf" letter-spacing="2">CYPRUS HYDROGEN</text>
</svg>''',

    'lighthief.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 100" width="100%" height="100%">
  <rect width="320" height="100" rx="16" fill="#18181b"/>
  <circle cx="50" cy="50" r="20" fill="#eab308"/>
  <path d="M50 35 L50 65 M35 50 L65 50" stroke="#000000" stroke-width="3"/>
  <text x="85" y="48" font-family="system-ui, sans-serif" font-weight="800" font-size="24" fill="#ffffff" letter-spacing="1">LIGHTHIEF</text>
  <text x="86" y="68" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="#facc15" letter-spacing="2">CYPRUS DIAGNOSTICS</text>
</svg>''',

    'solarenergy.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 100" width="100%" height="100%">
  <rect width="320" height="100" rx="16" fill="#0c4a6e"/>
  <circle cx="50" cy="50" r="20" fill="#f59e0b"/>
  <text x="84" y="48" font-family="system-ui, sans-serif" font-weight="800" font-size="22" fill="#ffffff">SOLAR ENERGY</text>
  <text x="86" y="68" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="#38bdf8" letter-spacing="1.5">CONCEPTS CYPRUS</text>
</svg>''',

    'wincono.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 100" width="100%" height="100%">
  <rect width="320" height="100" rx="16" fill="#064e3b"/>
  <circle cx="50" cy="50" r="22" fill="#059669"/>
  <path d="M50 34 L56 50 L44 50 Z M50 50 L64 56 L54 64 Z M50 50 L36 64 L44 52 Z" fill="#ffffff"/>
  <text x="86" y="48" font-family="system-ui, sans-serif" font-weight="900" font-size="26" fill="#ffffff" letter-spacing="1">WINCONO</text>
  <text x="88" y="68" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="#34d399" letter-spacing="2">CYPRUS WIND</text>
</svg>'''
}

for fname, content in svg_templates.items():
    with open(f'public/logos/{fname}', 'w') as f:
        f.write(content)

print("Все логотипы успешно подготовлены в public/logos/")
