import { RobotLogo } from "@/components/ui/robot-logo"
import Link from "next/link"
import { LoginForm } from "./login-form"

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string; error: string }
}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 font-mono text-sm text-gray-400 hover:text-white">
        <RobotLogo className="w-6 h-6" />
        NOTAROBOT.COM
      </Link>

      <LoginForm searchParams={searchParams} />
    </div>
  )
}
