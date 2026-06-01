import * as React from "react";
import { UpgradeBanner } from "@/components/ui/upgrade-banner";
import { useNavigate, useLocation } from "react-router-dom";

function UpgradeBannerDemo() {
  const [isVisible, setIsVisible] = React.useState(() => {
    return localStorage.getItem("upgrade-banner-dismissed-v2") !== "true";
  });
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname !== "/") {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("upgrade-banner-dismissed-v2", "true");
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
