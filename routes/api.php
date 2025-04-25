<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::get('/get-events', [EventController::class, 'getEvents']);
Route::post('/filter-events', [EventController::class, 'filterEvents']);
Route::post('/search-events', [EventController::class, 'searchEvents']);
Route::get('/event-types', [EventController::class, 'getEventTypes']);
Route::post('/search-events-by-type', [EventController::class, 'searchByType']);
Route::post('/search-events-by-date', [EventController::class, 'searchByDate']);

Route::middleware(['auth:sanctum', 'admin.only'])->group(function () {
    //Events
    Route::post('/create-event', [EventController::class, 'createEvent']);
    Route::put('/edit-event/{id}', [EventController::class, 'updateEvent']);
    Route::delete('/delete-event/{id}', [EventController::class, 'deleteEvent']);

    Route::get('/sign-out', [AuthController::class, 'logout'])->name('sign_out');

});