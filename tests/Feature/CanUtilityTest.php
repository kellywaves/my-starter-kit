<?php

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    // Create test permissions
    Permission::create(['name' => 'view-roles']);
    Permission::create(['name' => 'create-roles']);
    Permission::create(['name' => 'edit-roles']);
    Permission::create(['name' => 'delete-roles']);
    Permission::create(['name' => 'view-permissions']);
    Permission::create(['name' => 'create-permissions']);
    Permission::create(['name' => 'edit-permissions']);
    Permission::create(['name' => 'delete-permissions']);
});

it('can check if user has specific permission', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('view-roles');

    expect($user->hasPermissionTo('view-roles'))->toBeTrue();
    expect($user->hasPermissionTo('create-roles'))->toBeFalse();
});

it('can check if user has permission through role', function () {
    $user = User::factory()->create();
    
    $role = Role::create(['name' => 'Editor']);
    $role->givePermissionTo(['view-roles', 'create-roles']);
    
    $user->assignRole($role);

    expect($user->hasPermissionTo('view-roles'))->toBeTrue();
    expect($user->hasPermissionTo('create-roles'))->toBeTrue();
    expect($user->hasPermissionTo('delete-roles'))->toBeFalse();
});

it('can check if user has any of multiple permissions', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('view-roles');

    expect($user->hasAnyPermission(['view-roles', 'create-roles']))->toBeTrue();
    expect($user->hasAnyPermission(['edit-roles', 'delete-roles']))->toBeFalse();
});

it('can check if user has all permissions', function () {
    $user = User::factory()->create();
    $user->givePermissionTo(['view-roles', 'create-roles']);

    expect($user->hasAllPermissions(['view-roles', 'create-roles']))->toBeTrue();
    expect($user->hasAllPermissions(['view-roles', 'create-roles', 'edit-roles']))->toBeFalse();
});

it('can check if user has specific role', function () {
    $user = User::factory()->create();
    
    $role = Role::create(['name' => 'Editor']);
    $user->assignRole($role);

    expect($user->hasRole('Editor'))->toBeTrue();
    expect($user->hasRole('Admin'))->toBeFalse();
});

it('can get all user permissions', function () {
    $user = User::factory()->create();
    $user->givePermissionTo(['view-roles', 'create-roles']);

    $permissions = $user->getAllPermissions()->pluck('name')->toArray();
    
    expect($permissions)->toContain('view-roles');
    expect($permissions)->toContain('create-roles');
    expect($permissions)->not->toContain('edit-roles');
});

it('can get all user roles', function () {
    $user = User::factory()->create();
    
    $editorRole = Role::create(['name' => 'Editor']);
    $adminRole = Role::create(['name' => 'Admin']);
    
    $user->assignRole([$editorRole, $adminRole]);

    $roles = $user->getRoleNames()->toArray();
    
    expect($roles)->toContain('Editor');
    expect($roles)->toContain('Admin');
});
