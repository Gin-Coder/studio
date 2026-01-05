import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-24 w-24 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm", className)}>
      <div className="relative h-16 w-16">
        <Image 
          src="/logo.png" 
          alt="Danny Store Logo"
          fill
          style={{ objectFit: 'contain' }}
          unoptimized
        />
      </div>
    </div>
  );
}
