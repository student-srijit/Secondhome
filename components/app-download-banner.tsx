"use client"

import { useState } from "react"
import { Smartphone, Download } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/providers/language-provider"

export function AppDownloadBanner() {
  const [contact, setContact] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { t } = useLanguage()

  const apkLink = "https://github.com/AdityaShome/SecondHome-releases/releases/download/v1.0.0/SecondHome.apk"

  const handleSendLink = async () => {
    if (!contact.trim() || !contact.includes("@")) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/send-app-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact }),
      })
      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Email Sent! 🚀",
          description: data.message,
          style: { backgroundColor: "#10b981", color: "#fff" }, // Success green
        })
        setContact("")
      } else {
        throw new Error(data.error || "Failed to send link")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-12 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left / Middle Content */}
          <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start w-full">
            {/* Phone Illustration */}
            <div className="hidden lg:flex items-center justify-center w-24 h-24 bg-orange-50 rounded-full flex-shrink-0">
              <Smartphone className="w-12 h-12 text-orange-500" />
            </div>

            <div className="flex-1 w-full space-y-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                  Download App Now !
                </h2>
                <p className="text-gray-500 mt-1">
                  Use code <span className="font-bold text-gray-900">WELCOME500</span> and get <span className="font-bold text-gray-900">FLAT ₹500 OFF*</span> on your first booking
                </p>
              </div>

              {/* Input & Button */}
              <div className="flex flex-col sm:flex-row max-w-lg mt-4">
                <div className="flex flex-1 items-center border border-gray-300 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none bg-white overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all">
                  <input 
                    type="email" 
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Enter Email address"
                    className="flex-1 px-4 py-3 outline-none text-gray-800 placeholder:text-gray-400 w-full"
                  />
                </div>
                <Button 
                  onClick={handleSendLink}
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-6 sm:rounded-l-none sm:rounded-r-lg rounded-b-lg sm:rounded-bl-none h-auto w-full sm:w-auto uppercase tracking-wide"
                >
                  {isLoading ? "Sending..." : "Get App Link"}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Content - Badges & QR */}
          <div className="flex flex-col sm:flex-row items-center gap-6 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
            <div className="flex flex-row md:flex-col gap-3 w-full sm:w-auto">
              {/* Direct APK Download Button */}
              <a 
                href={apkLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white px-6 py-4 rounded-xl transition-transform hover:scale-105 w-full shadow-lg"
              >
                <Download className="w-6 h-6" />
                <div className="flex flex-col items-start">
                  <span className="text-[10px] uppercase tracking-wider leading-none opacity-80">Direct Download</span>
                  <span className="text-[16px] font-bold leading-tight mt-0.5">Download Our App</span>
                </div>
              </a>
            </div>

            <div className="hidden sm:flex flex-col items-center">
              <div className="p-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                <QRCodeSVG 
                  value={apkLink} 
                  size={100} 
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
