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
import type { Entity } from '@/types';
import { formatDate } from '@/lib/code-generator';

interface EntityTableProps {
  entities: Entity[];
  onDelete: (id: string) => void;
}

export function EntityTable({ entities, onDelete }: EntityTableProps) {
  const router = useRouter();

  if (entities.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No entities found</h3>
        <p className="text-gray-500 mb-4">
          Get started by creating your first entity or adjust your filters.
        </p>
        <Button asChild>
          <Link href="/entities/create">Create Entity</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entities.map((entity) => (
            <TableRow
              key={entity.id}
              className="cursor-pointer"
              onClick={() => router.push(`/entities/${entity.id}`)}
            >
              <TableCell>
                <Badge variant="outline">{entity.code}</Badge>
              </TableCell>
              <TableCell className="font-medium">{entity.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{entity.entity_type.name}</Badge>
              </TableCell>
              <TableCell className="text-gray-500">
                {entity.parent ? (
                  <span className="text-sm">
                    {entity.parent.code}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell className="text-gray-500">
                {formatDate(entity.created_at)}
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
                        router.push(`/entities/${entity.id}`);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(entity.id);
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
