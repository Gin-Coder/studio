import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-20 w-20 flex items-center justify-center bg-black/80 rounded-full", className)}>
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
