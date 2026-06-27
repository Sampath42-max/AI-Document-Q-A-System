from langchain_text_splitters import RecursiveCharacterTextSplitter

def create_chunks(text: str):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size = 900,
        chunk_overlap = 200,
        separators = [
            "\n\n",
            "\n",
            ". ",
            "? ",
            ""
        ]
    )

    chunks = text_splitter.split_text(text)

    return chunks