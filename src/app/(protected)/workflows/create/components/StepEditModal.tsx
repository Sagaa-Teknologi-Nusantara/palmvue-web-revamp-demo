"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, PlayCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SchemaBuilder } from "@/components/schema-builder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { JSONSchema } from "@/types";

const defaultFormSchema: JSONSchema = {
  type: "object",
  properties: {},
  required: [],
};

const formSchema = z.object({
  name: z.string().min(1, "Step name is required"),
  formName: z.string().min(1, "Form name is required"),
  requiresApproval: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export interface StepData {
  id: string;
  name: string;
  formName: string;
  formSchema: JSONSchema;
  requiresApproval: boolean;
}

interface StepEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<StepData, "id">) => void;
  step?: StepData | null;
}

// Inner component that resets when key changes
function StepEditModalContent({
  onClose,
  onSave,
  step,
}: Omit<StepEditModalProps, "open">) {
  // Initialize state directly from props - no useEffect needed
  const [schema, setSchema] = useState<JSONSchema>(
    () => step?.formSchema ?? defaultFormSchema,
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: step?.name ?? "",
      formName: step?.formName ?? "",
      requiresApproval: step?.requiresApproval ?? false,
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSave({
      name: values.name,
      formName: values.formName,
      formSchema: schema,
      requiresApproval: values.requiresApproval,
    });
    onClose();
  };

  return (
    <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col gap-0 p-0">
      <DialogHeader className="bg-muted/10 border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary rounded-md p-1.5">
            <PlayCircle className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle>
              {step ? "Edit Step Configuration" : "Add New Step"}
            </DialogTitle>
            <DialogDescription>
              Configure the step details and the form data to be collected.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto">
            <div className="grid h-full grid-cols-1 lg:grid-cols-3">
              {/* Left Column: Basic Details */}
              <div className="bg-muted/5 space-y-6 p-6 lg:col-span-1 lg:border-r">
                <div>
                  <h3 className="text-foreground mb-1 text-sm font-semibold">
                    Step Details
                  </h3>
                  <p className="text-muted-foreground mb-4 text-xs">
                    Basic information about this step in the workflow.
                  </p>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Step Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Initial Inspection"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="formName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Form Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Inspection Checklist"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Title shown on the collection form.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Requires Approval Toggle */}
                <FormField
                  control={form.control}
                  name="requiresApproval"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="flex items-center gap-2 text-base">
                          <ShieldCheck className="text-muted-foreground h-4 w-4" />
                          Requires Approval
                        </FormLabel>
                        <FormDescription>
                          Submissions must be approved before proceeding.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="rounded-md border border-blue-100 bg-blue-50 p-3 dark:border-blue-900/50 dark:bg-blue-900/20">
                  <div className="flex items-start gap-2">
                    <FileText className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <div className="text-xs text-blue-800 dark:text-blue-300">
                      <p className="mb-1 font-medium">Form Configuration</p>
                      <p>
                        Use the builder on the right to define what data needs
                        to be collected during this step.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Schema Builder */}
              <div className="p-6 lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-foreground mb-1 text-sm font-semibold">
                      Form Schema
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      Define fields and validation rules.
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {Object.keys(schema.properties || {}).length} Fields
                  </Badge>
                </div>
                <div className="bg-card rounded-lg border p-1">
                  <SchemaBuilder value={schema} onChange={setSchema} />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="bg-muted/20 border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{step ? "Save Changes" : "Add Step"}</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

export function StepEditModal({
  open,
  onClose,
  onSave,
  step,
}: StepEditModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <StepEditModalContent
        key={step?.id ?? "new"}
        onClose={onClose}
        onSave={onSave}
        step={step}
      />
    </Dialog>
  );
}
