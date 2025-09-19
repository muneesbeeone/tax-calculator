import { useEffect, useRef } from "react";

const AdSense = ({
  slot,
  style = { display: "block" },
  format = "auto",
  responsive = true,
  className = "",
  adType = "banner",
}) => {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        if (window.adsbygoogle && adRef.current) {
          // clear and re-push so it always reloads
          window.adsbygoogle.push({});
        }
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, [slot]); // rerun when slot changes

  const adStyle = {
    ...style,
    minHeight: adType === "banner" ? "90px" : "250px",
    minWidth: "320px",
    ...(responsive && {
      width: "100%",
      height: "auto",
    }),
  };

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-4391323106927085"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
};

export default AdSense;
