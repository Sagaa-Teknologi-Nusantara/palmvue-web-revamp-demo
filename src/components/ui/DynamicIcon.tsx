import { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn, toPascalCase } from "@/lib/utils";

interface DynamicIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

export function DynamicIcon({ name, className, ...props }: DynamicIconProps) {
  const pascalName = name ? toPascalCase(name) : "";
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[
    pascalName
  ];

  if (!Icon) {
    return <LucideIcons.Box className={cn("h-4 w-4", className)} {...props} />;
  }

  return <Icon className={cn("h-4 w-4", className)} {...props} />;
}
