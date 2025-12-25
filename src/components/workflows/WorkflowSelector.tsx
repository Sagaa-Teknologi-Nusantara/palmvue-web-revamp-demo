"use client";

import { ArrowRight, PlayCircle, Plus, Repeat, Search, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkflowOption } from "@/types";

interface WorkflowSelectorProps {
  availableWorkflows: WorkflowOption[];
  selectedWorkflowIds: string[];
  onChange: (ids: string[]) => void;
}

export function WorkflowSelector({
  availableWorkflows,
  selectedWorkflowIds,
  onChange,
}: WorkflowSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedIds, setTempSelectedIds] =
    useState<string[]>(selectedWorkflowIds);

  const handleOpen = () => {
    setTempSelectedIds(selectedWorkflowIds);
    setSearchQuery("");
    setOpen(true);
  };

  const handleToggle = (id: string, checked: boolean) => {
    if (checked) {
      setTempSelectedIds((prev) => [...prev, id]);
    } else {
      setTempSelectedIds((prev) => prev.filter((prevId) => prevId !== id));
    }
  };

  const handleSave = () => {
    onChange(tempSelectedIds);
    setOpen(false);
  };

  const filteredWorkflows = availableWorkflows.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedWorkflows = availableWorkflows.filter((w) =>
    selectedWorkflowIds.includes(w.id),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedWorkflows.map((workflow) => (
          <Badge
            key={workflow.id}
            variant="secondary"
            className="flex items-center gap-1.5 py-1.5 pr-2 pl-3"
          >
            <PlayCircle className="h-3.5 w-3.5 opacity-70" />
            {workflow.name}
            <button
              type="button"
              onClick={() =>
                onChange(selectedWorkflowIds.filter((id) => id !== workflow.id))
              }
              className="hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground ml-1 rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {workflow.name}</span>
            </button>
          </Badge>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 border-dashed"
          onClick={handleOpen}
        >
          <Plus className="mr-2 h-3.5 w-3.5" />
          Assign Workflows
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Workflows</DialogTitle>
            <DialogDescription>
              Select workflows to automatically assign to entities of this type.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="h-[300px] overflow-hidden rounded-md border">
              <ScrollArea className="h-full">
                {filteredWorkflows.length === 0 ? (
                  <div className="text-muted-foreground flex h-full flex-col items-center justify-center p-4 text-center">
                    <p className="text-sm">No workflows found.</p>
                  </div>
                ) : (
                  <div className="space-y-1 p-1">
                    {filteredWorkflows.map((workflow) => (
                      <div
                        key={workflow.id}
                        className="hover:bg-muted/50 flex cursor-pointer items-center space-x-3 rounded-sm p-2 transition-colors"
                        onClick={() => {
                          const isSelected = tempSelectedIds.includes(
                            workflow.id,
                          );
                          handleToggle(workflow.id, !isSelected);
                        }}
                      >
                        <Checkbox
                          id={`wf-${workflow.id}`}
                          checked={tempSelectedIds.includes(workflow.id)}
                          onCheckedChange={(checked) =>
                            handleToggle(workflow.id, checked as boolean)
                          }
                        />
                        <div className="min-w-0 flex-1">
                          <label
                            htmlFor={`wf-${workflow.id}`}
                            className="block cursor-pointer truncate text-sm leading-none font-medium"
                          >
                            {workflow.name}
                          </label>
                          <div className="mt-1.5 flex flex-wrap gap-2">
                            {workflow.is_auto_start && (
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1 border-blue-200 bg-blue-50 px-1.5 py-0 text-[10px] font-normal text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                              >
                                <PlayCircle className="h-3 w-3" />
                                Auto-start
                              </Badge>
                            )}
                            {workflow.is_loopable ? (
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1 border-amber-200 bg-amber-50 px-1.5 py-0 text-[10px] font-normal text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                              >
                                <Repeat className="h-3 w-3" />
                                Loopable
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1 border-slate-200 bg-slate-50 px-1.5 py-0 text-[10px] font-normal text-slate-500 dark:border-slate-800 dark:bg-slate-900/20 dark:text-slate-400"
                              >
                                <ArrowRight className="h-3 w-3" />
                                One-time
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <span>{tempSelectedIds.length} selected</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
