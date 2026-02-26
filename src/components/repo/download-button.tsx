"use client"

import React, { useCallback, useRef, useState } from "react"

export interface OsmoDownloadButtonProps {
  src?: string
  fileName?: string
  label?: string
  successLabel?: string
  backgroundColor?: string
  hoverColor?: string
  textColor?: string
  className?: string
}

type DownloadState = "idle" | "downloading" | "ready" | "fallback"

export default function OsmoDownloadButton({
  src = "https://example.com/file.pdf",
  fileName = "",
  label = "Download",
  successLabel = "Downloaded!",
  backgroundColor = "#0065e1",
  hoverColor = "#0a75f8",
  textColor = "#f2f2f2",
  className,
}: OsmoDownloadButtonProps) {
  const [state, setState] = useState<DownloadState>("idle")
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [displayLabel, setDisplayLabel] = useState(label)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerDownload = useCallback((url: string, name: string) => {
    const a = document.createElement("a")
    a.href = url
    if (name) a.download = name
    a.rel = "noopener"
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [])

  const showSuccessAndReset = useCallback(() => {
    setDisplayLabel(successLabel)
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    resetTimerRef.current = setTimeout(() => {
      setState("idle")
      setDisplayLabel(label)
    }, 3000)
  }, [successLabel, label])

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      if (state === "downloading") return
      if (!src) return
      const urlObj = new URL(src, window.location.href)
      const urlFilePart = urlObj.pathname.split("/").pop() || "download"
      const resolvedFileName = fileName || urlFilePart
      try {
        setState("downloading")
        const res = await fetch(src, { mode: "cors", credentials: "omit" })
        if (!res.ok) throw new Error("bad status")
        const blob = await res.blob()
        const objectUrl = URL.createObjectURL(blob)
        setState("ready")
        triggerDownload(objectUrl, resolvedFileName)
        showSuccessAndReset()
        setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000)
      } catch {
        setState("fallback")
        triggerDownload(src, resolvedFileName)
        showSuccessAndReset()
      }
    },
    [src, fileName, state, triggerDownload, showSuccessAndReset]
  )

  const isActive = isHovered || isFocused
  const isIdle = state === "idle"
  const isReady = state === "ready" || state === "fallback"

  return (
    <button
      className={className}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        columnGap: "0.625em", rowGap: "0.625em", color: textColor,
        backgroundColor: isActive && isIdle ? hoverColor : backgroundColor,
        borderRadius: "0.5em", justifyContent: "center", alignItems: "center",
        padding: "0.75em 1.5em 0.75em 1em", display: "flex", border: "none",
        cursor: state === "downloading" ? "wait" : "pointer",
        transition: "0.25s background-color ease",
        pointerEvents: state === "downloading" ? "none" : "auto",
      }}
    >
      <span
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: "100em",
          flex: "none", justifyContent: "center", alignItems: "center",
          width: "2.5em", height: "2.5em", padding: 0, display: "flex",
          position: "relative",
          clipPath: isReady ? "inset(0.35em round 100em)" : "inset(0em round 100em)",
          transition: `0.5s clip-path cubic-bezier(0.625, 0.05, 0, 1)${isReady ? ", transition-delay: 0.15s" : ""}`,
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 16 16" fill="none"
          style={{ justifyContent: "center", alignItems: "center", width: "1em", height: "1em", display: "flex", overflow: "visible" }}>
          <g clipPath="url(#osmo-dl-clip)">
            <path d="M8.74902 10.7734L12.4688 7.05371L13.5293 8.11426L7.99902 13.6445L2.46875 8.11426L3.5293 7.05371L7.24902 10.7734V0.0830078H8.74902V10.7734Z" fill="currentColor"
              style={{ transition: "0.5s transform cubic-bezier(0.625, 0.05, 0, 1)", transform: isReady ? "translate(0px, 200%)" : isActive && isIdle ? "translate(0px, -30%)" : "translate(0px, 0px)" }} />
            <path d="M15.5 14.75V16.25H0.5V14.75H15.5Z" fill="currentColor"
              style={{ transformOrigin: "center center", transition: `0.5s transform cubic-bezier(0.625, 0.05, 0, 1)${isReady ? "; transition-delay: 0.1s" : ""}`, transform: isReady ? "scale(0, 1)" : isActive && isIdle ? "scale(1.2, 1)" : "scale(1, 1)" }} />
          </g>
          <defs><clipPath id="osmo-dl-clip"><rect width="16" height="16" fill="white" /></clipPath></defs>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 20 20" fill="none"
          style={{ position: "absolute", justifyContent: "center", alignItems: "center", width: "1em", height: "1em", display: "flex", overflow: "visible" }}>
          <path d="M2 9.5L8 15.5L19 4.5" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeDasharray="25"
            strokeDashoffset={isReady ? "0" : "25"}
            style={{ transition: `0.4s stroke-dashoffset cubic-bezier(0.625, 0.05, 0, 1)${isReady ? "; transition-delay: 0.25s" : ""}` }} />
        </svg>
      </span>
      <span style={{ fontSize: "1.5em", fontWeight: 500, lineHeight: 1.2 }}>{displayLabel}</span>
    </button>
  )
}
