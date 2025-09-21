import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, Edit, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { index as permissionsIndex, edit as permissionsEdit } from '@/routes/permissions';
import { type BreadcrumbItem } from '@/types';

interface Permission {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface ShowPermissionProps {
    permission: Permission;
}

export default function Show({ permission }: ShowPermissionProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Permissions',
            href: permissionsIndex().url,
        },
        {
            title: permission.name,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Permission: ${permission.name}`} />
            
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={permissionsIndex().url}>
                                <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Permissions
                            </Button>
                        </Link>
                    </div>
                    <Link href={permissionsEdit({ permission: permission.id }).url}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Permission
                        </Button>
                    </Link>
                </div>

                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Permission Details
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        View permission information and details
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <CardTitle>{permission.name}</CardTitle>
                                <CardDescription>
                                    Created {new Date(permission.created_at).toLocaleDateString()} • 
                                    Updated {new Date(permission.updated_at).toLocaleDateString()}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    Permission Name
                                </h4>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    {permission.name}
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    Created At
                                </h4>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(permission.created_at).toLocaleString()}
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    Last Updated
                                </h4>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(permission.updated_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
