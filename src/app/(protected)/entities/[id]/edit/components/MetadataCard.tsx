"use client";

import { Database, Loader2 } from "lucide-react";

import { MetadataForm } from "@/components/entities";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { JSONSchema } from "@/types";

interface MetadataCardProps {
  schema: JSONSchema | undefined;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
}

export function MetadataCard({
  schema,
  value,
  onChange,
  isLoading,
  errors,
}: MetadataCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="bg-primary/10 text-primary rounded-md p-1.5">
            <Database className="h-4 w-4" />
          </span>
          Metadata
          {isLoading && (
            <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
          )}
        </CardTitle>
        <CardDescription>
          Custom fields defined by the entity type schema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        ) : schema ? (
          <MetadataForm
            schema={schema}
            value={value}
            onChange={onChange}
            errors={errors}
          />
        ) : (
          <p className="text-muted-foreground text-sm">
            No metadata fields defined for this entity type.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
