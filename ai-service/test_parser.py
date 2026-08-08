from app.services.indexing.parser_service import ParserService

files = [{"path": "repositories/Hello-World/README", "language": "Markdown"}]

parser = ParserService()
result = parser.parse_files(files)

print(result)
