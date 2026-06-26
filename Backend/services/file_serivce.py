from pathlib import Path

from fastapi import HTTPException, UploadFile

from schemas.file_schema import FileMetaData

ALLOWED_EXTENSIONS = [
    ".svg",
    ".pdf",
    ".webp",
    ".docx",
    ".html",
    ".xlsx",
    ".csv"
]

ALLOWED_CONTENT_TYPES = [
    "image/svg+xml",

    "application/pdf",

    "image/webp",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    "text/html",

    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    "text/csv"
]

async def validate(file: UploadFile):
    if not file.filename:
            raise HTTPException(
                  status_code = 400,
                  detail = "Filename is missing"
            )
    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
          raise HTTPException(
                status_code = 400,
                detail = f"{extension} is not supported"
          )
    
    if file.content_type not in ALLOWED_CONTENT_TYPES:
          raise HTTPException(
                status_code = 400,
                detail = "Invalid File type"
          )
    content = await file.read()

    size = len(content)

    await file.seek(0)

    metadata = FileMetaData(
          filename = file.filename,
          extensions = extension,
          content_type = file.content_type,
          size = size
    )

    return metadata