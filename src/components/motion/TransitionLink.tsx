"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { navigateWithTransition } from "./PageTransition";
import { scrollToTarget } from "./SmoothScroll";

type Props = ComponentProps<typeof Link> & { href: string };

/**
 * Internal link that plays the page curtain between routes and scrolls
 * smoothly to #anchors on the current page.
 */
export function TransitionLink({ href, onClick, ...rest }: Props) {
  const router = useRouter();

  function handle(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const url = new URL(href, window.location.href);
    if (url.pathname === window.location.pathname) {
      e.preventDefault();
      if (url.hash) {
        const el = document.querySelector<HTMLElement>(url.hash);
        if (el) {
          scrollToTarget(el);
          history.replaceState(null, "", url.hash);
          el.focus({ preventScroll: true });
        }
      } else scrollToTarget(0);
      return;
    }
    e.preventDefault();
    navigateWithTransition(href, router.push);
  }

  return <Link href={href} onClick={handle} {...rest} />;
}
