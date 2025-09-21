import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Shield, Users, Settings, FileText, Database, Lock } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { index as rolesIndex, update as rolesUpdate } from '@/routes/roles';
import { type BreadcrumbItem } from '@/types';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface EditRoleProps {
    role: Role;
    permissions: Permission[];
}

export default function Edit({ role, permissions }: EditRoleProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: role.permissions.map(p => p.id),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(rolesUpdate({ role: role.id }).url);
    };

    const handlePermissionChange = (permissionId: number, checked: boolean) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionId]);
        } else {
            setData('permissions', data.permissions.filter(id => id !== permissionId));
        }
    };

    const selectAllPermissions = () => {
        setData('permissions', permissions.map(p => p.id));
    };

    const clearAllPermissions = () => {
        setData('permissions', []);
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Users':
                return <Users className="h-4 w-4" />;
            case 'Roles':
                return <Shield className="h-4 w-4" />;
            case 'Content':
                return <FileText className="h-4 w-4" />;
            case 'Analytics':
                return <Settings className="h-4 w-4" />;
            case 'System':
                return <Database className="h-4 w-4" />;
            default:
                return <Lock className="h-4 w-4" />;
        }
    };

    const getPermissionCategory = (permissionName: string): string => {
        const name = permissionName.toLowerCase();
        
        if (name.includes('dashboard')) return 'Dashboard';
        if (name.includes('role')) return 'Roles';
        if (name.includes('permission')) return 'Roles';
        if (name.includes('user')) return 'Users';
        if (name.includes('profile')) return 'Users';
        if (name.includes('content')) return 'Content';
        if (name.includes('analytics')) return 'Analytics';
        if (name.includes('system')) return 'System';
        
        return 'General';
    };

    // Group permissions by category
    const groupedPermissions = permissions.reduce(
        (acc, permission) => {
            const category = getPermissionCategory(permission.name);
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(permission);
            return acc;
        },
        {} as Record<string, Permission[]>
    );

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
            title: 'Edit Role',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Role" />
            
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-7xl p-6">
                    <div className="space-y-8">
                        {/* Page Header */}
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Edit Role</h1>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Update role information and configure its permissions across the system</p>
                            </div>
                            <Link href={rolesIndex().url}>
                                <Button variant="outline">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Roles
                                </Button>
                            </Link>
                        </div>

                        {/* Main Content */}
                        <div className="grid gap-8 lg:grid-cols-3">
                            {/* Role Information Sidebar */}
                            <div className="lg:col-span-1">
                                <Card className="border-border bg-card">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-semibold">Role Details</CardTitle>
                                        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                                            Basic information about this role
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-sm font-medium">
                                                Role Name
                                            </Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="bg-input border-border focus:ring-primary"
                                                placeholder="e.g., Content Manager"
                                            />
                                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                        </div>

                                        <div className="rounded-lg bg-muted/50 p-4">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                                <span className="font-medium">Role Summary</span>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                {data.permissions.length} permission{data.permissions.length !== 1 ? 's' : ''} selected
                                            </p>
                                            <div className="mt-3 space-y-1">
                                                {Object.entries(groupedPermissions).map(([category, permissions]) => {
                                                    const selectedInCategory = permissions.filter((p) => data.permissions.includes(p.id)).length;
                                                    if (selectedInCategory === 0) return null;

                                                    return (
                                                        <div key={category} className="flex items-center justify-between text-xs">
                                                            <div className="flex items-center space-x-1">
                                                                {getCategoryIcon(category)}
                                                                <span>{category}</span>
                                                            </div>
                                                            <span className="text-muted-foreground">
                                                                {selectedInCategory}/{permissions.length}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Permissions Section */}
                            <div className="lg:col-span-2">
                                <Card className="border-border bg-card">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg font-semibold">Permissions</CardTitle>
                                                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                                                    Select the permissions this role should have
                                                </CardDescription>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={selectAllPermissions}
                                                    className="border-border hover:bg-accent bg-transparent"
                                                >
                                                    Select All
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={clearAllPermissions}
                                                    className="border-border hover:bg-accent bg-transparent"
                                                >
                                                    Clear All
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-8">
                                            {/* Permissions by Category */}
                                            {Object.entries(groupedPermissions).map(([category, permissions]) => (
                                                <div key={category} className="space-y-4">
                                                    <div className="flex items-center space-x-2 border-b border-border pb-2">
                                                        {getCategoryIcon(category)}
                                                        <h3 className="font-medium text-foreground">{category}</h3>
                                                        <span className="text-xs text-muted-foreground">
                                                            ({permissions.filter((p) => data.permissions.includes(p.id)).length}/
                                                            {permissions.length})
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                        {permissions.map((permission) => (
                                                            <div
                                                                key={permission.id}
                                                                className="group relative rounded-lg border border-border bg-card/50 p-4 transition-all hover:bg-accent/50 hover:border-primary/20"
                                                            >
                                                                <div className="flex items-start space-x-3">
                                                                    <Checkbox
                                                                        id={`permission-${permission.id}`}
                                                                        checked={data.permissions.includes(permission.id)}
                                                                        onCheckedChange={(checked) =>
                                                                            handlePermissionChange(permission.id, checked as boolean)
                                                                        }
                                                                        className="mt-0.5 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                                    />
                                                                    <div className="flex-1 min-w-0">
                                                                        <Label
                                                                            htmlFor={`permission-${permission.id}`}
                                                                            className="text-sm font-medium cursor-pointer text-foreground group-hover:text-primary transition-colors"
                                                                        >
                                                                            {permission.name}
                                                                        </Label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}

                                            {errors.permissions && <p className="text-sm text-destructive">{errors.permissions}</p>}

                                            {/* Action Buttons */}
                                            <div className="flex justify-end space-x-3 pt-6 border-t border-border">
                                                <Link href={rolesIndex().url}>
                                                    <Button type="button" variant="outline" className="border-border hover:bg-accent bg-transparent">
                                                        Cancel
                                                    </Button>
                                                </Link>
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                                                            Updating Role...
                                                        </>
                                                    ) : (
                                                        'Update Role'
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
