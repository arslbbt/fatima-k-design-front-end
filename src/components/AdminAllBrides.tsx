import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Calendar,
  CreditCard,
  FileText,
  Filter,
  ChevronRight,
  Heart,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/Pagination";
import { AdminLayout } from "@/components/AdminLayout";
import {
  bridesApi,
  type BrideWithProfile,
  type BrideStage,
  BRIDE_STAGE_LABELS,
  BRIDE_STAGE_ORDER,
} from "@/lib/api";

const PAGE_SIZE = 12;

const stageFilters: Array<{ label: string; value: BrideStage | "ALL" }> = [
  { label: "All Stages", value: "ALL" },
  ...BRIDE_STAGE_ORDER.map((s) => ({ label: BRIDE_STAGE_LABELS[s], value: s })),
];

export function AdminAllBrides() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<BrideStage | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleStage = useCallback((val: BrideStage | "ALL") => {
    setStageFilter(val);
    setPage(1);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["brides", { search, stage: stageFilter, page }],
    queryFn: () =>
      bridesApi.list({
        search: search || undefined,
        stage: stageFilter === "ALL" ? undefined : stageFilter,
        page,
        limit: PAGE_SIZE,
      }),
    placeholderData: (prev) => prev,
  });

  const stageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: BrideStage }) =>
      bridesApi.updateStage(id, stage),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["brides"] }),
  });

  const brides = data?.data ?? [];
  const meta = data?.meta;

  return (
    <AdminLayout>
      <main className="bp-page-main">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Page header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 28,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 32,
                  fontWeight: 500,
                  color: "#2C2C2C",
                  margin: "0 0 4px",
                }}
              >
                All Brides
              </h1>
              <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
                {meta
                  ? `${meta.total} bride${meta.total !== 1 ? "s" : ""}`
                  : "Loading…"}
              </p>
            </div>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 20px",
                background: "#2C2C2C",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <Plus size={15} /> New Bride
            </button>
          </div>

          {/* Search */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ position: "relative", maxWidth: 400 }}>
              <Search
                size={15}
                color="#AAA"
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name or email…"
                style={{
                  width: "100%",
                  paddingLeft: 36,
                  paddingRight: 14,
                  paddingTop: 9,
                  paddingBottom: 9,
                  border: "1px solid #E8E0D5",
                  borderRadius: 8,
                  fontSize: 13,
                  background: "#fff",
                  color: "#333",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Stage filter pills */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 24,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Filter size={13} color="#AAA" />
            {stageFilters.map((s) => (
              <button
                key={s.value}
                onClick={() => handleStage(s.value)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  border: `1px solid ${stageFilter === s.value ? "#A67C52" : "#E8E0D5"}`,
                  background:
                    stageFilter === s.value ? "#E8D8CE" : "transparent",
                  color: stageFilter === s.value ? "#7A5C3A" : "#888",
                  fontSize: 11,
                  fontWeight: stageFilter === s.value ? 600 : 400,
                  cursor: "pointer",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Loading */}
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

          {/* Error */}
          {isError && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "#C0392B",
                fontSize: 14,
              }}
            >
              Failed to load brides. Please try again.
            </div>
          )}

          {/* Grid */}
          {!isLoading && !isError && (
            <>
              {brides.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 0",
                    color: "#AAA",
                  }}
                >
                  <Search
                    size={32}
                    color="#DDD"
                    style={{ margin: "0 auto 12px" }}
                  />
                  <div style={{ fontSize: 14 }}>
                    No brides match your filters
                  </div>
                  <button
                    onClick={() => {
                      handleSearch("");
                      handleStage("ALL");
                    }}
                    style={{
                      marginTop: 12,
                      fontSize: 12,
                      color: "#A67C52",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: 16,
                  }}
                >
                  {brides.map((bride) => (
                    <BrideCard
                      key={bride.id}
                      bride={bride}
                      onStageChange={(stage) =>
                        stageMutation.mutate({ id: bride.id, stage })
                      }
                      stageUpdating={stageMutation.isPending}
                    />
                  ))}
                </div>
              )}

              {meta && (
                <Pagination
                  page={meta.page}
                  totalPages={meta.totalPages}
                  total={meta.total}
                  limit={meta.limit}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </main>
    </AdminLayout>
  );
}

function BrideCard({
  bride,
  onStageChange,
  stageUpdating,
}: {
  bride: BrideWithProfile;
  onStageChange: (stage: BrideStage) => void;
  stageUpdating: boolean;
}) {
  const profile = bride.brideProfile;
  const currentStage = profile?.stage ?? "CONSULTATION";
  const stageIndex = BRIDE_STAGE_ORDER.indexOf(currentStage);
  const progressPct = Math.round(
    ((stageIndex + 1) / BRIDE_STAGE_ORDER.length) * 100,
  );

  const initials = bride.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const weddingDate = profile?.weddingDate
    ? new Date(profile.weddingDate).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  // TODO: Replace with real payment data from payments API
  const PLACEHOLDER_BALANCE = { total: 10000, paid: 8000, outstanding: 2000 };

  return (
    <Card
      style={{
        background: "#fff",
        border: "1px solid #E8E0D5",
        borderRadius: 12,
        boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      {/* Top accent — gold if balance outstanding, green if paid */}
      <div
        style={{
          height: 3,
          background:
            PLACEHOLDER_BALANCE.outstanding > 0 ? "#D4A373" : "#B8D4B0",
        }}
      />
      <CardContent style={{ padding: "20px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 16,
          }}
        >
          <Avatar
            style={{
              width: 48,
              height: 48,
              flexShrink: 0,
              border: "2px solid #E8D8CE",
            }}
          >
            <AvatarFallback
              style={{
                background: "#E8D8CE",
                color: "#A67C52",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18,
                fontWeight: 600,
                color: "#2C2C2C",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {bride.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#888",
                marginTop: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {bride.email}
            </div>
          </div>
        </div>

        {/* Stage progress bar */}
        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, color: "#555" }}>
              {BRIDE_STAGE_LABELS[currentStage]}
            </span>
            <span style={{ fontSize: 10, color: "#AAA" }}>
              {stageIndex + 1}/{BRIDE_STAGE_ORDER.length}
            </span>
          </div>
          <div style={{ height: 4, background: "#F0EAE2", borderRadius: 4 }}>
            <div
              style={{
                height: 4,
                borderRadius: 4,
                background: "#D4A373",
                width: `${progressPct}%`,
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>

        {/* Stage dropdown */}
        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              fontSize: 9,
              color: "#AAAAAA",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              display: "block",
              marginBottom: 4,
            }}
          >
            Update Stage
          </label>
          <select
            value={currentStage}
            disabled={stageUpdating}
            onChange={(e) => onStageChange(e.target.value as BrideStage)}
            style={{
              width: "100%",
              padding: "7px 10px",
              border: "1px solid #E8E0D5",
              borderRadius: 7,
              fontSize: 12,
              color: "#555",
              background: "#FDFBF8",
              cursor: stageUpdating ? "not-allowed" : "pointer",
              outline: "none",
            }}
          >
            {BRIDE_STAGE_ORDER.map((s) => (
              <option key={s} value={s}>
                {BRIDE_STAGE_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        {/* Info row */}
        <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
          {weddingDate && (
            <div>
              <div
                style={{
                  fontSize: 9,
                  color: "#AAAAAA",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 3,
                }}
              >
                Wedding
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#444",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Heart size={10} fill="#D4A373" color="#D4A373" /> {weddingDate}
              </div>
            </div>
          )}
          {/* TODO: Replace PLACEHOLDER_BALANCE with real data from payments API */}
          <div>
            <div
              style={{
                fontSize: 9,
                color: "#AAAAAA",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 3,
              }}
            >
              Balance
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color:
                  PLACEHOLDER_BALANCE.outstanding > 0 ? "#D4A373" : "#5A9E6E",
              }}
            >
              {PLACEHOLDER_BALANCE.outstanding > 0
                ? `$${PLACEHOLDER_BALANCE.outstanding.toLocaleString()} due`
                : "Paid in full"}
            </div>
          </div>
          {profile?.phone && (
            <div>
              <div
                style={{
                  fontSize: 9,
                  color: "#AAAAAA",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 3,
                }}
              >
                Phone
              </div>
              <div style={{ fontSize: 12, color: "#555" }}>{profile.phone}</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: 8,
            paddingTop: 14,
            borderTop: "1px solid #F0EAE2",
          }}
        >
          <button
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "7px 8px",
              background: "#2C2C2C",
              color: "#fff",
              border: "none",
              borderRadius: 7,
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            View Profile <ChevronRight size={12} />
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "7px 10px",
              background: "transparent",
              color: "#888",
              border: "1px solid #E8E0D5",
              borderRadius: 7,
              cursor: "pointer",
            }}
          >
            <Calendar size={12} />
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "7px 10px",
              background: "transparent",
              color: "#888",
              border: "1px solid #E8E0D5",
              borderRadius: 7,
              cursor: "pointer",
            }}
          >
            <CreditCard size={12} />
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "7px 10px",
              background: "transparent",
              color: "#888",
              border: "1px solid #E8E0D5",
              borderRadius: 7,
              cursor: "pointer",
            }}
          >
            <FileText size={12} />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
