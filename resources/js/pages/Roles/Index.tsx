
import { Head, Link, router, usePage } from "@inertiajs/react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  index as rolesIndex,
  create as rolesCreate,
  show as rolesShow,
  edit as rolesEdit,
  destroy as rolesDestroy,
} from "@/routes/roles"
import type { BreadcrumbItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog"
import { MoreHorizontal, Plus, Search, Shield, Edit, Trash2 } from "lucide-react"
import AppLayout from "@/layouts/app-layout"
import { can } from "@/lib/can"

interface Permission {
  id: number
  name: string
}

interface Role {
  id: number
  name: string
  permissions: Permission[]
  created_at: string
  updated_at: string
}

interface RolesIndexProps {
  roles: {
    data: Role[]
    links: any[]
    meta: any
  }
  filters: {
    search?: string
  }
}

export default function Index({ roles, filters }: RolesIndexProps) {
  const { props } = usePage<{ flash: { success?: string; error?: string } }>()
  
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    role: Role | null
    isLoading: boolean
  }>({
    isOpen: false,
    role: null,
    isLoading: false,
  })

  // Handle flash messages
  useEffect(() => {
    if (props.flash?.success) {
      toast.success(props.flash.success)
    }
    if (props.flash?.error) {
      toast.error(props.flash.error)
    }
  }, [props.flash])

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Roles",
      href: rolesIndex().url,
    },
  ]

  const handleSearch = (search: string) => {
    router.get(rolesIndex().url, { search }, { preserveState: true })
  }

  const handleDeleteClick = (role: Role) => {
    setDeleteDialog({
      isOpen: true,
      role,
      isLoading: false,
    })
  }

  const handleDeleteConfirm = () => {
    if (!deleteDialog.role) return

    setDeleteDialog(prev => ({ ...prev, isLoading: true }))

    router.delete(rolesDestroy({ role: deleteDialog.role.id }).url, {
      onSuccess: () => {
        setDeleteDialog({
          isOpen: false,
          role: null,
          isLoading: false,
        })
      },
      onError: () => {
        toast.error("Failed to delete role")
        setDeleteDialog(prev => ({ ...prev, isLoading: false }))
      },
    })
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({
      isOpen: false,
      role: null,
      isLoading: false,
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles" />

      <div className="flex h-full flex-1 flex-col gap-8 p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Roles
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage user roles and configure their access permissions
            </p>
          </div>
          
          
          
          {can('create roles') && (
            <Link href={rolesCreate().url}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Create Role
              </Button>
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  value={filters.search || ""}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-background/50 border-border focus:border-primary"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {roles.data.length} role{roles.data.length !== 1 ? "s" : ""} found
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roles Grid */}
        {roles.data.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.data.map((role) => (
              <Card
                key={role.id}
                className="group border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{role.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {role.permissions.length} permission{role.permissions.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        {can('view roles') && (
                          <DropdownMenuItem asChild>
                            <Link href={rolesShow({ role: role.id }).url} className="cursor-pointer">
                              View Details
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {can('edit roles') && (
                          <DropdownMenuItem asChild>
                            <Link href={rolesEdit({ role: role.id }).url} className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Role
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {can('delete roles') && (
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(role)}
                            className="text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Role
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Permissions Preview */}
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Permissions
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.slice(0, 4).map((permission) => (
                        <Badge
                          key={permission.id}
                          variant="secondary"
                          className="text-xs bg-secondary/50 text-secondary-foreground border border-border/50"
                        >
                          {permission.name}
                        </Badge>
                      ))}
                      {role.permissions.length > 4 && (
                        <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground">
                          +{role.permissions.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Role Stats */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Created {new Date(role.created_at).toLocaleDateString()}</span>
                      <div className="flex items-center space-x-1">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span>Active</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-4">
                <Shield className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No roles found</h3>
              <p className="text-muted-foreground text-center max-w-sm mb-6">
                Get started by creating your first role to manage user permissions and access control.
              </p>
              {can('create roles') && (
                <Link href={rolesCreate().url}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Role
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        {/* Confirm Delete Dialog */}
        <ConfirmDeleteDialog
          isOpen={deleteDialog.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Role"
          itemName={deleteDialog.role?.name}
          isLoading={deleteDialog.isLoading}
        />
      </div>
    </AppLayout>
  )
}
