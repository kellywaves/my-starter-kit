<?php

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    // Create test permissions
    Permission::create(['name' => 'view roles']);
    Permission::create(['name' => 'create roles']);
    Permission::create(['name' => 'edit roles']);
    Permission::create(['name' => 'delete roles']);
    Permission::create(['name' => 'view permissions']);
    Permission::create(['name' => 'create permissions']);
    Permission::create(['name' => 'edit permissions']);
    Permission::create(['name' => 'delete permissions']);
});

it('can create a role with permissions', function () {
    $user = User::factory()->create();
    $user->givePermissionTo(['create roles', 'view roles']);

    $this->actingAs($user);

    $response = $this->post(route('roles.store'), [
        'name' => 'Editor',
        'permissions' => [1, 2], // view roles, create roles
    ]);

    $response->assertRedirect(route('roles.index'));
    $response->assertSessionHas('success', 'Role created successfully.');

    $this->assertDatabaseHas('roles', [
        'name' => 'Editor',
    ]);

    $role = Role::where('name', 'Editor')->first();
    expect($role->permissions)->toHaveCount(2);
});

it('can view roles index', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('view roles');

    $this->actingAs($user);

    $response = $this->get(route('roles.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('Roles/Index'));
});

it('cannot access roles without permission', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $response = $this->get(route('roles.index'));

    $response->assertForbidden();
});

it('can create a permission', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('create permissions');

    $this->actingAs($user);

    $response = $this->post(route('permissions.store'), [
        'name' => 'view reports',
    ]);

    $response->assertRedirect(route('permissions.index'));
    $response->assertSessionHas('success', 'Permission created successfully.');

    $this->assertDatabaseHas('permissions', [
        'name' => 'view reports',
    ]);
});

it('can view permissions index', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('view permissions');

    $this->actingAs($user);

    $response = $this->get(route('permissions.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('Permissions/Index'));
});

it('validates role name is required', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('create roles');

    $this->actingAs($user);

    $response = $this->post(route('roles.store'), [
        'name' => '',
    ]);

    $response->assertSessionHasErrors(['name']);
});

it('validates permission name is unique', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('create permissions');

    $this->actingAs($user);

    // Create first permission
    $this->post(route('permissions.store'), [
        'name' => 'unique permission',
    ]);

    // Try to create duplicate
    $response = $this->post(route('permissions.store'), [
        'name' => 'unique permission',
    ]);

    $response->assertSessionHasErrors(['name']);
});

it('can assign permissions to user through role', function () {
    $user = User::factory()->create();
    
    $role = Role::create(['name' => 'Editor']);
    $role->givePermissionTo(['view roles', 'create roles']);
    
    $user->assignRole($role);

    expect($user->hasPermissionTo('view roles'))->toBeTrue();
    expect($user->hasPermissionTo('create roles'))->toBeTrue();
    expect($user->hasPermissionTo('delete roles'))->toBeFalse();
});