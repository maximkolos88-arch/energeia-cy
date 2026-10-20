import re
import urllib.request
import unittest
from pathlib import Path

class TestEnergyScrapers(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        ts_code = Path("src/cloud_functions/newsAggregator.ts").read_text(encoding="utf-8")
        regex_match = re.search(r'const headlineRegex\s*=\s*/(.*?)/gi;', ts_code)
        if not regex_match:
            raise ValueError("headlineRegex not found in newsAggregator.ts")
        
        cls.pattern_str = regex_match.group(1)
        cls.compiled_regex = re.compile(cls.pattern_str, re.IGNORECASE)
        cls.headers = {"User-Agent": "Energeia-Aggregator-Bot/1.0 (+https://www.energeia.cy)"}

    def _fetch_html(self, url: str) -> str:
        req = urllib.request.Request(url, headers=self.headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            return response.read().decode("utf-8", errors="ignore")

    def test_cera_markup_structure(self):
        url = "https://www.cera.org.cy/en-gb/press-releases"
        html = self._fetch_html(url)
        matches = self.compiled_regex.findall(html)
        self.assertGreater(
            len(matches), 
            0, 
            f"Parser failed for CERA ({url}). Regex '{self.pattern_str}' matched 0 articles."
        )

    def test_eac_markup_structure(self):
        url = "https://www.eac.com.cy/EN/PressReleases"
        html = self._fetch_html(url)
        matches = self.compiled_regex.findall(html)
        self.assertGreater(
            len(matches), 
            0, 
            f"Parser failed for EAC ({url}). Regex '{self.pattern_str}' matched 0 articles."
        )

if __name__ == "__main__":
    unittest.main()
