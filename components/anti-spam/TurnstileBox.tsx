"use client";

import { useEffect, useRef } from "react";

type TurnstileBoxProps = {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (errorCode?: string) => void;
  className?: string;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          appearance?: "always" | "execute" | "interaction-only";
          retry?: "off" | "auto";
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: (errorCode?: string) => void;
        }
      ) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

const TURNSTILE_EVENT = "turnstile-loaded";

export default function TurnstileBox({
  siteKey,
  onVerify,
  onExpire,
  onError,
  className,
}: TurnstileBoxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey) {
      console.warn("[Turnstile] Missing siteKey");
      return;
    }

    let isActive = true;

    const renderWidget = () => {
      if (!isActive) return;
      if (widgetIdRef.current) return;
      if (!containerRef.current || typeof window === "undefined" || !window.turnstile) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        appearance: "interaction-only",
        retry: "auto",
        callback: (token) => {
          onVerify(token);
        },
        "expired-callback": () => {
          onExpire?.();
          if (widgetIdRef.current && window.turnstile) {
            try {
              window.turnstile.reset(widgetIdRef.current);
            } catch (error) {
              // ignore reset failures
            }
          }
        },
        "error-callback": (errorCode) => {
          onError?.(errorCode);
          console.warn("[Turnstile error]", errorCode);
        },
      });
    };

    renderWidget();

    const handleLoaded = () => renderWidget();
    window.addEventListener(TURNSTILE_EVENT, handleLoaded);

    return () => {
      isActive = false;
      window.removeEventListener(TURNSTILE_EVENT, handleLoaded);
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (error) {
          // ignore remove failures
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onVerify, onExpire, onError]);

  return <div ref={containerRef} className={className} />;
}
