import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Edit, ArrowLeft, Calendar, Users, Lock, Settings, BarChart3, FileText, Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { index as rolesIndex, edit as rolesEdit } from '@/routes/roles';
import { type BreadcrumbItem } from '@/types';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
    created_at: string;
    updated_at: string;
}

interface ShowRoleProps {
    role: Role;
}

export default function Show({ role }: ShowRoleProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Roles',
            href: rolesIndex().url,
        },
        {
            title: role.name,
            href: '#',
        },
    ];

    // Group permissions by category
    const groupedPermissions = role.permissions.reduce(
        (acc, permission) => {
            const category = permission.name.split('.')[0];
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(permission);
            return acc;
        },
        {} as Record<string, Permission[]>
    );

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'users':
                return <Users className="h-4 w-4" />;
            case 'roles':
                return <Shield className="h-4 w-4" />;
            case 'posts':
                return <FileText className="h-4 w-4" />;
            case 'settings':
                return <Settings className="h-4 w-4" />;
            case 'analytics':
                return <BarChart3 className="h-4 w-4" />;
            default:
                return <Lock className="h-4 w-4" />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'users':
                return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-800';
            case 'roles':
                return 'bg-purple-500/10 text-purple-600 border-purple-200 dark:text-purple-400 dark:border-purple-800';
            case 'posts':
                return 'bg-green-500/10 text-green-600 border-green-200 dark:text-green-400 dark:border-green-800';
            case 'settings':
                return 'bg-orange-500/10 text-orange-600 border-orange-200 dark:text-orange-400 dark:border-orange-800';
            case 'analytics':
                return 'bg-cyan-500/10 text-cyan-600 border-cyan-200 dark:text-cyan-400 dark:border-cyan-800';
            default:
                return 'bg-gray-500/10 text-gray-600 border-gray-200 dark:text-gray-400 dark:border-gray-800';
        }
    };

    const getCategoryDescription = (category: string) => {
        switch (category) {
            case 'users':
                return 'User management and authentication';
            case 'roles':
                return 'Role and permission management';
            case 'posts':
                return 'Content creation and management';
            case 'settings':
                return 'System configuration and settings';
            case 'analytics':
                return 'Data analysis and reporting';
            default:
                return 'System permissions';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Role: ${role.name}`} />
            
            <div className="min-h-screen bg-background">
                {/* Professional Header */}
                <div className="border-b border-border bg-card/50 backdrop-blur-sm">
                    <div className="container mx-auto px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <Link href={rolesIndex().url}>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-foreground transition-colors"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Roles
                                    </Button>
                                </Link>
                                <div className="h-8 w-px bg-border" />
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        Role Details
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Comprehensive view of role information and assigned permissions
                                    </p>
                                </div>
                            </div>
                            <Link href={rolesEdit({ role: role.id }).url}>
                                <Button className="bg-primary hover:bg-primary/90 transition-colors shadow-sm">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Role
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-6 py-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Role Information Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8">
                                <Card className="border-border bg-card shadow-sm">
                                    <CardHeader className="pb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 shadow-sm">
                                                <Shield className="h-7 w-7 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl text-foreground font-semibold">
                                                    {role.name}
                                                </CardTitle>
                                                <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    System Role
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-5">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                                                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">Created</p>
                                                    <p className="text-sm text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {new Date(role.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950/30">
                                                    <Edit className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">Last Updated</p>
                                                    <p className="text-sm text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {new Date(role.updated_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/30">
                                                    <Lock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">Total Permissions</p>
                                                    <p className="text-sm text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''} assigned
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Permissions List */}
                        <div className="lg:col-span-2">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground mb-3">Assigned Permissions</h2>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        All permissions assigned to this role ({role.permissions.length} total)
                                    </p>
                                </div>

                                {role.permissions.length > 0 ? (
                                    <Card className="border-border bg-card shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-4 gap-3">
                                                {role.permissions.map((permission) => (
                                                    <div
                                                        key={permission.id}
                                                        className="flex items-center gap-2 rounded-md bg-muted/50 p-2 text-sm"
                                                    >
                                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                                        <span className="text-foreground truncate">{permission.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card className="border-border bg-card shadow-sm">
                                        <CardContent className="flex flex-col items-center justify-center py-16">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-6">
                                                <Lock className="h-8 w-8 text-sm text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-foreground mb-3">No Permissions Assigned</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
                                                This role doesn't have any permissions assigned yet. Click "Edit Role" to add permissions and define access controls.
                                            </p>
                                            <Link href={rolesEdit({ role: role.id }).url}>
                                                <Button variant="outline" className="gap-2">
                                                    <Edit className="h-4 w-4" />
                                                    Assign Permissions
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
