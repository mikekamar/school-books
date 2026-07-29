<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $permissions = [

            'manage users',
            'create users',
            'edit users',
            'delete users',

            'view schools',
            'edit schools',
            'import schools',

            'view stock',
            'receive books',
            'dispatch books',
            'adjust stock',

            'create delivery',
            'update delivery status',
            'view assigned deliveries',

            'view payments',
            'record payments',
            'approve payments',

            'view reports',
            'export reports',
        ];


        foreach ($permissions as $permission) {

            Permission::firstOrCreate([
                'name' => $permission
            ]);

        }


        // CREATE ROLES
        $admin = Role::firstOrCreate([
            'name' => 'Admin'
        ]);

        $fieldAgent = Role::firstOrCreate([
            'name' => 'Field Agent'
        ]);

        $accountant = Role::firstOrCreate([
            'name' => 'Accountant'
        ]);

        $storeManager = Role::firstOrCreate([
            'name' => 'Store Manager'
        ]);

        $driver = Role::firstOrCreate([
            'name' => 'Driver'
        ]);


        // Assign permissions


        // Admin gets everything
        $admin->syncPermissions([
            'manage users',
            'create users',
            'edit users',
            'delete users',

            'create delivery',
            'update delivery status',

            'import schools',

            'view payments',
            'record payments',
            'approve payments',

            'view reports',
            'export reports',
        ]);


        // Field Agent permissions
        $fieldAgent->syncPermissions([
            'create delivery',
            'update delivery status',
            'view assigned deliveries',
        ]);


        // Store Manager permissions
        $storeManager->syncPermissions([
            'view stock',
            'receive books',
            'dispatch books',
            'adjust stock',
            'view schools',
            'view reports',
        ]);


        // Accountant permissions
        $accountant->syncPermissions([
            'view payments',
            'record payments',
            'approve payments',
            'view reports',
            'export reports',
        ]);


        // Driver permissions
        $driver->syncPermissions([
            'update delivery status',
            'view assigned deliveries',
        ]);
    }
}