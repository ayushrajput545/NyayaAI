export const YOUTUBE_WALKTHROUGH_URL = "https://youtu.be/Tz5XakUp1oU";
export const GITHUB_REPOSITORY_URL = "https://github.com/ayushrajput545/NyayaAI";

function getYouTubeEmbedUrl(videoUrl: string) {
  if (!videoUrl.trim()) {
    return null;
  }

  if (!URL.canParse(videoUrl)) {
    throw new Error("YOUTUBE_WALKTHROUGH_URL must be an absolute URL.");
  }

  const url = new URL(videoUrl);
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  let videoId: string | null = null;

  if (hostname === "youtu.be") {
    videoId = url.pathname.split("/").filter(Boolean)[0] ?? null;
  } else if (
    hostname === "youtube.com" ||
    hostname === "m.youtube.com" ||
    hostname === "youtube-nocookie.com"
  ) {
    videoId =
      url.searchParams.get("v") ??
      url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] ??
      null;
  } else {
    throw new Error("YOUTUBE_WALKTHROUGH_URL must point to a YouTube video.");
  }

  if (!videoId || !/^[\w-]{11}$/.test(videoId)) {
    throw new Error("YOUTUBE_WALKTHROUGH_URL must include a valid video ID.");
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

export { getYouTubeEmbedUrl };
