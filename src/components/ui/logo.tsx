import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-12 w-28", className)}>
      <Image 
        src="https://storage.googleapis.com/studioprompt-helper-images/danny-store-logo-for-light-bg.png" 
        alt="Danny Store Logo"
        fill
        sizes="112px"
        className="object-contain dark:hidden"
        priority
      />
       <Image 
        src="https://storage.googleapis.com/studioprompt-helper-images/danny-store-logo-for-dark-bg.png" 
        alt="Danny Store Logo"
        fill
        sizes="112px"
        className="object-contain hidden dark:block"
        priority
      />
    </div>
  );
}
