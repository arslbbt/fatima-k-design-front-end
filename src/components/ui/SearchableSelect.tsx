import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface Option {
  id: string;
  name: string;
  email?: string;
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  onSearch: (search: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

export function SearchableSelect({
  value,
  onChange,
  options,
  onSearch,
  placeholder = "Select...",
  label,
  required = false,
  disabled = false,
  isLoading = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearch("");
  };

  const lbl: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    display: "block",
    marginBottom: 6,
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {label && (
        <label style={lbl}>
          {label} {required && "*"}
        </label>
      )}

      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "9px 12px",
          border: "1px solid #E8E0D5",
          borderRadius: 7,
          fontSize: 13,
          color: selectedOption ? "#333" : "#AAA",
          background: disabled ? "#F5F5F5" : "#FDFBF8",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span
          style={{
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {value && !disabled && (
            <button
              onClick={handleClear}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={14} color="#AAA" />
            </button>
          )}
          <ChevronDown
            size={14}
            color="#AAA"
            style={{
              transform: isOpen ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #E8E0D5",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 1000,
            maxHeight: 280,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "8px",
              borderBottom: "1px solid #F0EBE4",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#FAF8F5",
                border: "1px solid #E8E0D5",
                borderRadius: 6,
                padding: "6px 10px",
              }}
            >
              <Search size={13} color="#AAA" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: 12,
                  color: "#333",
                  background: "transparent",
                  flex: 1,
                }}
              />
            </div>
          </div>

          <div
            style={{
              overflowY: "auto",
              flex: 1,
            }}
          >
            {isLoading ? (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#AAA",
                  fontSize: 12,
                }}
              >
                Loading...
              </div>
            ) : options.length === 0 ? (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#AAA",
                  fontSize: 12,
                }}
              >
                {search ? "No results found" : "No options available"}
              </div>
            ) : (
              options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    background: value === option.id ? "#FFF9F4" : "transparent",
                    borderLeft:
                      value === option.id
                        ? "3px solid #D4A373"
                        : "3px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (value !== option.id) {
                      e.currentTarget.style.background = "#FAFAFA";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== option.id) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: value === option.id ? 600 : 400,
                      color: "#333",
                      marginBottom: option.email ? 2 : 0,
                    }}
                  >
                    {option.name}
                  </div>
                  {option.email && (
                    <div style={{ fontSize: 11, color: "#888" }}>
                      {option.email}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
