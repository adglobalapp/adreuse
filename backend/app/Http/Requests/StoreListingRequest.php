<?php

namespace App\Http\Requests;

use App\Models\Listing;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreListingRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'title' => ['required', 'string', 'min:3', 'max:120'],
            'description' => ['required', 'string', 'max:5000'],
            'price' => ['required', 'integer', 'min:0', 'max:100000000'],
            'condition' => ['required', Rule::in(Listing::CONDITIONS)],
            'location' => ['nullable', 'string', 'max:120'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }
}
