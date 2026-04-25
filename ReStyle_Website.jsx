import { useState, useEffect, useRef } from "react";

// ─── Inline Styles / CSS ────────────────────────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --gold: #C9A227; --gold-light: #E8C96A; --gold-pale: #FAF0D0; --gold-deep: #8B6914;
    --dark: #0A0908; --dark2: #151310; --dark3: #1E1B17;
    --cream: #FAF6EE; --muted: #8A7B6A;
    --font-display: 'Cormorant Garamond', serif;
    --font-body: 'DM Sans', sans-serif;
  }
  html, body, #root { height: 100%; background: var(--dark); }
  body { font-family: var(--font-body); color: var(--cream); overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #151310; }
  ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
  .shimmer-text {
    background: linear-gradient(90deg, var(--gold-deep), var(--gold), var(--gold-light), var(--gold));
    background-size: 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }
`;

// ─── Data ────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: "Silk Wrap Dress",     cat: "Women",      price: 799,  old: 1299, emoji: "👗", tag: "New",  color: "#2D1B4E", desc: "Flowing silk-effect wrap dress for campus events. Lightweight & breathable." },
  { id: 2, name: "Linen Blazer",        cat: "Men",        price: 999,  old: 1599, emoji: "🧥", tag: "Hot",  color: "#1B2D1E", desc: "Smart linen blazer for presentations, fests & everyday campus style." },
  { id: 3, name: "Chain Shoulder Bag",  cat: "Accessories",price: 599,  old: null, emoji: "👜", tag: "New",  color: "#2D2218", desc: "Compact gold-chain shoulder bag. Faux leather with magnetic clasp." },
  { id: 4, name: "Pleated Trousers",    cat: "Women",      price: 649,  old: 999,  emoji: "👖", tag: "Sale", color: "#1A1E2D", desc: "Relaxed pleated trousers with elastic waistband for all-day comfort." },
  { id: 5, name: "Chunky Sneakers",     cat: "Footwear",   price: 849,  old: 1199, emoji: "👟", tag: "Hot",  color: "#1E1A2D", desc: "Trendy chunky sole sneakers with padded insole for all-day wear." },
  { id: 6, name: "Polo Shirt",          cat: "Men",        price: 399,  old: 599,  emoji: "👕", tag: "Sale", color: "#1B2A2A", desc: "Classic cotton polo shirt — a wardrobe staple. Pre-washed for softness." },
  { id: 7, name: "Floral Co-ord Set",   cat: "Women",      price: 1199, old: 1699, emoji: "🌸", tag: "New",  color: "#2D1B28", desc: "Matching floral top & trousers co-ord set for fests and outings." },
  { id: 8, name: "Denim Jacket",        cat: "Men",        price: 1099, old: 1499, emoji: "🫙", tag: "Hot",  color: "#1A2028", desc: "Classic washed denim jacket — goes with everything you own." },
  { id: 9, name: "Hoop Earrings Set",   cat: "Accessories",price: 299,  old: null, emoji: "💛", tag: "New",  color: "#2A2010", desc: "Set of 3 gold-toned hoop earrings. Lightweight, hypoallergenic posts." },
];

const CATEGORIES = ["All", "Women", "Men", "Accessories", "Footwear"];
const TAG_COLOR   = { New: "#C9A227", Hot: "#E55A3A", Sale: "#4CAF50" };

// ─── RS Logo SVG ─────────────────────────────────────────────────────────────
function RSLogo({ height = 36 }) {
  return (
    <svg width={height * 2.5} height={height} viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="8" y1="10" x2="78" y2="10" stroke="#C9A227" strokeWidth="5" strokeLinecap="round" />
      <path d="M8 10 L28 52 L46 38 Q64 24 64 10" stroke="#C9A227" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M46 38 Q80 48 74 68 Q68 82 52 80 Q38 78 34 65 L28 52" stroke="#C9A227" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="88" y="46" fontFamily="Cormorant Garamond, serif" fontSize="32" fontWeight="500">
        <tspan fill="#C9A227">Re</tspan>
        <tspan fill="#FAF6EE">Style</tspan>
      </text>
      <text x="88" y="62" fontFamily="DM Sans, sans-serif" fontSize="9" fontWeight="300" fill="#C9A227" letterSpacing="2">
        REDEFINING EVERYDAY STYLE
      </text>
    </svg>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar({ cartCount, onCart, onNav, page }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const navStyle = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
    padding: "0 40px", height: 64,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: scrolled ? "rgba(10,9,8,0.96)" : "transparent",
    borderBottom: scrolled ? "0.5px solid rgba(201,162,39,0.2)" : "none",
    backdropFilter: scrolled ? "blur(20px)" : "none",
    transition: "all 0.4s ease",
  };

  return (
    <nav style={navStyle}>
      <div style={{ cursor: "pointer" }} onClick={() => onNav("home")}>
        <RSLogo height={28} />
      </div>

      <div style={{ display: "flex", gap: 32 }}>
        {["Home", "Women", "Men", "Accessories", "About"].map((n) => (
          <button
            key={n}
            onClick={() => onNav(n.toLowerCase())}
            style={{
              background: "none", border: "none",
              color: page === n.toLowerCase() ? "#C9A227" : "rgba(250,246,238,0.65)",
              fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase",
              cursor: "pointer", fontFamily: "DM Sans, sans-serif",
              transition: "color 0.2s",
            }}
          >
            {n}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          onClick={onCart}
          style={{
            position: "relative", background: "none",
            border: "1px solid rgba(201,162,39,0.4)", borderRadius: "50%",
            width: 38, height: 38, color: "#C9A227", cursor: "pointer",
            fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          🛍
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: -4, right: -4,
              width: 16, height: 16, borderRadius: "50%",
              background: "#C9A227", color: "#0A0908",
              fontSize: 9, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {cartCount}
            </span>
          )}
        </button>

        <button style={{
          background: "linear-gradient(135deg,#C9A227,#8B6914)",
          border: "none", color: "#0A0908",
          padding: "8px 20px", borderRadius: 20,
          fontSize: 11, fontWeight: 500, letterSpacing: "1px",
          textTransform: "uppercase", cursor: "pointer",
        }}>
          Sign In
        </button>
      </div>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero({ onShop }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const anim = (delay) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(28px)",
    transition: `all 0.8s ease ${delay}s`,
  });

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      background: "radial-gradient(ellipse at 30% 50%, #1E1508 0%, #0A0908 60%)",
    }}>
      {/* Ambient glow */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 80%, rgba(201,162,39,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(201,162,39,0.05) 0%, transparent 50%)" }} />
      {/* Decorative rings */}
      <div style={{ position: "absolute", top: "15%", right: "8%", width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(201,162,39,0.12)", animation: "pulse 4s ease infinite" }} />
      <div style={{ position: "absolute", top: "20%", right: "12%", width: 220, height: 220, borderRadius: "50%", border: "1px solid rgba(201,162,39,0.18)" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 180, height: 180, border: "1px solid rgba(201,162,39,0.08)", transform: "rotate(45deg)" }} />

      <div style={{ textAlign: "center", zIndex: 1, padding: "0 24px", maxWidth: 820 }}>
        <div style={anim(0.1)}>
          <span style={{ fontSize: 11, letterSpacing: "4px", textTransform: "uppercase", color: "#C9A227", fontFamily: "DM Sans, sans-serif" }}>
            ✦ New Collection 2026
          </span>
        </div>

        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(56px, 8vw, 100px)", fontWeight: 300, lineHeight: 0.95, marginTop: 16, marginBottom: 24, ...anim(0.3) }}>
          <span style={{ display: "block", color: "#FAF6EE" }}>Redefining</span>
          <span style={{ display: "block", fontStyle: "italic" }} className="shimmer-text">Everyday</span>
          <span style={{ display: "block", color: "#FAF6EE" }}>Style</span>
        </h1>

        <p style={{ fontSize: 14, lineHeight: 1.85, color: "rgba(250,246,238,0.55)", maxWidth: 460, margin: "0 auto 40px", ...anim(0.5) }}>
          Trendy, affordable fashion curated for college students. Look extraordinary without breaking the bank.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", ...anim(0.6) }}>
          <button onClick={onShop} style={{ background: "linear-gradient(135deg,#C9A227,#8B6914)", border: "none", color: "#0A0908", padding: "14px 40px", borderRadius: 30, fontSize: 12, fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>
            Shop Collection
          </button>
          <button style={{ background: "transparent", border: "1px solid rgba(201,162,39,0.5)", color: "#C9A227", padding: "14px 36px", borderRadius: 30, fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>
            Our Story
          </button>
        </div>

        <div style={{ display: "flex", gap: 52, justifyContent: "center", marginTop: 60, ...anim(0.8) }}>
          {[["500+", "Styles"], ["2K+", "Students"], ["4.9★", "Rating"], ["₹399", "Starting At"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 500, color: "#C9A227" }}>{n}</div>
              <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(250,246,238,0.45)", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 9, letterSpacing: "3px", color: "rgba(250,246,238,0.3)", textTransform: "uppercase" }}>Scroll</span>
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom,rgba(201,162,39,0.6),transparent)" }} />
      </div>
    </section>
  );
}

// ─── Marquee Ticker ───────────────────────────────────────────────────────────
function Marquee() {
  const items = ["Silk Wrap Dress", "Linen Blazer", "Gold Hoops", "Chunky Sneakers", "Floral Co-ord", "Denim Jacket", "Pleated Trousers", "Chain Bag"];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: "#C9A227", padding: "12px 0", overflow: "hidden" }}>
      <div style={{ display: "flex", animation: "marquee 22s linear infinite", width: "max-content" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, color: "#0A0908", whiteSpace: "nowrap", padding: "0 32px", fontStyle: i % 2 === 0 ? "italic" : "normal" }}>
            {item} {i % 3 === 0 ? "✦" : "·"}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ p, onAdd, onView }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? p.color : "#151310",
        border: `1px solid ${hov ? "rgba(201,162,39,0.5)" : "rgba(201,162,39,0.1)"}`,
        borderRadius: 16, overflow: "hidden", cursor: "pointer",
        transition: "all 0.4s ease",
        transform: hov ? "translateY(-6px)" : "none",
        boxShadow: hov ? "0 20px 60px rgba(0,0,0,0.5)" : "none",
      }}
    >
      <div
        onClick={() => onView(p)}
        style={{
          height: 185, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 66, position: "relative",
          background: `linear-gradient(135deg,${p.color},rgba(10,9,8,0.8))`,
        }}
      >
        <span style={{ transform: hov ? "scale(1.12)" : "scale(1)", transition: "transform 0.3s ease", display: "block" }}>
          {p.emoji}
        </span>
        <span style={{ position: "absolute", top: 12, left: 12, background: TAG_COLOR[p.tag], color: "#0A0908", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "1px", textTransform: "uppercase" }}>
          {p.tag}
        </span>
        {p.old && (
          <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(10,9,8,0.7)", color: "rgba(250,246,238,0.5)", fontSize: 9, padding: "3px 8px", borderRadius: 10, textDecoration: "line-through" }}>
            ₹{p.old}
          </span>
        )}
      </div>

      <div style={{ padding: "16px 18px 20px" }}>
        <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(201,162,39,0.7)", marginBottom: 6 }}>{p.cat}</div>
        <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 21, fontWeight: 500, color: "#FAF6EE", marginBottom: 4 }}>{p.name}</div>
        <div style={{ fontSize: 12, color: "rgba(250,246,238,0.45)", lineHeight: 1.6, marginBottom: 14, minHeight: 36 }}>{p.desc}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 600, color: "#C9A227" }}>₹{p.price}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(p); }}
            style={{ background: "linear-gradient(135deg,#C9A227,#8B6914)", border: "none", color: "#0A0908", width: 36, height: 36, borderRadius: "50%", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shop Section ─────────────────────────────────────────────────────────────
function Shop({ onAdd, onView }) {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === active);

  return (
    <section style={{ padding: "80px 40px", background: "#0A0908" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span style={{ fontSize: 10, letterSpacing: "4px", textTransform: "uppercase", color: "#C9A227" }}>Curated For You</span>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 52, fontWeight: 300, color: "#FAF6EE", marginTop: 10 }}>The Collection</h2>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 40, flexWrap: "wrap" }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            style={{
              background: active === c ? "#C9A227" : "transparent",
              border: `1px solid ${active === c ? "#C9A227" : "rgba(201,162,39,0.3)"}`,
              color: active === c ? "#0A0908" : "rgba(201,162,39,0.8)",
              padding: "8px 22px", borderRadius: 20,
              fontSize: 11, letterSpacing: "1px", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.2s", fontFamily: "DM Sans, sans-serif",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
        {filtered.map((p) => <ProductCard key={p.id} p={p} onAdd={onAdd} onView={onView} />)}
      </div>
    </section>
  );
}

// ─── Product Detail Page ──────────────────────────────────────────────────────
function DetailPage({ product, onAdd, onBack }) {
  const [size, setSize] = useState("M");
  if (!product) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#0A0908", paddingTop: 80 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px" }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "1px solid rgba(201,162,39,0.3)", color: "#C9A227", padding: "8px 22px", borderRadius: 20, fontSize: 11, letterSpacing: "1px", cursor: "pointer", marginBottom: 40, textTransform: "uppercase" }}
        >
          ← Back
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 52, alignItems: "start" }}>
          {/* Product image */}
          <div style={{
            background: `linear-gradient(135deg,${product.color},#0A0908)`,
            borderRadius: 24, height: 420,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 120, border: "1px solid rgba(201,162,39,0.15)",
          }}>
            {product.emoji}
          </div>

          {/* Product info */}
          <div>
            <div style={{ fontSize: 10, letterSpacing: "3px", textTransform: "uppercase", color: "#C9A227", marginBottom: 10 }}>{product.cat}</div>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 48, fontWeight: 300, color: "#FAF6EE", lineHeight: 1, marginBottom: 16 }}>{product.name}</h1>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 24 }}>
              <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 38, fontWeight: 500, color: "#C9A227" }}>₹{product.price}</span>
              {product.old && <span style={{ fontSize: 16, color: "rgba(250,246,238,0.3)", textDecoration: "line-through" }}>₹{product.old}</span>}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "rgba(250,246,238,0.6)", marginBottom: 28 }}>{product.desc}</p>

            {/* Size picker */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(250,246,238,0.45)", marginBottom: 12 }}>Select Size</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["XS", "S", "M", "L", "XL"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    style={{
                      width: 44, height: 44, borderRadius: 8,
                      border: `1px solid ${size === s ? "#C9A227" : "rgba(201,162,39,0.2)"}`,
                      background: size === s ? "rgba(201,162,39,0.15)" : "transparent",
                      color: size === s ? "#C9A227" : "rgba(250,246,238,0.5)",
                      fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => onAdd(product)}
              style={{ width: "100%", background: "linear-gradient(135deg,#C9A227,#8B6914)", border: "none", color: "#0A0908", padding: 16, borderRadius: 12, fontSize: 13, fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", marginBottom: 20 }}
            >
              Add to Cart — ₹{product.price}
            </button>

            {/* Trust badges */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[["🚚", "Free Delivery", "Above ₹999"], ["↩", "Easy Returns", "7-day policy"], ["🔒", "Secure Pay", "Safe checkout"]].map(([icon, title, sub]) => (
                <div key={title} style={{ textAlign: "center", padding: "12px 8px", border: "1px solid rgba(201,162,39,0.1)", borderRadius: 10 }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "#FAF6EE", marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: 10, color: "rgba(250,246,238,0.35)" }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div style={{ marginTop: 52, padding: 32, background: "#151310", borderRadius: 16, border: "1px solid rgba(201,162,39,0.1)" }}>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, fontWeight: 400, color: "#FAF6EE", marginBottom: 20 }}>Customer Reviews</h3>
          {[
            ["Rahul",  "★★★★★", "Loved the quality! Great fit for college wear."],
            ["Sneha",  "★★★★☆", "Very affordable and trendy. Fast delivery too!"],
            ["Arjun",  "★★★★★", "Perfect for everyday use. Will definitely order again."],
          ].map(([name, rating, text]) => (
            <div key={name} style={{ padding: "16px 0", borderBottom: "0.5px solid rgba(201,162,39,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(201,162,39,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: "#C9A227" }}>{name[0]}</div>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#FAF6EE" }}>{name}</span>
                <span style={{ fontSize: 12, color: "#C9A227", marginLeft: "auto" }}>{rating}</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(250,246,238,0.55)", lineHeight: 1.7 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
function CartDrawer({ cart, open, onClose, onQty }) {
  const sub = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const del = sub >= 999 ? 0 : 49;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, pointerEvents: open ? "all" : "none" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", opacity: open ? 1 : 0, transition: "opacity 0.3s" }} />

      {/* Drawer */}
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: 380,
        background: "#0F0E0C", borderLeft: "1px solid rgba(201,162,39,0.2)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.4s ease",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "24px", borderBottom: "1px solid rgba(201,162,39,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, color: "#FAF6EE" }}>Your Cart</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(250,246,238,0.4)", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(250,246,238,0.3)" }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🛍</div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24 }}>Your cart is empty</div>
            </div>
          ) : cart.map((item, i) => (
            <div key={item.id} style={{ display: "flex", gap: 12, padding: "16px 0", borderBottom: "0.5px solid rgba(201,162,39,0.08)" }}>
              <div style={{ width: 60, height: 60, borderRadius: 10, background: "#1E1B17", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
                {item.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#FAF6EE", marginBottom: 2 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: "rgba(250,246,238,0.4)", marginBottom: 8 }}>{item.cat}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button onClick={() => onQty(i, -1)} style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid rgba(201,162,39,0.3)", background: "none", color: "#C9A227", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ fontSize: 13, color: "#FAF6EE", width: 18, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => onQty(i, 1)} style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid rgba(201,162,39,0.3)", background: "none", color: "#C9A227", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                  <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#C9A227" }}>₹{item.price * item.qty}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(201,162,39,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(250,246,238,0.45)", marginBottom: 6 }}><span>Subtotal</span><span>₹{sub}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(250,246,238,0.45)", marginBottom: 14 }}><span>Delivery</span><span style={{ color: del === 0 ? "#4CAF50" : "inherit" }}>{del === 0 ? "FREE" : `₹${del}`}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#FAF6EE", marginBottom: 18, paddingTop: 12, borderTop: "0.5px solid rgba(201,162,39,0.2)" }}>
              <span>Total</span><span style={{ color: "#C9A227" }}>₹{sub + del}</span>
            </div>
            <button style={{ width: "100%", background: "linear-gradient(135deg,#C9A227,#8B6914)", border: "none", color: "#0A0908", padding: 14, borderRadius: 10, fontSize: 12, fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>
              Checkout
            </button>
            <div style={{ textAlign: "center", fontSize: 10, color: "rgba(250,246,238,0.25)", marginTop: 10, letterSpacing: "1px" }}>
              ORDER VIA WHATSAPP OR INSTAGRAM DM
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section style={{ padding: "80px 40px", background: "#0D0C0A", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right,transparent,rgba(201,162,39,0.4),transparent)" }} />
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        <div>
          <span style={{ fontSize: 10, letterSpacing: "4px", textTransform: "uppercase", color: "#C9A227" }}>Our Story</span>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 52, fontWeight: 300, color: "#FAF6EE", lineHeight: 1, marginTop: 12, marginBottom: 20 }}>
            Built for Students,<br />
            <span style={{ fontStyle: "italic", color: "#C9A227" }}>by Students</span>
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: "rgba(250,246,238,0.55)", marginBottom: 20 }}>ReStyle was born from a simple problem: college students want to look great but don't have the budget for expensive fashion.</p>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: "rgba(250,246,238,0.55)", marginBottom: 36 }}>We curate affordable, trendy clothing so you can express yourself without the guilt. Founded in 2026, we're student-first.</p>
          <div style={{ display: "flex", gap: 36 }}>
            {[["500+", "Styles Available"], ["2,000+", "Happy Students"], ["50+", "Cities Delivered"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 500, color: "#C9A227" }}>{n}</div>
                <div style={{ fontSize: 10, letterSpacing: "1px", color: "rgba(250,246,238,0.35)", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            ["🎯", "Mission",  "Affordable style for every college student in India"],
            ["💛", "Values",   "Quality, affordability, and community first"],
            ["🚀", "Vision",   "India's most trusted student fashion brand"],
            ["📦", "Service",  "Order via Instagram or WhatsApp — super easy"],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: "#151310", border: "1px solid rgba(201,162,39,0.1)", borderRadius: 16, padding: "20px 16px" }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#FAF6EE", marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 11, lineHeight: 1.65, color: "rgba(250,246,238,0.4)" }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ msg, show }) {
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%",
      transform: `translateX(-50%) translateY(${show ? 0 : 20}px)`,
      opacity: show ? 1 : 0, transition: "all 0.3s ease",
      background: "#1E1B17", border: "1px solid rgba(201,162,39,0.4)",
      color: "#FAF6EE", padding: "12px 28px", borderRadius: 30,
      fontSize: 13, zIndex: 3000, whiteSpace: "nowrap",
      pointerEvents: "none", backdropFilter: "blur(20px)",
    }}>
      <span style={{ color: "#C9A227", marginRight: 8 }}>✦</span>{msg}
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ onNav }) {
  return (
    <footer style={{ background: "#080706", borderTop: "1px solid rgba(201,162,39,0.1)", padding: "32px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <RSLogo height={22} />
      <span style={{ fontSize: 11, color: "rgba(250,246,238,0.3)", letterSpacing: "1px" }}>© 2026 ReStyle · Redefining Everyday Style</span>
      <div style={{ display: "flex", gap: 24 }}>
        {["Instagram", "WhatsApp", "Contact"].map((l) => (
          <span key={l} style={{ fontSize: 11, color: "rgba(201,162,39,0.6)", cursor: "pointer", letterSpacing: "1px" }}>{l}</span>
        ))}
      </div>
    </footer>
  );
}

// ─── App (Root) ───────────────────────────────────────────────────────────────
export default function App() {
  const [page,    setPage]    = useState("home");
  const [cart,    setCart]    = useState([]);
  const [cartOpen,setCartOpen]= useState(false);
  const [detail,  setDetail]  = useState(null);
  const [toast,   setToast]   = useState({ show: false, msg: "" });

  // Inject global CSS once
  useEffect(() => {
    const tag = document.createElement("style");
    tag.textContent = globalCSS;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2800);
  };

  const addToCart = (p) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.id === p.id);
      if (ex) return prev.map((c) => (c.id === p.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...p, qty: 1 }];
    });
    showToast(`${p.name} added to cart`);
  };

  const changeQty = (i, d) => {
    setCart((prev) => prev.map((c, idx) => idx === i ? { ...c, qty: c.qty + d } : c).filter((c) => c.qty > 0));
  };

  const onNav = (n) => {
    setDetail(null);
    if (n === "home") setPage("home");
    else if (["women", "men", "accessories", "footwear"].includes(n)) setPage("shop");
    else if (n === "about") setPage("about");
  };

  const cartCount = cart.reduce((a, c) => a + c.qty, 0);

  return (
    <>
      <Navbar cartCount={cartCount} onCart={() => setCartOpen(true)} onNav={onNav} page={detail ? "detail" : page} />

      {detail ? (
        <DetailPage product={detail} onAdd={addToCart} onBack={() => setDetail(null)} />
      ) : (
        <>
          {page === "home" && (
            <>
              <Hero onShop={() => setPage("shop")} />
              <Marquee />
              <Shop onAdd={addToCart} onView={setDetail} />
              <AboutSection />
              <Footer onNav={onNav} />
            </>
          )}
          {page === "shop" && (
            <div style={{ paddingTop: 64 }}>
              <Shop onAdd={addToCart} onView={setDetail} />
            </div>
          )}
          {page === "about" && (
            <div style={{ paddingTop: 64 }}>
              <AboutSection />
              <Footer onNav={onNav} />
            </div>
          )}
        </>
      )}

      <CartDrawer cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} onQty={changeQty} />
      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
