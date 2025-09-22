<?php

namespace App\Services;

class FitnessService
{
    private $data;

    public function __construct()
    {
        $this->data = json_decode(file_get_contents(storage_path('app/data/fitness_businesses.json')), true);
    }

    public function all()
    {
        return $this->data;
    }

    public function filter($filters)
    {
        return array_values(array_filter($this->data, function ($item) use ($filters) {

            if (!empty($filters['category']) && strtolower($item['category']) != strtolower($filters['category'])) {
                return false;
            }

            if (!empty($filters['location']) && stripos($item['location'], $filters['location']) === false) {
                return false;
            }

            if (!empty($filters['vibe']) && strtolower($item['vibe']) != strtolower($filters['vibe'])) {
                return false;
            }

            if (!empty($filters['price_min']) && $item['price'] < $filters['price_min']) {
                return false;
            }

            if (!empty($filters['price_max']) && $item['price'] > $filters['price_max']) {
                return false;
            }

            if (!empty($filters['search'])) {
                $search = strtolower($filters['search']);
                if (
                    stripos($item['name'], $search) === false &&
                    stripos($item['category'], $search) === false &&
                    stripos($item['location'], $search) === false
                ) {
                    return false;
                }
            }

            return true;
        }));
    }
}
