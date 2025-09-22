<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FitnessController;

Route::get('/fitness', [FitnessController::class, 'index']);
