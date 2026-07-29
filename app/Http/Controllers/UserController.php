<?php

namespace App\Http\Controllers;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;


class UserController extends Controller
{


    public function index()
    {

        return Inertia::render('Users/Index',[

            'users'=>User::with('roles')->get()

        ]);

    }




    public function create()
    {

        return Inertia::render('Users/Create',[

            'roles'=>Role::all()

        ]);

    }




    public function store(Request $request)
    {


        $request->validate([

            'name'=>'required',

            'email'=>'required|email|unique:users',

            'password'=>'required|min:8',

            'role'=>'required'

        ]);



        $user = User::create([

            'name'=>$request->name,

            'email'=>$request->email,

            'password'=>Hash::make($request->password)

        ]);



        $user->assignRole($request->role);



        return redirect()
            ->route('users.index')
            ->with('success','User created');

    }

public function edit(User $user)
{
    return Inertia::render('Users/Edit', [
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->roles->pluck('name')->first(),
        ],

        'roles' => Role::pluck('name')
    ]);
}

public function update(Request $request, User $user)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,'.$user->id,
        'role' => 'required'
    ]);


    $user->update([
        'name'=>$request->name,
        'email'=>$request->email,
    ]);


    $user->syncRoles([$request->role]);


    return redirect()
        ->route('users.index')
        ->with('success','User updated successfully');
}


    public function destroy(User $user)
{
    if(auth()->id() === $user->id){

        return redirect()
            ->route('users.index')
            ->with('error','You cannot delete your own account.');

    }


    $user->delete();


    return redirect()
        ->route('users.index')
        ->with('success','User deleted successfully');

}


}