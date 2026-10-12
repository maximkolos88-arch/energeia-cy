import json
import unittest
import os

class TestSystemConstants(unittest.TestCase):
    def test_required_keys(self):
        config_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'system_constants.json')
        with open(config_path, 'r') as f:
            data = json.load(f)

        required_keys = ['supported_locales', 'regulatory_entities']
        for key in required_keys:
            self.assertIn(key, data, f"Required key '{key}' is missing from system_constants.json")

if __name__ == '__main__':
    unittest.main()
