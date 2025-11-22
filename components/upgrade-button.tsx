"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export function UpgradeButton() {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Failed to start checkout")
      }
    } catch (error) {
      console.error(error)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleUpgrade} 
      disabled={loading}
      className="w-full bg-white text-black hover:bg-gray-200 font-bold"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upgrade to Pro ($10)"}
    </Button>
  )
}
