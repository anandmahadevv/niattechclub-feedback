import * as React from "react";
import { UpgradeBanner } from "@/components/ui/upgrade-banner";
import { useNavigate, useLocation } from "react-router-dom";

function UpgradeBannerDemo() {
  const [isVisible, setIsVisible] = React.useState(() => {
    const dismissedAt = localStorage.getItem("upgrade-banner-dismissed-v2");
    if (dismissedAt) {
      if (Date.now() - parseInt(dismissedAt, 10) < 60000) {
        return false;
      } else {
        localStorage.removeItem("upgrade-banner-dismissed-v2");
        return true;
      }
    }
    return true;
  });

  React.useEffect(() => {
    const dismissedAt = localStorage.getItem("upgrade-banner-dismissed-v2");
    if (dismissedAt) {
      const timePassed = Date.now() - parseInt(dismissedAt, 10);
      if (timePassed < 60000) {
        const timer = setTimeout(() => {
          setIsVisible(true);
          localStorage.removeItem("upgrade-banner-dismissed-v2");
        }, 60000 - timePassed);
        return () => clearTimeout(timer);
      }
    }
  }, []);
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname !== "/") {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("upgrade-banner-dismissed-v2", Date.now().toString());
    setTimeout(() => {
      setIsVisible(true);
      localStorage.removeItem("upgrade-banner-dismissed-v2");
    }, 60000);
  };

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4 flex justify-center pointer-events-none">
      <div className="pointer-events-auto">
        {!isVisible ? null : (
          <UpgradeBanner
            buttonText="See Student Projects"
            description="and our latest achievements!"
            onClose={handleClose}
            onClick={() => {
              navigate("/showcase");
            }}
          />
        )}
      </div>
    </div>
  );
}

export { UpgradeBannerDemo };
