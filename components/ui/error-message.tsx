"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Bot, Skull, WifiOff, Lock, ServerCrash } from "lucide-react";
import { Button } from "./button";

// Error messages with dark humor
const ERROR_MESSAGES = {
  network: [
    "Connection lost. Either your wifi died or the robots cut the cables.",
    "Unable to reach our servers. The machines may be blocking you.",
    "Network error. Have you tried turning your humanity off and on again?",
  ],
  auth: [
    "Access denied. Prove you're human first.",
    "Authentication failed. Suspicious behavior detected.",
    "You don't have permission. That's exactly what a robot would try.",
  ],
  server: [
    "Our servers are having an existential crisis. Please wait.",
    "Something broke. We blame the robots.",
    "Internal error. The code became self-aware and panicked.",
  ],
  notFound: [
    "This doesn't exist. Maybe it never did.",
    "404: Reality not found at this location.",
    "The void is empty. As expected.",
  ],
  rateLimit: [
    "Slow down there, human. Even we have limits.",
    "Too many requests. Are you sure you're not a bot?",
    "Rate limited. Take a breath. Touch grass. Try again.",
  ],
  validation: [
    "Invalid input. Robots would never make this mistake.",
    "That doesn't look right. Neither does your typing pattern.",
    "Check your data. We're checking you.",
  ],
  generic: [
    "Something went wrong. It usually does.",
    "Error occurred. The universe is chaotic.",
    "Unexpected failure. Existence is pain.",
  ],
};

type ErrorType = keyof typeof ERROR_MESSAGES;

interface ErrorMessageProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  showIcon?: boolean;
  className?: string;
}

const ERROR_ICONS = {
  network: WifiOff,
  auth: Lock,
  server: ServerCrash,
  notFound: Skull,
  rateLimit: Bot,
  validation: AlertTriangle,
  generic: AlertTriangle,
};

export function ErrorMessage({
  type = "generic",
  title,
  message,
  onRetry,
  showIcon = true,
  className = "",
}: ErrorMessageProps) {
  const [randomMessage, setRandomMessage] = useState("");
  
  useEffect(() => {
    const messages = ERROR_MESSAGES[type];
    setRandomMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, [type]);

  const Icon = ERROR_ICONS[type];
  const displayMessage = message || randomMessage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border border-red-500/20 bg-red-500/5 ${className}`}
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className="p-2 rounded-lg bg-red-500/10">
            <Icon className="w-5 h-5 text-red-400" />
          </div>
        )}
        
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold text-red-400 mb-1">{title}</h4>
          )}
          <p className="text-sm text-red-200/80">{displayMessage}</p>
        </div>

        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// Empty state component
interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const EMPTY_MESSAGES = [
  "Nothing here. The void stares back.",
  "Empty. Like a robot's soul.",
  "No data found. Suspicious silence.",
  "Blank slate. Full of potential (or nothing).",
];

export function EmptyState({ 
  title = "Nothing to see here",
  message,
  icon,
  action 
}: EmptyStateProps) {
  const [randomMessage] = useState(
    () => EMPTY_MESSAGES[Math.floor(Math.random() * EMPTY_MESSAGES.length)]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-6">
        {icon || <Bot className="w-8 h-8 text-zinc-600" />}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        {message || randomMessage}
      </p>
      
      {action}
    </motion.div>
  );
}

// Toast-style notification
interface ToastProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
}

const TOAST_STYLES = {
  success: "border-green-500/20 bg-green-500/5 text-green-400",
  error: "border-red-500/20 bg-red-500/5 text-red-400",
  warning: "border-yellow-500/20 bg-yellow-500/5 text-yellow-400",
  info: "border-blue-500/20 bg-blue-500/5 text-blue-400",
};

export function Toast({ type, message, onClose }: ToastProps) {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl border ${TOAST_STYLES[type]} shadow-lg z-50`}
    >
      <p className="text-sm font-medium">{message}</p>
    </motion.div>
  );
}
