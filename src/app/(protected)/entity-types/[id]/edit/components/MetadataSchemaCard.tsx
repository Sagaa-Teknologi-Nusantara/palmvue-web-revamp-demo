import { Database } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { JSONSchema } from "@/types";

import { MetadataSchemaDisplay } from "../../components/MetadataSchemaDisplay";

interface MetadataSchemaCardProps {
  schema: JSONSchema;
}

export function MetadataSchemaCard({ schema }: MetadataSchemaCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="bg-primary/10 text-primary rounded-md p-1.5">
            <Database className="h-4 w-4" />
          </span>
          Metadata Schema
          <Badge variant="secondary" className="ml-2 text-xs">
            Read-only
          </Badge>
        </CardTitle>
        <CardDescription>
          The metadata schema cannot be modified after creation
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        <MetadataSchemaDisplay schema={schema} />
      </CardContent>
    </Card>
  );
}
