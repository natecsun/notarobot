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
      { text: "i am looking", href: "/maze/corridor-1", style: "text-green-500 underline decoration-wavy hover:text-green-300 ml-8" }
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
      { text: "look closely", href: "/maze/detail", style: "text-xs text-blue-300 absolute bottom-10 right-10" }
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
      { text: "ignore warning", href: "/maze/garden", style: "opacity-10 hover:opacity-100 transition-opacity duration-1000 mt-12 block" }
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
      { text: "water the plants", href: "/maze/ocean", style: "text-blue-400 ml-4" }
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
      { text: "drown", href: "/", style: "text-xs text-black bg-blue-900 p-1" }
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
      { text: "touch it", href: "/randy", style: "text-yellow-500 font-bold ml-4" }
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
      { text: "recycle", href: "/maze/start", style: "text-green-500 ml-4" }
    ]
  }
};
