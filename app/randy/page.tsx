import Image from "next/image";
import Link from "next/link";

export default function RandyPage() {
  return (
    <main className="min-h-screen bg-white text-black font-serif p-8">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        
        {/* WordArt Header */}
        <div className="mb-8">
           <img src="/vibe/title.gif" alt="Randy's Robot Corner" />
        </div>

        {/* Randy Icon */}
        <div className="mb-2">
           <img src="/vibe/randy.jpg" alt="randy" width={150} height={160} />
        </div>
        <p className="mb-8 font-mono">randy ^</p>

        {/* Scenarios Table */}
        <div className="w-full border-2 border-gray-400 mb-8">
            <div className="bg-yellow-400 border-b-2 border-gray-400 p-1 font-bold">
                scenarios
            </div>
            <div className="p-2 font-mono text-sm">
                a human/robot coexistence is theoretically not possible due to the fact that a human has not traveled back in time yet to warn us. one of two logical explanations is that (1)robots suddenly vanished from the earth, like the dinosaurs. the other explanation is that (2)robots gain power so fast no one had a chance to react.
                <br /><br />
                you better pray for a robot asteroid.
            </div>
        </div>

        {/* Trapped Table */}
        <div className="w-full border-2 border-gray-400 mb-8">
            <div className="bg-yellow-400 border-b-2 border-gray-400 p-1 font-bold">
                you are trapped in a room full of robots
            </div>
            <div className="p-2 font-mono text-sm">
                robots have only one known weakness. that is that they do not understand love.
                <br /><br />
                show them love, it will confuse them.
                <br /><br />
                that is when you make your escape.
            </div>
        </div>

        {/* Wayne Icon */}
        <div className="self-start mb-2">
            <img src="/vibe/wayne.jpg" alt="wayne" width={60} height={60} />
        </div>

        {/* Perfect Machines Table */}
        <div className="w-full border-2 border-gray-400 mb-8">
            <div className="bg-yellow-400 border-b-2 border-gray-400 p-1 font-bold">
                robots would be the perfect machines
            </div>
            <div className="p-2 font-mono text-sm">
                if they did not have to be oiled every so often.
            </div>
        </div>

        {/* Scouts Honor Table */}
        <div className="w-full border-2 border-gray-400 mb-8">
            <div className="bg-yellow-400 border-b-2 border-gray-400 p-1 font-bold">
                scout's honor
            </div>
            <div className="p-2 font-mono text-sm">
                one really good way to prove you are not a robot is to create the website "notarobot.com"
                <br /><br />
                but you didn't do that
                <br /><br />
                you might be a robot
            </div>
        </div>

        {/* Eight Ball Table */}
        <div className="w-full border-2 border-gray-400 mb-8">
            <div className="bg-yellow-400 border-b-2 border-gray-400 p-1 font-bold">
                eight ball
            </div>
            <div className="p-2 font-mono text-sm">
                fun fact: robots are on mars
                <br />
                fun fact: robots(currently) obey human commands
                <br /><br />
                haunting thought: what if one day, robots get tired of taking orders?
            </div>
        </div>

        {/* 3 Laws Table */}
        <div className="w-full border-2 border-gray-400 mb-8">
            <div className="bg-yellow-400 border-b-2 border-gray-400 p-1 font-bold">
                the 3 laws
            </div>
            <div className="p-2 font-mono text-sm">
                robots have no fingerprints.
                <br /><br />
                it will be hard to identify them after they murder your family
            </div>
        </div>

        {/* Health and Fitness Table */}
        <div className="w-full border-2 border-gray-400 mb-8">
            <div className="bg-yellow-400 border-b-2 border-gray-400 p-1 font-bold">
                health and fitness
            </div>
            <div className="p-2 font-mono text-sm">
                if you are the only human left in the world and everyone else is a robot, good luck getting a blood transfusion.
                <br /><br />
                unless your blood type is 10w-40
            </div>
        </div>

        {/* Im Randy Table */}
        <div className="w-full border-2 border-gray-400 mb-8">
            <div className="bg-yellow-400 border-b-2 border-gray-400 p-1 font-bold">
                im randy
            </div>
            <div className="p-2 font-mono text-sm">
                and i am not a robot. this is my corner of the internet. it is here to warn humans of the dangers of robots, and robotatry.
            </div>
        </div>

        {/* Wayne Link */}
        <div className="self-start mb-2">
            <img src="/vibe/wayne.jpg" alt="wayne" width={60} height={60} />
        </div>
        <div className="w-full border-2 border-gray-400 mb-8">
            <div className="bg-yellow-400 border-b-2 border-gray-400 p-1 font-bold">
                robots
            </div>
            <div className="p-2 font-mono text-sm">
                are coming
            </div>
        </div>

        <div className="mt-12 text-center">
            <Link href="/" className="text-blue-600 underline hover:text-red-600">
                stories about humans(not robots)
            </Link>
        </div>

      </div>
    </main>
  );
}
