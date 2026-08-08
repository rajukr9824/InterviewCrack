from pathlib import Path
from typing import Dict, List, Optional


class ParserService:
    """
    Reads repository source files and returns their content
    together with metadata.
    """

    def __init__(self):
        pass

    def parse_files(self, files: List[Dict]) -> List[Dict]:
        """
        Parse all supported repository files.

        Args:
            files: List of supported repository files.

        Returns:
            A list containing parsed file information.
        """
        parsed_files = []

        for file_info in files:
            parsed = self.parse_file(file_info)

            if parsed is not None:
                parsed_files.append(parsed)

        return parsed_files

    def parse_file(self, file_info: Dict) -> Optional[Dict]:
        """
        Parse a single repository file.
        """

        file_path = Path(file_info["absolute_path"])

        try:
            content = file_path.read_text(
                encoding="utf-8",
                errors="strict",
            )
        except Exception as e:
            print(f"Error parsing {file_path}: {e}")
            return None

        return {
            **file_info,
            "content": content,
        }
