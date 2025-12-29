import { ArrowLeft, Construction } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function UnderDevelopment() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-lg border-dashed">
        <CardContent className="flex flex-col items-center py-16 text-center">
          <div className="mb-6 rounded-full bg-amber-100 p-4">
            <Construction className="h-12 w-12 text-amber-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Under Development</h1>
          <p className="text-muted-foreground mb-6 max-w-sm">
            This feature is currently under development. We&apos;re working hard
            to bring it to you soon!
          </p>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/entities">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Entities
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
