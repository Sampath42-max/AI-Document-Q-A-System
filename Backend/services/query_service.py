from spellchecker import SpellChecker

spell = SpellChecker()

def preprocess_query(question: str):
    words = question.split()

    corrected = []

    for word in words:
        corrected.append(
            spell.correction(word) or word
        )
    return " ".join(corrected)