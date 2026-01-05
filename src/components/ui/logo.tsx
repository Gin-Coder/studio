import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-12 w-28", className)}>
      {/* Light mode logo */}
      <div className="block dark:hidden">
        <Image 
          src="https://storage.googleapis.com/studioprompt-helper-images/danny-store-logo-for-light-bg.png" 
          alt="Danny Store Logo"
          fill
          style={{ objectFit: 'contain' }}
          unoptimized
        />
      </div>
      {/* Dark mode logo */}
      <div className="hidden dark:block">
        <Image 
          src="https://storage.googleapis.com/studioprompt-helper-images/danny-store-logo-for-dark-bg.png" 
          alt="Danny Store Logo"
          fill
          style={{ objectFit: 'contain' }}
          unoptimized
        />
      </div>
    </div>
  );
}
