/**
 * Button variants:
 *   primary   — filled orange (main CTA)
 *   secondary — outlined blue
 *   ghost     — no border, just text
 */
export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
}) {
  const base =
    "tracking-wide cursor-pointer transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-3 text-base border-2";

  const variants = {
    primary:
      "bg-spicy-orange border-spicy-orange text-ivory hover:bg-dark-wine hover:border-dark-wine",
    secondary:
      "bg-transparent border-yale-blue text-yale-blue hover:bg-yale-blue hover:text-ivory",
    ghost:
      "bg-transparent border-transparent text-yale-blue hover:text-spicy-orange",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}