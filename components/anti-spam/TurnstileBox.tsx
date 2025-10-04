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
          appearance?: "always" | "execute" | "interaction-only" | "managed";
          retry?: "off" | "auto";
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: (errorCode?: string) => void;
          "unsupported-callback"?: () => void;
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
  const hasRenderedRef = useRef(false);

  useEffect(() => {
    if (!siteKey) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Turnstile] Missing NEXT_PUBLIC_TURNSTILE_SITE_KEY");
      }
      return;
    }

    let isMounted = true;

    const renderWidgetOnce = () => {
      if (!isMounted || hasRenderedRef.current) return;
      if (!containerRef.current || typeof window === "undefined" || !window.turnstile) {
        return;
      }

      hasRenderedRef.current = true;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        appearance: "always",
        retry: "auto",
        callback: (token) => {
          onVerify(token);
        },
        "expired-callback": () => {
          onExpire?.();
          if (widgetIdRef.current && window.turnstile) {
            try {
              window.turnstile.reset(widgetIdRef.current);
            } catch {
              // ignore reset issues
            }
          }
        },
        "error-callback": (errorCode) => {
          onError?.(errorCode);
          if (widgetIdRef.current && window.turnstile) {
            try {
              window.turnstile.reset(widgetIdRef.current);
            } catch {
              // ignore reset issues
            }
          }
        },
        "unsupported-callback": () => {
          onError?.("unsupported");
          if (widgetIdRef.current && window.turnstile) {
            try {
              window.turnstile.reset(widgetIdRef.current);
            } catch {
              // ignore reset issues
            }
          }
        },
      });
    };

    renderWidgetOnce();

    window.addEventListener(TURNSTILE_EVENT, renderWidgetOnce);

    return () => {
      isMounted = false;
      window.removeEventListener(TURNSTILE_EVENT, renderWidgetOnce);
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore remove issues
        }
      }
      widgetIdRef.current = null;
      hasRenderedRef.current = false;
    };
  }, [siteKey, onVerify, onExpire, onError]);

  return <div id="cf-turnstile" ref={containerRef} className={className} />;
}
