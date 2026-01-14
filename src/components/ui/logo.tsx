import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-12 w-12 flex items-center justify-center rounded-full", className)}>
      <div className={cn("relative h-11 w-11", className?.includes('!h-24') && '!h-[5.5rem] !w-[5.5rem]')}>
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
