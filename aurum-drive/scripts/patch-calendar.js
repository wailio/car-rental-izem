const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'ui', 'VehicleModal.tsx');
let src = fs.readFileSync(filePath, 'utf8');

const OLD_START = '  function getDayStyle';
const OLD_END = '// ─── Main Modal';

const startIdx = src.indexOf(OLD_START);
const endIdx = src.indexOf(OLD_END);

if (startIdx === -1 || endIdx === -1) {
  console.error('Markers not found', { startIdx, endIdx });
  process.exit(1);
}

const REPLACEMENT = `  // ── Light iOS calendar ──
  return (
    <div style={{
      marginBottom: 16,
      borderRadius: 18,
      background: "#F5F5F7",
      border: "1px solid rgba(0,0,0,0.07)",
      overflow: "hidden",
      fontFamily: SF,
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      {/* ── Header ── */}
      <div style={{
        padding: "14px 18px 12px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase", color: "#FF3600", marginBottom: 3 }}>
            Étape 1
          </div>
          <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.2, color: "#1D1D1F" }}>
            <span style={{ fontWeight: 300 }}>Choisissez vos </span>
            <span style={{ fontWeight: 800 }}>dates</span>
          </h3>
        </div>
        {/* Live state pill */}
        <div style={{
          padding: "5px 13px",
          borderRadius: 99,
          background: startDate && endDate ? "#FF3600" : "rgba(0,0,0,0.07)",
          color: startDate && endDate ? "#fff" : "#6E6E73",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.01em",
          transition: "background 0.25s ease, color 0.25s ease",
          whiteSpace: "nowrap",
        }}>
          {startDate && endDate
            ? \`\${Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000)} nuit\${Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000) > 1 ? "s" : ""}\`
            : startDate ? "→ retour ?" : "Sélectionnez"}
        </div>
      </div>

      {/* ── Month nav ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 18px 8px",
      }}>
        <button onClick={prevMonth} aria-label="Mois précédent" style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.10)",
          color: "#1D1D1F", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)", transition: "background 0.15s ease",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#F5F5F7")}
        onMouseLeave={e => (e.currentTarget.style.background = "#FFFFFF")}
        >
          <ChevronLeft size={15} strokeWidth={2.5} />
        </button>

        <span style={{ fontSize: 17, color: "#1D1D1F", lineHeight: 1, letterSpacing: "-0.02em" }}>
          <span style={{ fontWeight: 300 }}>{MONTHS_FR[viewMonth]} </span>
          <span style={{ fontWeight: 800 }}>{viewYear}</span>
        </span>

        <button onClick={nextMonth} aria-label="Mois suivant" style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.10)",
          color: "#1D1D1F", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)", transition: "background 0.15s ease",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#F5F5F7")}
        onMouseLeave={e => (e.currentTarget.style.background = "#FFFFFF")}
        >
          <ChevronRight size={15} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── Day headers ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 10px 6px" }}>
        {DAYS_FR.map(day => (
          <div key={day} style={{
            textAlign: "center", fontSize: 10, fontWeight: 800,
            color: "#AEAEB2", letterSpacing: "0.07em", padding: "2px 0",
          }}>{day}</div>
        ))}
      </div>

      {/* ── Day grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 10px 10px", rowGap: 2 }}>
        {calendarDays.map((d, i) => {
          if (!d) return <div key={\`empty-\${i}\`} />;

          const reserved = isReserved(d);
          const past = isPast(d);
          const start = isStart(d);
          const end = isEnd(d);
          const inRange = isInRange(d);
          const isToday = sameDay(d, today);
          const disabled = past || reserved;

          // Circle styling
          let circleBg = "transparent";
          let circleColor = "#1D1D1F";
          let circleBorder = "none";
          let circleFW = 400;
          let circleOpacity = 1;
          let textDeco = "none";
          let shadow = "none";

          if (past) {
            circleColor = "#C7C7CC";
            circleOpacity = 0.5;
          } else if (reserved) {
            // OBVIOUS: coral background + strikethrough
            circleBg = "rgba(255,59,48,0.12)";
            circleColor = "#C08080";
            textDeco = "line-through";
            circleFW = 500;
          } else if (start || end) {
            circleBg = "#FF3600";
            circleColor = "#FFFFFF";
            circleFW = 800;
            shadow = "0 4px 12px rgba(255,54,0,0.4)";
          } else if (inRange) {
            circleColor = "#FF3600";
            circleFW = 600;
          } else if (isToday) {
            circleBorder = "2px solid #FF3600";
            circleColor = "#FF3600";
            circleFW = 700;
          }

          // Range strip background on wrapper
          const stripBg = inRange ? "rgba(255,54,0,0.09)" : "transparent";
          const stripRadius = start ? "50% 0 0 50%" : end ? "0 50% 50% 0" : inRange ? "0" : undefined;

          // Dot color
          const dotColor = reserved ? "#FF453A" : (past || start || end || inRange) ? "transparent" : "#34C759";

          return (
            <div
              key={toISO(d)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                background: stripBg,
                borderRadius: stripRadius,
                padding: "2px 0",
              }}
              onMouseEnter={() => { if (!disabled && startDate && !endDate) setHoverDate(d); }}
              onMouseLeave={() => setHoverDate(null)}
              onClick={() => handleDayClick(d)}
            >
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13.5,
                fontWeight: circleFW,
                cursor: disabled ? "not-allowed" : "pointer",
                background: circleBg,
                color: circleColor,
                border: circleBorder,
                opacity: circleOpacity,
                textDecoration: textDeco,
                transition: "background 0.12s ease, transform 0.1s ease, box-shadow 0.12s ease",
                flexShrink: 0,
                userSelect: "none",
                boxShadow: shadow,
                transform: (start || end) ? "scale(1.08)" : "scale(1)",
              }}>
                {d.getDate()}
              </div>
              <div style={{
                width: 4, height: 4, borderRadius: "50%",
                background: dotColor, flexShrink: 0,
              }} />
            </div>
          );
        })}
      </div>

      {/* ── Legend ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "10px 18px 12px",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        flexWrap: "wrap",
      }}>
        {/* Réservé */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 7,
            background: "rgba(255,59,48,0.10)", border: "1px solid rgba(255,59,48,0.22)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: 10, height: 1.5, background: "#FF453A", borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#6E6E73" }}>Réservé</span>
        </div>
        {/* Disponible */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 7,
            background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.10)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#34C759" }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#6E6E73" }}>Disponible</span>
        </div>
        {/* Sélectionné */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#FF3600", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.8)" }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#6E6E73" }}>Sélectionné</span>
        </div>
      </div>

      {/* ── Selected summary bar ── */}
      {startDate && (
        <div style={{
          margin: "0 12px 12px",
          padding: "12px 16px",
          borderRadius: 12,
          background: startDate && endDate ? "#FFFFFF" : "rgba(255,54,0,0.04)",
          border: startDate && endDate ? "1px solid rgba(255,54,0,0.18)" : "1.5px dashed rgba(255,54,0,0.22)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          transition: "all 0.2s ease",
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#FF3600", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 3 }}>
              {startDate && endDate ? "Période confirmée" : "Départ sélectionné"}
            </div>
            <div style={{ fontSize: 13.5, color: "#1D1D1F", display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 800 }}>
                {startDate.toLocaleDateString("fr-DZ", { day: "numeric", month: "short" })}
              </span>
              {endDate ? (
                <>
                  <span style={{ color: "#FF3600", fontWeight: 300, fontSize: 18, lineHeight: 1 }}>→</span>
                  <span style={{ fontWeight: 800 }}>
                    {endDate.toLocaleDateString("fr-DZ", { day: "numeric", month: "short" })}
                  </span>
                </>
              ) : (
                <span style={{ fontWeight: 300, color: "#AEAEB2", fontStyle: "italic", fontSize: 12 }}>
                  → cliquez la date de retour
                </span>
              )}
            </div>
          </div>
          {startDate && endDate && (
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#1D1D1F", lineHeight: 1 }}>
                {Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000)}
                <span style={{ fontSize: 12, fontWeight: 300, color: "#AEAEB2" }}> nuits</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

`;

const newSrc = src.slice(0, startIdx) + REPLACEMENT + src.slice(endIdx);
fs.writeFileSync(filePath, newSrc, 'utf8');
console.log('OK - calendar replaced, file length:', newSrc.length);
