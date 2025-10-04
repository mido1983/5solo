"use client";

import { useCallback, useEffect, useRef } from "react";

type TurnstileWidgetProps = {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export default function TurnstileWidget({
  siteKey,
  onVerify,
  onExpire,
  onError,
  className,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKeyRef = useRef(siteKey);

  const renderWidget = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!siteKey || !window.turnstile || !containerRef.current) return;

    if (widgetIdRef.current && siteKeyRef.current === siteKey) {
      window.turnstile.reset(widgetIdRef.current);
      return;
    }

    if (widgetIdRef.current && siteKeyRef.current !== siteKey) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }

    siteKeyRef.current = siteKey;
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token) => {
        onVerify(token);
      },
      "expired-callback": () => {
        onExpire?.();
        if (widgetIdRef.current) {
          window.turnstile?.reset(widgetIdRef.current);
        }
      },
      "error-callback": () => {
        onError?.();
        if (widgetIdRef.current) {
          window.turnstile?.reset(widgetIdRef.current);
        }
      },
    });
  }, [siteKey, onVerify, onExpire, onError]);

  useEffect(() => {
    if (typeof window === "undefined" || !siteKey) {
      return;
    }

    const handleTurnstileLoaded = () => {
      renderWidget();
    };

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (script) {
      if (window.turnstile) {
        renderWidget();
      }
    } else {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    script?.addEventListener("load", handleTurnstileLoaded, { once: true });
    window.addEventListener("turnstile-loaded", handleTurnstileLoaded);

    return () => {
      script?.removeEventListener("load", handleTurnstileLoaded);
      window.removeEventListener("turnstile-loaded", handleTurnstileLoaded);
    };
  }, [renderWidget, siteKey]);

  useEffect(() => {
    return () => {
      if (typeof window === "undefined") return;
      if (widgetIdRef.current) {
        try {
          window.turnstile?.remove(widgetIdRef.current);
        } catch (error) {
          // Turnstile may not support remove in some browsers; safe to ignore.
        }
      }
    };
  }, []);

  return <div ref={containerRef} className={className} data-testid="turnstile-widget" />;
}
