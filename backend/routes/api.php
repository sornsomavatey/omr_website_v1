<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\ReservationController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/reservations', [ReservationController::class, 'store']);
Route::post('/telegram-reservation', [ReservationController::class, 'store']);
Route::post('/telegram-event', [ReservationController::class, 'storeEvent']);
Route::post('/telegram-feedback', [ReservationController::class, 'storeFeedback']);
