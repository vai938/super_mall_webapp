const GlassCard = ({ children, className = "" }) => {
  return (
    <div
      className={`
        bg-white/10 backdrop-blur-xl
        border border-white/20
        shadow-xl rounded-2xl
        p-6 ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
