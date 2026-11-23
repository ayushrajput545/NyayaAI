"use client";

import axios from "axios";
import {
  ArrowLeft,
  CheckCircle2,
  CloudUpload,
  Download,
  FileText,
  LoaderCircle,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { useAuth } from "@/contexts/auth-context";
import { authenticatedApiClient } from "@/lib/api";
import {
  forgetBrowserUploadedDocument,
  rememberBrowserUploadedDocument,
} from "@/lib/user-documents";

const DOCUMENT_API_PATH = "/documents/api/v1";
const MAX_FILE_SIZE = 20 * 1024 * 1024;

interface DocumentUploadResponse {
  message: string;
  document_id: string;
  filename: string;
  total_chunks: number;
}

interface UploadedDocument {
  documentId: string;
  filename: string;
  totalChunks: number;
  fileSize: number;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getDocumentErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const detail: unknown = error.response?.data?.detail;
  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item: unknown) => {
        if (
          typeof item === "object" &&
          item !== null &&
          "msg" in item &&
          typeof item.msg === "string"
        ) {
          return item.msg;
        }

        return null;
      })
      .filter((message): message is string => message !== null);

    if (messages.length > 0) {
      return messages.join(". ");
    }
  }

  return error.message || fallback;
}

function DocumentsManager({
  status,
  authError,
  refreshUser,
  userId,
}: Pick<ReturnType<typeof useAuth>, "status" | "authError" | "refreshUser"> & {
  userId: number | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<
    UploadedDocument[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] =
    useState<UploadedDocument | null>(null);
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(
    null,
  );
  const [downloadingDocumentId, setDownloadingDocumentId] = useState<
    string | null
  >(null);

  const isAuthenticated = status === "authenticated";

  const requestUpload = () => {
    if (status === "loading") {
      return;
    }

    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    fileInputRef.current?.click();
  };

  const validateFile = async (file: File) => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF files are supported.");
      return;
    }

    if (
      file.type &&
      file.type !== "application/pdf" &&
      file.type !== "application/octet-stream"
    ) {
      toast.error("Please choose a valid PDF file.");
      return;
    }

    if (file.size === 0) {
      toast.error("The selected file is empty.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("The maximum file size is 20 MB.");
      return;
    }

    try {
      const signatureBytes = await file.slice(0, 1024).arrayBuffer();
      const signature = new TextDecoder().decode(signatureBytes);

      if (!signature.includes("%PDF-")) {
        toast.error("This file does not appear to be a valid PDF.");
        return;
      }

      setSelectedFile(file);
    } catch {
      toast.error("Unable to read the selected file. Please try again.");
    }
  };

  const handleFileInputChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (file) {
      await validateFile(file);
    }
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      await validateFile(file);
    }
  };

  const uploadSelectedFile = async () => {
    if (!selectedFile) {
      requestUpload();
      return;
    }

    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    setUploading(true);
    setUploadProgress(0);

    try {
      const response =
        await authenticatedApiClient.post<DocumentUploadResponse>(
          `${DOCUMENT_API_PATH}/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 0,
            onUploadProgress: (progressEvent) => {
              if (!progressEvent.total) {
                return;
              }

              setUploadProgress(
                Math.min(
                  99,
                  Math.round(
                    (progressEvent.loaded / progressEvent.total) * 100,
                  ),
                ),
              );
            },
          },
        );

      const document = response.data;
      if (userId !== null) {
        try {
          rememberBrowserUploadedDocument(userId, {
            documentId: document.document_id,
            filename: document.filename,
          });
        } catch (error) {
          const reason =
            error instanceof Error ? ` ${error.message}` : "";
          toast.error(
            `The PDF was uploaded, but this tab could not save it for document-only search.${reason}`,
          );
        }
      }

      setUploadedDocuments((currentDocuments) => [
        {
          documentId: document.document_id,
          filename: document.filename,
          totalChunks: document.total_chunks,
          fileSize: selectedFile.size,
        },
        ...currentDocuments,
      ]);
      setUploadProgress(100);
      setSelectedFile(null);
      toast.success(document.message || "PDF uploaded and processed.");
    } catch (error) {
      toast.error(
        getDocumentErrorMessage(error, "Unable to upload this PDF."),
      );
    } finally {
      setUploading(false);
    }
  };

  const downloadDocument = async (document: UploadedDocument) => {
    setDownloadingDocumentId(document.documentId);

    try {
      const response = await authenticatedApiClient.get<Blob>(
        `${DOCUMENT_API_PATH}/${encodeURIComponent(document.documentId)}/download`,
        { responseType: "blob", timeout: 60_000 },
      );
      const objectUrl = URL.createObjectURL(response.data);
      const link = window.document.createElement("a");
      link.href = objectUrl;
      link.download = document.filename;
      window.document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      toast.success("Download started.");
    } catch (error) {
      toast.error(
        getDocumentErrorMessage(error, "Unable to download this document."),
      );
    } finally {
      setDownloadingDocumentId(null);
    }
  };

  const deleteDocument = async () => {
    if (!documentToDelete) {
      return;
    }

    const document = documentToDelete;
    setDeletingDocumentId(document.documentId);

    try {
      await authenticatedApiClient.delete(
        `${DOCUMENT_API_PATH}/${encodeURIComponent(document.documentId)}`,
      );
      if (userId !== null) {
        try {
          forgetBrowserUploadedDocument(userId, document.documentId);
        } catch (error) {
          const reason =
            error instanceof Error ? ` ${error.message}` : "";
          toast.error(
            `The document was deleted, but this tab could not update its saved document list.${reason}`,
          );
        }
      }

      setUploadedDocuments((currentDocuments) =>
        currentDocuments.filter(
          (item) => item.documentId !== document.documentId,
        ),
      );
      setDocumentToDelete(null);
      toast.success("Document deleted.");
    } catch (error) {
      toast.error(
        getDocumentErrorMessage(error, "Unable to delete this document."),
      );
    } finally {
      setDeletingDocumentId(null);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50/70">
        <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
          <Link
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
            href="/workspace"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to workspace
          </Link>

          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                <FileText aria-hidden="true" className="size-5" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Document library
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Upload legal PDFs to make them available for your research.
                Files are private to your account.
              </p>
            </div>
            <Button
              className="w-full sm:w-auto"
              disabled={status === "loading" || uploading}
              onClick={requestUpload}
              type="button"
            >
              <Upload aria-hidden="true" className="size-4" />
              Upload PDF
            </Button>
          </div>

          {status === "error" && authError ? (
            <ErrorState
              className="mb-6"
              description={authError}
              title="Unable to check your sign-in"
            />
          ) : null}

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Upload a document</CardTitle>
                <p className="text-sm leading-6 text-slate-500">
                  PDF files only, up to 20 MB. Your document is indexed after
                  upload.
                </p>
              </CardHeader>
              <CardContent>
                <div
                  className={`rounded-2xl border border-dashed p-6 text-center transition-colors sm:p-8 ${
                    dragging
                      ? "border-blue-500 bg-blue-50/80"
                      : "border-slate-300 bg-slate-50/70"
                  }`}
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    setDragging(false);
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => void handleDrop(event)}
                >
                  <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white text-blue-900 shadow-sm">
                    <CloudUpload aria-hidden="true" className="size-6" />
                  </span>
                  <p className="mt-4 text-sm font-semibold text-slate-900">
                    Drag and drop a PDF here
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    or choose a file from your device
                  </p>
                  <input
                    accept="application/pdf,.pdf"
                    className="sr-only"
                    onChange={(event) => void handleFileInputChange(event)}
                    ref={fileInputRef}
                    tabIndex={-1}
                    type="file"
                  />
                  <Button
                    className="mt-5"
                    disabled={status === "loading" || uploading}
                    onClick={requestUpload}
                    type="button"
                    variant="outline"
                  >
                    Browse PDF
                  </Button>
                  <p className="mt-4 text-xs text-slate-500">
                    Maximum file size: 20 MB
                  </p>
                </div>

                {selectedFile ? (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
                        <FileText aria-hidden="true" className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="break-all text-sm font-medium text-slate-900">
                          {selectedFile.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                      {uploading ? (
                        <LoaderCircle
                          aria-label="Uploading document"
                          className="mt-1 size-4 shrink-0 animate-spin text-blue-800"
                        />
                      ) : null}
                    </div>
                    {uploading ? (
                      <div className="mt-4">
                        <div
                          aria-label="Upload progress"
                          aria-valuemax={100}
                          aria-valuemin={0}
                          aria-valuenow={uploadProgress}
                          className="h-1.5 overflow-hidden rounded-full bg-slate-100"
                          role="progressbar"
                        >
                          <div
                            className="h-full rounded-full bg-blue-800 transition-[width]"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-slate-500">
                          {uploadProgress < 100
                            ? `Uploading PDF... ${uploadProgress}%`
                            : "Processing document..."}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          disabled={status !== "authenticated"}
                          onClick={() => void uploadSelectedFile()}
                          type="button"
                        >
                          <Upload aria-hidden="true" className="size-4" />
                          Upload PDF
                        </Button>
                        <Button
                          onClick={() => setSelectedFile(null)}
                          type="button"
                          variant="outline"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ) : null}

                <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-blue-50/70 p-3.5 text-xs leading-5 text-blue-950">
                  <ShieldCheck
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0"
                  />
                  <p>
                    Uploads require an active sign-in. The server verifies the
                    PDF and enforces the 20 MB limit.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-lg">Your documents</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">
                    {uploadedDocuments.length > 0
                      ? `${uploadedDocuments.length} uploaded in this visit`
                      : "Your uploaded legal PDFs"}
                  </p>
                </div>
                {uploadedDocuments.length > 0 ? (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {uploadedDocuments.length}
                  </span>
                ) : null}
              </CardHeader>
              <CardContent>
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs leading-5 text-amber-950">
                  Existing documents cannot be loaded here because the backend
                  does not provide a document-list endpoint. Newly uploaded
                  files appear in this list for the current visit.
                </div>

                {uploadedDocuments.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-center">
                    <EmptyState
                      className="border-0 bg-transparent px-2 py-4 shadow-none"
                      description="Upload a PDF and it will appear here with its processing result."
                      icon={FileText}
                      title="No documents uploaded in this visit"
                    />
                    <Button
                      className="mt-2"
                      disabled={status === "loading" || uploading}
                      onClick={requestUpload}
                      type="button"
                      variant="outline"
                    >
                      <Upload aria-hidden="true" className="size-4" />
                      Upload PDF
                    </Button>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {uploadedDocuments.map((document) => (
                      <li
                        className="rounded-xl border border-slate-200 bg-white p-4"
                        key={document.documentId}
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
                            <FileText
                              aria-hidden="true"
                              className="size-5"
                            />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="break-all text-sm font-semibold text-slate-900">
                              {document.filename}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                              <span>{formatFileSize(document.fileSize)}</span>
                              <span className="inline-flex items-center gap-1 text-emerald-700">
                                <CheckCircle2
                                  aria-hidden="true"
                                  className="size-3.5"
                                />
                                Processed
                              </span>
                              <span>
                                {document.totalChunks}{" "}
                                {document.totalChunks === 1 ? "chunk" : "chunks"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
                          <Button
                            aria-label={`Download ${document.filename}`}
                            disabled={
                              downloadingDocumentId === document.documentId
                            }
                            onClick={() => void downloadDocument(document)}
                            size="sm"
                            type="button"
                            variant="outline"
                          >
                            {downloadingDocumentId === document.documentId ? (
                              <LoaderCircle
                                aria-hidden="true"
                                className="size-4 animate-spin"
                              />
                            ) : (
                              <Download
                                aria-hidden="true"
                                className="size-4"
                              />
                            )}
                            Download
                          </Button>
                          <Button
                            aria-label={`Delete ${document.filename}`}
                            onClick={() => setDocumentToDelete(document)}
                            size="sm"
                            type="button"
                            variant="ghost"
                          >
                            <Trash2
                              aria-hidden="true"
                              className="size-4 text-red-600"
                            />
                            Delete
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog
        onOpenChange={setLoginDialogOpen}
        open={loginDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login required</DialogTitle>
            <DialogDescription>
              Please login to upload and manage your legal documents.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              onClick={() => setLoginDialogOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        onOpenChange={(open) => {
          if (!open && deletingDocumentId === null) {
            setDocumentToDelete(null);
          }
        }}
        open={documentToDelete !== null}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this document?</DialogTitle>
            <DialogDescription>
              {documentToDelete
                ? `“${documentToDelete.filename}” and its indexed content will be deleted. This cannot be undone.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              disabled={deletingDocumentId !== null}
              onClick={() => setDocumentToDelete(null)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={deletingDocumentId !== null}
              onClick={() => void deleteDocument()}
              type="button"
              variant="destructive"
            >
              {deletingDocumentId !== null ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin"
                />
              ) : (
                <Trash2 aria-hidden="true" className="size-4" />
              )}
              Delete document
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {status === "error" ? (
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            onClick={() => void refreshUser()}
            size="sm"
            type="button"
            variant="outline"
          >
            Retry sign-in check
          </Button>
        </div>
      ) : null}
    </>
  );
}

function DocumentsPage() {
  const auth = useAuth();
  const sessionKey =
    auth.status === "authenticated"
      ? `authenticated-${auth.user?.id ?? "user"}`
      : auth.status;

  return (
    <DocumentsManager
      authError={auth.authError}
      key={sessionKey}
      refreshUser={auth.refreshUser}
      status={auth.status}
      userId={auth.user?.id ?? null}
    />
  );
}

export default DocumentsPage;
