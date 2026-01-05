import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-28 w-28 flex items-center justify-center", className)}>
      <div className="relative h-20 w-20">
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
