import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Build page number list with ellipsis for large ranges
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const btnBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 34,
    height: 34,
    padding: "0 10px",
    border: "1px solid #E8E0D5",
    borderRadius: 8,
    fontSize: 13,
    background: "#fff",
    color: "#555",
    cursor: "pointer",
    transition: "all 0.15s",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        marginTop: 32,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          style={{
            ...btnBase,
            color: page === 1 ? "#CCC" : "#555",
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}
        >
          <ChevronLeft size={15} />
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              style={{ fontSize: 13, color: "#AAA", padding: "0 4px" }}
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              style={{
                ...btnBase,
                background: p === page ? "#2C2C2C" : "#fff",
                color: p === page ? "#fff" : "#555",
                border: p === page ? "1px solid #2C2C2C" : "1px solid #E8E0D5",
                fontWeight: p === page ? 600 : 400,
                cursor: p === page ? "default" : "pointer",
              }}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          style={{
            ...btnBase,
            color: page === totalPages ? "#CCC" : "#555",
            cursor: page === totalPages ? "not-allowed" : "pointer",
          }}
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Count */}
      <span style={{ fontSize: 11, color: "#AAAAAA" }}>
        Showing {from}–{to} of {total}
      </span>
    </div>
  );
}
