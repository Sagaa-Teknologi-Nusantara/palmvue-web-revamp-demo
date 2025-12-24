'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Trash2 } from 'lucide-react';
import type { EntityType } from '@/types';
import { formatDate } from '@/lib/date';

interface EntityTypeTableProps {
  entityTypes: EntityType[];
  onDelete: (id: string) => void;
}

export function EntityTypeTable({ entityTypes, onDelete }: EntityTypeTableProps) {
  const router = useRouter();

  if (entityTypes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No entity types yet</h3>
        <p className="text-gray-500 mb-4">Get started by creating your first entity type.</p>
        <Button asChild>
          <Link href="/entity-types/create">Create Entity Type</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Prefix</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entityTypes.map((entityType) => (
            <TableRow
              key={entityType.id}
              className="cursor-pointer"
              onClick={() => router.push(`/entity-types/${entityType.id}`)}
            >
              <TableCell className="font-medium">{entityType.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{entityType.prefix}</Badge>
              </TableCell>
              <TableCell className="text-gray-500 max-w-xs truncate">
                {entityType.description}
              </TableCell>
              <TableCell className="text-gray-500">
                {formatDate(entityType.created_at)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/entity-types/${entityType.id}`);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(entityType.id);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
