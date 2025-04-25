<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    public function login(Request $request){
        try{
            Log::info('------------------------login - Start------------------------');
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string|min:8',
            ]);

            $user = User::where('email',$request->email)->first();
            if($user){
                // Check If Password Is Wrong
                if(!Hash::check($request->password, $user->password) ){
                    return response()->json(['status' => False, 'response_code' => 401, 'message' => 'Password is incorrect', 'data' => 'null'],401);
                }else{
                    Auth::login($user, true);
                    $access_token = $user->createToken('personal_access_token')->plainTextToken;
                    $user = Auth::user();
                    return response()->json(['status' => True, 'response_code' => 200, 'message' => 'Logged in successfully', 'user' => $user, 'access_token' => $access_token],200);
                }
            }else{
                return response()->json(['status' => False, 'response_code' => 404, 'message' => 'User not found '],200);
            }
        } catch (\Exception $e) {
            //Returning Exception
            return response()->json(['status' => false, 'response_code' => 400, 'message' => $e->getMessage(), 'line_number' => $e->getLine()],400);
        }
    }

    public function signOut(){
        try {
            //Delete All Tokens Of Logged In User
            if(!auth('sanctum')->user()){
                return response()->json(['status' => false, 'response_code' => 401, 'message' => 'You are not logged in', 'data' => null],200);
            }
            Auth::logout();
            return response()->json(['status' => true, 'response_code' => 200, 'message' => 'logged out successfully'],200);

        } catch (\Exception $e) {
            //Returning Exception
            return response()->json(['status' => false, 'response_code' => 400, 'message' => $e->getMessage(), 'line_number' => $e->getLine()],400);
        }
    }

}
