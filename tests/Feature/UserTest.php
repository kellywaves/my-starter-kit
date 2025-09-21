<?php

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
// RefreshDatabase is already configured in Pest.php

beforeEach(function () {
    // Disable CSRF for tests
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class);
    
    // Create roles and permissions for testing
    $adminRole = Role::create(['name' => 'admin', 'guard_name' => 'web']);
    $userRole = Role::create(['name' => 'user', 'guard_name' => 'web']);
    
    $viewUsersPermission = Permission::create(['name' => 'view users', 'guard_name' => 'web']);
    $createUsersPermission = Permission::create(['name' => 'create users', 'guard_name' => 'web']);
    $editUsersPermission = Permission::create(['name' => 'edit users', 'guard_name' => 'web']);
    $deleteUsersPermission = Permission::create(['name' => 'delete users', 'guard_name' => 'web']);
    
    $adminRole->givePermissionTo([$viewUsersPermission, $createUsersPermission, $editUsersPermission, $deleteUsersPermission]);
    
    // Create admin user
    $this->admin = User::factory()->create();
    $this->admin->assignRole($adminRole);
    
    // Create regular user
    $this->user = User::factory()->create();
    $this->user->assignRole($userRole);
});

it('can view users index page', function () {
    $this->actingAs($this->admin)
        ->get('/users')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Users/Index')
            ->has('users.data')
        );
});

it('cannot view users index page without permission', function () {
    $this->actingAs($this->user)
        ->get('/users')
        ->assertForbidden();
});

it('can view create user page', function () {
    $this->actingAs($this->admin)
        ->get('/users/create')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Users/Create')
            ->has('roles')
        );
});

it('cannot view create user page without permission', function () {
    $this->actingAs($this->user)
        ->get('/users/create')
        ->assertForbidden();
});

it('can create a new user with roles', function () {
    $role = Role::where('name', 'user')->first();
    
    $userData = [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'roles' => [$role->id],
    ];

    $this->actingAs($this->admin)
        ->withoutMiddleware()
        ->post('/users', $userData)
        ->assertRedirect('/users')
        ->assertSessionHas('success', 'User created successfully.');

    $this->assertDatabaseHas('users', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
    ]);

    $newUser = User::where('email', 'john@example.com')->first();
    expect($newUser->hasRole('user'))->toBeTrue();
});

it('cannot create user without permission', function () {
    $userData = [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $this->actingAs($this->user)
        ->postJson('/users', $userData)
        ->assertForbidden();
});

it('validates required fields when creating user', function () {
    $this->actingAs($this->admin)
        ->postJson('/users', [])
        ->assertSessionHasErrors(['name', 'email', 'password']);
});

it('validates email uniqueness when creating user', function () {
    $existingUser = User::factory()->create(['email' => 'existing@example.com']);
    
    $userData = [
        'name' => 'John Doe',
        'email' => 'existing@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $this->actingAs($this->admin)
        ->postJson('/users', $userData)
        ->assertSessionHasErrors(['email']);
});

it('can view user show page', function () {
    $testUser = User::factory()->create();
    
    $this->actingAs($this->admin)
        ->get("/users/{$testUser->id}")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Users/Show')
            ->has('user')
        );
});

it('can view user edit page', function () {
    $testUser = User::factory()->create();
    
    $this->actingAs($this->admin)
        ->get("/users/{$testUser->id}/edit")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Users/Edit')
            ->has('user')
            ->has('roles')
        );
});

it('can update user information', function () {
    $testUser = User::factory()->create();
    $role = Role::where('name', 'admin')->first();
    
    $updateData = [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'roles' => [$role->id],
    ];

    $this->actingAs($this->admin)
        ->putJson("/users/{$testUser->id}", $updateData)
        ->assertRedirect('/users')
        ->assertSessionHas('success', 'User updated successfully.');

    $testUser->refresh();
    expect($testUser->name)->toBe('Updated Name');
    expect($testUser->email)->toBe('updated@example.com');
    expect($testUser->hasRole('admin'))->toBeTrue();
});

it('can update user password', function () {
    $testUser = User::factory()->create();
    
    $updateData = [
        'name' => $testUser->name,
        'email' => $testUser->email,
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ];

    $this->actingAs($this->admin)
        ->putJson("/users/{$testUser->id}", $updateData)
        ->assertRedirect('/users')
        ->assertSessionHas('success', 'User updated successfully.');

    $testUser->refresh();
    expect(password_verify('newpassword123', $testUser->password))->toBeTrue();
});

it('can delete user', function () {
    $testUser = User::factory()->create();
    
    $this->actingAs($this->admin)
        ->deleteJson("/users/{$testUser->id}")
        ->assertRedirect('/users')
        ->assertSessionHas('success', 'User deleted successfully.');

    $this->assertDatabaseMissing('users', ['id' => $testUser->id]);
});

it('cannot delete user without permission', function () {
    $testUser = User::factory()->create();
    
    $this->actingAs($this->user)
        ->deleteJson("/users/{$testUser->id}")
        ->assertForbidden();
});

it('can search users', function () {
    User::factory()->create(['name' => 'John Doe', 'email' => 'john@example.com']);
    User::factory()->create(['name' => 'Jane Smith', 'email' => 'jane@example.com']);
    
    $this->actingAs($this->admin)
        ->get('/users?search=John')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Users/Index')
            ->has('users.data', 1)
            ->where('users.data.0.name', 'John Doe')
        );
});