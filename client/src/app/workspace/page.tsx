"use client";

import axios from "axios";
import {
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  FileText,
  LoaderCircle,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { useAuth } from "@/contexts/auth-context";
import { apiClient, authenticatedApiClient } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-session";
import {
  getBrowserUploadedDocuments,
  type BrowserUploadedDocument,
} from "@/lib/user-documents";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ASK_QUESTION_PATH = "/rag/api/v1/ask_que";
const CONVERSATIONS_PATH = "/conversations/api/v1";
const CONVERSATION_LIST_PATH = `${CONVERSATIONS_PATH}/get-conversations`;
const starterQuestions = [
  "What are the key issues discussed in uploaded document?",
  "Summarize the court's reasoning and decision.",
  "What was Section 66A of the Information Technology Act, 2000?",
  "What is the punishment for committing cyber fraud in India?"
];

type ResearchMode = "quick" | "deep";
type DocumentScope = "my-only" | "my-and-library";
type MessageRole = "user" | "assistant";
interface Source {
  filename: string;
  page_number: number | string | null;
  content: string;
}

interface AskQuestionRequest {
  question: string;
  use_multi_agent: boolean;
  use_my_doc: boolean;
  document_id?: number;
  conversation_id?: number;
}

interface AskQuestionResponse {
  conversation_id: string;
  question: string;
  answer: string;
  sources: Source[];
}

interface ConversationSummary {
  conversation_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ConversationMessage {
  message_id: string;
  role: string;
  content: string;
  created_at: string;
}

interface ConversationDetail {
  conversation_id: string;
  title: string;
  messages: ConversationMessage[];
}

interface ChatMessage {
  role: MessageRole;
  content: string;
  sources?: Source[];
}

interface FailedRequest {
  question: string;
  mode: ResearchMode;
  scope: DocumentScope;
  request: AskQuestionRequest;
}

function getWorkspaceErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    console.log("Error:", error)
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
        return messages.join(" ");
      }
    }

    if (!error.response) {
      return error.message || "Unable to reach the server. Please try again.";
    }
  }

  return error instanceof Error ? error.message : fallback;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function WorkspaceContent({
  user,
  authStatus,
  logout,
}: Pick<ReturnType<typeof useAuth>, "user" | "logout"> & {
  authStatus: ReturnType<typeof useAuth>["status"];
}) {
  const router = useRouter();
  const [researchMode, setResearchMode] = useState<ResearchMode>("quick");
  const [documentScope, setDocumentScope] =
    useState<DocumentScope>("my-and-library");
  const [uploadedDocuments, setUploadedDocuments] = useState<
    BrowserUploadedDocument[]
  >([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [documentStorageError, setDocumentStorageError] = useState<
    string | null
  >(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [failedRequest, setFailedRequest] = useState<FailedRequest | null>(
    null,
  );
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [loginRequiredOpen, setLoginRequiredOpen] = useState(false);
  const [scopeDialogOpen, setScopeDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] =
    useState<ConversationSummary | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const questionInputRef = useRef<HTMLTextAreaElement>(null);

  const loadConversations = useCallback(async () => {
    if (authStatus !== "authenticated") {
      return;
    }

    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const { data } =
        await authenticatedApiClient.get<ConversationSummary[]>(
          CONVERSATION_LIST_PATH,
        );
      setConversations(data);
    } catch (error) {
      console.log("Error: ", error)
      setHistoryError(
        getWorkspaceErrorMessage(
          error,
          "Unable to load your conversation history.",
        ),
      );
    } finally {
      setHistoryLoading(false);
    }
  }, [authStatus]);

  useEffect(() => {
    if (authStatus === "authenticated") {
      const loadHistory = window.setTimeout(() => {
        void loadConversations();
      }, 0);
      const loadDocuments = window.setTimeout(() => {
        if (!user) {
          setUploadedDocuments([]);
          setSelectedDocumentId("");
          return;
        }

        try {
          const documents = getBrowserUploadedDocuments(user.id);
          setUploadedDocuments(documents);
          setSelectedDocumentId(documents[0]?.documentId ?? "");
          setDocumentStorageError(null);
        } catch (error) {
          setUploadedDocuments([]);
          setSelectedDocumentId("");
          setDocumentStorageError(
            error instanceof Error
              ? error.message
              : "Unable to read this tab's uploaded document list.",
          );
        }
      }, 0);

      return () => {
        window.clearTimeout(loadHistory);
        window.clearTimeout(loadDocuments);
      };
    }

    if (authStatus === "anonymous" || authStatus === "error") {
      const clearPrivateHistory = window.setTimeout(() => {
        setConversations([]);
        setSelectedConversationId(null);
        setMessages([]);
        setUploadedDocuments([]);
        setSelectedDocumentId("");
        setDocumentStorageError(null);
      }, 0);

      return () => window.clearTimeout(clearPrivateHistory);
    }
  }, [authStatus, loadConversations, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const startNewChat = () => {
    setSelectedConversationId(null);
    setMessages([]);
    setQuestion("");
    setResearchMode("quick");
    setWorkspaceError(null);
    setFailedRequest(null);
    setSidebarOpen(false);
  };

  const handleModeChange = (mode: ResearchMode) => {
    if (mode === "deep" && authStatus !== "authenticated") {
      setLoginRequiredOpen(true);
      return;
    }

    setResearchMode(mode);
    setWorkspaceError(null);
    setFailedRequest(null);
  };

  const handleDocumentScopeChange = (scope: DocumentScope) => {
    if (
      scope === "my-only" &&
      (authStatus !== "authenticated" ||
        uploadedDocuments.length === 0)
    ) {
      return;
    }

    setDocumentScope(scope);
    setWorkspaceError(null);
    setFailedRequest(null);
  };

  const openConversation = async (conversation: ConversationSummary) => {
    setSidebarOpen(false);
    setSelectedConversationId(conversation.conversation_id);
    setMessages([]);
    setWorkspaceError(null);
    setFailedRequest(null);
    setConversationLoading(true);

    try {
      const { data } = await authenticatedApiClient.get<ConversationDetail>(
        `${CONVERSATIONS_PATH}/${encodeURIComponent(conversation.conversation_id)}`,
      );
      setSelectedConversationId(data.conversation_id);
      setMessages(
        data.messages.map((message) => ({
          role: message.role === "user" ? "user" : "assistant",
          content: message.content,
        })),
      );
    } catch (error) {
      setSelectedConversationId(null);
      setWorkspaceError(
        getWorkspaceErrorMessage(error, "Unable to open this conversation."),
      );
    } finally {
      setConversationLoading(false);
    }
  };

  const handleSend = async (retryRequest?: FailedRequest) => {
    const mode = retryRequest?.mode ?? researchMode;
    const scope = retryRequest?.scope ?? documentScope;
    const message = (retryRequest?.question ?? question).trim();

    if (!message || sending || conversationLoading) {
      return;
    }

    if (mode === "deep" && authStatus !== "authenticated") {
      setLoginRequiredOpen(true);
      return;
    }

    const requestedDocumentId =
      retryRequest?.request.document_id ?? Number(selectedDocumentId);
    if (scope === "my-only") {
      if (authStatus !== "authenticated" || uploadedDocuments.length === 0) {
        setWorkspaceError(
          "Upload a document in this browser session before using document-only search.",
        );
        return;
      }

      if (
        !Number.isSafeInteger(requestedDocumentId) ||
        requestedDocumentId < 1 ||
        !uploadedDocuments.some(
          (document) => Number(document.documentId) === requestedDocumentId,
        )
      ) {
        setWorkspaceError(
          "Choose an available uploaded document before starting document-only search.",
        );
        return;
      }
    }

    const conversationId = selectedConversationId
      ? Number(selectedConversationId)
      : undefined;

    if (
      conversationId !== undefined &&
      (!Number.isSafeInteger(conversationId) || conversationId < 1)
    ) {
      setWorkspaceError(
        "The selected conversation has an invalid ID. Start a new chat and try again.",
      );
      return;
    }

    const request: AskQuestionRequest =
      retryRequest?.request ?? {
        question: message,
        use_multi_agent: mode === "deep",
        use_my_doc: scope === "my-only",
        ...(scope === "my-only"
          ? { document_id: requestedDocumentId }
          : {}),
        ...(conversationId === undefined
          ? {}
          : { conversation_id: conversationId }),
      };

    setQuestion("");
    setWorkspaceError(null);
    setFailedRequest(null);
    setMessages((current) => [...current, { role: "user", content: message }]);
    setSending(true);

    let isAnonymousRequest = false;
    try {
      const token = getAccessToken();
      isAnonymousRequest = !token;
      const client = token ? authenticatedApiClient : apiClient;
      const { data } = await client.post<AskQuestionResponse>(
        ASK_QUESTION_PATH,
        request,
      );

      if (typeof data.conversation_id !== "string" || !data.answer) {
        throw new Error("The research endpoint returned an unexpected response.");
      }

      setSelectedConversationId(data.conversation_id);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources,
        },
      ]);
      setFailedRequest(null);

      if (authStatus === "authenticated") {
        await loadConversations();
      }
    } catch (error) {
      console.log("Error In Ask Question: ", error);
      setMessages((current) => {
        return current.slice(0, -1);
      });
      setQuestion(message);
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;
      const canRetry =
        axios.isAxiosError(error) &&
        (!error.response ||
          status === 408 ||
          status === 429 ||
          (status !== undefined && status >= 500));
      setFailedRequest(
        canRetry ? { question: message, mode, scope, request } : null,
      );

      if (
        isAnonymousRequest &&
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        setWorkspaceError(
          "Only authenticated users can make a Quick Search request. Sign in to run this question; no anonymous conversation was created.",
        );
      } else if (
        mode === "deep" &&
        axios.isAxiosError(error) &&
        error.response?.status === 401
      ) {
        setWorkspaceError(
          "Your session has expired. Log in again to continue Deep Research.",
        );
      } else {
        console.log("Error In Ask Question: ", error)
        setWorkspaceError(
          getWorkspaceErrorMessage(error, "Unable to complete this research request."),
        );
      }
    } finally {
      setSending(false);
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSend();
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      void handleSend();
    }
  };

  const handleDeleteConversation = async () => {
    if (!conversationToDelete) {
      return;
    }

    setDeleting(true);
    setHistoryError(null);

    try {
      await authenticatedApiClient.delete(
        `${CONVERSATIONS_PATH}/${encodeURIComponent(conversationToDelete.conversation_id)}`,
      );
      setConversations((current) =>
        current.filter(
          (item) =>
            item.conversation_id !== conversationToDelete.conversation_id,
        ),
      );

      if (
        selectedConversationId === conversationToDelete.conversation_id
      ) {
        setSelectedConversationId(null);
        setMessages([]);
      }

      toast.success("Conversation deleted.");
      setConversationToDelete(null);
    } catch (error) {
      setHistoryError(
        getWorkspaceErrorMessage(error, "Unable to delete this conversation."),
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    logout();
    startNewChat();
    router.replace("/");
  };

  return (
    <div className="flex h-dvh min-h-[32rem] overflow-hidden bg-[#f7f8fa] text-slate-900">
      {sidebarOpen ? (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-950/35 md:hidden"
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
      ) : null}

      <aside
        id="workspace-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[min(84vw,18rem)] min-w-0 shrink-0 flex-col border-r border-slate-200 bg-white transition-[width,transform] duration-200 md:static md:z-auto md:translate-x-0",
          sidebarCollapsed ? "md:w-[4.5rem]" : "md:w-[17rem]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div
          className={cn(
            "flex h-[4.5rem] shrink-0 items-center justify-between border-b border-slate-100 px-5",
            sidebarCollapsed && "md:justify-center md:px-2",
          )}
        >
          <Link
            aria-label="NyayaAI home"
            className="inline-flex items-center gap-2.5"
            href="/"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Scale aria-hidden="true" className="size-[18px]" />
            </span>
            <span
              className={cn(
                "text-lg font-semibold tracking-tight text-slate-950",
                sidebarCollapsed && "md:hidden",
              )}
            >
              Nyaya<span className="text-blue-800">AI</span>
            </span>
          </Link>
          <Button
            aria-label="Close sidebar"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <X aria-hidden="true" className="size-4" />
          </Button>
        </div>

        <div className="space-y-2 px-3 py-4">
          <button
            aria-label="Uploaded Documents"
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50",
              sidebarCollapsed && "md:justify-center md:px-0",
            )}
            onClick={() => {
              setSidebarOpen(false);
              router.push("/documents");
            }}
            title={sidebarCollapsed ? "Uploaded Documents" : undefined}
            type="button"
          >
            <FileText aria-hidden="true" className="size-4 text-slate-400" />
            <span className={cn(sidebarCollapsed && "md:hidden")}>
              Uploaded Documents
            </span>
          </button>
          <button
            aria-label="Search Scope"
            aria-expanded={scopeDialogOpen}
            aria-haspopup="dialog"
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700",
              sidebarCollapsed && "md:justify-center md:px-0",
            )}
            disabled={sending || conversationLoading}
            onClick={() => {
              setSidebarOpen(false);
              setScopeDialogOpen(true);
            }}
            title={sidebarCollapsed ? "Search Scope" : undefined}
            type="button"
          >
            <Search aria-hidden="true" className="size-4 text-slate-400" />
            <span
              className={cn(
                "min-w-0 flex-1",
                sidebarCollapsed && "md:hidden",
              )}
            >
              <span className="block">Search Scope</span>
              <span className="block truncate text-[11px] font-normal text-slate-400">
                {documentScope === "my-only"
                  ? "My document only"
                  : "My documents + library"}
              </span>
            </span>
          </button>
          <Button
            aria-label="New Chat"
            className={cn(
              "w-full justify-start",
              sidebarCollapsed && "md:justify-center md:px-0",
            )}
            disabled={sending || conversationLoading}
            onClick={startNewChat}
            title={sidebarCollapsed ? "New Chat" : undefined}
            type="button"
          >
            <Plus aria-hidden="true" className="size-4" />
            <span className={cn(sidebarCollapsed && "md:hidden")}>
              New Chat
            </span>
          </Button>
        </div>

        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto px-3 pb-4",
            sidebarCollapsed && "md:hidden",
          )}
        >
          <div className="mb-2 flex items-center justify-between px-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              Conversation history
            </p>
            {historyLoading ? (
              <div
                aria-label="Loading conversation history"
                className="space-y-2 py-2"
                role="status"
              >
                <span className="sr-only">Loading conversation history</span>
                <span className="block h-8 animate-pulse rounded-lg bg-slate-100" />
                <span className="block h-8 animate-pulse rounded-lg bg-slate-100" />
                <span className="block h-8 w-4/5 animate-pulse rounded-lg bg-slate-100" />
              </div>
            ) : null}
          </div>

          {authStatus === "authenticated" ? (
            <>
              {historyError ? (
                <div className="rounded-lg px-2 py-2 text-xs leading-5 text-red-700">
                  <p>{historyError}</p>
                  <button
                    className="mt-1 font-medium underline underline-offset-2"
                    onClick={() => void loadConversations()}
                    type="button"
                  >
                    Try again
                  </button>
                </div>
              ) : null}
              {!historyLoading && !historyError && conversations.length === 0 ? (
                <p className="px-2 py-3 text-xs leading-5 text-slate-400">
                  Your saved conversations will appear here.
                </p>
              ) : null}
              <ul className="space-y-1">
                {conversations.map((conversation) => (
                  <li
                    className="group flex items-center gap-1"
                    key={conversation.conversation_id}
                  >
                    <button
                      className={cn(
                        "flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-slate-50 disabled:opacity-50",
                        selectedConversationId === conversation.conversation_id
                          ? "bg-blue-50 text-blue-900"
                          : "text-slate-600",
                      )}
                      disabled={sending || conversationLoading}
                      onClick={() => void openConversation(conversation)}
                      type="button"
                    >
                      <MessageSquare
                        aria-hidden="true"
                        className="size-4 shrink-0 text-slate-400"
                      />
                      <span className="truncate">{conversation.title}</span>
                    </button>
                    <Button
                      aria-label={`Delete ${conversation.title}`}
                      className="size-8 shrink-0 text-slate-400 opacity-100 hover:text-red-700 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                      disabled={sending || conversationLoading}
                      onClick={() => setConversationToDelete(conversation)}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <Trash2 aria-hidden="true" className="size-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          ) : authStatus === "loading" ? (
            <div className="px-2 py-3">
              <LoadingIndicator label="Restoring session" />
            </div>
          ) : (
            <p className="px-2 py-3 text-xs leading-5 text-slate-400">
              Sign in to save and revisit your research.
            </p>
          )}

        </div>

        <div className="shrink-0 border-t border-slate-100 p-3">
          {user ? (
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl px-2 py-2",
                sidebarCollapsed && "md:flex-col md:gap-1",
              )}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-800">
                {getInitials(user.name)}
              </span>
              <div
                className={cn(
                  "min-w-0 flex-1",
                  sidebarCollapsed && "md:hidden",
                )}
              >
                <p className="truncate text-sm font-medium text-slate-800">
                  {user.name}
                </p>
                <p className="truncate text-xs text-slate-400">{user.email}</p>
              </div>
              <Button
                aria-label="Log out"
                title="Log out"
                onClick={handleLogout}
                size="icon"
                type="button"
                variant="ghost"
              >
                <LogOut aria-hidden="true" className="size-4" />
              </Button>
            </div>
          ) : (
            <Button
              asChild
              className={cn(
                "w-full",
                sidebarCollapsed && "md:mx-auto md:w-10 md:px-0",
              )}
              title={sidebarCollapsed ? "Login" : undefined}
              variant="outline"
            >
              <Link href="/login">
                <LogIn aria-hidden="true" className="size-4" />
                <span className={cn(sidebarCollapsed && "md:hidden")}>
                  Login
                </span>
              </Link>
            </Button>
          )}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Button
              aria-controls="workspace-sidebar"
              aria-expanded={sidebarOpen}
              aria-label="Toggle navigation"
              className="md:hidden"
              onClick={() => setSidebarOpen((open) => !open)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Menu aria-hidden="true" className="size-5" />
            </Button>
            <Button
              aria-controls="workspace-sidebar"
              aria-expanded={!sidebarCollapsed}
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
              className="hidden md:inline-flex"
              onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
              size="icon"
              type="button"
              variant="ghost"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen aria-hidden="true" className="size-5" />
              ) : (
                <PanelLeftClose aria-hidden="true" className="size-5" />
              )}
            </Button>
          </div>
        </header>

        <div
          aria-label="Conversation"
          className="min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-8"
          role="log"
          aria-live="polite"
        >
              <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col">
                {conversationLoading ? (
                  <div className="flex flex-1 items-center justify-center">
                    <LoadingIndicator label="Opening conversation" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
                    <span className="flex size-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                      <Scale aria-hidden="true" className="size-6" />
                    </span>
                    <h2 className="mt-6 text-xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-2xl">
                      Try a research question
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Choose a prompt to add it to the composer. Review it,
                      then send when you&apos;re ready.
                    </p>
                    <div className="mt-6 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
                      {starterQuestions.map((starterQuestion) => (
                        <button
                          className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-left text-sm leading-5 text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50/50 hover:text-slate-900"
                          key={starterQuestion}
                          onClick={() => {
                            setQuestion(starterQuestion);
                            setFailedRequest(null);
                            setWorkspaceError(null);
                            questionInputRef.current?.focus();
                          }}
                          type="button"
                        >
                          <MessageSquare
                            aria-hidden="true"
                            className="mt-0.5 size-4 shrink-0 text-blue-700"
                          />
                          <span>{starterQuestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 pb-8">
                    {messages.map((message, index) => (
                      <ChatMessageView
                        key={`${message.role}-${index}`}
                        message={message}
                      />
                    ))}
                    {sending ? (
                      <div className="flex items-start gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
                          <Sparkles
                            aria-hidden="true"
                            className="size-4"
                          />
                        </span>
                        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                          <LoadingIndicator label="Researching your question" />
                        </div>
                      </div>
                    ) : null}
                    <div ref={messagesEndRef} />
                  </div>
                )}

                {workspaceError ? (
                  <div
                    aria-live="assertive"
                    className="mb-5 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950 sm:flex-row sm:items-center sm:justify-between"
                    role="alert"
                  >
                    <p>{workspaceError}</p>
                    <div className="flex shrink-0 items-center gap-3">
                      {workspaceError.includes(
                        "Sign in to run this question",
                      ) ? (
                        <Link
                          className="font-semibold underline underline-offset-2"
                          href="/login"
                        >
                          Login
                        </Link>
                      ) : null}
                      {failedRequest ? (
                        <Button
                          onClick={() => void handleSend(failedRequest)}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          Retry
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
        </div>

        <div className="shrink-0 border-t border-slate-200/80 bg-white px-4 pb-4 pt-4 sm:px-8 sm:pb-6">
              <form
                className="mx-auto max-w-3xl"
                onSubmit={handleFormSubmit}
              >
                <div className="rounded-2xl border border-slate-300 bg-white p-2 shadow-[0_8px_30px_-20px_rgba(15,35,67,0.3)] transition-colors focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
                  <div
                    aria-label="Research mode"
                    className="flex gap-2 border-b border-slate-100 px-1 pb-2"
                    role="group"
                  >
                    <button
                      aria-pressed={researchMode === "quick"}
                      className={cn(
                        "flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors sm:px-3",
                        researchMode === "quick"
                          ? "bg-blue-50 text-blue-950 ring-1 ring-blue-200 shadow-sm"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                      )}
                      disabled={sending || conversationLoading}
                      onClick={() => handleModeChange("quick")}
                      type="button"
                    >
                      <Search aria-hidden="true" className="size-4 shrink-0" />
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold">
                          Quick Search
                        </span>
                        <span className="hidden truncate text-[11px] leading-4 text-slate-500 sm:block">
                          Fast, document-grounded answers.
                        </span>
                      </span>
                      {researchMode === "quick" ? (
                        <Check
                          aria-hidden="true"
                          className="ml-auto size-4 shrink-0 text-blue-800"
                        />
                      ) : null}
                    </button>
                    <button
                      aria-pressed={researchMode === "deep"}
                      className={cn(
                        "flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors sm:px-3",
                        researchMode === "deep"
                          ? "bg-violet-100 text-violet-950 shadow-sm ring-1 ring-violet-300"
                          : "text-violet-800 hover:bg-violet-50 hover:text-violet-950",
                      )}
                      disabled={sending || conversationLoading}
                      onClick={() => handleModeChange("deep")}
                      type="button"
                    >
                      <Sparkles
                        aria-hidden="true"
                        className={cn(
                          "size-4 shrink-0",
                          researchMode === "deep"
                            ? "text-violet-700"
                            : "text-violet-700",
                        )}
                      />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5">
                          <span className="block truncate text-xs font-semibold">
                            Deep Research
                          </span>
                          {authStatus !== "authenticated" ? (
                            <ShieldCheck
                              aria-label="Login required"
                              className="size-3.5 shrink-0 text-slate-400"
                            />
                          ) : null}
                        </span>
                        <span
                          className={cn(
                            "hidden truncate text-[11px] leading-4 sm:block",
                            researchMode === "deep"
                              ? "text-violet-800"
                              : "text-slate-500",
                          )}
                        >
                          Multi-agent research with deeper analysis.
                        </span>
                      </span>
                      {researchMode === "deep" ? (
                        <Check
                          aria-hidden="true"
                          className="ml-auto size-4 shrink-0 text-violet-700"
                        />
                      ) : null}
                    </button>
                  </div>
                  <label className="sr-only" htmlFor="workspace-question">
                    Ask a legal research question
                  </label>
                  <textarea
                    className="max-h-32 min-h-14 w-full resize-y bg-transparent px-3 py-2 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50 sm:min-h-16"
                    disabled={sending || conversationLoading}
                    id="workspace-question"
                    onChange={(event) => {
                      setQuestion(event.target.value);
                      setFailedRequest(null);
                    }}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Ask a question about your legal documents..."
                    ref={questionInputRef}
                    rows={2}
                    value={question}
                  />
                  <div className="flex items-center justify-between gap-3 px-2 pb-1">
                    <div className="flex min-w-0 items-center gap-2 text-xs text-slate-400">
                      <span className="truncate">
                        {researchMode === "deep"
                          ? "Multi-agent research enabled"
                          : "Type your legal question"}
                      </span>
                    </div>
                    <Button
                      aria-label="Send question"
                      className="size-9"
                      disabled={
                        !question.trim() || sending || conversationLoading
                      }
                      size="icon"
                      type="submit"
                    >
                      {sending ? (
                        <LoaderCircle
                          aria-hidden="true"
                          className="size-4 animate-spin"
                        />
                      ) : (
                        <ArrowUp aria-hidden="true" className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-center text-[11px] leading-5 text-slate-400">
                  Press Enter to send · Shift + Enter for a new line. Review
                  cited sources before relying on an answer.
                </p>
              </form>
        </div>
      </main>

      <Dialog onOpenChange={setScopeDialogOpen} open={scopeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search scope</DialogTitle>
            <DialogDescription>
              Choose where{" "}
              {researchMode === "deep" ? "Deep Research" : "Quick Search"}{" "}
              looks for answers.
            </DialogDescription>
          </DialogHeader>
          {documentStorageError ? (
            <p className="text-sm text-red-700" role="alert">
              {documentStorageError}
            </p>
          ) : null}
          <div
            aria-label="Document search scope"
            className="grid gap-2"
            role="group"
          >
            <button
              aria-pressed={documentScope === "my-only"}
              className={cn(
                "flex min-w-0 items-start gap-2.5 rounded-lg border px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700",
                documentScope === "my-only"
                  ? "border-blue-300 bg-blue-50 text-blue-950"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/50",
                (authStatus !== "authenticated" ||
                  uploadedDocuments.length === 0) &&
                  "cursor-not-allowed opacity-50",
              )}
              disabled={
                authStatus !== "authenticated" ||
                uploadedDocuments.length === 0 ||
                sending ||
                conversationLoading
              }
              onClick={() => {
                handleDocumentScopeChange("my-only");
                setScopeDialogOpen(false);
              }}
              title={
                uploadedDocuments.length === 0
                  ? "Upload a PDF to enable this scope."
                  : "Use one uploaded PDF as the only source."
              }
              type="button"
            >
              <FileText
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">
                  Use my uploaded document only
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                  {uploadedDocuments.length === 0
                    ? "Upload a PDF to enable."
                    : "Answer strictly from one selected PDF."}
                </span>
              </span>
              {documentScope === "my-only" ? (
                <Check
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-blue-800"
                />
              ) : null}
            </button>
            <button
              aria-pressed={documentScope === "my-and-library"}
              className={cn(
                "flex min-w-0 items-start gap-2.5 rounded-lg border px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700",
                documentScope === "my-and-library"
                  ? "border-violet-300 bg-violet-50 text-violet-950"
                  : "border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50/50",
              )}
              disabled={sending || conversationLoading}
              onClick={() => {
                handleDocumentScopeChange("my-and-library");
                setScopeDialogOpen(false);
              }}
              type="button"
            >
              <Scale
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-violet-700"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">
                  Use my document and NyayaAI Library
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                  Search your uploads and the legal library.
                </span>
              </span>
              {documentScope === "my-and-library" ? (
                <Check
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-violet-800"
                />
              ) : null}
            </button>
          </div>
          {documentScope === "my-only" ? (
            uploadedDocuments.length > 1 ? (
              <label className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <span className="font-medium">Document</span>
                <select
                  aria-label="Document for document-only search"
                  className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                  disabled={sending || conversationLoading}
                  onChange={(event) => {
                    setSelectedDocumentId(event.target.value);
                    setFailedRequest(null);
                  }}
                  value={selectedDocumentId}
                >
                  {uploadedDocuments.map((document) => (
                    <option
                      key={document.documentId}
                      value={document.documentId}
                    >
                      {document.filename}
                    </option>
                  ))}
                </select>
              </label>
            ) : uploadedDocuments[0] ? (
              <p className="truncate text-xs text-slate-500">
                Source: {uploadedDocuments[0].filename}
              </p>
            ) : null
          ) : null}
          {uploadedDocuments.length === 0 ? (
            <p className="text-xs leading-5 text-slate-500">
              Previously uploaded files may not be listed.{" "}
              <Link
                className="font-medium text-blue-800 underline underline-offset-2"
                href="/documents"
                onClick={() => setSidebarOpen(false)}
              >
                Upload a PDF
              </Link>{" "}
              in this tab to enable document-only search.
            </p>
          ) : (
            <p className="text-xs leading-5 text-slate-500">
              Only PDFs uploaded through this tab are listed here.
            </p>
          )}
          <div className="flex justify-end">
            <Button
              onClick={() => setScopeDialogOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        onOpenChange={setLoginRequiredOpen}
        open={loginRequiredOpen}
      >
        <DialogContent>
          <DialogHeader>
            <span className="mb-1 flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </span>
            <DialogTitle>Sign in for Deep Research</DialogTitle>
            <DialogDescription>
              Deep Research uses NyayaAI&apos;s multi-agent workflow and
              requires an account. Quick Search remains available to try.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              onClick={() => setLoginRequiredOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button asChild>
              <Link href="/login">
                <LogIn aria-hidden="true" className="size-4" />
                Login
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        onOpenChange={(open) => {
          if (!deleting && !open) {
            setConversationToDelete(null);
          }
        }}
        open={conversationToDelete !== null}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this conversation?</DialogTitle>
            <DialogDescription>
              This permanently deletes
              {conversationToDelete
                ? ` “${conversationToDelete.title}” and its messages`
                : " this conversation and its messages"}
              .
            </DialogDescription>
          </DialogHeader>
          {historyError ? (
            <p className="text-sm text-red-700" role="alert">
              {historyError}
            </p>
          ) : null}
          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              disabled={deleting}
              onClick={() => setConversationToDelete(null)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={deleting}
              onClick={() => void handleDeleteConversation()}
              type="button"
              variant="destructive"
            >
              {deleting ? (
                <>
                  <LoaderCircle
                    aria-hidden="true"
                    className="size-4 animate-spin"
                  />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 aria-hidden="true" className="size-4" />
                  Delete conversation
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ChatMessageView({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const copyAnswer = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard access is unavailable.");
      }

      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success("Answer copied.");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Unable to copy the answer. Check your clipboard permissions.");
    }
  };

  return (
    <article
      aria-label={isUser ? "Your message" : "NyayaAI response"}
      className={cn(
        "flex items-start gap-3",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-xl",
          isUser
            ? "bg-slate-200 text-slate-600"
            : "bg-blue-50 text-blue-800",
        )}
      >
        {isUser ? (
          <UserRound aria-hidden="true" className="size-4" />
        ) : (
          <Sparkles aria-hidden="true" className="size-4" />
        )}
      </span>
      <div
        className={cn(
          "min-w-0 max-w-[88%] rounded-2xl px-4 py-3.5 sm:max-w-[82%]",
          isUser
            ? "rounded-tr-md bg-slate-900 text-white"
            : "rounded-tl-md border border-slate-200 bg-white text-slate-800 shadow-sm",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
        ) : (
          <>
            <div className="space-y-4 text-sm leading-7">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p className="whitespace-pre-wrap">{children}</p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="pt-1 text-xl font-semibold leading-7 text-slate-950">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="pt-1 text-lg font-semibold leading-7 text-slate-950">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="pt-1 text-base font-semibold text-slate-950">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="font-semibold text-slate-950">{children}</h4>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc space-y-1 pl-5">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal space-y-1 pl-5">{children}</ol>
                  ),
                  li: ({ children }) => <li className="pl-1">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-blue-300 pl-3 text-slate-600">
                      {children}
                    </blockquote>
                  ),
                  pre: ({ children }) => (
                    <pre className="max-w-full overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100 [&_code]:block [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
                      {children}
                    </pre>
                  ),
                  code: ({ className, children }) => (
                    <code
                      className={cn(
                        "rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800",
                        className,
                      )}
                    >
                      {children}
                    </code>
                  ),
                  table: ({ children }) => (
                    <div className="max-w-full overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full border-collapse text-left text-xs leading-5">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-slate-100 text-slate-800">
                      {children}
                    </thead>
                  ),
                  th: ({ children }) => (
                    <th className="border-b border-slate-200 px-3 py-2 font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border-b border-slate-100 px-3 py-2 align-top">
                      {children}
                    </td>
                  ),
                  a: ({ href, children }) => (
                    <a
                      className="font-medium text-blue-800 underline underline-offset-2"
                      href={href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-slate-950">
                      {children}
                    </strong>
                  ),
                  hr: () => <hr className="border-slate-200" />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {message.sources && message.sources.length > 0 ? (
              <details className="group mt-4 border-t border-slate-100 pt-3">
                <summary className="flex cursor-pointer list-none items-center gap-1.5 text-xs font-semibold text-slate-600 outline-none hover:text-slate-950 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-blue-700">
                  <FileText aria-hidden="true" className="size-3.5" />
                  Sources ({message.sources.length})
                  <ChevronDown
                    aria-hidden="true"
                    className="ml-auto size-4 transition-transform group-open:rotate-180"
                  />
                </summary>
                <ul className="mt-3 space-y-2">
                  {message.sources.map((source, index) => (
                    <li
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                      key={`${source.filename}-${source.page_number}-${index}`}
                    >
                      <p className="break-all text-xs font-medium text-slate-800">
                        {source.filename}
                        {source.page_number !== null &&
                        source.page_number !== undefined
                          ? ` · Page ${source.page_number}`
                          : ""}
                      </p>
                      {source.content ? (
                        <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-600">
                          {source.content}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}

            <div className="mt-3 flex justify-end border-t border-slate-100 pt-2">
              <button
                aria-label={copied ? "Answer copied" : "Copy answer"}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                onClick={() => void copyAnswer()}
                title="Copy answer"
                type="button"
              >
                {copied ? (
                  <Check aria-hidden="true" className="size-3.5 text-emerald-700" />
                ) : (
                  <Copy aria-hidden="true" className="size-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function WorkspacePage() {
  const { user, status, logout } = useAuth();
  const sessionKey =
    status === "authenticated" ? `authenticated-${user?.id ?? "user"}` : status;

  return (
    <WorkspaceContent
      authStatus={status}
      key={sessionKey}
      logout={logout}
      user={user}
    />
  );
}

export default WorkspacePage;
