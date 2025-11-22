import { RobotLogo } from "@/components/ui/robot-logo"
import Link from "next/link"
import { LoginForm } from "./login-form"

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string; error: string }
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <LoginForm searchParams={searchParams} />
    </div>
  )
}
