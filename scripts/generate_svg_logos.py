import os

os.makedirs('public/logos', exist_ok=True)

svgs = {
    # MECI Solar Installers
    'bigsolar.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#1e1b4b"/>
  <rect x="22" y="22" width="24" height="24" rx="4" fill="#eab308"/>
  <rect x="54" y="22" width="24" height="24" rx="4" fill="#eab308"/>
  <rect x="22" y="54" width="24" height="24" rx="4" fill="#eab308"/>
  <rect x="54" y="54" width="24" height="24" rx="4" fill="#facc15"/>
  <path d="M50 12 L50 88 M12 50 L88 50" stroke="#000000" stroke-width="1.5" opacity="0.3"/>
</svg>''',

    'cgpsolar.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#0f172a"/>
  <circle cx="50" cy="50" r="32" fill="none" stroke="#eab308" stroke-width="6"/>
  <polygon points="50,22 62,42 38,42" fill="#eab308"/>
  <rect x="35" y="46" width="30" height="22" rx="4" fill="#0284c7"/>
  <path d="M42 57 L58 57" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
</svg>''',

    'firstelectric.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#0b192c"/>
  <path d="M55 18 L25 54 L48 54 L42 82 L75 46 L52 46 Z" fill="#f59e0b" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>
</svg>''',

    'zotiades.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#042f2e"/>
  <path d="M25 30 L75 30 L35 70 L75 70" fill="none" stroke="#10b981" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="75" cy="30" r="5" fill="#f59e0b"/>
</svg>''',

    # Biomass Plants
    'cypra.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#064e3b"/>
  <circle cx="50" cy="50" r="30" fill="none" stroke="#22c55e" stroke-width="8" stroke-dasharray="35 15"/>
  <path d="M42 62 L42 38 L62 50 Z" fill="#86efac"/>
  <path d="M50 25 C60 35 60 45 50 50 C40 45 40 35 50 25 Z" fill="#4ade80"/>
</svg>''',

    'akerasi.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#14532d"/>
  <path d="M50 20 Q75 40 50 80 Q25 40 50 20 Z" fill="#16a34a"/>
  <path d="M50 35 Q65 50 50 75" fill="none" stroke="#bbf7d0" stroke-width="4" stroke-linecap="round"/>
</svg>''',

    'abio.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#1c1917"/>
  <circle cx="50" cy="50" r="28" fill="#78350f"/>
  <path d="M35 50 C35 35 65 35 65 50 C65 65 35 65 35 50 Z" fill="#f59e0b"/>
  <path d="M50 28 L50 72" stroke="#b45309" stroke-width="4"/>
</svg>''',

    # Grid Engineering Firms
    'caramondani.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#1e293b"/>
  <polygon points="22,25 47,50 22,75" fill="#f59e0b"/>
  <polygon points="42,25 67,50 42,75" fill="#d97706"/>
  <polygon points="62,25 87,50 62,75" fill="#b45309"/>
</svg>''',

    'ergo.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#111827"/>
  <polygon points="50,18 82,78 18,78" fill="#ea580c"/>
  <path d="M50 32 L68 68 L32 68 Z" fill="#111827"/>
  <circle cx="50" cy="56" r="8" fill="#f97316"/>
</svg>''',

    'tpad.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#0f172a"/>
  <circle cx="50" cy="50" r="32" fill="#0284c7"/>
  <path d="M28 65 Q50 28 72 35 Q50 50 38 72" fill="none" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
  <circle cx="50" cy="50" r="6" fill="#ffffff"/>
</svg>''',

    # Converted vector SVGs for Bioland, GEG, Trikkis
    'bioland.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#065f46"/>
  <circle cx="50" cy="50" r="30" fill="#10b981"/>
  <path d="M35 55 C35 40 65 40 65 55 C65 70 35 70 35 55 Z" fill="#a7f3d0"/>
  <circle cx="50" cy="32" r="8" fill="#fbbf24"/>
</svg>''',

    'geg.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#0284c7"/>
  <path d="M25 68 L50 22 L75 68 Z" fill="none" stroke="#ffffff" stroke-width="8" stroke-linejoin="round"/>
  <circle cx="50" cy="52" r="10" fill="#22c55e"/>
</svg>''',

    'trikkis.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#0f172a"/>
  <polygon points="50,20 80,50 50,80 20,50" fill="#eab308"/>
  <polygon points="50,32 68,50 50,68 32,50" fill="#1e293b"/>
</svg>'''
}

for filename, content in svgs.items():
    path = os.path.join('public/logos', filename)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip())
    print(f"[CREATED] {path}")

print("[OK] All SVG emblems generated successfully.")
