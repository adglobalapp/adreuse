<?php

return [
    'confirmation_subject' => 'Confirmación del pedido :reference – AdReuse',
    'confirmation_body' => "Hola, :name:\n\nGracias por tu pedido. Hemos recibido el pago.\n\nPedido: :reference\nArtículo: :item\nPrecio del artículo: :item_amount\nEnvío: :shipping_amount\nTotal pagado: :total\n\nDirección de entrega:\n:address\n\nTe escribiremos de nuevo cuando el paquete esté en camino. Los envíos fuera del Reino Unido pueden estar sujetos a IVA de importación, aranceles y gastos de gestión, que paga el destinatario.\n\nPuedes desistir del pedido en los 14 días siguientes a la recepción del artículo; consulta nuestra política de devoluciones: :returns_url\n\n¿Tienes preguntas? Responde a este correo.\n\n:seller",
    'shipped_subject' => 'Tu pedido :reference está en camino – AdReuse',
    'shipped_body' => "Hola, :name:\n\nHemos enviado tu pedido :reference (:item).\n\nTransportista: :carrier\nNúmero de seguimiento: :tracking\n\nGracias por tu compra.\n\n:seller",
    'not_provided' => 'no indicado',
];
