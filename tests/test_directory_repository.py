import re
import unittest

class TestDirectoryRepository(unittest.TestCase):
    def test_initial_members_4_languages(self):
        with open("src/services/repositories/DirectoryRepository.ts", "r", encoding="utf-8") as f:
            content = f.read()

        # Ensure INITIAL_DIRECTORY_MEMBERS exists
        self.assertIn("INITIAL_DIRECTORY_MEMBERS", content)

        # Extract all descriptions
        desc_en_count = content.count("description:")
        desc_el_count = content.count("description_el:")
        desc_ru_count = content.count("description_ru:")
        desc_he_count = content.count("description_he:")

        self.assertGreater(desc_en_count, 10, "Expected at least 10 EN descriptions in INITIAL_DIRECTORY_MEMBERS")
        self.assertEqual(desc_en_count, desc_el_count, "Mismatch between EN and EL description count")
        self.assertEqual(desc_en_count, desc_ru_count, "Mismatch between EN and RU description count")
        self.assertEqual(desc_en_count, desc_he_count, "Mismatch between EN and HE description count")

    def test_batch_entities_present(self):
        with open("src/services/repositories/DirectoryRepository.ts", "r", encoding="utf-8") as f:
            content = f.read()

        # MECI Solar Installers
        self.assertIn("Big Solar Cyprus Ltd", content)
        self.assertIn("CGP Solar Systems Ltd", content)
        self.assertIn("First Electric Solar Ltd", content)
        self.assertIn("Zotiades Energy Solutions Ltd", content)

        # Biomass Plants
        self.assertIn("Cypra Bioenergy Ltd", content)
        self.assertIn("Akerasi Bioenergy Plant", content)
        self.assertIn("ABIO Biomass Energy Ltd", content)

        # Grid Engineering Firms
        self.assertIn("Caramondani Energy Solutions", content)
        self.assertIn("Ergo Energy Contractors", content)
        self.assertIn("TPA Development & Grid Engineering", content)

if __name__ == "__main__":
    unittest.main()
