import { useEffect, useState } from "react";
import { card, T } from "../theme/colors";
import { Btn } from "../components/Button";
import { Ic } from "../components/Icons";

export default function NotFoundPage({ onNav }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  // Create floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, () => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Track mouse for parallax effect
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: `radial-gradient(circle at 50% 50%, ${T.bg2} 0%, ${T.bg} 100%)`,
      }}
    >
      {/* Animated Background Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: "absolute",
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, ${T.gold}80, transparent)`,
            borderRadius: "50%",
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            opacity: 0.3,
          }}
        />
      ))}

      {/* Decorative Wood Grain Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `repeating-linear-gradient(45deg, ${T.gold} 0px, ${T.gold} 2px, transparent 2px, transparent 8px)`,
          pointerEvents: "none",
        }}
      />

      {/* Main Content */}
      <div
        style={{
          ...card(),
          position: "relative",
          zIndex: 2,
          maxWidth: 550,
          width: "90%",
          padding: "48px 40px",
          textAlign: "center",
          background: `linear-gradient(135deg, ${T.card} 0%, ${T.bg2} 100%)`,
          border: `1px solid ${T.borderHov}`,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
          transform: `perspective(1000px) rotateX(${mousePos.y * 0.05}deg) rotateY(${mousePos.x * 0.05}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Animated 404 Number */}
        <div
          style={{
            position: "relative",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 140,
              fontWeight: 900,
              background: `linear-gradient(135deg, ${T.gold} 0%, ${T.amber} 50%, ${T.goldD} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              textShadow: "0 0 30px rgba(205,133,63,0.3)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            404
          </div>

          {/* Decorative Wooden Frame Effect */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 180,
              height: 180,
              border: `2px solid ${T.gold}20`,
              borderRadius: "50%",
              animation: "ripple 2s ease-out infinite",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 220,
              height: 220,
              border: `1px solid ${T.gold}10`,
              borderRadius: "50%",
              animation: "ripple 2s ease-out infinite 0.5s",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Error Message */}
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              color: T.text,
              fontSize: 24,
              fontWeight: 800,
              marginBottom: 12,
              letterSpacing: "-0.02em",
            }}
          >
            Oops! Page Not Found
          </h2>
          <p
            style={{
              color: T.textSub,
              fontSize: 13,
              lineHeight: 1.6,
              marginBottom: 8,
            }}
          >
            The page you're looking for seems to have wandered off into the
            woods.
          </p>
          <p
            style={{
              color: T.textMut,
              fontSize: 12,
            }}
          >
            It might have been moved, deleted, or perhaps it never existed.
          </p>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            marginBottom: 32,
            flexWrap: "wrap",
          }}
        >
          <Btn onClick={() => onNav("dashboard")} size="lg">
            <Ic.Store /> Back to Dashboard
          </Btn>
          <Btn variant="ghost" size="lg" onClick={() => window.history.back()}>
            <Ic.ChevRight /> Go Back
          </Btn>
        </div>

        {/* Helpful Links */}
        <div
          style={{
            paddingTop: 24,
            borderTop: `1px solid ${T.border}`,
          }}
        >
          <p
            style={{
              color: T.textMut,
              fontSize: 10,
              marginBottom: 12,
              letterSpacing: "0.07em",
            }}
          >
            YOU MIGHT BE LOOKING FOR
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Dashboard", icon: <Ic.Dashboard />, nav: "dashboard" },
              { label: "New Sale", icon: <Ic.Sale />, nav: "sales/new" },
              {
                label: "Sale History",
                icon: <Ic.History />,
                nav: "sales/history",
              },
              {
                label: "Installments",
                icon: <Ic.Installment />,
                nav: "sales/installments",
              },
            ].map((link) => (
              <button
                key={link.label}
                onClick={() => onNav(link.nav)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  background: "rgba(139,90,43,0.1)",
                  border: `1px solid ${T.border}`,
                  borderRadius: 20,
                  color: T.textSub,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(205,133,63,0.2)";
                  e.currentTarget.style.color = T.gold;
                  e.currentTarget.style.borderColor = T.gold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(139,90,43,0.1)";
                  e.currentTarget.style.color = T.textSub;
                  e.currentTarget.style.borderColor = T.border;
                }}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Furniture Icon Decoration */}
        <div
          style={{
            position: "absolute",
            bottom: -20,
            right: -20,
            fontSize: 80,
            opacity: 0.05,
            pointerEvents: "none",
            transform: "rotate(-15deg)",
          }}
        >
          🛋️
        </div>
        <div
          style={{
            position: "absolute",
            top: -20,
            left: -20,
            fontSize: 60,
            opacity: 0.05,
            pointerEvents: "none",
            transform: "rotate(10deg)",
          }}
        >
          🪑
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
          }
        }

        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.5;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
