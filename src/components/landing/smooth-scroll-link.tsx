"use client";

import Link, { type LinkProps } from "next/link";
import type React from "react";

interface SmoothScrollLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

export function SmoothScrollLink({
  children,
  className,
  ...props
}: SmoothScrollLinkProps) {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    const targetId = href.replace(/.*#/, "");
    const elem = document.getElementById(targetId);
    elem?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <Link
      {...props}
      onClick={props.href.toString().startsWith("#") ? handleScroll : undefined}
      className={className}
    >
      {children}
    </Link>
  );
}
