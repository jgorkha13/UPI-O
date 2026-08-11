export default function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div className="relative w-11 h-6">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-full h-full rounded-full bg-bg-secondary border border-white/10 peer-checked:bg-accent/20 peer-checked:border-accent/40 transition-all duration-300 ease-smooth" />
        <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-text-secondary peer-checked:translate-x-5 peer-checked:bg-accent transition-all duration-300 ease-smooth shadow-sm" />
      </div>
      {label && <span className="text-sm text-text-secondary">{label}</span>}
    </label>
  );
}
