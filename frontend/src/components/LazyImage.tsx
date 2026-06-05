import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string;
}

export function LazyImage({ src, alt, className, skeletonClassName, ...props }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative w-full h-full ${skeletonClassName || ""}`}>
      {/* Skeleton / Loading Animation */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 bg-gray-200 animate-pulse flex items-center justify-center"
          >
            {/* Optional subtle spinner or icon */}
            <i className="fas fa-circle-notch fa-spin text-gray-400 text-xl"></i>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`${className || ""} ${
          isLoaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500`}
        {...props}
      />
    </div>
  );
}
