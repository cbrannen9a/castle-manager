import { useState } from "react";
import ShareController from "./ShareController";
import SharePopup from "./SharePopup";

function Share({
  className,
  shareData,
  children,
  onInteraction,
  onSuccess,
  onError,
  disabled,
}: Props) {
  const [openPopup, setOpenPopup] = useState(false);

  const handleNonNativeShare = () => {
    setOpenPopup(true);
  };

  return (
    <>
      <ShareController
        className={className}
        shareData={shareData}
        onInteraction={onInteraction}
        onSuccess={onSuccess}
        onError={onError}
        onNonNativeShare={handleNonNativeShare}
        disabled={disabled}
      >
        {children}
      </ShareController>
      {openPopup ? (
        <SharePopup shareData={shareData} onClose={() => setOpenPopup(false)} />
      ) : null}
    </>
  );
}

interface Props {
  className: string;
  shareData: ShareData;
  children: React.ReactNode;
  onSuccess?: () => void;
  onError?: (error?: unknown) => void;
  onInteraction?: () => void;
  disabled?: boolean;
}

export default Share;
