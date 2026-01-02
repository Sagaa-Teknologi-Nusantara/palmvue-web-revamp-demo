"use client";

import {
  Check,
  ChevronsUpDown,
  Plus,
  Workflow as WorkflowIcon,
  X,
} from "lucide-react";
import type { Control, UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";
import type { Workflow, WorkflowOption } from "@/types";

type FormValues = {
  name: string;
  description: string;
  icon: string;
  color: string;
  add_workflow_ids: string[];
  include_existing: boolean;
};

interface WorkflowsCardProps {
  control: Control<FormValues>;
  form: UseFormReturn<FormValues>;
  assignedWorkflows: Workflow[];
  availableWorkflows: WorkflowOption[];
}

export function WorkflowsCard({
  control,
  form,
  assignedWorkflows,
  availableWorkflows,
}: WorkflowsCardProps) {
  const watchedAddWorkflows = useWatch({
    control,
    name: "add_workflow_ids",
  });

  const assignedIds = new Set(assignedWorkflows.map((w) => w.id));
  const unassignedWorkflows = availableWorkflows.filter(
    (w) => !assignedIds.has(w.id),
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="bg-primary/10 text-primary rounded-md p-1.5">
            <WorkflowIcon className="h-4 w-4" />
          </span>
          Workflows
        </CardTitle>
        <CardDescription>
          Manage workflows assigned to this entity type
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Currently Assigned */}
        {assignedWorkflows.length > 0 && (
          <div className="space-y-2">
            <FormLabel className="text-muted-foreground">
              Currently Assigned
            </FormLabel>
            <div className="flex flex-wrap gap-2">
              {assignedWorkflows.map((workflow) => (
                <Badge key={workflow.id} variant="secondary">
                  {workflow.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {assignedWorkflows.length > 0 && unassignedWorkflows.length > 0 && (
          <Separator />
        )}

        {/* Add New Workflows */}
        <div className="space-y-4">
          <FormField
            control={control}
            name="add_workflow_ids"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Add Workflows</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value.length && "text-muted-foreground",
                        )}
                        disabled={unassignedWorkflows.length === 0}
                      >
                        {unassignedWorkflows.length === 0
                          ? "No more workflows available"
                          : "Select workflows to add..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search workflows..." />
                      <CommandList>
                        <CommandEmpty>No workflow found.</CommandEmpty>
                        <CommandGroup>
                          {unassignedWorkflows.map((workflow) => {
                            const isSelected = field.value.includes(
                              workflow.id,
                            );
                            return (
                              <CommandItem
                                value={workflow.name}
                                key={workflow.id}
                                onSelect={() => {
                                  if (isSelected) {
                                    field.onChange(
                                      field.value.filter(
                                        (id) => id !== workflow.id,
                                      ),
                                    );
                                  } else {
                                    field.onChange([
                                      ...field.value,
                                      workflow.id,
                                    ]);
                                  }
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {workflow.name}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Search and select multiple workflows to add to this entity
                  type.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Added Workflows Display */}
          {watchedAddWorkflows.length > 0 && (
            <div className="bg-muted/30 rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <FormLabel className="flex items-center gap-2">
                  <Plus className="text-primary h-4 w-4" />
                  Added Workflows
                  <Badge className="ml-2">{watchedAddWorkflows.length}</Badge>
                </FormLabel>
              </div>

              <div className="mb-4 grid max-h-[300px] gap-2 overflow-y-auto pr-2">
                {watchedAddWorkflows.map((id) => {
                  const workflow = unassignedWorkflows.find((w) => w.id === id);
                  if (!workflow) return null;
                  return (
                    <div
                      key={id}
                      className="bg-background flex items-center justify-between rounded-md border p-2 shadow-sm"
                    >
                      <span className="text-sm font-medium">
                        {workflow.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                        onClick={() => {
                          const current = form.getValues("add_workflow_ids");
                          form.setValue(
                            "add_workflow_ids",
                            current.filter((wId) => wId !== id),
                          );
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-4" />

              <FormField
                control={control}
                name="include_existing"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Apply to Existing Entities</FormLabel>
                      <FormDescription>
                        Backfill these new workflows to all existing entities.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
