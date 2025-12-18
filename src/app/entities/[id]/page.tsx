"use client";

import { use, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { PageHeader } from "@/components/layout";
import { useEntities, useEntityTypes, useWorkflowRecords } from "@/hooks";
import {
  ArrowLeft,
  Trash2,
  ExternalLink,
  Calendar,
  Code2,
  GitFork,
  PlayCircle,
  Clock,
} from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/code-generator";
import { WorkflowPipeline } from "@/components/workflows/WorkflowPipeline";
import { StatusBadge } from "@/components/entities/StatusBadge";
import type { WorkflowRecordStatus } from "@/types/workflow-record";

function computeEntityStatus(
  entityId: string,
  workflowRecords: { entity_id: string; status: WorkflowRecordStatus }[],
): WorkflowRecordStatus {
  const records = workflowRecords.filter((r) => r.entity_id === entityId);
  if (records.length === 0) return "not_started";

  const statuses = new Set(records.map((r) => r.status));
  if (statuses.size === 1) return records[0].status;

  if (statuses.has("in_progress")) return "in_progress";
  if (statuses.has("not_started")) return "in_progress";
  return "completed";
}

export default function EntityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getById, remove } = useEntities();
  const { getById: getEntityType } = useEntityTypes();
  const { getByEntityId, workflowRecords: allWorkflowRecords } =
    useWorkflowRecords();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const entity = getById(id);
  const entityType = entity ? getEntityType(entity.entity_type_id) : null;
  const workflowRecords = getByEntityId(id);

  const entityStatus = useMemo(() => {
    return entity
      ? computeEntityStatus(entity.id, allWorkflowRecords)
      : "not_started";
  }, [entity, allWorkflowRecords]);

  if (!entity) {
    return (
      <div>
        <PageHeader title="Entity" />
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    remove(id);
    router.push("/entities");
  };

  const {
    icon: typeIcon,
    fg_color: typeColor,
    bg_color: typeBgColor,
    name: typeName,
  } = entityType || {
    icon: "box",
    fg_color: "#000000",
    bg_color: "#ffffff",
    name: "Unknown",
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          asChild
          className="hover:text-primary mb-4 pl-0 hover:bg-transparent"
        >
          <Link href="/entities">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Entities
          </Link>
        </Button>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-[0.5px] shadow-sm"
                style={{
                  backgroundColor: typeBgColor,
                  color: typeColor,
                  borderColor: typeColor,
                }}
              >
                <DynamicIcon
                  name={(typeIcon as IconName) || "box"}
                  className="h-6 w-6"
                />
              </div>
              <div className="space-y-1">
                <h1 className="text-foreground text-3xl font-bold tracking-tight">
                  {entity.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-muted text-muted-foreground flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-xs font-medium">
                    <span>{entity.code}</span>
                  </div>

                  <StatusBadge status={entityStatus} />
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 h-9"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Entity
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
                <GitFork className="h-4 w-4" />
              </span>
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="bg-muted/40 border-muted/60 flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Entity Type
                  </p>
                  <Link
                    href={`/entity-types/${entity.entity_type_id}`}
                    className="text-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                  >
                    {typeName}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <div
                  className="bg-background flex h-8 w-8 items-center justify-center rounded-full border"
                  style={{ color: typeColor }}
                >
                  <DynamicIcon
                    name={(typeIcon as IconName) || "box"}
                    className="h-4 w-4"
                  />
                </div>
              </div>

              <div className="bg-muted/40 border-muted/60 flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Parent Entity
                  </p>
                  {entity.parent ? (
                    <Link
                      href={`/entities/${entity.parent_id}`}
                      className="text-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                    >
                      {entity.parent.name}
                      <span className="text-muted-foreground font-mono text-xs font-normal">
                        ({entity.parent.code})
                      </span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  ) : (
                    <p className="text-muted-foreground text-sm italic">None</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Calendar className="h-3.5 w-3.5" /> Created
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(entity.created_at)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Clock className="h-3.5 w-3.5" /> Updated
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(entity.updated_at)}
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
                <Code2 className="h-4 w-4" />
              </span>
              Metadata
            </CardTitle>
            <CardDescription>
              Custom attributes for this {typeName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(entity.metadata).length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Object.entries(entity.metadata).map(([key, value]) => {
                  const propSchema =
                    entityType?.metadata_schema.properties[key];
                  const label = propSchema?.title || key;

                  return (
                    <div
                      key={key}
                      className="bg-card group rounded-lg border p-3 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <p className="text-muted-foreground group-hover:text-primary mb-1 text-xs font-medium transition-colors">
                        {label}
                      </p>
                      <p className="text-sm font-medium break-all">
                        {typeof value === "boolean"
                          ? value
                            ? "Yes"
                            : "No"
                          : String(value)}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-muted-foreground bg-muted/20 flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
                <p>No metadata configured.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Workflow Progress
            </h2>
            <p className="text-muted-foreground text-sm">
              Track status and view details for assigned workflows
            </p>
          </div>
        </div>

        {workflowRecords.length > 0 ? (
          <div className="grid gap-6">
            {workflowRecords.map((record) => (
              <Card key={record.id} className="overflow-hidden p-0 gap-0">
                <CardHeader className="bg-muted/30 border-b pb-4 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full">
                        <PlayCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {record.workflow.name}
                        </CardTitle>
                        <CardDescription className="mt-0.5 flex items-center gap-2">
                          <span className="text-xs">
                            Started{" "}
                            {formatDate(record.started_at || record.created_at)}
                          </span>
                          {record.completed_at && (
                            <>
                              <span>•</span>
                              <span className="text-xs">
                                Completed {formatDate(record.completed_at)}
                              </span>
                            </>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <StatusBadge status={record.status} />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <WorkflowPipeline workflowRecord={record} />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                <PlayCircle className="text-muted-foreground/50 h-6 w-6" />
              </div>
              <p className="font-medium">No workflow records found</p>
              <p className="mt-1 max-w-sm text-sm">
                Assign workflows to this entity's type to automatically create
                workflow records.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{entity.name}&quot;? This
              will also delete all associated workflow records.
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
