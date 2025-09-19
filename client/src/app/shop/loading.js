export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin">
            <div 
              className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent rounded-full animate-spin"
              style={{ 
                borderTopColor: "#ee2b8c",
                animationDuration: "1s" 
              }}
            ></div>
          </div>
        </div>

        {/* Logo */}
        <div className="w-8 h-8" style={{ color: "#ee2b8c" }}>
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              clipRule="evenodd"
              d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Sweet Delights</h2>
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading your sweet experience...
          </p>
        </div>

        {/* Dots */}
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-[#ee2b8c] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#ee2b8c] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-[#ee2b8c] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  );
}