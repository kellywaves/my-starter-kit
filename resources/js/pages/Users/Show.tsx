import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, User, Mail, Shield, Calendar, Edit, Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { index as usersIndex, edit as usersEdit } from '@/routes/users';
import { can } from '@/lib/can';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles: Role[];
}

interface UsersShowProps {
    user: User;
}

export default function Show({ user }: UsersShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Users',
            href: usersIndex().url,
        },
        {
            title: user.name,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={user.name} />
            
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            {user.name}
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            User details and information
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link href={usersIndex().url}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Users
                            </Button>
                        </Link>
                        {can('edit users') && (
                            <Link href={usersEdit({ user: user.id }).url}>
                                <Button>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit User
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* User Information */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="mr-2 h-5 w-5" />
                                User Information
                            </CardTitle>
                            <CardDescription>
                                Basic user details and contact information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm font-medium text-muted-foreground">
                                        <User className="mr-2 h-4 w-4" />
                                        Full Name
                                    </div>
                                    <p className="text-lg font-semibold">{user.name}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center text-sm font-medium text-muted-foreground">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Email Address
                                    </div>
                                    <p className="text-lg">{user.email}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm font-medium text-muted-foreground">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Account Created
                                    </div>
                                    <p className="text-lg">
                                        {new Date(user.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center text-sm font-medium text-muted-foreground">
                                        <Eye className="mr-2 h-4 w-4" />
                                        Email Status
                                    </div>
                                    <Badge variant={user.email_verified_at ? "default" : "secondary"}>
                                        {user.email_verified_at ? "Verified" : "Unverified"}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Roles and Permissions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Shield className="mr-2 h-5 w-5" />
                                Roles & Permissions
                            </CardTitle>
                            <CardDescription>
                                Assigned roles and permissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="mb-3 text-sm font-medium text-muted-foreground">
                                        Assigned Roles
                                    </div>
                                    <div className="space-y-2">
                                        {user.roles.length > 0 ? (
                                            user.roles.map((role) => (
                                                <Badge key={role.id} variant="secondary" className="mr-2 mb-2">
                                                    {role.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                No roles assigned
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Details</CardTitle>
                        <CardDescription>
                            Additional account information and metadata
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                                <div className="text-sm font-medium text-muted-foreground">
                                    User ID
                                </div>
                                <p className="font-mono text-sm">#{user.id}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="text-sm font-medium text-muted-foreground">
                                    Last Updated
                                </div>
                                <p className="text-sm">
                                    {new Date(user.updated_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="text-sm font-medium text-muted-foreground">
                                    Email Verified
                                </div>
                                <p className="text-sm">
                                    {user.email_verified_at 
                                        ? new Date(user.email_verified_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })
                                        : 'Not verified'
                                    }
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="text-sm font-medium text-muted-foreground">
                                    Role Count
                                </div>
                                <p className="text-sm">{user.roles.length} assigned</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
