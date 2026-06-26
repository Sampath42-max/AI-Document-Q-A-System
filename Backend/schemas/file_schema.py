from pydantic import BaseModel

class FileMetaData(BaseModel):
    filename : str
    extensions : str
    content_type : str
    size : int
    