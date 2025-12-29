"use client";

import { Network } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { EntitySelector } from "@/components/entities";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function RelationshipsCard() {
  const form = useFormContext();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="bg-primary/10 text-primary rounded-md p-1.5">
            <Network className="h-4 w-4" />
          </span>
          Relationships
        </CardTitle>
        <CardDescription>Optional hierarchical connections</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="parent_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Entity (Optional)</FormLabel>
              <FormControl>
                <EntitySelector
                  value={field.value || null}
                  onChange={(id) => field.onChange(id || "")}
                  placeholder="Select a parent entity..."
                />
              </FormControl>
              <FormDescription>
                Link this entity to a parent for hierarchical organization.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
