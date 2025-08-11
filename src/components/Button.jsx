import { useNavigate } from "react-router-dom";

export default function Button({
  children,
  onClick,
  to,
  className = "",
  disabled = false,
  loading = false,
  loadingContent = "Loading...",
  type = "button",
  ...rest
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (disabled || loading) return;
    if (to) navigate(to);
    if (onClick) onClick(e);
  };

  return (
    <button
      type={type}
      className={`btn ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading ? loadingContent : children}
    </button>
  );
}
