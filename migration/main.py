import csv
import os

import requests
from dotenv import load_dotenv

load_dotenv()

# Firebase REST API details
firebase_api_key = os.getenv("VITE_API_KEY")
firebase_project_id = os.getenv("VITE_PROJECT_ID")
firebase_collection = "documents"  # Replace with your collection name


def process_field(value):
    if "stringValue" in value:
        return value["stringValue"]
    elif "integerValue" in value:
        return int(value["integerValue"])
    elif "booleanValue" in value:
        return value["booleanValue"]
    elif "doubleValue" in value:
        return float(value["doubleValue"])
    elif "timestampValue" in value:
        return value["timestampValue"]
    elif "arrayValue" in value and "values" in value["arrayValue"]:
        return [process_field(v) for v in value["arrayValue"]["values"]]
    elif "mapValue" in value and "fields" in value["mapValue"]:
        return {k: process_field(v) for k, v in value["mapValue"]["fields"].items()}
    else:
        return None


def fetch_notes_from_firebase():
    url = f"https://firestore.googleapis.com/v1/projects/{firebase_project_id}/databases/(default)/documents/{firebase_collection}?key={firebase_api_key}"
    response = requests.get(url)
    response.raise_for_status()
    documents = response.json().get("documents", [])

    notes_list = []
    for doc in documents:
        note_dict = {"id": doc["name"].split("/")[-1]}
        for field, value in doc["fields"].items():
            note_dict[field] = process_field(value)
        notes_list.append(note_dict)
    return notes_list


def map_note_to_document(note):
    return {
        "content": note.get("mdcontent", None),
        "created_at": note["createdAt"],
        "updated_at": note["updatedAt"],
        "pinned": note.get("metadata", {}).get("pin", False),
        "sample": note.get("metadata", {}).get("sample", ""),
        "tags": note.get("metadata", {}).get("tags", "[]"),
        "title": note.get("title", ""),
        "type": note.get("metadata", {}).get("type", "note"),
    }


def save_notes_to_csv(notes, filename="notes.csv"):
    # Ensure all notes have the same keys
    fieldnames = [
        "content",
        "created_at",
        "updated_at",
        "pinned",
        "sample",
        "tags",
        "title",
        "type",
    ]

    with open(filename, mode="w", newline="", encoding="utf-8") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)

        writer.writeheader()
        for note in notes:
            document = map_note_to_document(note)
            writer.writerow(document)


if __name__ == "__main__":
    notes = fetch_notes_from_firebase()
    save_notes_to_csv(notes)
