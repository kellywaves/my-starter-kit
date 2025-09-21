import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { index as usersIndex, create as usersCreate, show as usersShow, edit as usersEdit, destroy as usersDestroy } from '@/routes/users';
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
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Plus, Users, Edit, Trash2, Eye, Mail } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles: Array<{
        id: number;
        name: string;
    }>;
}

interface UsersIndexProps {
    users: {
        data: User[];
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

export default function Index({ users, filters }: UsersIndexProps) {
    const { props } = usePage<{ flash: { success?: string; error?: string } }>()

    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean
        user: User | null
        isLoading: boolean
    }>({
        isOpen: false,
        user: null,
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
            title: 'Users',
            href: usersIndex().url,
        },
    ];

    const handleDeleteClick = (user: User) => {
        setDeleteDialog({
            isOpen: true,
            user,
            isLoading: false,
        })
    }

    const handleDeleteConfirm = () => {
        if (!deleteDialog.user) return

        setDeleteDialog(prev => ({ ...prev, isLoading: true }))

        router.delete(usersDestroy({ user: deleteDialog.user.id }).url, {
            onSuccess: () => {
                setDeleteDialog({
                    isOpen: false,
                    user: null,
                    isLoading: false,
                })
            },
            onError: () => {
                toast.error("Failed to delete user")
                setDeleteDialog(prev => ({ ...prev, isLoading: false }))
            },
        })
    }

    const handleDeleteCancel = () => {
        setDeleteDialog({
            isOpen: false,
            user: null,
            isLoading: false,
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            Users
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Manage system users and their roles
                        </p>
                    </div>
                    {can('create users') && (
                        <Link href={usersCreate().url}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create User
                            </Button>
                        </Link>
                    )}
                </div>

                <DataTable
                    data={users.data}
                    searchUrl={usersIndex().url}
                    searchPlaceholder="Search users..."
                    searchValue={filters.search || ''}
                    emptyState={{
                        icon: <Users className="mx-auto h-12 w-12 text-gray-400" />,
                        title: "No users found",
                        description: "Get started by creating a new user.",
                        action: can('create users') ? (
                            <Link href={usersCreate().url}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create User
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
                            key: 'user',
                            label: 'User',
                            render: (user) => (
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <span className="font-medium">{user.name}</span>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                            )
                        },
                        {
                            key: 'roles',
                            label: 'Roles',
                            render: (user) => (
                                <div className="flex flex-wrap gap-1">
                                    {user.roles.length > 0 ? (
                                        user.roles.map((role) => (
                                            <Badge key={role.id} variant="secondary">
                                                {role.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <Badge variant="outline">No roles</Badge>
                                    )}
                                </div>
                            )
                        },
                        {
                            key: 'status',
                            label: 'Status',
                            render: (user) => (
                                <Badge variant={user.email_verified_at ? "default" : "secondary"}>
                                    {user.email_verified_at ? "Verified" : "Unverified"}
                                </Badge>
                            )
                        },
                        {
                            key: 'created_at',
                            label: 'Created',
                            render: (user) => (
                                <span className="text-muted-foreground">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </span>
                            )
                        },
                        {
                            key: 'actions',
                            label: 'Actions',
                            width: 'text-right w-[100px]',
                            render: (user) => (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {can('view users') && (
                                            <DropdownMenuItem asChild>
                                                <Link href={usersShow({ user: user.id }).url}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        {can('edit users') && (
                                            <DropdownMenuItem asChild>
                                                <Link href={usersEdit({ user: user.id }).url}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        {can('delete users') && (
                                            <DropdownMenuItem
                                                onClick={() => handleDeleteClick(user)}
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
                <AdvancedPagination pagination={users} className="mt-6" />

                {/* Confirm Delete Dialog */}
                <ConfirmDeleteDialog
                    isOpen={deleteDialog.isOpen}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    title="Delete User"
                    itemName={deleteDialog.user?.name}
                    isLoading={deleteDialog.isLoading}
                />
            </div>
        </AppLayout>
    );
}
