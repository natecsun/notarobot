import { MAZE_DATA } from "@/lib/maze-data";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function MazePage({ params }: { params: { slug: string } }) {
  const room = MAZE_DATA[params.slug];

  if (!room) {
    return notFound();
  }

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center p-12 ${room.bgColor} ${room.textColor} transition-colors duration-700`}>
      <div className="max-w-2xl w-full space-y-12 relative">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter opacity-50 mb-8">
          {room.title}
        </h1>

        <div 
          className="text-xl md:text-2xl font-serif leading-relaxed"
          dangerouslySetInnerHTML={{ __html: room.content }}
        />

        <div className="mt-24 flex flex-wrap gap-8 items-center justify-center">
          {room.links.map((link, i) => (
            <Link 
              key={i} 
              href={link.href}
              className={link.style}
            >
              {link.text}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
