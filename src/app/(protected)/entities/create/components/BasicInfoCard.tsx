"use client";

import { Box } from "lucide-react";
import { useFormContext } from "react-hook-form";

import type { EntityTypeOption } from "@/api/types/entity";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BasicInfoCardProps {
  entityTypeOptions: EntityTypeOption[];
  isLoadingOptions?: boolean;
}

export function BasicInfoCard({
  entityTypeOptions,
  isLoadingOptions,
}: BasicInfoCardProps) {
  const form = useFormContext();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="bg-primary/10 text-primary rounded-md p-1.5">
            <Box className="h-4 w-4" />
          </span>
          Basic Information
        </CardTitle>
        <CardDescription>Core details for the new entity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="entity_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entity Type</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isLoadingOptions}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an entity type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {entityTypeOptions.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} ({type.prefix})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The type determines the metadata fields and auto-generated code
                prefix.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Palm Tree Alpha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
