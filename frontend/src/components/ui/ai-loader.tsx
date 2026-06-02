import * as React from "react";

interface LoaderProps {
  size?: number; 
  text?: string;
}

export const Component: React.FC<LoaderProps> = ({ size = 180, text = "Generating" }) => {
  const letters = text.split("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white transition-colors duration-300">
      {/* Subtle grid/dot background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(244, 244, 244, 0.85)_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
      
      {/* Soft ambient orange/red glow in the center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-red-100/30 dark:bg-red-950/20 rounded-full blur-3xl pointer-events-none animate-pulse duration-[3000ms]" />

      <div
        className="relative flex items-center justify-center font-inter select-none"
        style={{ width: size, height: size }}
      >
        {letters.map((letter, index) => (
          <span
            key={index}
            className="inline-block text-black dark:text-[#bd3c0d] font-extrabold tracking-wider opacity-40 animate-loaderLetter"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter}
          </span>
        ))}

        <div
          className="absolute inset-0 rounded-full animate-loaderCircle"
        ></div>
      </div>

      <style>{`
        @keyframes loaderCircle {
          0% {
            transform: rotate(90deg);
            box-shadow:
              0 6px 12px 0 #efedbdff inset,
              0 12px 18px 0 #e7af38ff inset,
              0 36px 36px 0 #e17313ff inset,
              0 0 3px 1.2px rgba(207, 87, 87, 0.3),
              0 0 6px 1.8px rgba(235, 110, 33, 0.2);
          }
          50% {
            transform: rotate(270deg);
            box-shadow:
              0 6px 12px 0 #dc8a46ff inset,
              0 12px 6px 0 #a9591cff inset,
              0 24px 36px 0 #aa530dff inset,
              0 0 3px 1.2px rgba(204, 83, 83, 0.3),
              0 0 6px 1.8px rgba(172, 62, 62, 0.2);
          }
          100% {
            transform: rotate(450deg);
            box-shadow:
              0 6px 12px 0 #fd9f4dff inset,
              0 12px 18px 0 #ff7700ff inset,
              0 36px 36px 0 #cf5757ff inset,
              0 0 3px 1.2px rgba(207, 87, 87, 0.3),
              0 0 6px 1.8px rgba(235, 110, 33, 0.2);
          }
        }

        @keyframes loaderLetter {
          0%,
          100% {
            opacity: 0.4;
            transform: translateY(0);
          }
          20% {
            opacity: 1;
            transform: scale(1.15);
          }
          40% {
            opacity: 0.7;
            transform: translateY(0);
          }
        }

        .animate-loaderCircle {
          animation: loaderCircle 5s linear infinite;
        }

        .animate-loaderLetter {
          animation: loaderLetter 3s infinite;
        }
      `}</style>
    </div>
  );
};
