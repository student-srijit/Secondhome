"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, ChevronUp } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    category: "Account & Registration",
    questions: [
      {
        question: "How do I create an account on Second Home?",
        answer:
          "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. Fill in your details including name, email address, and password. You can also sign up using your Google or Facebook account for quicker registration.",
      },
      {
        question: "Can I use Second Home without creating an account?",
        answer:
          "Yes, you can browse listings and search for properties without creating an account. However, to book accommodations, contact property owners, or list your own property, you'll need to create an account.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "If you've forgotten your password, click on 'Log In', then select 'Forgot Password'. Enter your email address, and we'll send you a link to reset your password. Follow the instructions in the email to create a new password.",
      },
    ],
  },
  {
    category: "Finding Accommodation",
    questions: [
      {
        question: "How do I search for properties on Second Home?",
        answer:
          "You can search for properties by entering your college name, area, or locality in the search bar on the homepage. You can further refine your search using filters such as property type, price range, and amenities.",
      },
      {
        question: "What types of accommodation can I find on Second Home?",
        answer:
          "Second Home offers various types of student accommodations including PGs (Paying Guest), hostels, flats/apartments, and shared houses. Each listing specifies the type of accommodation and available facilities.",
      },
      {
        question: "How accurate are the property locations shown on the map?",
        answer:
          "We strive to ensure all property locations are accurate. Property owners provide their exact address, which we verify. The map view shows the approximate location to give you an idea of the property's surroundings and nearby amenities.",
      },
      {
        question: "Can I filter properties based on specific amenities?",
        answer:
          "Yes, you can filter properties based on amenities such as WiFi, AC, attached bathroom, meals provided, laundry service, power backup, and more. Use the filter option on the listings page to select your required amenities.",
      },
    ],
  },
  {
    category: "Bookings & Payments",
    questions: [
      {
        question: "How do I book a property on Second Home?",
        answer:
          "To book a property, navigate to the property listing page and click on the 'Book Now' button. Select your preferred room type and check-in date, then proceed to payment. Once your booking is confirmed, you'll receive a confirmation email with all the details.",
      },
      {
        question: "What payment methods are accepted?",
        answer:
          "We accept various payment methods including credit/debit cards, UPI, net banking, and digital wallets like Paytm and Google Pay. All payments are processed securely through our payment partners.",
      },
      {
        question: "Is my payment secure?",
        answer:
          "Yes, all payments on Second Home are secure. We use industry-standard encryption and secure payment gateways to ensure your payment information is protected. We do not store your credit card details on our servers.",
      },
      {
        question: "What is the cancellation policy?",
        answer:
          "Cancellation policies vary by property. Each property listing includes its specific cancellation policy, which you should review before booking. In general, cancellations made at least 7 days before check-in are eligible for a full refund minus processing fees.",
      },
      {
        question: "Do I need to pay a security deposit?",
        answer:
          "Most properties require a security deposit, which is refundable at the end of your stay, subject to the condition of the property. The security deposit amount is specified on the property listing page and is collected along with your first month's rent.",
      },
    ],
  },
  {
    category: "Property Listings",
    questions: [
      {
        question: "How do I list my property on Second Home?",
        answer:
          "To list your property, click on 'List Your Property' in the navigation menu. You'll need to create an account if you don't already have one, then fill out the property details form including location, amenities, room types, pricing, and upload clear photos of your property.",
      },
      {
        question: "Is there a fee for listing my property?",
        answer:
          "Basic property listings are free. We offer premium listing options for better visibility and additional features, which come with a nominal fee. You can upgrade to a premium listing at any time from your dashboard.",
      },
      {
        question: "How long does it take for my property to be listed?",
        answer:
          "Once submitted, your property listing goes through a verification process which typically takes 24-48 hours. We verify the information provided to ensure quality and authenticity. You'll receive an email notification once your listing is approved and live on the platform.",
      },
    ],
  },
  {
    category: "Reviews & Ratings",
    questions: [
      {
        question: "How do I leave a review for a property?",
        answer:
          "You can leave a review for a property after you've stayed there. Go to your bookings in your account dashboard, find the completed booking, and click on 'Write a Review'. You can rate different aspects of your stay and write a detailed review of your experience.",
      },
      {
        question: "Are all reviews genuine?",
        answer:
          "Yes, we ensure all reviews are from verified guests who have actually stayed at the property. We have measures in place to detect and prevent fake reviews. Property owners cannot remove negative reviews, ensuring transparency for future guests.",
      },
      {
        question: "Can I edit or delete my review after posting?",
        answer:
          "You can edit your review within 14 days of posting. After that, the review becomes permanent. If you wish to delete your review, you can do so at any time from your account dashboard.",
      },
    ],
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "What should I do if I encounter a technical issue?",
        answer:
          "If you encounter any technical issues while using our platform, please contact our support team at second.home2k25@gmail.com or WhatsApp us at +91 73846 62005. Include details of the issue, screenshots if possible, and the device and browser you're using to help us resolve the problem quickly.",
      },
      {
        question: "Is the Second Home website mobile-friendly?",
        answer:
          "Yes, our website is fully responsive and optimized for mobile devices. You can access all features of Second Home on your smartphone or tablet. We also have a mobile app available for download on iOS and Android for an enhanced mobile experience.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  const toggleCategory = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(category)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground mb-8">Find answers to common questions about Second Home</p>

            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for questions..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No results found for "{searchQuery}"</p>
                <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">
                  Clear search
                </Button>
              </div>
            ) : (
              filteredFaqs.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div
                    className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleCategory(category.category)}
                  >
                    <h2 className="text-xl font-bold">{category.category}</h2>
                    {expandedCategory === category.category ? (
                      <ChevronUp className="h-5 w-5 text-primary" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-primary" />
                    )}
                  </div>

                  {expandedCategory === category.category && (
                    <div className="px-6 pb-6">
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((faq, faqIndex) => (
                          <AccordionItem key={faqIndex} value={`item-${faqIndex}`}>
                            <AccordionTrigger className="text-left text-[15px]">{faq.question}</AccordionTrigger>
                            <AccordionContent>
                              <p className="text-muted-foreground">{faq.answer}</p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Still have questions? We're here to help.</p>
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
