<?php

return [
    'confirmation_subject' => 'Order confirmation :reference – AdReuse',
    'confirmation_body' => "Hi :name,\n\nThank you for your order. We have received your payment.\n\nOrder: :reference\nItem: :item\nItem price: :item_amount\nShipping: :shipping_amount\nTotal paid: :total\n\nDelivery address:\n:address\n\nWe will email you again when your parcel is on its way. Deliveries outside the UK may be subject to import VAT, duties and handling fees, which are payable by the recipient.\n\nYou can cancel this order within 14 days of receiving the item; see our returns policy: :returns_url\n\nQuestions? Just reply to this email.\n\n:seller",
    'shipped_subject' => 'Your order :reference is on its way – AdReuse',
    'shipped_body' => "Hi :name,\n\nYour order :reference (:item) has been dispatched.\n\nCarrier: :carrier\nTracking number: :tracking\n\nThank you for shopping with us.\n\n:seller",
    'not_provided' => 'not provided',
];
