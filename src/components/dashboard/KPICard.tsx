import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KPICardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  href: string;
}

export function KPICard({
  title,
  value,
  description,
  icon: Icon,
  href,
}: KPICardProps) {
  return (
    <Link href={href}>
      <Card className="shadow-sm transition-all hover:shadow-md cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{value.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
