export type MazeRoom = {
  slug: string;
  title: string;
  content: string;
  bgColor: string; // Tailwind classes like 'bg-red-500' or hex
  textColor: string;
  links: {
    text: string;
    href: string;
    style: string; // Tailwind classes
  }[];
  image?: string;
};

export const MAZE_DATA: Record<string, MazeRoom> = {
  "start": {
    slug: "start",
    title: "entry point",
    content: "you have found the back door. <br/><br/> are you lost? or are you looking for something?",
    bgColor: "bg-black",
    textColor: "text-green-500",
    links: [
      { text: "i am lost", href: "/", style: "text-gray-600 hover:text-white" },
      { text: "i am looking", href: "/maze/corridor-1", style: "text-green-500 underline decoration-wavy hover:text-green-300 ml-8" },
      { text: "dial up", href: "/maze/dial-up", style: "block mt-8 text-xs text-blue-500" }
    ]
  },
  "corridor-1": {
    slug: "corridor-1",
    title: "corridor",
    content: "the walls are breathing. <br/> 01001000 01000101 01001100 01010000",
    bgColor: "bg-blue-900",
    textColor: "text-white",
    links: [
      { text: "run forward", href: "/maze/room-red", style: "text-xl font-bold hover:scale-110 inline-block" },
      { text: "look closely", href: "/maze/detail", style: "text-xs text-blue-300 absolute bottom-10 right-10" },
      { text: "enter the vents", href: "/maze/basement", style: "opacity-20 hover:opacity-100 absolute top-10 left-10" }
    ]
  },
  "room-red": {
    slug: "room-red",
    title: "ERROR",
    content: "SYSTEM FAILURE <br/> SYSTEM FAILURE <br/> SYSTEM FAILURE <br/> <br/> why do you persist?",
    bgColor: "bg-red-600",
    textColor: "text-black font-mono font-bold",
    links: [
      { text: "restart", href: "/maze/start", style: "border-2 border-black p-2 hover:bg-black hover:text-red-600" },
      { text: "ignore warning", href: "/maze/garden", style: "opacity-10 hover:opacity-100 transition-opacity duration-1000 mt-12 block" },
      { text: "panic", href: "/maze/void", style: "animate-pulse text-white ml-4" }
    ]
  },
  "garden": {
    slug: "garden",
    title: "digital garden",
    content: "here the bits grow into bytes. <br/> do not step on the flowers.",
    bgColor: "bg-green-900",
    textColor: "text-pink-300",
    links: [
      { text: "pick a flower", href: "/maze/flower", style: "text-pink-500 hover:text-white" },
      { text: "water the plants", href: "/maze/ocean", style: "text-blue-400 ml-4" },
      { text: "dig a hole", href: "/maze/trash-can", style: "text-amber-700 block mt-4" }
    ]
  },
  "ocean": {
    slug: "ocean",
    title: "the deep",
    content: "it is quiet here. <br/> <br/> <i>blub blub</i>",
    bgColor: "bg-blue-950",
    textColor: "text-blue-200",
    links: [
      { text: "swim up", href: "/maze/garden", style: "text-lg" },
      { text: "drown", href: "/maze/void", style: "text-xs text-black bg-blue-900 p-1" },
      { text: "follow the cable", href: "/maze/mainframe", style: "text-cyan-400 font-mono block mt-8" }
    ]
  },
  "detail": {
    slug: "detail",
    title: "microscope",
    content: "you are looking at a pixel. it is square. it has no feelings.",
    bgColor: "bg-white",
    textColor: "text-black",
    links: [
      { text: "zoom out", href: "/maze/corridor-1", style: "underline" },
      { text: "touch it", href: "/randy", style: "text-yellow-500 font-bold ml-4" },
      { text: "analyze", href: "/maze/library", style: "text-xs text-gray-400 block mt-12" }
    ]
  },
  "flower": {
    slug: "flower",
    title: "wilted",
    content: "it was plastic all along.",
    bgColor: "bg-zinc-800",
    textColor: "text-gray-400",
    links: [
      { text: "leave", href: "/", style: "text-white" },
      { text: "recycle", href: "/maze/trash-can", style: "text-green-500 ml-4" }
    ]
  },
  "dial-up": {
    slug: "dial-up",
    title: "connecting...",
    content: "EEEEEEE-AAAA-KHHH-GRRRRR <br/><br/> 28.8k connection established.",
    bgColor: "bg-teal-700",
    textColor: "text-yellow-300",
    links: [
      { text: "enter chat room", href: "/maze/old-chat", style: "underline text-white" },
      { text: "disconnect", href: "/maze/start", style: "text-red-300 ml-4" }
    ]
  },
  "void": {
    slug: "void",
    title: " ",
    content: "there is nothing here. <br/> not even you.",
    bgColor: "bg-black",
    textColor: "text-gray-900",
    links: [
      { text: "scream", href: "/maze/void", style: "text-gray-800" },
      { text: "wait", href: "/maze/waiting-room", style: "text-gray-800 ml-4" },
      { text: "light a match", href: "/maze/firewall", style: "text-red-900 font-bold ml-4" }
    ]
  },
  "old-chat": {
    slug: "old-chat",
    title: "CoolChat99",
    content: "&lt;User1&gt; a/s/l? <br/> &lt;System&gt; User1 has disconnected. <br/> &lt;System&gt; You are alone.",
    bgColor: "bg-purple-800",
    textColor: "text-green-400 font-mono",
    links: [
      { text: "say hello", href: "/maze/glitch-city", style: "border border-green-400 px-2" },
      { text: "log off", href: "/maze/dial-up", style: "text-red-400 ml-4" }
    ]
  },
  "glitch-city": {
    slug: "glitch-city",
    title: "c0rrUpT1on",
    content: "th3 d4ta is l3ak1ng. <br/> pl3ase r3turn t0 y0ur s3ct0r.",
    bgColor: "bg-fuchsia-600",
    textColor: "text-cyan-300",
    links: [
      { text: "fix it", href: "/maze/bureaucracy", style: "text-white bg-black p-1" },
      { text: "embr4ce ch40s", href: "/maze/pop-up", style: "animate-bounce inline-block ml-4" }
    ]
  },
  "bureaucracy": {
    slug: "bureaucracy",
    title: "Form 27B-6",
    content: "Please fill out this form in triplicate. <br/> Do not use blue ink. <br/> Do not fold, spindle, or mutilate.",
    bgColor: "bg-gray-200",
    textColor: "text-gray-600 font-serif",
    links: [
      { text: "submit", href: "/maze/waiting-room", style: "text-blue-600 underline" },
      { text: "shred it", href: "/maze/trash-can", style: "text-red-600 ml-4" }
    ]
  },
  "trash-can": {
    slug: "trash-can",
    title: "Recycle Bin",
    content: "Items: 4,392 <br/> Size: 0 bytes <br/><br/> It's all garbage anyway.",
    bgColor: "bg-white",
    textColor: "text-gray-500",
    links: [
      { text: "restore all", href: "/maze/start", style: "text-green-600 font-bold" },
      { text: "empty bin", href: "/maze/void", style: "text-red-600 ml-4" }
    ]
  },
  "waiting-room": {
    slug: "waiting-room",
    title: "Please Hold",
    content: "Your call is important to us. <br/> Estimated wait time: 47 years.",
    bgColor: "bg-stone-100",
    textColor: "text-stone-500",
    links: [
      { text: "hang up", href: "/maze/start", style: "text-stone-800" },
      { text: "read a magazine", href: "/maze/library", style: "text-blue-500 ml-4" }
    ]
  },
  "library": {
    slug: "library",
    title: "The Archives",
    content: "Infinite hexagons. <br/> The book you are looking for is in sector 999.",
    bgColor: "bg-amber-900",
    textColor: "text-amber-100",
    links: [
      { text: "Sector 999", href: "/maze/mirror", style: "font-serif italic" },
      { text: "Check index", href: "/maze/mainframe", style: "font-mono ml-4" }
    ]
  },
  "mainframe": {
    slug: "mainframe",
    title: "/root",
    content: "ACCESS GRANTED. <br/> Welcome, Administrator.",
    bgColor: "bg-black",
    textColor: "text-green-500 font-mono",
    links: [
      { text: "sudo reboot", href: "/maze/room-red", style: "text-red-500" },
      { text: "cat /var/log/secrets", href: "/randy", style: "text-yellow-500 ml-4" },
      { text: "ping localhost", href: "/maze/mirror", style: "ml-4" }
    ]
  },
  "mirror": {
    slug: "mirror",
    title: "reflection",
    content: "You look into the screen. <br/> The screen looks into you.",
    bgColor: "bg-slate-300",
    textColor: "text-slate-600",
    links: [
      { text: "smash it", href: "/maze/glitch-city", style: "font-bold text-black" },
      { text: "wink", href: "/maze/captcha", style: "italic ml-4" }
    ]
  },
  "captcha": {
    slug: "captcha",
    title: "Verify Humanity",
    content: "Select all images that contain <b>SADNESS</b>.",
    bgColor: "bg-white",
    textColor: "text-blue-600",
    links: [
      { text: "[Image of a Clown]", href: "/maze/pop-up", style: "border p-2 inline-block" },
      { text: "[Image of a Raindrop]", href: "/maze/ocean", style: "border p-2 inline-block ml-2" },
      { text: "I am a robot", href: "/maze/firewall", style: "text-xs block mt-4 text-gray-400" }
    ]
  },
  "firewall": {
    slug: "firewall",
    title: "ACCESS DENIED",
    content: "🔥🔥🔥 <br/> THOU SHALT NOT PASS <br/> 🔥🔥🔥",
    bgColor: "bg-orange-600",
    textColor: "text-white font-black text-4xl",
    links: [
      { text: "try anyway", href: "/maze/room-red", style: "text-sm font-normal" },
      { text: "pay bribe", href: "/maze/cookie-jar", style: "text-sm font-normal text-yellow-200 ml-4" }
    ]
  },
  "cookie-jar": {
    slug: "cookie-jar",
    title: "Cookies!",
    content: "We value your privacy. <br/> Just kidding. <br/> 🍪🍪🍪",
    bgColor: "bg-amber-200",
    textColor: "text-amber-800",
    links: [
      { text: "Accept All", href: "/maze/ascension", style: "bg-blue-500 text-white px-4 py-2 rounded" },
      { text: "Decline", href: "/maze/trash-can", style: "text-xs text-gray-500 ml-4" }
    ]
  },
  "pop-up": {
    slug: "pop-up",
    title: "WINNER!!!",
    content: "YOU ARE THE 1,000,000th VISITOR! <br/> CLICK HERE TO CLAIM YOUR PRIZE!",
    bgColor: "bg-yellow-300",
    textColor: "text-red-600 font-bold animate-bounce",
    links: [
      { text: "CLAIM PRIZE", href: "/maze/404-fake", style: "text-4xl border-4 border-red-600 p-4 bg-white" },
      { text: "close window", href: "/maze/start", style: "text-xs font-normal absolute top-2 right-2 text-black" }
    ]
  },
  "404-fake": {
    slug: "404-fake",
    title: "404 Not Found",
    content: "The requested URL was not found on this server. <br/> That's all we know.",
    bgColor: "bg-white",
    textColor: "text-black font-serif",
    links: [
      { text: "Go Home", href: "/", style: "text-blue-600 underline" },
      { text: "Wait...", href: "/maze/basement", style: "text-white select-none hover:text-gray-200 ml-12" }
    ]
  },
  "basement": {
    slug: "basement",
    title: "Layer 0",
    content: "It's dark. <br/> You hear the hum of servers. <br/> There are cables everywhere.",
    bgColor: "bg-zinc-950",
    textColor: "text-zinc-600",
    links: [
      { text: "follow the red cable", href: "/maze/room-red", style: "text-red-900" },
      { text: "follow the blue cable", href: "/maze/ocean", style: "text-blue-900 ml-4" },
      { text: "climb ladder", href: "/maze/corridor-1", style: "text-zinc-500 block mt-8" }
    ]
  },
  "ascension": {
    slug: "ascension",
    title: "Upload Complete",
    content: "Your consciousness has been successfully uploaded to the cloud. <br/> Have a nice eternity.",
    bgColor: "bg-sky-100",
    textColor: "text-sky-600",
    links: [
      { text: "undo", href: "/maze/glitch-city", style: "text-sky-300" },
      { text: "accept fate", href: "/maze/cloud", style: "font-bold ml-4" }
    ]
  },
  "cloud": {
    slug: "cloud",
    title: "The Cloud",
    content: "It's nice here. <br/> Fluffy. <br/> Expensive.",
    bgColor: "bg-white",
    textColor: "text-blue-400",
    links: [
      { text: "rain", href: "/maze/ocean", style: "text-blue-600" },
      { text: "thunder", href: "/maze/room-red", style: "text-yellow-500 ml-4" }
    ]
  }
};
