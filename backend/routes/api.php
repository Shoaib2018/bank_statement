<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// Auth
use App\Http\Controllers\Auth\AccountAuthController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Auth\UserAuthController;
// Account
use App\Http\Controllers\Admin\Account\AccountController as AdminAccountController;
// Particulars
use App\Http\Controllers\Admin\Particular\ParticularController as AdminParticularController;
use App\Http\Controllers\Account\Particular\ParticularController as AccountParticularController;
// Statements
use App\Http\Controllers\Account\Statement\StatementController;
// Users
use App\Http\Controllers\User\User\UserController;
// Messages
use App\Http\Controllers\User\Message\MessageController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => 'account'],
    Route::group(['prefix' => 'account'],
        function ($router) {
            Route::post('/login', [AccountAuthController::class, 'login']);
            Route::post('/logout', [AccountAuthController::class, 'logout']);
            Route::get('/', [AccountAuthController::class, 'index']);
        }
    ),
    Route::group(
        ['prefix' => 'particulars'],
        function ($router) {
            Route::get('/list', [AccountParticularController::class, 'index']);
        }
    ),
    Route::group(
        ['prefix' => 'statements'],
        function ($router) {
            Route::get('/', [StatementController::class, 'index']);
            Route::post('/', [StatementController::class, 'create']);
            Route::get('/{id}', [StatementController::class, 'show']);
            Route::post('/{id}/edit', [StatementController::class, 'update']);
            Route::delete('/{id}', [StatementController::class, 'destroy']);
        }
    )
);

Route::group(['middleware' => 'admin'],
    Route::group(
        ['prefix' => 'admin'],
        function ($router) {
            Route::post('/login', [AdminAuthController::class, 'login']);
            Route::post('/logout', [AdminAuthController::class, 'logout']);
            Route::get('/particulars', [ParticularController::class, 'index']);
        }
    ),
    Route::group(
        ['prefix' => 'accounts'],
        function ($router) {
            Route::get('/', [AdminAccountController::class, 'index']);
            Route::post('/', [AdminAccountController::class, 'create']);
            Route::get('/{id}', [AdminAccountController::class, 'show']);
            Route::post('/{id}/edit', [AdminAccountController::class, 'update']);
            Route::delete('/{id}', [AdminAccountController::class, 'destroy']);
        }
    ),
    Route::group(
        ['prefix' => 'particulars'],
        function ($router) {
            Route::get('/', [AdminParticularController::class, 'index']);
            Route::post('/', [AdminParticularController::class, 'create']);
            Route::get('/{id}', [AdminParticularController::class, 'show']);
            Route::post('/{id}/edit', [AdminParticularController::class, 'update']);
            Route::delete('/{id}', [AdminParticularController::class, 'destroy']);
        }
    ),
);

Route::group(['middleware' => 'user'],
    Route::group(['prefix' => 'user'],
        function ($router) {
            Route::post('/login', [UserAuthController::class, 'login']);
            Route::post('/logout', [UserAuthController::class, 'logout']);
        }
    ),
    Route::group(['prefix' => 'users'],
        function ($router) {
            Route::get('/', [UserController::class, 'index']);
        }
    ),
    Route::group(['prefix' => 'messages'],
        function ($router) {
            Route::get('/{receiver_id}', [MessageController::class, 'index']);
            Route::post('/', [MessageController::class, 'send']);
        },
    ),
);

