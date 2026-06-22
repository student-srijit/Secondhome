"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, CheckCircle2, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

interface EmailInquiryModalProps {
  isOpen: boolean
  onClose: () => void
  propertyName: string
  ownerEmail?: string
}

export function EmailInquiryModal({ isOpen, onClose, propertyName, ownerEmail }: EmailInquiryModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSending, setIsSending] = useState(false)

  // Initialize the message content when the modal opens or user details change
  useEffect(() => {
    if (isOpen) {
      let initialBody = `Hi,\n\nI am interested in booking "${propertyName}".\n\n`
      
      if (user) {
        initialBody += `Here are my details:\n`
        if (user.name) initialBody += `Name: ${user.name}\n`
        if (user.email) initialBody += `Email: ${user.email}\n`
        if ((user as any).phone) initialBody += `Phone: ${(user as any).phone}\n`
        initialBody += `\n`
      }
      
      initialBody += `Please let me know the next steps for completing this booking.\n\nThank you.`
      setMessage(initialBody)
      setIsSuccess(false)
      setIsSending(false)
    }
  }, [isOpen, propertyName, user])

  const handleConfirm = async () => {
    if (!ownerEmail) {
      toast({
        title: "Error",
        description: "Property owner email is not available.",
        variant: "destructive"
      })
      onClose()
      return
    }

    if (!message.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message before sending.",
        variant: "destructive"
      })
      return
    }

    const subject = `Booking Inquiry: ${propertyName}`

    setIsSending(true)

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: ownerEmail,
          subject,
          body: message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email")
      }

      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "Failed to send",
        description: error instanceof Error ? error.message : "Something went wrong while sending the email.",
        variant: "destructive"
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setIsSuccess(false)
        onClose()
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 flex flex-col items-center text-center space-y-4"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Email Sent!</h3>
              <p className="text-muted-foreground">The property owner has been notified.</p>
            </div>
          </motion.div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Contact Owner</DialogTitle>
              <DialogDescription>
                Review and edit your inquiry for <strong>{propertyName}</strong> before sending.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea 
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[200px]"
                  placeholder="Type your message here..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isSending}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm} 
                disabled={isSending}
                className="bg-gradient-to-r from-primary to-orange-600 text-white"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Confirm & Send Email
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
