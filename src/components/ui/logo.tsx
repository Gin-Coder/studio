import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-12 w-28", className)}>
      <Image 
        src="/logo.png" 
        alt="Danny Store Logo"
        fill
        style={{ objectFit: 'contain' }}
        unoptimized
      />
    </div>
  );
}
