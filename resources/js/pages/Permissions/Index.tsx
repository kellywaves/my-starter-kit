import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { index as permissionsIndex, create as permissionsCreate, show as permissionsShow, edit as permissionsEdit, destroy as permissionsDestroy } from '@/routes/permissions';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { DataTable } from '@/components/ui/data-table';
import { AdvancedPagination } from '@/components/ui/advanced-pagination';
import { MoreHorizontal, Plus, UserCheck, Edit, Trash2, Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';

interface Permission {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface PermissionsIndexProps {
    permissions: {
        data: Permission[];
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ permissions, filters }: PermissionsIndexProps) {
    const { props } = usePage<{ flash: { success?: string; error?: string } }>()

    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean
        permission: Permission | null
        isLoading: boolean
    }>({
        isOpen: false,
        permission: null,
        isLoading: false,
    })

    // Handle flash messages
    useEffect(() => {
        if (props.flash?.success) {
            toast.success(props.flash.success);
        }
        if (props.flash?.error) {
            toast.error(props.flash.error);
        }
    }, [props.flash]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Permissions',
            href: permissionsIndex().url,
        },
    ];

    const handleDeleteClick = (permission: Permission) => {
        setDeleteDialog({
            isOpen: true,
            permission,
            isLoading: false,
        })
    }

    const handleDeleteConfirm = () => {
        if (!deleteDialog.permission) return

        setDeleteDialog(prev => ({ ...prev, isLoading: true }))

        router.delete(permissionsDestroy({ permission: deleteDialog.permission.id }).url, {
            onSuccess: () => {
                setDeleteDialog({
                    isOpen: false,
                    permission: null,
                    isLoading: false,
                })
            },
            onError: () => {
                toast.error("Failed to delete permission")
                setDeleteDialog(prev => ({ ...prev, isLoading: false }))
            },
        })
    }

    const handleDeleteCancel = () => {
        setDeleteDialog({
            isOpen: false,
            permission: null,
            isLoading: false,
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />
            
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            Permissions
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Manage system permissions
                        </p>
                    </div>
                    {can('create permissions') && (
                        <Link href={permissionsCreate().url}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Permission
                            </Button>
                        </Link>
                    )}
                </div>

                <DataTable
                    data={permissions.data}
                    searchUrl={permissionsIndex().url}
                    searchPlaceholder="Search permissions..."
                    searchValue={filters.search || ''}
                    emptyState={{
                        icon: <UserCheck className="mx-auto h-12 w-12 text-gray-400" />,
                        title: "No permissions found",
                        description: "Get started by creating a new permission.",
                        action: can('create permissions') ? (
                            <Link href={permissionsCreate().url}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Permission
                                </Button>
                            </Link>
                        ) : undefined
                    }}
                    columns={[
                        {
                            key: 'index',
                            label: '#',
                            width: 'w-[50px]',
                            render: (_, index) => (
                                <span className="font-medium text-muted-foreground">
                                    {index + 1}
                                </span>
                            )
                        },
                        {
                            key: 'name',
                            label: 'Permission Name',
                            render: (permission) => (
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                        <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span className="font-medium">{permission.name}</span>
                                </div>
                            )
                        },
                        {
                            key: 'created_at',
                            label: 'Created',
                            render: (permission) => (
                                <span className="text-muted-foreground">
                                    {new Date(permission.created_at).toLocaleDateString()}
                                </span>
                            )
                        },
                        {
                            key: 'updated_at',
                            label: 'Updated',
                            render: (permission) => (
                                <span className="text-muted-foreground">
                                    {new Date(permission.updated_at).toLocaleDateString()}
                                </span>
                            )
                        },
                        {
                            key: 'actions',
                            label: 'Actions',
                            width: 'text-right w-[100px]',
                            render: (permission) => (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {can('view permissions') && (
                                            <DropdownMenuItem asChild>
                                                <Link href={permissionsShow({ permission: permission.id }).url}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        {can('edit permissions') && (
                                            <DropdownMenuItem asChild>
                                                <Link href={permissionsEdit({ permission: permission.id }).url}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        {can('delete permissions') && (
                                            <DropdownMenuItem
                                                onClick={() => handleDeleteClick(permission)}
                                                className="text-red-600 dark:text-red-400"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )
                        }
                    ]}
                />

                {/* Pagination */}
                <AdvancedPagination pagination={permissions} className="mt-6" />

                {/* Confirm Delete Dialog */}
                <ConfirmDeleteDialog
                    isOpen={deleteDialog.isOpen}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Permission"
                    itemName={deleteDialog.permission?.name}
                    isLoading={deleteDialog.isLoading}
                />
            </div>
        </AppLayout>
    );
}
