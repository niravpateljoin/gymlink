<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FitnessService;

class FitnessController extends Controller
{
    protected $service;

    public function __construct(FitnessService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['category', 'location', 'vibe', 'price_min', 'price_max', 'search']);
        $results = $this->service->filter($filters);

        return response()->json($results);
    }
}
