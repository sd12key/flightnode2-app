import { useNavigate } from "react-router-dom";

export default function Button({
  children,
  onClick,
  to,
  className = "",
  disabled = false,
  loading = false,
  loadingContent = ".....",
  type = "button",
  ...rest
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (disabled || loading) return;
    console.log("button clicked");

    e.preventDefault();
    e.stopPropagation();

    if (to) navigate(to);
    if (onClick) onClick(e);
  };

  return (
    <button
      type={type || "button"}
      className={`btn ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? loadingContent : children}
    </button>
  );
}
