"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useWorkflows, useEntityTypes } from "@/hooks";
import {
  ArrowLeft,
  Trash2,
  Calendar,
  Clock,
  PlayCircle,
  CheckCircle2,
  Hash,
  Type,
  List,
  GitBranch,
  Split,
  FileText,
  Box,
} from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/cn";
import type { JSONSchema, PropertySchema } from "@/types";

// Field type display configuration
const FIELD_TYPE_CONFIG: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  string: {
    label: "Text",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    icon: Type,
  },
  number: {
    label: "Number",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
    icon: Hash,
  },
  integer: {
    label: "Integer",
    color:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400",
    icon: Hash,
  },
  boolean: {
    label: "Boolean",
    color:
      "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
    icon: CheckCircle2,
  },
  date: {
    label: "Date",
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
    icon: Calendar,
  },
  dropdown: {
    label: "Dropdown",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400",
    icon: List,
  },
};

function getFieldType(prop: PropertySchema): string {
  if (prop.enum) return "dropdown";
  if (prop.format === "date") return "date";
  return prop.type || "string";
}

function FormSchemaDisplay({ schema }: { schema: JSONSchema }) {
  if (!schema.properties || Object.keys(schema.properties).length === 0) {
    return (
      <div className="text-muted-foreground bg-muted/20 flex flex-col items-center justify-center rounded-lg border border-dashed py-4 text-center">
        <p className="text-xs">No fields defined.</p>
      </div>
    );
  }

  const requiredFields = schema.required || [];

  return (
    <div className="space-y-2">
      {Object.entries(schema.properties).map(([fieldName, prop]) => {
        const fieldType = getFieldType(prop);
        const config = FIELD_TYPE_CONFIG[fieldType] || FIELD_TYPE_CONFIG.string;
        const Icon = config.icon;
        const isRequired = requiredFields.includes(fieldName);

        return (
          <div
            key={fieldName}
            className="group bg-card hover:border-primary/50 relative overflow-hidden rounded-md border p-2.5 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {prop.title || fieldName}
                </span>
                {isRequired && (
                  <span
                    title="Required"
                    className="text-destructive text-xs font-bold"
                  >
                    *
                  </span>
                )}
                <code className="bg-muted text-muted-foreground rounded px-1 py-0.5 font-mono text-[10px]">
                  {fieldName}
                </code>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  "flex shrink-0 items-center gap-1 px-1.5 py-0 text-[10px] font-medium transition-colors",
                  config.color,
                )}
              >
                <Icon className="h-3 w-3" />
                {config.label}
              </Badge>
            </div>
            {prop.description && (
              <p className="text-muted-foreground mt-1 text-[10px]">
                {prop.description}
              </p>
            )}
            {prop.enum && prop.enum.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {prop.enum.map((option) => (
                  <span
                    key={option}
                    className="bg-muted/50 text-muted-foreground rounded border px-1 py-0.5 text-[10px]"
                  >
                    {option}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getById, remove } = useWorkflows();
  const { entityTypes, entityTypeWorkflows } = useEntityTypes();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const workflow = getById(id);

  if (!workflow) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <Skeleton className="h-16 w-16 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const assignedEntityTypes = entityTypes.filter((et) =>
    entityTypeWorkflows[et.id]?.includes(workflow.id),
  );

  const handleDelete = () => {
    remove(id);
    router.push("/workflows");
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          asChild
          className="hover:text-primary mb-4 pl-0 hover:bg-transparent"
        >
          <Link href="/workflows">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workflows
          </Link>
        </Button>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary border-primary/20 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-transform hover:scale-105">
                <GitBranch className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h1 className="text-foreground text-3xl font-bold tracking-tight">
                  {workflow.name}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {workflow.steps.length} step
                  {workflow.steps.length !== 1 ? "s" : ""} configuration
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 h-9"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Workflow
            </Button>
          </div>
          <Separator />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Sidebar / Info */}
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="bg-primary/10 text-primary rounded-md p-1.5">
                  <PlayCircle className="h-4 w-4" />
                </span>
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Calendar className="h-3.5 w-3.5" /> Created
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(workflow.created_at)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Clock className="h-3.5 w-3.5" /> Updated
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(workflow.updated_at)}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
                  Structure
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {workflow.steps.length} Steps
                  </Badge>
                  <Badge variant="outline" className="font-mono">
                    Sequential
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="bg-primary/10 text-primary rounded-md p-1.5">
                  <Box className="h-4 w-4" />
                </span>
                Assigned To
              </CardTitle>
              <CardDescription>
                Entity types using this workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignedEntityTypes.length > 0 ? (
                <div className="space-y-3">
                  {assignedEntityTypes.map((et) => {
                    const {
                      icon: typeIcon,
                      fg_color: typeColor,
                      bg_color: typeBgColor,
                    } = et;

                    return (
                      <Link
                        key={et.id}
                        href={`/entity-types/${et.id}`}
                        className="group bg-card hover:bg-muted/50 hover:border-primary/50 flex items-center gap-3 rounded-lg border p-3 transition-colors"
                      >
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-[0.5px] shadow-sm"
                          style={{
                            backgroundColor: typeBgColor,
                            color: typeColor,
                            borderColor: typeColor,
                          }}
                        >
                          <DynamicIcon
                            name={(typeIcon as IconName) || "box"}
                            className="h-5 w-5"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="group-hover:text-primary truncate text-sm font-medium transition-colors">
                            {et.name}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-[10px]">
                              {et.prefix}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-muted-foreground py-6 text-center text-sm">
                  <p>Not assigned to any entity types.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content / Steps */}
        <div className="md:col-span-3">
          <Card className="md:bg-card h-full border-none bg-transparent shadow-none md:border md:shadow-sm">
            <CardHeader className="px-0 md:px-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="bg-primary/10 text-primary rounded-md p-1.5">
                  <Split className="h-4 w-4" />
                </span>
                Workflow Steps
              </CardTitle>
              <CardDescription>
                Execution order and form configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 md:px-6">
              <div className="space-y-6">
                {workflow.steps
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((step, index) => (
                    <div key={step.id} className="group relative flex gap-4">
                      {/* Timeline Line */}
                      {index !== workflow.steps.length - 1 && (
                        <div className="bg-border absolute top-10 -bottom-6 left-[1.15rem] w-0.5" />
                      )}

                      {/* Number Bubble */}
                      <div className="border-background bg-muted text-muted-foreground group-hover:border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 text-sm font-bold shadow-sm transition-colors">
                        {index + 1}
                      </div>

                      {/* Step Content */}
                      <div className="bg-card w-full rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <h3 className="text-base font-semibold">
                              {step.name}
                            </h3>
                            <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs">
                              <FileText className="h-3 w-3" />
                              Form:{" "}
                              <span className="text-foreground font-medium">
                                {step.form.name}
                              </span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-[10px]">
                            Step {index + 1}
                          </Badge>
                        </div>

                        <div className="bg-muted/30 rounded-md border border-dashed p-3">
                          <p className="text-muted-foreground mb-3 text-[10px] font-medium tracking-wider uppercase">
                            Form Fields
                          </p>
                          <FormSchemaDisplay schema={step.form.schema} />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workflow</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{workflow.name}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
