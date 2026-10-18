<?php

namespace App\Policies;

use App\Models\Listing;
use App\Models\User;

class ListingPolicy
{
    /**
     * Admins can manage every listing.
     */
    public function before(User $user): ?bool
    {
        return $user->is_admin ? true : null;
    }

    /**
     * Only the seller can edit their listing.
     */
    public function update(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id;
    }

    /**
     * Only the seller can delete their listing.
     */
    public function delete(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id;
    }
}
