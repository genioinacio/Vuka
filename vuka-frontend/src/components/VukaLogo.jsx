export default function VukaLogo({ size = 32, showText = true, horizontal = false }) {

  const icone = (
    <div style={{
      width: size * 1.4,
      height: size * 1.4,
      background: "#EAF3DE",
      borderRadius: size * 0.35,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <path d="M22 18 C28 28, 34 42, 50 72" stroke="#2D6A1F" strokeWidth="7.5" strokeLinecap="round" fill="none"/>
        <path d="M78 18 C72 28, 66 42, 50 72" stroke="#2D6A1F" strokeWidth="7.5" strokeLinecap="round" fill="none"/>
        <path d="M31 30 C36 24, 44 20, 50 18" stroke="#C0DD97" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M69 30 C64 24, 56 20, 50 18" stroke="#C0DD97" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M37 44 C41 38, 46 34, 50 32" stroke="#C0DD97" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75"/>
        <path d="M63 44 C59 38, 54 34, 50 32" stroke="#C0DD97" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75"/>
        <circle cx="50" cy="72" r="4.5" fill="#C0DD97"/>
        <path d="M50 72 C50 76, 48 80, 46 84" stroke="#2D6A1F" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4"/>
      </svg>
    </div>
  );

  if (!showText) return icone;

  return (
    <div style={{
      display: "flex",
      flexDirection: horizontal ? "row" : "column",
      alignItems: "center",
      gap: horizontal ? "10px" : "6px",
    }}>
      {icone}
      <span style={{
        fontSize: size * 0.7,
        fontWeight: "900",
        color: "#2D6A1F",
        letterSpacing: size * 0.12,
        fontFamily: "'Inter', system-ui, sans-serif",
        lineHeight: 1,
      }}>
        VUKA
      </span>
    </div>
  );
}