<?php

namespace App\Http\Requests;

use App\Models\Listing;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateListingRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['sometimes', 'integer', 'exists:categories,id'],
            'title' => ['sometimes', 'string', 'min:3', 'max:120'],
            'description' => ['sometimes', 'string', 'max:5000'],
            'price' => ['sometimes', 'integer', 'min:0', 'max:100000000'],
            'condition' => ['sometimes', Rule::in(Listing::CONDITIONS)],
            'location' => ['sometimes', 'nullable', 'string', 'max:120'],
            'status' => ['sometimes', Rule::in(Listing::STATUSES)],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'remove_image' => ['sometimes', 'boolean'],
        ];
    }
}
