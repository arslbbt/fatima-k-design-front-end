import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Upload,
  Plus,
  Trash2,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  Play,
  ExternalLink,
} from "lucide-react";
import { BridePortalLayout } from "@/components/BridePortalLayout";
import { inspoApi, ApiError, type InspoUpload } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export function BridePortalInspiration() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"image" | "video">("image");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [addingVideo, setAddingVideo] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const { data: uploads = [], isLoading } = useQuery({
    queryKey: ["inspo-mine"],
    queryFn: () => inspoApi.listMine(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => inspoApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inspo-mine"] });
      setLightboxIdx(null);
      setConfirmDelete(null);
      toast({ title: "Removed successfully" });
    },
    onError: (err) =>
      toast({
        title: "Error",
        description:
          err instanceof ApiError ? err.message : "Something went wrong.",
      }),
  });

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const valid = Array.from(files).filter((f) => {
      if (!["image/jpeg", "image/png"].includes(f.type)) {
        toast({
          title: "Invalid file type",
          description: `${f.name} is not a JPEG or PNG.`,
        });
        return false;
      }
      if (f.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${f.name} exceeds 10MB.`,
        });
        return false;
      }
      return true;
    });
    if (!valid.length) return;

    setUploading(true);
    try {
      await inspoApi.upload(valid.slice(0, 5));
      queryClient.invalidateQueries({ queryKey: ["inspo-mine"] });
      toast({
        title: "Photos uploaded",
        description: `${valid.length} photo${valid.length !== 1 ? "s" : ""} added to your board.`,
      });
    } catch (err) {
      toast({
        title: "Upload failed",
        description:
          err instanceof ApiError ? err.message : "Something went wrong.",
      });
    } finally {
      setUploading(false);
    }
  }

  async function handleAddVideoLink() {
    if (!videoLink.trim()) return;

    // Basic URL validation
    try {
      new URL(videoLink);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
      });
      return;
    }

    setAddingVideo(true);
    try {
      await inspoApi.addVideoLink(videoLink);
      queryClient.invalidateQueries({ queryKey: ["inspo-mine"] });
      setVideoLink("");
      setMode("image");
      toast({
        title: "Video link added",
        description: "Your inspiration video has been saved.",
      });
    } catch (err) {
      toast({
        title: "Failed to add video link",
        description:
          err instanceof ApiError ? err.message : "Something went wrong.",
      });
    } finally {
      setAddingVideo(false);
    }
  }

  function getPlatformIcon(platform?: string | null) {
    switch (platform?.toLowerCase()) {
      case "tiktok":
        return "🎵";
      case "instagram":
        return "📸";
      case "youtube":
        return "▶️";
      case "pinterest":
        return "📌";
      default:
        return "🎬";
    }
  }

  function getPlatformGradient(platform?: string | null) {
    switch (platform?.toLowerCase()) {
      case "tiktok":
        return "linear-gradient(135deg, #000000 0%, #ee1d52 100%)";
      case "instagram":
        return "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)";
      case "youtube":
        return "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)";
      case "pinterest":
        return "linear-gradient(135deg, #E60023 0%, #BD081C 100%)";
      default:
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }
  }

  function getInstagramEmbedUrl(url: string): string | null {
    // Extract Instagram post/reel ID from URL
    const match = url.match(/instagram\.com\/(p|reel)\/([^/?]+)/);
    if (match) {
      return `https://www.instagram.com/${match[1]}/${match[2]}/embed/`;
    }
    return null;
  }

  function getYouTubeEmbedUrl(url: string): string | null {
    // Extract YouTube video ID
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  }

  function getTikTokEmbedUrl(url: string): string | null {
    // Extract TikTok video ID
    const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
    if (match) {
      return `https://www.tiktok.com/embed/v2/${match[1]}`;
    }
    return null;
  }

  function getVideoThumbnail(item: InspoUpload): string | null {
    if (item.platform === "youtube" && item.videoLink) {
      const videoId = item.videoLink.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
      )?.[1];
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      }
    }
    return null;
  }

  const selectedItem = lightboxIdx !== null ? uploads[lightboxIdx] : null;

  return (
    <BridePortalLayout>
      {/* Lightbox for images */}
      {selectedItem && selectedItem.mediaType === "image" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.88)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => setLightboxIdx(null)}
            style={{
              position: "absolute",
              top: 24,
              right: 28,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <X size={24} />
          </button>
          <button
            onClick={() =>
              setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : i))
            }
            style={{
              position: "absolute",
              left: 28,
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <ChevronLeft size={22} />
          </button>
          <img
            src={selectedItem.imageUrl!}
            alt={selectedItem.caption ?? "Inspiration"}
            style={{
              maxWidth: "80vw",
              maxHeight: "80vh",
              borderRadius: 12,
              objectFit: "contain",
            }}
          />
          <button
            onClick={() =>
              setLightboxIdx((i) =>
                i !== null && i < uploads.length - 1 ? i + 1 : i,
              )
            }
            style={{
              position: "absolute",
              right: 28,
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <ChevronRight size={22} />
          </button>
          <div
            style={{
              position: "absolute",
              bottom: 24,
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {(lightboxIdx ?? 0) + 1} / {uploads.length}
          </div>
        </div>
      )}

      {/* Modal for video links */}
      {selectedItem && selectedItem.mediaType === "video_link" && (
        <>
          <div
            onClick={() => setLightboxIdx(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              zIndex: 100,
              backdropFilter: "blur(2px)",
            }}
          />
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 101,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                width: "100%",
                maxWidth: 500,
                maxHeight: "90vh",
                overflow: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid #F0F0F0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 20 }}>
                    {getPlatformIcon(selectedItem.platform)}
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#333",
                      textTransform: "capitalize",
                    }}
                  >
                    {selectedItem.platform} Video
                  </span>
                </div>
                <button
                  onClick={() => setLightboxIdx(null)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  <X size={20} color="#666" />
                </button>
              </div>
              <div style={{ padding: 24 }}>
                {/* Instagram Embed */}
                {selectedItem.platform === "instagram" &&
                  getInstagramEmbedUrl(selectedItem.videoLink!) && (
                    <div
                      style={{
                        marginBottom: 20,
                        borderRadius: 12,
                        overflow: "hidden",
                        background: "#F5F5F5",
                      }}
                    >
                      <iframe
                        src={getInstagramEmbedUrl(selectedItem.videoLink!)!}
                        width="100%"
                        height="600"
                        frameBorder="0"
                        scrolling="no"
                        allowTransparency
                        style={{ border: "none", overflow: "hidden" }}
                      />
                    </div>
                  )}

                {/* YouTube Embed */}
                {selectedItem.platform === "youtube" &&
                  getYouTubeEmbedUrl(selectedItem.videoLink!) && (
                    <div
                      style={{
                        marginBottom: 20,
                        borderRadius: 12,
                        overflow: "hidden",
                        aspectRatio: "16/9",
                      }}
                    >
                      <iframe
                        src={getYouTubeEmbedUrl(selectedItem.videoLink!)!}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ border: "none" }}
                      />
                    </div>
                  )}

                {/* TikTok Embed */}
                {selectedItem.platform === "tiktok" &&
                  getTikTokEmbedUrl(selectedItem.videoLink!) && (
                    <div
                      style={{
                        marginBottom: 20,
                        borderRadius: 12,
                        overflow: "hidden",
                        background: "#F5F5F5",
                      }}
                    >
                      <iframe
                        src={getTikTokEmbedUrl(selectedItem.videoLink!)!}
                        width="100%"
                        height="600"
                        frameBorder="0"
                        scrolling="no"
                        allowFullScreen
                        style={{ border: "none" }}
                      />
                    </div>
                  )}

                {/* Fallback for Pinterest or if embed fails */}
                {(!selectedItem.platform ||
                  (selectedItem.platform !== "instagram" &&
                    selectedItem.platform !== "youtube" &&
                    selectedItem.platform !== "tiktok")) && (
                  <div
                    style={{
                      background: "#F5F5F5",
                      borderRadius: 12,
                      padding: 40,
                      textAlign: "center",
                      marginBottom: 20,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 12,
                      border: "1px solid #E8E0D5",
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        background: "#fff",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Play size={28} color="#D4A373" fill="#D4A373" />
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: "#666",
                        fontWeight: 500,
                      }}
                    >
                      Video hosted on {selectedItem.platform}
                    </div>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                  }}
                >
                  <a
                    href={selectedItem.videoLink!}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#333",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 500,
                      textAlign: "center",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <ExternalLink size={14} />
                    Open in {selectedItem.platform}
                  </a>
                  <button
                    onClick={() => {
                      setLightboxIdx(null);
                      setConfirmDelete(selectedItem.id);
                    }}
                    style={{
                      padding: "12px 20px",
                      background: "#FFF",
                      color: "#CC4444",
                      border: "1px solid #CC4444",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile menu modal */}
      {showMobileMenu && (
        <>
          <div
            onClick={() => setShowMobileMenu(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 100,
              backdropFilter: "blur(2px)",
            }}
          />
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 101,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              padding: 16,
              pointerEvents: "none",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                borderRadius: "16px 16px 0 0",
                width: "100%",
                maxWidth: 500,
                padding: "24px",
                boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
                pointerEvents: "auto",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 20,
                  fontWeight: 500,
                  color: "#2C2C2C",
                  margin: "0 0 16px",
                  textAlign: "center",
                }}
              >
                Add Inspiration
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    fileInputRef.current?.click();
                  }}
                  style={{
                    padding: "16px",
                    background: "#333",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <Upload size={18} />
                  Upload Photos
                </button>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setMode("video");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  style={{
                    padding: "16px",
                    background: "#fff",
                    color: "#333",
                    border: "1px solid #E8E0D5",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <LinkIcon size={18} />
                  Add Video Link
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <main className="bp-page-main">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 24,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 32,
                  fontWeight: 500,
                  color: "#2C2C2C",
                  margin: "0 0 6px",
                }}
              >
                Inspiration Board
              </h1>
              <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
                <span className="hidden sm:inline">
                  Share your vision with Fatima —{" "}
                </span>
                upload anything that inspires you
              </p>
            </div>
            <div className="hidden sm:flex" style={{ gap: 8 }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Upload Photos"
                style={{
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  background: "#333",
                  color: "#fff",
                  border: "none",
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: uploading ? "not-allowed" : "pointer",
                  opacity: uploading ? 0.7 : 1,
                  display: "flex",
                }}
                className="upload-btn"
              >
                {uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span className="btn-text">Uploading…</span>
                  </>
                ) : (
                  <>
                    <Upload size={15} />
                    <span className="btn-text">Upload Photos</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setMode("video")}
                title="Add Video Link"
                style={{
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  background: "#fff",
                  color: "#333",
                  border: "1px solid #E8E0D5",
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                }}
                className="video-btn"
              >
                <LinkIcon size={15} />
                <span className="btn-text">Add Video Link</span>
              </button>
            </div>
          </div>

          {/* Video Link Form (shown when mode is video) */}
          {mode === "video" && (
            <div
              style={{
                border: "1.5px solid #D4A373",
                borderRadius: 12,
                padding: 24,
                background: "rgba(212,163,115,0.04)",
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: "#F5EFE9",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LinkIcon size={20} color="#D4A373" />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#333",
                      marginBottom: 3,
                    }}
                  >
                    Add Video Link from Social Media
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    Paste link from TikTok, Instagram, YouTube, or Pinterest
                  </div>
                </div>
              </div>
              <input
                type="url"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                placeholder="https://www.tiktok.com/@username/video/..."
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #E8E0D5",
                  borderRadius: 8,
                  fontSize: 13,
                  marginBottom: 16,
                  outline: "none",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 11, color: "#999" }}>
                  Supported: TikTok • Instagram • YouTube • Pinterest
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => {
                      setMode("image");
                      setVideoLink("");
                    }}
                    style={{
                      padding: "10px 20px",
                      background: "#fff",
                      color: "#666",
                      border: "1px solid #E8E0D5",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddVideoLink}
                    disabled={!videoLink.trim() || addingVideo}
                    style={{
                      padding: "10px 24px",
                      background:
                        videoLink.trim() && !addingVideo ? "#333" : "#CCC",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor:
                        videoLink.trim() && !addingVideo
                          ? "pointer"
                          : "not-allowed",
                    }}
                  >
                    {addingVideo ? "Adding..." : "Add Video Link"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Drop zone (only shown when not in video mode) */}
          {mode === "image" && (
            <div
              className="hidden sm:flex"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "1.5px dashed #D4A373",
                borderRadius: 12,
                padding: "20px 24px",
                background: "rgba(212,163,115,0.04)",
                alignItems: "center",
                gap: 16,
                marginBottom: 28,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: "#F5EFE9",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Upload size={20} color="#D4A373" />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#333",
                    marginBottom: 3,
                  }}
                >
                  Drop photos here to add to your board
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  JPEG or PNG · Max 10MB per image · Up to 5 at a time
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={uploading}
                style={{
                  padding: "8px 18px",
                  background: uploading ? "#CCC" : "#FFFFFF",
                  border: "1px solid #E8E0D5",
                  borderRadius: 7,
                  fontSize: 12,
                  color: "#555",
                  cursor: uploading ? "not-allowed" : "pointer",
                }}
              >
                {uploading ? "Uploading..." : "Browse files"}
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            style={{ display: "none" }}
            onChange={(e) => handleFiles(e.target.files)}
          />
          {isLoading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "60px 0",
              }}
            >
              <Loader2 size={24} className="animate-spin" color="#D4A373" />
            </div>
          )}

          {!isLoading && (
            <>
              {uploads.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 0",
                    color: "#AAA",
                    fontSize: 13,
                  }}
                >
                  No inspiration yet — add your first image or video link above.
                </div>
              )}
              {uploads.length > 0 && (
                <div
                  className="inspo-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 12,
                  }}
                >
                  {uploads.map((item, i) => (
                    <div
                      key={item.id}
                      onClick={() => setLightboxIdx(i)}
                      style={{
                        borderRadius: 10,
                        overflow: "hidden",
                        border: "1px solid #E8E0D5",
                        cursor: "pointer",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                        transition: "all 0.15s",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                      }}
                    >
                      {item.mediaType === "image" ? (
                        <>
                          <div
                            style={{
                              height: 280,
                              overflow: "hidden",
                              position: "relative",
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={item.imageUrl!}
                              alt={item.caption ?? "Inspo"}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            style={{
                              height: 280,
                              background: "#F5F5F5",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 12,
                              position: "relative",
                              border: "1px solid #E8E0D5",
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                top: 12,
                                left: 12,
                                background: "#fff",
                                borderRadius: 6,
                                padding: "4px 10px",
                                fontSize: 10,
                                fontWeight: 600,
                                color: "#333",
                                textTransform: "uppercase",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                              }}
                            >
                              {getPlatformIcon(item.platform)} {item.platform}
                            </div>

                            <div
                              style={{
                                width: 64,
                                height: 64,
                                background: "#fff",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              }}
                            >
                              <Play size={28} color="#D4A373" fill="#D4A373" />
                            </div>

                            <div
                              style={{
                                color: "#666",
                                fontSize: 13,
                                fontWeight: 500,
                              }}
                            >
                              Video Link
                            </div>
                          </div>
                        </>
                      )}

                      <div
                        style={{
                          background: "#fff",
                          padding: "7px 10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: 10, color: "#888" }}>
                          {new Date(item.uploadedAt).toLocaleDateString(
                            "en-AU",
                            { day: "numeric", month: "short" },
                          )}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(item.id);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 2,
                          }}
                        >
                          <Trash2 size={12} color="#CC4444" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add more tile */}
                  <div
                    onClick={() => setShowMobileMenu(true)}
                    className="add-more-tile"
                    style={{
                      borderRadius: 10,
                      border: "1.5px dashed #E8E0D5",
                      height: 310,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      cursor: "pointer",
                      background: "#FAFAFA",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        background: "#F5EFE9",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Plus size={18} color="#D4A373" />
                    </div>
                    <span style={{ fontSize: 11, color: "#AAAAAA" }}>
                      Add more
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      {/* Floating upload button for mobile */}
      <button
        className="inspo-mobile-upload-btn sm:hidden"
        onClick={() => setShowMobileMenu(true)}
        disabled={uploading}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#333",
          color: "#fff",
          border: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          cursor: uploading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
        }}
      >
        {uploading ? (
          <Loader2 size={24} className="animate-spin" />
        ) : (
          <Plus size={24} />
        )}
      </button>

      {/* Confirm delete */}
      {confirmDelete && (
        <>
          <div
            onClick={() => setConfirmDelete(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 100,
              backdropFilter: "blur(2px)",
            }}
          />
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 101,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                width: "100%",
                maxWidth: 380,
                padding: "28px 24px",
                textAlign: "center",
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  fontWeight: 500,
                  color: "#2C2C2C",
                  margin: "0 0 8px",
                }}
              >
                Remove this item?
              </h3>
              <p style={{ fontSize: 13, color: "#888", margin: "0 0 24px" }}>
                This cannot be undone.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setConfirmDelete(null)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "1px solid #E8E0D5",
                    borderRadius: 9,
                    fontSize: 13,
                    color: "#666",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(confirmDelete)}
                  disabled={deleteMutation.isPending}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "none",
                    borderRadius: 9,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    background: "#CC4444",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 size={13} className="animate-spin" /> Removing…
                    </>
                  ) : (
                    "Remove"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .inspo-mobile-upload-btn {
          display: none;
        }
        
        @media (max-width: 640px) {
          .inspo-mobile-upload-btn {
            display: flex !important;
          }
          
          .inspo-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .add-more-tile {
            display: none !important;
          }
        }
        
        @media (min-width: 641px) and (max-width: 1024px) {
          .btn-text {
            display: none;
          }
          .upload-btn, .video-btn {
            padding: 10px !important;
          }
        }
      `}</style>
    </BridePortalLayout>
  );
}
