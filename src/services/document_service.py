# This service handles:
# 1. Validate filename and extension
# 2. Validate MIME type
# 3. Generate unique UUID
# 4. Validate PDF signature
# 5. Check file size (20 MB)
# 6. Calculate SHA-256
# 7. Save PDF on disk

import hashlib
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException, status

CHUNK_SIZE = 1024 * 1024  # 1 MB

def get_storage_root() -> Path:
    root = Path("storage").resolve()
    root.mkdir(parents=True, exist_ok=True)
    return root

def save_document(file:UploadFile , user_id:str):
    original_filename = file.filename or "document.pdf"

    # Remove directory components from the supplied filename.
    original_filename = original_filename.replace("\\", "/").split("/")[-1]

    if not original_filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported."
        )

    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file content type."
        )

    # Use a generated name rather than trusting the user's filename.
    file_id = str(uuid.uuid4())
    storage_key = f"documents/{user_id}/{file_id}.pdf"

    root = get_storage_root()
    destination = (root / storage_key).resolve()

    if not destination.is_relative_to(root):
        raise HTTPException(
            status_code=400,
            detail="Invalid storage path."
        )

    destination.parent.mkdir(parents=True, exist_ok=True)

    sha256 = hashlib.sha256()
    total_size = 0
    max_size = 20 * 1024 * 1024 #20 MB
    first_chunk = True

    try:
        with destination.open("wb") as output:
            while True:
                chunk = file.file.read(CHUNK_SIZE)

                if not chunk:
                    break

                if first_chunk:
                    first_chunk = False

                    if b"%PDF-" not in chunk[:1024]:
                        raise HTTPException(
                            status_code=400,
                            detail="The uploaded file is not a valid PDF."
                        )

                total_size += len(chunk)

                if total_size > max_size:
                    raise HTTPException(
                        status_code=413,
                        detail="Maximum file size is 20 MB."
                    )

                sha256.update(chunk)
                output.write(chunk)

        if total_size == 0:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty."
            )

        return {
            "filename": original_filename,
            "storage_key": storage_key,
            "file_size": total_size,
            "sha256": sha256.hexdigest(),
            "mime_type": "application/pdf",
        }

    except Exception:
        destination.unlink(missing_ok=True)
        raise


def get_document_path(storage_key: str) -> Path:
    root = get_storage_root()
    path = (root / storage_key).resolve()

    if not path.is_relative_to(root):
        raise HTTPException(
            status_code=400,
            detail="Invalid storage path."
        )

    return path

def delete_stored_file(storage_key: str):
    path = get_document_path(storage_key)
    path.unlink(missing_ok=True)