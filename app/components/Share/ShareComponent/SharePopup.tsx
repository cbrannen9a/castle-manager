import { useState, useEffect, useRef } from "react";

function SharePopup({ shareData, onClose, onError }: Props) {
  const [state, setState] = useState<ShareState>("pending");
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state === "success") {
      timer.current = setInterval(() => setState("pending"), 3000);
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [state]);

  const copyClicked = async () => {
    try {
      await navigator.clipboard.writeText(shareData?.url || "");
      setState("success");
    } catch (err) {
      onError && onError(err);
      setState("error");
    }
  };

  const getButtonText = (state: ShareState) => {
    switch (state) {
      case "success":
        return "Link copied";
      case "pending":
      default:
        return "Copy link";
    }
  };

  return (
    <div className="fixed inset-0 z-10 bg-gray-500 bg-opacity-75 transition-opacity">
      <div className="fixed inset-0 z-20 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-start justify-between p-4">
                <h3 className="prose mb-2 text-lg font-medium leading-6 text-gray-900">
                  {shareData.title}
                </h3>

                <button className="flex-end ml-4" onClick={onClose}>
                  <span className="sr-only">Close menu</span>
                  <div className="h-6 w-6" aria-hidden="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g id="close">
                        <path
                          id="x"
                          d="M18.717 6.697l-1.414-1.414-5.303 5.303-5.303-5.303-1.414 1.414 5.303 5.303-5.303 5.303 1.414 1.414 5.303-5.303 5.303 5.303 1.414-1.414-5.303-5.303z"
                        />
                      </g>
                    </svg>
                  </div>
                </button>
              </div>
              <div className="m-2">
                {state === "error" ? (
                  <div className="mb-2 rounded-md border-2 border-red-600 p-2">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        className="h-6 w-6 text-red-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div className="m-2">
                      <p className="prose text-center text-sm text-red-500">
                        Unable to copy to clipboard, please manually copy the
                        url to share.
                      </p>
                    </div>
                  </div>
                ) : null}
                <input
                  className="prose mb-4 w-full overflow-hidden rounded-md border-2 border-gray-500 p-2"
                  value={shareData.url}
                  readOnly
                />

                <button
                  className="mx-auto flex w-56 flex-row justify-center rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
                  onClick={copyClicked}
                >
                  {getButtonText(state)}
                  {state === "success" ? (
                    <svg
                      className="ml-2"
                      aria-hidden="true"
                      height="20"
                      viewBox="0 0 16 16"
                      width="20"
                    >
                      <path
                        fillRule="evenodd"
                        fill="currentColor"
                        stroke="currentColor"
                        d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
                      ></path>
                    </svg>
                  ) : null}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type ShareState = "pending" | "success" | "error";

interface Props {
  shareData: ShareData;
  onClose: () => void;
  onError?: (error?: unknown) => void;
}

export default SharePopup;
