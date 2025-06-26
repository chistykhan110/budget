export default function Spinner({ size = "md", color = "secondary", className = "" }) {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const colorMap = {
    primary: "border-blue-500",
    secondary: "border-gray-400",
    white: "border-white",
    success: "border-green-500",
    danger: "border-red-500",
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          ${sizeMap[size] || sizeMap.md}
          animate-spin
          rounded-full
          border-4
          border-t-transparent
          ${colorMap[color] || colorMap.primary}
        `}
        style={{
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      />
    </div>
  );
}
