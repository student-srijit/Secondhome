"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export function SplashScreen() {
  const [isMounted, setIsMounted] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash")
    if (!hasSeenSplash) {
      setShow(true)
      // Allow 3.5 seconds for the user to admire the splash screen before dismissing it
      const timer = setTimeout(() => {
        setShow(false)
        sessionStorage.setItem("hasSeenSplash", "true")
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [])

  // Avoid hydration mismatch by not rendering anything until mounted
  if (!isMounted) return null

  // If we shouldn't show it and we've mounted, we can just render nothing instead of wrapping with AnimatePresence
  // But to get the exit animation, AnimatePresence must be present when show becomes false.
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#0a0f1c]"
        >
          {/* Background Glows */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-orange-500/15 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
          </div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Logo */}
            <motion.div 
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
              className="w-28 h-28 md:w-36 md:h-36 mb-8 relative"
            >
               <Image 
                 src="/sechome favicon.png" 
                 alt="Second Home Logo" 
                 fill 
                 className="object-contain drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]" 
                 priority
               />
            </motion.div>
            
            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white flex items-center">
              Second<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Home</span>
            </h1>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-6 text-slate-300 text-lg md:text-xl font-medium tracking-wide text-center max-w-sm px-4"
            >
              Your Perfect Accommodation Near College
            </motion.p>
          </motion.div>

          {/* Loading Progress Bar */}
          <motion.div
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ delay: 0.5, duration: 2.8, ease: "easeInOut" }}
             className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600 w-full origin-left shadow-[0_0_15px_rgba(249,115,22,0.8)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
