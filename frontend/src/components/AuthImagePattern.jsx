const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="flex items-center justify-center bg-base-200 p-12 border-none">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8 border-none">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="aspect-square w-20 h-20 rounded-2xl bg-gray-500 animate-pulse"
              style={{ animationDelay: `${i * 0.5}s` }} // Staggered effect
            />
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
