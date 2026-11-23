export interface BrowserUploadedDocument {
  documentId: string;
  filename: string;
}

function getStorageKey(userId: number) {
  return `nyayaai:uploaded-documents:${userId}`;
}

function isBrowserUploadedDocument(
  value: unknown,
): value is BrowserUploadedDocument {
  return (
    typeof value === "object" &&
    value !== null &&
    "documentId" in value &&
    typeof value.documentId === "string" &&
    "filename" in value &&
    typeof value.filename === "string"
  );
}

export function getBrowserUploadedDocuments(
  userId: number,
): BrowserUploadedDocument[] {
  if (typeof window === "undefined") {
    return [];
  }

  const storedDocuments = window.sessionStorage.getItem(getStorageKey(userId));
  if (!storedDocuments) {
    return [];
  }

  const parsed: unknown = JSON.parse(storedDocuments);
  if (!Array.isArray(parsed) || !parsed.every(isBrowserUploadedDocument)) {
    throw new Error("This tab's saved document list has an invalid format.");
  }

  return parsed;
}

export function rememberBrowserUploadedDocument(
  userId: number,
  document: BrowserUploadedDocument,
) {
  const documents = getBrowserUploadedDocuments(userId).filter(
    (item) => item.documentId !== document.documentId,
  );
  window.sessionStorage.setItem(
    getStorageKey(userId),
    JSON.stringify([document, ...documents]),
  );
}

export function forgetBrowserUploadedDocument(
  userId: number,
  documentId: string,
) {
  const documents = getBrowserUploadedDocuments(userId).filter(
    (document) => document.documentId !== documentId,
  );

  if (documents.length === 0) {
    window.sessionStorage.removeItem(getStorageKey(userId));
    return;
  }

  window.sessionStorage.setItem(
    getStorageKey(userId),
    JSON.stringify(documents),
  );
}
