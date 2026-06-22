"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function SplashScreen() {
  const [isMounted, setIsMounted] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    try {
      // Use localStorage so it persists across tabs/windows, not just one session tab
      const hasSeenSplash = localStorage.getItem("hasSeenSplash")
      
      // If we want it to reset occasionally, we could store a timestamp.
      // But for now, we'll just check if it exists.
      if (!hasSeenSplash) {
        setShow(true)
        // Allow 2 seconds for a fast, snappy splash screen
        const timer = setTimeout(() => {
          setShow(false)
          localStorage.setItem("hasSeenSplash", "true")
        }, 2000)
        return () => clearTimeout(timer)
      }
    } catch (e) {
      // Ignore if localStorage is not available
      console.error("LocalStorage error", e)
    }
  }, [])

  // Avoid hydration mismatch by not rendering anything until mounted
  if (!isMounted) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#0a0f1c]"
        >
          {/* Background Glows */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-orange-500/15 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
          </div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Logo */}
            <motion.div 
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, type: "spring", stiffness: 120 }}
              className="w-24 h-24 md:w-32 md:h-32 mb-6 relative"
            >
               <img 
                 src="/sechome%20favicon.png" 
                 alt="Second Home Logo" 
                 className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]" 
               />
            </motion.div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white flex items-center">
              Second<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Home</span>
            </h1>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-4 text-slate-300 text-base md:text-lg font-medium tracking-wide text-center max-w-sm px-4"
            >
              Your Perfect Accommodation
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
