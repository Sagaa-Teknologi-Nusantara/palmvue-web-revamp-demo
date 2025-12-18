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
import { useEntityTypes, useWorkflows } from "@/hooks";
import {
  ArrowLeft,
  Trash2,
  Plus,
  X,
  Box,
  Code2,
  Calendar,
  Clock,
  PlayCircle,
  Hash,
  Database,
  Type,
  List,
  CheckCircle2,
} from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/code-generator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { JSONSchema, PropertySchema } from "@/types";

// Field type display configuration with enhanced visuals
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

function MetadataSchemaDisplay({ schema }: { schema: JSONSchema }) {
  if (!schema.properties || Object.keys(schema.properties).length === 0) {
    return (
      <div className="text-muted-foreground bg-muted/20 flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
        <p>No metadata fields defined.</p>
      </div>
    );
  }

  const requiredFields = schema.required || [];

  return (
    <div className="grid grid-cols-1 gap-3">
      {Object.entries(schema.properties).map(([fieldName, prop]) => {
        const fieldType = getFieldType(prop);
        const config = FIELD_TYPE_CONFIG[fieldType] || FIELD_TYPE_CONFIG.string;
        const Icon = config.icon;
        const isRequired = requiredFields.includes(fieldName);

        return (
          <div
            key={fieldName}
            className="group bg-card hover:border-primary/50 relative overflow-hidden rounded-lg border p-3 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
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
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[10px]">
                    {fieldName}
                  </code>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  "flex shrink-0 items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium transition-colors",
                  config.color,
                )}
              >
                <Icon className="h-3 w-3" />
                {config.label}
              </Badge>
            </div>

            {prop.description && (
              <p className="text-muted-foreground mt-2 text-xs">
                {prop.description}
              </p>
            )}

            {prop.enum && prop.enum.length > 0 && (
              <div className="mt-3">
                <p className="text-muted-foreground mb-1.5 text-[10px] font-medium tracking-wider uppercase">
                  Options
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {prop.enum.map((option) => (
                    <span
                      key={option}
                      className="bg-muted/50 text-muted-foreground rounded border px-1.5 py-0.5 text-[10px]"
                    >
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function EntityTypeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const {
    getById,
    remove,
    getAssignedWorkflows,
    assignWorkflow,
    unassignWorkflow,
    getAssignedWorkflowIds,
  } = useEntityTypes();
  const { workflows } = useWorkflows();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");

  const entityType = getById(id);
  const assignedWorkflows = getAssignedWorkflows(id);
  const assignedWorkflowIds = getAssignedWorkflowIds(id);
  const availableWorkflows = workflows.filter(
    (w) => !assignedWorkflowIds.includes(w.id),
  );

  if (!entityType) {
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
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    remove(id);
    router.push("/entity-types");
  };

  const handleAssignWorkflow = () => {
    if (selectedWorkflow) {
      assignWorkflow(id, selectedWorkflow);
      setSelectedWorkflow("");
    }
  };

  const {
    icon: typeIcon,
    fg_color: typeColor,
    bg_color: typeBgColor,
  } = entityType;

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          asChild
          className="hover:text-primary mb-4 pl-0 hover:bg-transparent"
        >
          <Link href="/entity-types">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Entity Types
          </Link>
        </Button>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-[0.5px] shadow-sm transition-transform hover:scale-105"
                style={{
                  backgroundColor: typeBgColor,
                  color: typeColor,
                  borderColor: typeColor,
                }}
              >
                <DynamicIcon
                  name={(typeIcon as IconName) || "box"}
                  className="h-8 w-8"
                />
              </div>
              <div className="space-y-1">
                <h1 className="text-foreground text-3xl font-bold tracking-tight">
                  {entityType.name}
                </h1>
                <p className="text-muted-foreground max-w-xl text-sm">
                  {entityType.description || "No description provided."}
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
              Delete Entity Type
            </Button>
          </div>
          <Separator />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="bg-primary/10 text-primary rounded-md p-1.5">
                <Box className="h-4 w-4" />
              </span>
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="bg-muted/40 border-muted/60 flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Prefix
                  </p>
                  <p className="font-mono text-sm font-semibold">
                    {entityType.prefix}
                  </p>
                </div>
                <div className="bg-background text-muted-foreground flex h-8 w-8 items-center justify-center rounded-md border text-xs font-bold shadow-sm">
                  #
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Calendar className="h-3.5 w-3.5" /> Created
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(entityType.created_at)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Clock className="h-3.5 w-3.5" /> Updated
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(entityType.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="bg-primary/10 text-primary rounded-md p-1.5">
                <Database className="h-4 w-4" />
              </span>
              Metadata Fields
            </CardTitle>
            <CardDescription>
              Fields available for entities of this type
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto pr-2">
            <MetadataSchemaDisplay schema={entityType.metadata_schema} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Assigned Workflows
            </h2>
            <p className="text-muted-foreground text-sm">
              Workflows automatically assigned to new entities
            </p>
          </div>
        </div>

        <Card className="p-0">
          <CardContent className="p-0">
            {assignedWorkflows.length > 0 ? (
              <div className="divide-y">
                {assignedWorkflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="hover:bg-muted/50 flex items-center justify-between p-4 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                        <PlayCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <Link
                          href={`/workflows/${workflow.id}`}
                          className="block text-base font-medium hover:underline"
                        >
                          {workflow.name}
                        </Link>
                        <span className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                          <Code2 className="h-3 w-3" />
                          {workflow.steps.length} step
                          {workflow.steps.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => unassignWorkflow(id, workflow.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-muted mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                  <PlayCircle className="text-muted-foreground/50 h-6 w-6" />
                </div>
                <p className="font-medium">No workflows assigned</p>
                <p className="mt-1 max-w-sm text-sm">
                  Assign a workflow below to automate processes for this entity
                  type.
                </p>
              </div>
            )}

            <div className="bg-muted/30 border-t p-4">
              <div className="mx-auto flex max-w-xl gap-2 md:mx-0">
                <Select
                  value={selectedWorkflow}
                  onValueChange={setSelectedWorkflow}
                >
                  <SelectTrigger className="bg-background flex-1">
                    <SelectValue placeholder="Select a workflow to assign..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWorkflows.length > 0 ? (
                      availableWorkflows.map((workflow) => (
                        <SelectItem key={workflow.id} value={workflow.id}>
                          {workflow.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-muted-foreground p-2 text-center text-sm">
                        All workflows assigned
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAssignWorkflow}
                  disabled={!selectedWorkflow}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Assign
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entity Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{entityType.name}&quot;?
              This action cannot be undone.
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
