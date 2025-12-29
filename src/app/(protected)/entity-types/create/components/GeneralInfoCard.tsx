"use client";

import { Box } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { Control, useWatch } from "react-hook-form";

import { ColorPicker, IconPicker } from "@/components/pickers";
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
import { Textarea } from "@/components/ui/textarea";
import { getColorByLabel } from "@/lib/colors";

interface GeneralInfoCardProps {
  control: Control<{
    name: string;
    description: string;
    prefix: string;
    icon: string;
    color: string;
    workflow_ids: string[];
  }>;
}

export function GeneralInfoCard({ control }: GeneralInfoCardProps) {
  const watchedColor = useWatch({ control, name: "color" });
  const watchedIcon = useWatch({ control, name: "icon" });
  const selectedColor = getColorByLabel(watchedColor);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="bg-primary/10 text-primary rounded-md p-1.5">
            <Box className="h-4 w-4" />
          </span>
          General Information
        </CardTitle>
        <CardDescription>Basic details about the entity type</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Palm Tree" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what this entity type represents..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="prefix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prefix</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., TREE"
                  maxLength={5}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormDescription>
                Max 5 characters, uppercase. Used for generating unique entity
                codes.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full items-start gap-6">
          <div className="flex-1 space-y-6">
            <FormField
              control={control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <IconPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Preview</FormLabel>
              <div className="bg-muted/30 flex h-[6.3rem] items-center justify-center rounded-lg border border-dashed">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg shadow-sm transition-colors"
                  style={{
                    backgroundColor: selectedColor.bg,
                    color: selectedColor.fg,
                  }}
                >
                  <DynamicIcon
                    name={watchedIcon as IconName}
                    className="h-6 w-6"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <FormField
              control={control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Theme</FormLabel>
                  <FormControl>
                    <ColorPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
