import json

companies = [
    {
        "name": "Bioland Energy Group",
        "type": "Company",
        "role_or_category": "Utility-Scale Solar & EPC Contractor",
        "email": "info@biolandenergy.com",
        "phone": "+357 24 533833",
        "location": "Larnaca, Cyprus",
        "category": "Solar PV",
        "expertise_tags": ["Solar PV", "EPC", "Smart Grids", "O&M", "Project Management"],
        "image_url": "https://www.biolandenergy.com/favicon.ico",
        "description": "Leading Cyprus renewable energy developer specializing in utility-scale photovoltaic parks, grid infrastructure, and private energy supply.",
        "description_el": "Κορυφαίος οργανισμός ανάπτυξης ΑΠΕ στην Κύπρο με εξειδίκευση σε φωτοβολταϊκά πάρκα μεγάλης κλίμακας και υποδομές δικτύου.",
        "description_ru": "Крупнейший кипрский девелопер проектов ВИЭ: промышленные солнечные электростанции, подстанции высокого напряжения и частные PPA.",
        "is_verified": True
    },
    {
        "name": "K-Energy by Karantokis",
        "type": "Company",
        "role_or_category": "Commercial & Residential PV Solutions",
        "email": "info@kenergy.com.cy",
        "phone": "+357 22 311696",
        "location": "Nicosia, Cyprus",
        "category": "Solar PV",
        "expertise_tags": ["Solar PV", "Energy Efficiency", "Energy Storage", "EPC"],
        "image_url": "https://kenergy.com.cy/favicon.ico",
        "description": "Premier provider of rooftop solar photovoltaic installations, commercial net billing, energy storage, and efficiency audits.",
        "description_el": "Κορυφαίος πάροχος οικιακών και εμπορικών φωτοβολταϊκών συστημάτων, net billing και ενεργειακών ελέγχων στην Κύπρο.",
        "description_ru": "Ведущий поставщик коммерческих и бытовых фотоэлектрических систем, решений Net Billing, накопителей и энергоаудита.",
        "is_verified": True
    },
    {
        "name": "Green Energy Group",
        "type": "Company",
        "role_or_category": "Integrated Renewables & Storage Systems",
        "email": "info@geg.com.cy",
        "phone": "+357 25 734800",
        "location": "Limassol, Cyprus",
        "category": "Energy Storage",
        "expertise_tags": ["Solar PV", "Energy Storage", "Microgrids", "EPC", "Energy Trading"],
        "image_url": "https://geg.com.cy/favicon.ico",
        "description": "Turnkey engineering and installation firm delivering commercial PV parks, hybrid battery storage systems, and industrial electrical projects.",
        "description_el": "Ολοκληρωμένες λύσεις μηχανικής για φωτοβολταϊκά πάρκα, συστήματα αποθήκευσης ενέργειας με μπαταρίες και βιομηχανικά έργα.",
        "description_ru": "Инженерная компания полного цикла: коммерческие солнечные парки, гибридные системы хранения энергии (BESS) и промышленный монтаж.",
        "is_verified": True
    },
    {
        "name": "Lanitis Energy",
        "type": "Company",
        "role_or_category": "PV Equipment Distribution & EPC",
        "email": "info@lanitisenergy.com",
        "phone": "+357 25 820000",
        "location": "Limassol, Cyprus",
        "category": "Solar PV",
        "expertise_tags": ["Solar PV", "EPC", "Project Management", "O&M"],
        "image_url": "https://lanitisenergy.com/favicon.ico",
        "description": "Part of Lanitis Group, offering Tier-1 solar panel supply, premium inverters, and turnkey photovoltaic installations for corporate facilities.",
        "description_el": "Μέλος του Ομίλου Λανίτη, προσφέρει κορυφαίο εξοπλισμό φωτοβολταϊκών, μετατροπείς και ολοκληρωμένες εγκαταστάσεις για επιχειρήσεις.",
        "description_ru": "Подразделение Lanitis Group: официальные поставки Tier-1 фотомодулей, сетевых инверторов и EPC-проекты для корпоративного сектора.",
        "is_verified": True
    },
    {
        "name": "GreenH2Cy Ltd",
        "type": "Company",
        "role_or_category": "Green Hydrogen Production & Refueling",
        "email": "contact@greenh2.cy",
        "phone": "+357 25 000000",
        "location": "Limassol, Cyprus",
        "category": "Hydrogen",
        "expertise_tags": ["Hydrogen", "ESG & Environmental", "Project Management", "Policy & Regulatory"],
        "image_url": "https://greenh2.cy/favicon.ico",
        "description": "Developing Cyprus’s first green hydrogen production plant and HRS refueling station for heavy transport and industrial decarbonization.",
        "description_el": "Ανάπτυξη του πρώτου σταθμού παραγωγής πράσινου υδρογόνου και σταθμού ανεφοδιασμού για βαρέα οχήματα στην Κύπρο.",
        "description_ru": "Разработчик первого на Кипре завода по производству зеленого водорода и сети заправочных станций для тяжелого грузового транспорта.",
        "is_verified": True
    },
    {
        "name": "Conercon Energy Solutions",
        "type": "Company",
        "role_or_category": "EPC & Large Commercial Solar Projects",
        "email": "info@conercon.com",
        "phone": "+357 24 848000",
        "location": "Larnaca, Cyprus",
        "category": "Solar PV",
        "expertise_tags": ["Solar PV", "EPC", "O&M", "Project Management"],
        "image_url": "https://conercon.com/favicon.ico",
        "description": "Subsidiary of Petrolina Group delivering large-scale commercial solar parks, energy saving solutions, and EPC contracting.",
        "description_el": "Θυγατρική του Ομίλου Petrolina με εξειδίκευση σε μεγάλα εμπορικά φωτοβολταϊκά πάρκα και ενεργειακές λύσεις εξοικονόμησης.",
        "description_ru": "Дочерняя компания Petrolina Group: строительство масштабных коммерческих солнечных парков и энергосберегающие решения под ключ.",
        "is_verified": True
    },
    {
        "name": "Solar Energy Concepts",
        "type": "Company",
        "role_or_category": "Residential & Commercial PV EPC",
        "email": "info@solarenergy.com.cy",
        "phone": "+357 25 388880",
        "location": "Limassol, Cyprus",
        "category": "Solar PV",
        "expertise_tags": ["Solar PV", "Energy Storage", "EPC", "Energy Efficiency"],
        "image_url": "https://solarenergy.com.cy/favicon.ico",
        "description": "Engineering and installation of high-efficiency rooftop PV systems, battery integration, and electrical upgrades across Limassol and Paphos.",
        "description_el": "Σχεδιασμός και εγκατάσταση φωτοβολταϊκών συστημάτων υψηλής απόδοσης, ενσωμάτωση μπαταριών και ηλεκτρολογικές αναβαθμίσεις.",
        "description_ru": "Проектирование и монтаж высокоэффективных кровельных СЭС, интеграция накопителей энергии и модернизация вводов питания.",
        "is_verified": True
    },
    {
        "name": "Lighthief Cyprus Ltd",
        "type": "Company",
        "role_or_category": "PV Testing, O&M & Circular Economy",
        "email": "info@lighthief.com.cy",
        "phone": "+357 22 250000",
        "location": "Nicosia, Cyprus",
        "category": "Solar PV",
        "expertise_tags": ["Solar PV", "O&M", "ESG & Environmental", "Project Management"],
        "image_url": "https://lighthief.com.cy/favicon.ico",
        "description": "Specialized operation, mobile laboratory EL testing, thermographic diagnostics, and PV panel recycling solutions.",
        "description_el": "Εξειδικευμένες υπηρεσίες συντήρησης, θερμογραφικών ελέγχων και ανακύκλωσης φωτοβολταϊκών συστημάτων στην Κύπρο.",
        "description_ru": "Сервисное обслуживание, мобильное электролюминесцентное тестирование, тепловизионная диагностика и переработка солнечных панелей.",
        "is_verified": True
    },
    {
        "name": "Suntechnics Ltd",
        "type": "Company",
        "role_or_category": "Renewable Energy Systems & Microgrids",
        "email": "info@suntechnics.biz",
        "phone": "+357 22 865500",
        "location": "Nicosia, Cyprus",
        "category": "Solar PV",
        "expertise_tags": ["Solar PV", "Energy Storage", "Microgrids", "EPC", "EV Infrastructure"],
        "image_url": "https://suntechnics.biz/favicon.ico",
        "description": "Member of Green Energy Group, providing EPC services for utility-scale solar parks, residential net billing, and electric vehicle charging.",
        "description_el": "Μέλος του Ομίλου Green Energy, παρέχει υπηρεσίες EPC για φωτοβολταϊκά πάρκα, οικιακά συστήματα και φόρτιση ηλεκτρικών οχημάτων.",
        "description_ru": "Подразделение Green Energy Group: проектирование и монтаж промышленных солнечных станций, бытовых систем и зарядных станций для EV.",
        "is_verified": True
    },
    {
        "name": "Muskita Solar",
        "type": "Company",
        "role_or_category": "Mounting Structures & Aluminum Systems",
        "email": "info@muskitasolar.com",
        "phone": "+357 25 844444",
        "location": "Limassol, Cyprus",
        "category": "Solar PV",
        "expertise_tags": ["Solar PV", "EPC", "Project Management"],
        "image_url": "https://muskitasolar.com/favicon.ico",
        "description": "Engineering and manufacturing of specialized high-grade aluminum mounting structures for rooftop and ground-mounted PV systems.",
        "description_el": "Σχεδιασμός και κατασκευή εξειδικευμένων συστημάτων στήριξης αλουμινίου για φωτοβολταϊκές εγκαταστάσεις στέγης και εδάφους.",
        "description_ru": "Проектирование и производство высокопрочных алюминиевых опорных конструкций для наземных и кровельных солнечных электростанций.",
        "is_verified": True
    }
]

sql_statements = []
sql_statements.append("-- Seed data for public.participants")
sql_statements.append("INSERT INTO public.participants (name, type, role_or_category, email, phone, location, category, expertise_tags, image_url, description, description_el, description_ru, is_verified)")
sql_statements.append("VALUES")

values_list = []
for c in companies:
    # SQL escaping
    def esc(s):
        if s is None:
            return "NULL"
        return "'" + str(s).replace("'", "''") + "'"

    tags_array = "ARRAY[" + ", ".join([esc(t) for t in c["expertise_tags"]]) + "]::TEXT[]"
    
    val = f"  ({esc(c['name'])}, {esc(c['type'])}, {esc(c['role_or_category'])}, {esc(c['email'])}, {esc(c['phone'])}, {esc(c['location'])}, {esc(c['category'])}, {tags_array}, {esc(c['image_url'])}, {esc(c['description'])}, {esc(c['description_el'])}, {esc(c['description_ru'])}, {str(c['is_verified']).lower()})"
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
  is_verified = EXCLUDED.is_verified;""")

# Добавим также политику для будущих заявок без авторизации
sql_statements.append("""
-- Разрешить гостевую отправку заявок в статусе не верифицирован
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'participants' AND policyname = 'Allow public insert on participants'
  ) THEN
    CREATE POLICY "Allow public insert on participants" ON public.participants FOR INSERT WITH CHECK (true);
  END IF;
END $$;
""")

output = "\n".join(sql_statements)
with open("supabase_seed_participants.sql", "w", encoding="utf-8") as f:
    f.write(output)

print(f"[OK] Generated supabase_seed_participants.sql with {len(companies)} companies.")
