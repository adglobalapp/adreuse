// Vásárlási jogi dokumentumok három nyelven: ÁSZF, elállás és visszatérítés, szállítás és vámok.
// Sablon a brit fogyasztóvédelmi szabályok alapján – a végleges szöveget érdemes jogásszal átnézetni.

import { brand } from './brand';
import type { Lang } from './content';
import type { PrivacySection } from './privacy';

export type LegalDoc = { label: string; title: string; updated: string; intro: string; sections: PrivacySection[]; back: string };
export type LegalKey = 'terms' | 'returns' | 'delivery';

const C = brand.parent.company;
const NO = brand.parent.companyNumber;
const OFFICE = brand.parent.registeredOffice;
const EMAIL = brand.email;
const SITE = 'AdReuse (adreuse.uk)';

const en: Record<LegalKey, LegalDoc> = {
  terms: {
    label: 'Terms',
    title: 'Terms and Conditions of Sale',
    updated: 'Last updated: 1 November 2026',
    intro: `These terms apply when you buy an item from ${SITE}. Please read them before you order.`,
    sections: [
      { title: '1. Who we are', paragraphs: [`The seller is ${C}, registered in England & Wales (company no. ${NO}), registered office: ${OFFICE}. Contact: ${EMAIL}.`] },
      {
        title: '2. The items',
        items: [
          'Most items are second-hand. Each listing describes the item’s condition and shows photos of the actual item.',
          'Pre-owned items may show signs of use consistent with the description; this is not a fault.',
          'Each item is unique: it is reserved for you while you pay and is removed from sale once your payment is confirmed.',
        ],
      },
      {
        title: '3. Prices and payment',
        items: [
          'Prices are in pounds sterling (GBP). The item price, the shipping cost and the total are shown before you pay; we add no other charges.',
          'Payment is taken by Stripe at checkout. We never see or store your card details.',
          'The contract is formed when your payment is confirmed and we email you the order confirmation.',
          'If an item was listed with an obvious pricing or description error, we may cancel the order and refund you in full.',
        ],
      },
      {
        title: '4. Delivery',
        paragraphs: [
          'We deliver to the United Kingdom and the countries of the European Union. Shipping costs, dispatch times and customs rules are set out in our Shipping and customs page. The item is your responsibility from when it is delivered to you.',
        ],
      },
      { title: '5. Your right to cancel', paragraphs: ['You can cancel within 14 days of receiving the item without giving a reason. See our Returns and refunds policy for how it works.'] },
      {
        title: '6. Faulty or not as described',
        paragraphs: [
          'You have legal rights if an item is faulty or not as described (Consumer Rights Act 2015). Contact us and we will put it right with a repair, replacement or refund as the law provides. Nothing in these terms affects your statutory rights.',
        ],
      },
      {
        title: '7. Our liability',
        paragraphs: [
          'We are responsible for loss or damage you suffer that is a foreseeable result of us breaking these terms. We do not exclude liability where it would be unlawful to do so, for example for death or personal injury caused by negligence or for fraud. We are not responsible for business losses.',
        ],
      },
      { title: '8. Your personal data', paragraphs: ['We use your details to process and deliver your order, as explained in our Privacy policy.'] },
      { title: '9. Complaints', paragraphs: [`If something is not right, email us at ${EMAIL} with your order number. We aim to reply within 14 days.`] },
      {
        title: '10. Governing law',
        paragraphs: [
          'These terms are governed by the laws of England and Wales. If you live in Scotland, Northern Ireland or an EU country, you can also rely on the mandatory consumer protections of your country and bring proceedings there.',
        ],
      },
    ],
    back: 'Back to the shop',
  },
  returns: {
    label: 'Returns',
    title: 'Returns and refunds',
    updated: 'Last updated: 1 November 2026',
    intro: 'You can change your mind within 14 days of receiving your item, and you are protected if an item is faulty.',
    sections: [
      {
        title: 'Changing your mind (14-day right to cancel)',
        items: [
          'You can cancel your purchase within 14 days of the day you, or someone you nominate, receive the item, without giving a reason.',
          `To cancel, tell us clearly within that period, for example by emailing ${EMAIL} with your order number. You can use the model form below, but you do not have to.`,
          'Send the item back within 14 days of telling us. Please pack it carefully; you pay the cost of returning it.',
          'We refund the item price and the standard shipping you paid within 14 days of receiving the item back (or of you showing proof that you sent it back, if earlier), to your original payment method.',
          'We may reduce the refund if the item has lost value because it was handled beyond what is needed to check it.',
        ],
      },
      {
        title: 'Faulty or not as described',
        items: [
          'If the item is faulty or not as described, tell us within 30 days of delivery and we will give you a full refund, including the cost of returning it.',
          'After 30 days you are still entitled to a repair, replacement or, if that is not possible, a refund, under the Consumer Rights Act 2015.',
        ],
      },
      {
        title: 'Model cancellation form',
        paragraphs: [
          `To: ${C}, ${OFFICE}, ${EMAIL}`,
          'I hereby give notice that I cancel my contract for the sale of the following item: [item, order number]. Ordered on [date] / received on [date]. Name: [name]. Address: [address]. Date: [date].',
        ],
      },
    ],
    back: 'Back to the shop',
  },
  delivery: {
    label: 'Shipping',
    title: 'Shipping and customs',
    updated: 'Last updated: 1 November 2026',
    intro: 'We ship to the United Kingdom and the European Union. The shipping cost depends on the parcel size and the destination, and is shown before you pay.',
    sections: [
      {
        title: 'Dispatch and delivery times',
        items: [
          'We dispatch within 3 working days of payment and email you the tracking number.',
          'Typical delivery after dispatch: UK 1–3 working days, EU 3–10 working days. These are estimates; carrier delays can happen.',
          'Oversized items cannot be ordered online: send us a message and we will quote the shipping.',
        ],
      },
      {
        title: 'Customs, import VAT and duties (EU deliveries)',
        items: [
          'Since Brexit, parcels sent from the UK to the EU are imports. The destination country may charge import VAT, customs duty and a carrier handling fee on delivery.',
          'These charges are paid by the recipient and are not included in our prices. We cannot predict the exact amount.',
          'If a parcel is refused or not collected, we treat it as a cancellation: we refund the item price and standard shipping, minus the cost of the parcel being returned to us.',
        ],
      },
      { title: 'Lost or damaged parcels', paragraphs: [`If your parcel does not arrive or arrives damaged, email ${EMAIL} with your order number and we will arrange a replacement or refund.`] },
    ],
    back: 'Back to the shop',
  },
};

const hu: Record<LegalKey, LegalDoc> = {
  terms: {
    label: 'ÁSZF',
    title: 'Általános Szerződési Feltételek',
    updated: 'Utolsó frissítés: 2026. november 1.',
    intro: `Ezek a feltételek vonatkoznak a(z) ${SITE} oldalon történő vásárlásra. Kérjük, rendelés előtt olvasd el őket.`,
    sections: [
      { title: '1. Kik vagyunk', paragraphs: [`Az eladó a ${C} (Angliában és Walesben bejegyzett cég, cégjegyzékszám: ${NO}, bejegyzett székhely: ${OFFICE}). Elérhetőség: ${EMAIL}.`] },
      {
        title: '2. A termékek',
        items: [
          'A termékek többsége használt. Minden hirdetés leírja a termék állapotát, és a konkrét termékről készült fotókat mutatja.',
          'A használt termékeken a leírásnak megfelelő használati nyomok lehetnek; ez nem hiba.',
          'Minden termék egyedi: amíg fizetsz, a tiéd van fenntartva, a fizetés visszaigazolása után pedig lekerül az oldalról.',
        ],
      },
      {
        title: '3. Árak és fizetés',
        items: [
          'Az árak angol fontban (GBP) értendők. A termék árát, a szállítási díjat és a végösszeget a fizetés előtt mutatjuk; más díjat nem számolunk fel.',
          'A fizetést a Stripe kezeli. A kártyaadataidat mi soha nem látjuk és nem tároljuk.',
          'A szerződés akkor jön létre, amikor a fizetés megerősítést nyer, és e-mailben visszaigazoljuk a rendelést.',
          'Ha egy terméket nyilvánvalóan hibás árral vagy leírással hirdettünk, a rendelést törölhetjük, és a teljes összeget visszatérítjük.',
        ],
      },
      {
        title: '4. Szállítás',
        paragraphs: [
          'Az Egyesült Királyságba és az Európai Unió országaiba szállítunk. A szállítási díjakat, határidőket és a vámszabályokat a Szállítás és vámok oldal tartalmazza. A termékért a kézbesítéstől kezdve te felelsz.',
        ],
      },
      { title: '5. Elállási jog', paragraphs: ['A termék átvételétől számított 14 napon belül indoklás nélkül elállhatsz. A részleteket az Elállás és visszatérítés oldalon találod.'] },
      {
        title: '6. Hibás vagy a leírásnak nem megfelelő termék',
        paragraphs: [
          'Ha a termék hibás vagy nem felel meg a leírásnak, a törvény (Consumer Rights Act 2015) védelmet ad. Írj nekünk, és a jogszabály szerint javítással, cserével vagy visszatérítéssel orvosoljuk. Ezek a feltételek a törvényes jogaidat nem korlátozzák.',
        ],
      },
      {
        title: '7. Felelősségünk',
        paragraphs: [
          'Felelünk azért a kárért, amely a feltételek általunk történő megszegésének előre látható következménye. Nem zárjuk ki a felelősségünket ott, ahol ez jogellenes lenne (például gondatlanságból okozott halál vagy személyi sérülés, illetve csalás esetén). Üzleti veszteségért nem felelünk.',
        ],
      },
      { title: '8. Személyes adatok', paragraphs: ['Az adataidat a rendelés teljesítéséhez és kiszállításához használjuk, az Adatvédelmi tájékoztatóban leírtak szerint.'] },
      { title: '9. Panaszok', paragraphs: [`Ha valami nincs rendben, írj a(z) ${EMAIL} címre a rendelésszámmal. Igyekszünk 14 napon belül válaszolni.`] },
      {
        title: '10. Irányadó jog',
        paragraphs: [
          'Ezekre a feltételekre Anglia és Wales joga az irányadó. Ha Skóciában, Észak-Írországban vagy az EU valamely országában élsz, a saját országod kötelező fogyasztóvédelmi szabályaira is hivatkozhatsz, és ott is eljárást indíthatsz.',
        ],
      },
    ],
    back: 'Vissza a termékekhez',
  },
  returns: {
    label: 'Elállás',
    title: 'Elállás és visszatérítés',
    updated: 'Utolsó frissítés: 2026. november 1.',
    intro: 'A termék átvételétől számított 14 napon belül meggondolhatod magad, és hibás termék esetén is védelem illet meg.',
    sections: [
      {
        title: 'Ha meggondolod magad (14 napos elállási jog)',
        items: [
          'A vásárlástól a termék általad vagy az általad megjelölt személy általi átvételétől számított 14 napon belül indoklás nélkül elállhatsz.',
          `Az elállást ezen belül egyértelműen jelezd, például e-mailben a(z) ${EMAIL} címen, a rendelésszámmal. Használhatod az alábbi mintát, de nem kötelező.`,
          'A terméket az elállás jelzésétől számított 14 napon belül küldd vissza, gondosan becsomagolva; a visszaküldés költsége téged terhel.',
          'A termék árát és a kifizetett normál szállítási díjat a termék visszaérkezésétől (vagy ha korábbi, a feladás igazolásától) számított 14 napon belül visszatérítjük az eredeti fizetési módra.',
          'A visszatérítést csökkenthetjük, ha a termék értéke a kipróbáláshoz szükségesnél nagyobb mértékű használat miatt csökkent.',
        ],
      },
      {
        title: 'Hibás vagy a leírásnak nem megfelelő termék',
        items: [
          'Ha a termék hibás vagy nem felel meg a leírásnak, a kézbesítéstől számított 30 napon belül jelezd, és a teljes összeget visszatérítjük, a visszaküldés költségével együtt.',
          '30 nap után is jogosult vagy javításra, cserére, vagy ha ez nem lehetséges, visszatérítésre (Consumer Rights Act 2015).',
        ],
      },
      {
        title: 'Elállási nyilatkozat minta',
        paragraphs: [
          `Címzett: ${C}, ${OFFICE}, ${EMAIL}`,
          'Alulírott kijelentem, hogy gyakorlom elállási jogomat az alábbi termék adásvételére irányuló szerződés tekintetében: [termék, rendelésszám]. Rendelés dátuma: [dátum] / átvétel dátuma: [dátum]. Név: [név]. Cím: [cím]. Dátum: [dátum].',
        ],
      },
    ],
    back: 'Vissza a termékekhez',
  },
  delivery: {
    label: 'Szállítás',
    title: 'Szállítás és vámok',
    updated: 'Utolsó frissítés: 2026. november 1.',
    intro: 'Az Egyesült Királyságba és az Európai Unióba szállítunk. A szállítási díj a csomag méretétől és a célországtól függ, és a fizetés előtt látod.',
    sections: [
      {
        title: 'Feladás és szállítási idő',
        items: [
          'A fizetéstől számított 3 munkanapon belül feladjuk a csomagot, és e-mailben elküldjük a csomagkövetési számot.',
          'Szokásos kézbesítési idő a feladás után: Egyesült Királyság 1–3 munkanap, EU 3–10 munkanap. Ezek becslések, a futárnál előfordulhat késés.',
          'Az egyedi méretű termékek nem rendelhetők online: írj nekünk, és árajánlatot adunk a szállításra.',
        ],
      },
      {
        title: 'Vám, import-ÁFA és illetékek (EU-ba szállításnál)',
        items: [
          'A Brexit óta az Egyesült Királyságból az EU-ba küldött csomag behozatalnak számít. A célország átvételkor import-ÁFÁ-t, vámot és a futár kezelési díját számolhatja fel.',
          'Ezeket a címzett fizeti, és nem részei az árainknak. A pontos összeget nem tudjuk előre megmondani.',
          'Ha a csomagot nem veszed át vagy visszautasítod, elállásnak tekintjük: a termék árát és a normál szállítási díjat visszatérítjük, levonva a csomag visszaszállításának költségét.',
        ],
      },
      { title: 'Elveszett vagy sérült csomag', paragraphs: [`Ha a csomag nem érkezik meg vagy sérülten érkezik, írj a(z) ${EMAIL} címre a rendelésszámmal, és cserét vagy visszatérítést biztosítunk.`] },
    ],
    back: 'Vissza a termékekhez',
  },
};

const es: Record<LegalKey, LegalDoc> = {
  terms: {
    label: 'Condiciones',
    title: 'Condiciones Generales de Venta',
    updated: 'Última actualización: 1 de noviembre de 2026',
    intro: `Estas condiciones se aplican cuando compras un artículo en ${SITE}. Léelas antes de hacer tu pedido.`,
    sections: [
      { title: '1. Quiénes somos', paragraphs: [`El vendedor es ${C}, empresa registrada en Inglaterra y Gales (n.º ${NO}), domicilio social: ${OFFICE}. Contacto: ${EMAIL}.`] },
      {
        title: '2. Los artículos',
        items: [
          'La mayoría de los artículos son de segunda mano. Cada anuncio describe el estado del artículo y muestra fotos del artículo real.',
          'Los artículos usados pueden tener señales de uso acordes con la descripción; esto no es un defecto.',
          'Cada artículo es único: queda reservado para ti mientras pagas y se retira de la venta cuando se confirma el pago.',
        ],
      },
      {
        title: '3. Precios y pago',
        items: [
          'Los precios están en libras esterlinas (GBP). Antes de pagar ves el precio del artículo, el coste de envío y el total; no añadimos otros cargos.',
          'El pago lo procesa Stripe. Nunca vemos ni guardamos los datos de tu tarjeta.',
          'El contrato se perfecciona cuando se confirma el pago y te enviamos la confirmación del pedido por correo.',
          'Si un artículo se anunció con un error evidente de precio o descripción, podemos cancelar el pedido y reembolsarte el importe íntegro.',
        ],
      },
      {
        title: '4. Envío',
        paragraphs: [
          'Enviamos al Reino Unido y a los países de la Unión Europea. Los costes, los plazos y las normas aduaneras figuran en la página Envíos y aduanas. El artículo pasa a ser tu responsabilidad desde la entrega.',
        ],
      },
      { title: '5. Derecho de desistimiento', paragraphs: ['Puedes desistir en los 14 días siguientes a la recepción del artículo sin indicar el motivo. Consulta nuestra política de devoluciones.'] },
      {
        title: '6. Artículos defectuosos o no conformes',
        paragraphs: [
          'Tienes derechos legales si un artículo es defectuoso o no corresponde a la descripción (Consumer Rights Act 2015). Escríbenos y lo solucionaremos con una reparación, una sustitución o un reembolso según la ley. Estas condiciones no afectan a tus derechos legales.',
        ],
      },
      {
        title: '7. Nuestra responsabilidad',
        paragraphs: [
          'Respondemos de los daños que sean consecuencia previsible de un incumplimiento de estas condiciones por nuestra parte. No excluimos nuestra responsabilidad cuando sea ilegal hacerlo, por ejemplo por muerte o lesiones causadas por negligencia o por fraude. No respondemos de pérdidas empresariales.',
        ],
      },
      { title: '8. Tus datos personales', paragraphs: ['Usamos tus datos para tramitar y entregar tu pedido, como se explica en nuestra Política de privacidad.'] },
      { title: '9. Reclamaciones', paragraphs: [`Si algo no va bien, escríbenos a ${EMAIL} con tu número de pedido. Intentamos responder en 14 días.`] },
      {
        title: '10. Ley aplicable',
        paragraphs: [
          'Estas condiciones se rigen por las leyes de Inglaterra y Gales. Si vives en Escocia, Irlanda del Norte o un país de la UE, también puedes acogerte a las normas imperativas de protección del consumidor de tu país y acudir a sus tribunales.',
        ],
      },
    ],
    back: 'Volver a la tienda',
  },
  returns: {
    label: 'Devoluciones',
    title: 'Devoluciones y reembolsos',
    updated: 'Última actualización: 1 de noviembre de 2026',
    intro: 'Puedes cambiar de opinión en los 14 días siguientes a la recepción del artículo, y estás protegido si el artículo es defectuoso.',
    sections: [
      {
        title: 'Si cambias de opinión (desistimiento de 14 días)',
        items: [
          'Puedes desistir de la compra en los 14 días siguientes al día en que tú, o la persona que indiques, recibáis el artículo, sin indicar el motivo.',
          `Para desistir, comunícalo claramente dentro de ese plazo, por ejemplo escribiendo a ${EMAIL} con tu número de pedido. Puedes usar el modelo de abajo, pero no es obligatorio.`,
          'Devuelve el artículo en los 14 días siguientes a tu comunicación, bien embalado; los gastos de devolución corren de tu cuenta.',
          'Reembolsamos el precio del artículo y el envío estándar pagado en los 14 días siguientes a recibir el artículo (o a que acredites el envío, si es antes), con el mismo medio de pago.',
          'Podemos reducir el reembolso si el artículo ha perdido valor por una manipulación distinta a la necesaria para comprobarlo.',
        ],
      },
      {
        title: 'Artículos defectuosos o no conformes',
        items: [
          'Si el artículo es defectuoso o no corresponde a la descripción, avísanos en los 30 días siguientes a la entrega y te reembolsaremos el importe íntegro, incluidos los gastos de devolución.',
          'Pasados 30 días sigues teniendo derecho a reparación, sustitución o, si no es posible, reembolso (Consumer Rights Act 2015).',
        ],
      },
      {
        title: 'Modelo de formulario de desistimiento',
        paragraphs: [
          `A la atención de: ${C}, ${OFFICE}, ${EMAIL}`,
          'Por la presente le comunico que desisto de mi contrato de venta del siguiente artículo: [artículo, número de pedido]. Pedido el [fecha] / recibido el [fecha]. Nombre: [nombre]. Dirección: [dirección]. Fecha: [fecha].',
        ],
      },
    ],
    back: 'Volver a la tienda',
  },
  delivery: {
    label: 'Envíos',
    title: 'Envíos y aduanas',
    updated: 'Última actualización: 1 de noviembre de 2026',
    intro: 'Enviamos al Reino Unido y a la Unión Europea. El coste de envío depende del tamaño del paquete y del destino, y lo ves antes de pagar.',
    sections: [
      {
        title: 'Preparación y plazos de entrega',
        items: [
          'Enviamos el paquete en un plazo de 3 días laborables desde el pago y te mandamos el número de seguimiento por correo.',
          'Plazo habitual tras el envío: Reino Unido 1–3 días laborables, UE 3–10 días laborables. Son estimaciones; el transportista puede sufrir retrasos.',
          'Los artículos de tamaño especial no se pueden pedir online: escríbenos y te daremos presupuesto de envío.',
        ],
      },
      {
        title: 'Aduanas, IVA de importación y aranceles (envíos a la UE)',
        items: [
          'Desde el Brexit, los paquetes enviados del Reino Unido a la UE son importaciones. El país de destino puede cobrar IVA de importación, aranceles y gastos de gestión del transportista en la entrega.',
          'Estos cargos los paga el destinatario y no están incluidos en nuestros precios. No podemos prever el importe exacto.',
          'Si el paquete se rechaza o no se recoge, lo tratamos como un desistimiento: reembolsamos el precio y el envío estándar, descontando el coste de la devolución del paquete.',
        ],
      },
      { title: 'Paquetes perdidos o dañados', paragraphs: [`Si tu paquete no llega o llega dañado, escribe a ${EMAIL} con tu número de pedido y te ofreceremos una sustitución o un reembolso.`] },
    ],
    back: 'Volver a la tienda',
  },
};

export const legal: Record<Lang, Record<LegalKey, LegalDoc>> = { en, hu, es };
