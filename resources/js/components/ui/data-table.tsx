import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Column<T> {
    key: keyof T | string;
    label: string;
    width?: string;
    render?: (item: T, index: number) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchUrl: string;
    searchPlaceholder?: string;
    searchValue?: string;
    emptyState?: {
        icon: React.ReactNode;
        title: string;
        description: string;
        action?: React.ReactNode;
    };
    className?: string;
}

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    searchUrl,
    searchPlaceholder = "Search...",
    searchValue = "",
    emptyState,
    className = "",
}: DataTableProps<T>) {
    const [search, setSearch] = useState(searchValue);

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(searchUrl, { search: value }, { preserveState: true });
    };

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {data.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableHead 
                                        key={index}
                                        className={column.width ? column.width : ""}
                                    >
                                        {column.label}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={item.id || index}>
                                    {columns.map((column, colIndex) => (
                                        <TableCell 
                                            key={colIndex}
                                            className={column.className || ""}
                                        >
                                            {column.render 
                                                ? column.render(item, index)
                                                : item[column.key as keyof T]
                                            }
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    emptyState && (
                        <div className="text-center py-12">
                            {emptyState.icon}
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                                {emptyState.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                {emptyState.description}
                            </p>
                            {emptyState.action && (
                                <div className="mt-6">
                                    {emptyState.action}
                                </div>
                            )}
                        </div>
                    )
                )}
            </CardContent>
        </Card>
    );
}
