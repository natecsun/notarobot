# NotARobot.com 🤖❤️

**The Human Defense Layer for the Web.**

NotARobot is a suite of AI-powered tools designed to verify humanity, detect deepfakes, and sanitize content in the age of Generative AI.

## Features

### 1. Resume Sanitizer 📄
*   **Problem**: Recruiters use AI to filter candidates. Genuine human resumes often get rejected for not having "keyword density."
*   **Solution**: Upload your PDF. Our Llama 3-powered agent analyzes your text for "robotic" phrasing and rewrites it to sound more authentic and impactful.
*   **Tech**: Groq, Llama 3 8B, PDF parsing.

### 2. Fake Profile Spotter 🕵️‍♂️
*   **Problem**: Dating apps and social media are flooded with GAN-generated faces and LLM-written bios.
*   **Solution**: Upload a screenshot. Our Vision AI scans for artifacts (asymmetrical eyes, background warping) and robotic text patterns.
*   **Tech**: Groq Vision (Llama 3.2 11B).

### 3. Real vs AI Game 🎮
*   **Challenge**: Can you tell the difference? A viral game to test your own detection skills against the machine.
*   **Tech**: Next.js, Framer Motion.

## Architecture

*   **Framework**: Next.js 14 (App Router)
*   **Styling**: Tailwind CSS + Framer Motion
*   **AI Inference**: Groq (Ultra-low latency)
*   **Safety**: Telegram Alerts for rate limiting + Google Analytics
*   **Deployment**: Vercel

## Environment Variables

To run this locally, you need:
```bash
GROQ_API_KEY=gsk_...
GROQ_API_KEY_PAID=gsk_...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=...
```
