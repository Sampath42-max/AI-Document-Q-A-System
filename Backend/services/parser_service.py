import fitz
import pandas as pd
from docx import Document
from bs4 import BeautifulSoup
from pathlib import Path
import re


def parse_pdf(file_path: str):
    document = fitz.open(file_path)
    blocks_text = []
    # Enable space inhibition and dehyphenation to fix broken character spacing,
    # and sort blocks logically (top-to-bottom, left-to-right)
    flags = fitz.TEXT_INHIBIT_SPACES | fitz.TEXT_DEHYPHENATE
    for page in document:
        blocks = page.get_text("blocks", flags=flags, sort=True)
        for b in blocks:
            # b[4] is the text content of the block
            block_content = b[4].strip()
            if block_content:
                # Collapse redundant horizontal spaces (leaving word separators intact)
                block_content = re.sub(r'[ \t]+', ' ', block_content)
                blocks_text.append(block_content)
    return "\n\n".join(blocks_text)

def parse_docx(file_path: str):
    document = Document(file_path)
    text = []
    for paragraph in document.paragraphs:
        p_text = paragraph.text.strip()
        if p_text:
            text.append(p_text)
    return "\n\n".join(text)

def parse_html(file_path: str):
    with open(file_path, "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "html.parser")
    # Use double newlines as separator for extracted text elements
    return soup.get_text(separator="\n\n")

def parse_xlsx(file_path: str):
    excel = pd.read_excel(
        file_path, sheet_name=None
    )
    text = []

    for sheet_name, dataframe in excel.items():
        text.append(dataframe.to_string())
    
    return "\n\n".join(text)

def parse_csv(file_path: str):
    dataframe = pd.read_csv(file_path)
    return dataframe.to_string()

def parse_document(file_path: str):
    extension = Path(file_path).suffix.lower()

    if extension == '.pdf':
        return parse_pdf(file_path)
    elif extension == '.docx':
        return parse_docx(file_path)
    elif extension == '.html':
        return parse_html(file_path)
    elif extension == '.xlsx':
        return parse_xlsx(file_path)
    elif extension == '.csv':
        return parse_csv(file_path)
    else:
        raise ValueError(
            f"{extension} not supported"
        )