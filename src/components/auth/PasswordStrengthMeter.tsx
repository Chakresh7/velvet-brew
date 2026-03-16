interface Props {
  password: string;
}

function getStrength(pw: string): { level: number; label: string } {
  if (!pw || pw.length < 8) return { level: 1, label: "Weak" };
  const hasMixed = /[a-z]/.test(pw) && /[A-Z]/.test(pw);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  if (pw.length >= 12 && hasMixed && (hasSpecial || hasNumber)) return { level: 4, label: "Strong" };
  if (pw.length >= 8 && hasMixed) return { level: 3, label: "Good" };
  if (pw.length >= 8) return { level: 2, label: "Fair" };
  return { level: 1, label: "Weak" };
}

const COLORS = ["", "#C0392B", "#E67E22", "#D4AF37", "#27AE60"];

export default function PasswordStrengthMeter({ password }: Props) {
  if (!password) return null;
  const { level, label } = getStrength(password);

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-1 h-[3px] rounded-full transition-all duration-300"
            style={{
              background: i <= level ? COLORS[level] : "rgba(212,175,55,0.15)",
            }}
          />
        ))}
      </div>
      <span className="font-body text-[10px] mt-1 block" style={{ color: COLORS[level] }}>
        {label}
      </span>
    </div>
  );
}
