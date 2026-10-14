#!/usr/bin/env python3
"""
Seed SQL Generator for Supabase 'participants' table.
Generates SQL script to insert or update Cyprus energy directory members with 4-language support.
"""

import json

companies = [
    {
        "name": "Electricity Authority of Cyprus (EAC / AHK)",
        "type": "Company",
        "role_or_category": "State Electricity Utility & Distribution System Operator",
        "email": "eacinfo@eac.com.cy",
        "phone": "+357 22 201000",
        "location": "Nicosia, Cyprus",
        "category": "Government & Associations",
        "expertise_tags": ["Smart Grids", "Energy Efficiency", "O&M", "Policy & Regulatory"],
        "image_url": "/logos/eac.svg",
        "description": "Cyprus state utility responsible for power generation, transmission, and distribution grid operation under DTR regulation.",
        "description_el": "Αρχή Ηλεκτρισμού Κύπρου: Ημικρατικός οργανισμός παραγωγής, μεταφοράς και διανομής ηλεκτρικής ενέργειας στην Κύπρο.",
        "description_ru": "Государственная электрическая компания Кипра (EAC): генерация, передача и управление распределительными сетями электроснабжения.",
        "description_he": "רשות החשמל של קפריסין (EAC): הגוף הממשלתי האחראי ייצור, הולכה וחלוקת חשמל ברחבי קפריסין.",
        "is_verified": True
    },
    {
        "name": "Cyprus Energy Regulatory Authority (CERA / RAEK)",
        "type": "Company",
        "role_or_category": "Independent Energy Market Regulator",
        "email": "info@cera.org.cy",
        "phone": "+357 22 666363",
        "location": "Nicosia, Cyprus",
        "category": "Government & Associations",
        "expertise_tags": ["Policy & Regulatory", "PPA Structuring", "Energy Trading"],
        "image_url": "/logos/cera.svg",
        "description": "Independent regulatory authority monitoring the open electricity market, issuing generation licenses, and setting energy tariffs.",
        "description_el": "Ρυθμιστική Αρχή Ενέργειας Κύπρου (ΡΑΕΚ): Ανεξάρτητος ρυθμιστής αγοράς ηλεκτρισμού, αδειοδοτήσεων ΑΠΕ και τιμολογίων.",
        "description_ru": "Регуляторный орган энергетики Кипра (CERA): лицензирование энергорынка, регулирование тарифов и контроль конкуренции.",
        "description_he": "רשות הרגולציה לאנרגיה של קפריסין (CERA): רגולטור עצמאי המפקח על שוק החשמל, מעניק רישיונות ומגדיר תעריפים.",
        "is_verified": True
    },
    {
        "name": "Big Solar Cyprus Ltd",
        "type": "Company",
        "role_or_category": "MECI Registered PV Installer & Distributor",
        "email": "info@bigsolar.com.cy",
        "phone": "+357 22 870000",
        "location": "Nicosia, Cyprus",
        "category": "Renewables",
        "expertise_tags": ["Solar PV", "EPC", "Energy Efficiency", "O&M"],
        "image_url": "/logos/bigsolar.svg",
        "description": "Ministry-certified PV system installer and equipment distributor providing commercial net billing, energy efficiency upgrades, and solar power plants.",
        "description_el": "Πιστοποιημένος εγκαταστάτης φωτοβολταϊκών ΥΕΕΒΚ και διανομέας εξοπλισμού, παρέχοντας συστήματα net billing, ενεργειακές αναβαθμίσεις και φωτοβολταϊκά πάρκα.",
        "description_ru": "Авторизованный MECI инсталлятор фотоэлектрических систем и дистрибьютор оборудования: коммерческий Net Billing, энергоаудит и солнечные станции.",
        "description_he": "מתקין מערכות סולאריות מורשה משרד האנרגיה ומפיץ ציוד, המספק מערכות נט-בילינג מסחריות, שדרוגי התייעלות אנרגטית ותחנות כוח סולאריות.",
        "is_verified": True
    },
    {
        "name": "CGP Solar Systems Ltd",
        "type": "Company",
        "role_or_category": "MECI Certified PV & Battery Systems Contractor",
        "email": "info@cgpsolar.com",
        "phone": "+357 25 343434",
        "location": "Limassol, Cyprus",
        "category": "Renewables",
        "expertise_tags": ["Solar PV", "Energy Storage", "EPC", "Energy Efficiency"],
        "image_url": "/logos/cgpsolar.svg",
        "description": "MECI-registered renewable installer specializing in residential net-metering, commercial net-billing PV, and hybrid battery storage integration.",
        "description_el": "Εγγεγραμμένος εγκαταστάτης ΑΠΕ στο ΥΕΕΒΚ, με εξειδίκευση σε net-metering κατοικιών, εμπορικά φωτοβολταϊκά net-billing και ενσωμάτωση μπαταριών.",
        "description_ru": "Сертифицированный MECI подрядчик по солнечной энергетике: домашние системы Net Metering, коммерческий Net Billing и накопители энергии.",
        "description_he": "קבלן מערכות סולאריות מוסמך MECI המתמחה בנט-מטרינג למגורים, נט-בילינג מסחρη ושילוב אגירת אנרגיה בסוללות.",
        "is_verified": True
    },
    {
        "name": "First Electric Solar Ltd",
        "type": "Company",
        "role_or_category": "MECI Licensed Electrical & PV Engineering Contractor",
        "email": "contact@firstelectric.com.cy",
        "phone": "+357 24 636363",
        "location": "Larnaca, Cyprus",
        "category": "Engineering & EPC",
        "expertise_tags": ["Solar PV", "EPC", "Smart Grids", "Energy Efficiency"],
        "image_url": "/logos/firstelectric.svg",
        "description": "Licensed electrical engineering and solar installation contractor providing turnkey rooftop PV installations and industrial power upgrades.",
        "description_el": "Αδειούχος εργολήπτης ηλεκτρολογικών και φωτοβολταϊκών έργων, παρέχοντας ολοκληρωμένες εγκαταστάσεις στέγης και βιομηχανικές αναβαθμίσεις.",
        "description_ru": "Лицензированный MECI электротехнический и солярный подрядчик: монтаж крышных СЭС под ключ и модернизация промышленных вводов.",
        "description_he": "קבלן הנדסת חשמל וסולאר מורשה, המספק התקנות סולאריות על גגות במתכונת עד המפתח ושדרוגי רשת תעשייתיים.",
        "is_verified": True
    },
    {
        "name": "Cypra Bioenergy Ltd",
        "type": "Company",
        "role_or_category": "Biomass Waste-to-Energy & Biogas Generation Facility",
        "email": "info@cypra.com.cy",
        "phone": "+357 22 822800",
        "location": "Kato Moni, Nicosia, Cyprus",
        "category": "Renewables",
        "expertise_tags": ["ESG & Environmental", "Energy Storage", "Project Management", "O&M"],
        "image_url": "/logos/cypra.svg",
        "description": "Cyprus’s premier waste-to-energy biomass biogas plant converting livestock and agricultural waste into green grid electricity and organic fertilizer.",
        "description_el": "Η μεγαλύτερη μονάδα βιοαερίου και βιομάζας στην Κύπρο, που μετατρέπει γεωργοκτηνοτροφικά απόβλητα σε πράσινη ηλεκτρική ενέργεια.",
        "description_ru": "Крупнейшая на Кипре биогазовая станция на биомассе: переработка сельскохозяйственных отходов в зеленую электроэнергию и органические удобрения.",
        "description_he": "מפעל הביומסה והביוגז המוביל בקפריסין להפקת אנרגיה מפסולת, הממיר פסולת חקלאית לחשמל ירוק ודשן אורגני.",
        "is_verified": True
    },
    {
        "name": "Caramondani Energy Solutions (Caramondani Bros PLC)",
        "type": "Company",
        "role_or_category": "HV Substation & Power Grid EPC Engineering",
        "email": "info@caramondani.com.cy",
        "phone": "+357 22 816000",
        "location": "Nicosia, Cyprus",
        "category": "Engineering & EPC",
        "expertise_tags": ["Smart Grids", "EPC", "Energy Storage", "Project Management"],
        "image_url": "/logos/caramondani.svg",
        "description": "Pioneer engineering firm constructed high-voltage electrical substations, grid interconnections, and utility-scale power systems in Cyprus.",
        "description_el": "Πρωτοπόρος εταιρεία ηλεκτρολογικής μηχανικής, με κατασκευές υποσταθμών υψηλής τάσης, διασυνδέσεων δικτύου και ενεργειακών υποδομών.",
        "description_ru": "Ведущая инжиниринговая компания: строительство высоковольтных подстанций, сетевых присоединений и объектов электроэнергетики.",
        "description_he": "חברת הנדסה מובילה העוסקת בהקמת תחנות משנה במתח גבוה, חיבורי רשת חשמל ומערכות כוח בקנה מידה ארצי.",
        "is_verified": True
    },
    {
        "name": "Ergo Energy Contractors (Ergoleptiki Ltd)",
        "type": "Company",
        "role_or_category": "High-Voltage Grid & Transmission Line Engineers",
        "email": "info@ergo.com.cy",
        "phone": "+357 25 383838",
        "location": "Limassol, Cyprus",
        "category": "Engineering & EPC",
        "expertise_tags": ["Smart Grids", "EPC", "O&M", "Project Management"],
        "image_url": "/logos/ergo.svg",
        "description": "Specialized grid infrastructure contractor building medium and high voltage transmission lines, distribution networks, and transformer stations.",
        "description_el": "Εξειδικευμένος εργολήπτης υποδομών δικτύου, κατασκευάζοντας γραμμές μεταφοράς μέσης/υψηλής τάσης και μετασχηματιστές.",
        "description_ru": "Подрядчик сетевой инфраструктуры: строительство ЛЭП среднего и высокого напряжения, распределительных сетей и трансформаторных станций.",
        "description_he": "קבלן תשתיות רשת מתמחה הבונה קווי הולכה במתח בינוני וגבוה, רשתות חלוקה ותחנות שנאים.",
        "is_verified": True
    },
    {
        "name": "TPA Development & Grid Engineering (TPAD)",
        "type": "Company",
        "role_or_category": "Power Systems Engineering & Grid Stability Analysis",
        "email": "info@tpad.com.cy",
        "phone": "+357 22 313131",
        "location": "Nicosia, Cyprus",
        "category": "Engineering & EPC",
        "expertise_tags": ["Smart Grids", "PPA Structuring", "Project Management", "Financial Advisory"],
        "image_url": "/logos/tpad.svg",
        "description": "Power grid engineering and consultancy firm executing dynamic grid stability studies, TSOC compliance modeling, and renewable integration.",
        "description_el": "Εταιρεία σύμβουλων μηχανικών ηλεκτρικών συστημάτων, μελέτες ευσταθείας δικτύου, μοντελοποίηση TSOC και σύνδεση ΑΠΕ.",
        "description_ru": "Инжиниринговая компания: моделирование устойчивости энергосистем, расчеты режимов для TSOC и интеграция возобновляемых источников.",
        "description_he": "חברת הנדסת מערכות כוח ומחקר המבצעת ניתוחי יציבות רשת דינמיים, מידול תאימות ל-TSOC ושילוב אנרגיה מתחדשת.",
        "is_verified": True
    }
]

sql_statements = []
sql_statements.append("-- Seed data for public.participants table in Supabase")
sql_statements.append("INSERT INTO public.participants (name, type, role_or_category, email, phone, location, category, expertise_tags, image_url, description, description_el, description_ru, description_he, is_verified)")
sql_statements.append("VALUES")

values_list = []
for c in companies:
    def esc(s):
        if s is None:
            return "NULL"
        return "'" + str(s).replace("'", "''") + "'"

    tags_array = "ARRAY[" + ", ".join([esc(t) for t in c["expertise_tags"]]) + "]::TEXT[]"
    
    val = f"  ({esc(c['name'])}, {esc(c['type'])}, {esc(c['role_or_category'])}, {esc(c['email'])}, {esc(c['phone'])}, {esc(c['location'])}, {esc(c['category'])}, {tags_array}, {esc(c['image_url'])}, {esc(c['description'])}, {esc(c['description_el'])}, {esc(c['description_ru'])}, {esc(c.get('description_he', ''))}, {str(c['is_verified']).lower()})"
    values_list.append(val)

sql_statements.append(",\n".join(values_list))
sql_statements.append("""ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role_or_category = EXCLUDED.role_or_category,
  phone = EXCLUDED.phone,
  location = EXCLUDED.location,
  category = EXCLUDED.category,
  expertise_tags = EXCLUDED.expertise_tags,
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description,
  description_el = EXCLUDED.description_el,
  description_ru = EXCLUDED.description_ru,
  description_he = EXCLUDED.description_he,
  is_verified = EXCLUDED.is_verified;""")

output = "\n".join(sql_statements)
with open("supabase_seed_participants.sql", "w", encoding="utf-8") as f:
    f.write(output)

print(f"[OK] Generated supabase_seed_participants.sql with {len(companies)} companies.")
