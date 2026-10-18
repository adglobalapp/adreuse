// Adatvédelmi tájékoztató (UK GDPR) három nyelven. Sablon: a végleges szöveget érdemes szakemberrel átnézetni.
// A cégadatok a brand.ts-ből jönnek; a megőrzési idő a backend CONTACT_RETENTION_MONTHS értékével egyezik.

import { brand } from './brand';
import type { Lang } from './content';

export type PrivacySection = { title: string; paragraphs?: string[]; items?: string[] };

export type PrivacyContent = {
  /** A lábléc és az űrlapok linkjének szövege. */
  linkLabel: string;
  /** Rövid megjegyzés a kapcsolati űrlapok alatt. */
  formNote: string;
  title: string;
  updated: string;
  intro: string;
  sections: PrivacySection[];
  back: string;
};

const SITE = brand.name;
const COMPANY = brand.parent.company;
const NUMBER = brand.parent.companyNumber;
const OFFICE = brand.parent.registeredOffice;
const EMAIL = brand.email;
const ACCOUNTS = true;

const hu: PrivacyContent = {
  linkLabel: 'Adatvédelem',
  formNote: 'Az üzenetedet csak a megkeresésed megválaszolására használjuk.',
  title: 'Adatvédelmi tájékoztató',
  updated: 'Utolsó frissítés: 2026. október 18.',
  intro: `Ez a tájékoztató leírja, hogyan kezeljük a személyes adataidat, amikor a(z) ${SITE} oldalt használod.`,
  sections: [
    {
      title: 'Ki kezeli az adataidat?',
      paragraphs: [
        `Az adatkezelő a ${COMPANY} (Angliában és Walesben bejegyzett cég, cégjegyzékszám: ${NUMBER}, bejegyzett székhely: ${OFFICE}).`,
        `Adatvédelmi kérdésekben itt érsz el minket: ${EMAIL}.`,
      ],
    },
    {
      title: 'Milyen adatokat kezelünk?',
      items: [
        'A kapcsolati űrlapon megadott nevedet, e-mail címedet és az üzeneted tartalmát.',
        'Biztonsági és spamszűrési célból a beküldéskor használt IP-címet, valamint a Cloudflare Turnstile által végzett ellenőrzés eredményét.',
        'A szerver technikai naplóit (IP-cím, időpont, kért oldal), amelyek a hibák és támadások felderítését szolgálják.',
        ...(ACCOUNTS
          ? [
              'Ha fiókod van: a nevedet, e-mail címedet és a jelszavad titkosított (visszafejthetetlen) változatát.',
              'A feladott hirdetések tartalmát és képeit, amelyek nyilvánosan megjelennek az oldalon.',
            ]
          : []),
      ],
    },
    {
      title: 'Mire és milyen jogalapon használjuk?',
      items: [
        'A megkeresésed megválaszolására: jogos érdekünk alapján, illetve ha ajánlatot kérsz, a szerződéskötést megelőző lépésként.',
        'Az oldal biztonságának megőrzésére és a spam kiszűrésére: jogos érdekünk alapján.',
        ...(ACCOUNTS ? ['A fiókod és a hirdetéseid kezelésére: a felhasználási szerződés teljesítéséhez.'] : []),
        'Hírlevelet nem küldünk, az adataidat nem adjuk el, és marketingcélra nem használjuk.',
      ],
    },
    {
      title: 'Meddig őrizzük meg?',
      items: [
        'A kapcsolati üzeneteket legfeljebb 24 hónapig; utána automatikusan töröljük őket.',
        'Az e-mailben folytatott levelezést addig, amíg az ügy intézéséhez vagy jogi kötelezettség teljesítéséhez szükséges.',
        'A szerver technikai naplóit legfeljebb 30 napig.',
        ...(ACCOUNTS ? ['A fiók adatait a fiók törléséig; a törölt hirdetéseket és képeiket azonnal eltávolítjuk.'] : []),
      ],
    },
    {
      title: 'Kik férnek hozzá?',
      paragraphs: [
        'Az adataidat a saját, az Egyesült Királyságban üzemeltetett szerverünkön tároljuk. Az alábbi szolgáltatók adatfeldolgozóként, a mi utasításaink szerint dolgoznak velük:',
      ],
      items: [
        'Cloudflare, Inc.: az oldal kiszolgálása és védelme, az e-mailek továbbítása és küldése, valamint a Turnstile spamvédelem.',
        'E-mail szolgáltatóink, ahová a beérkező leveleket továbbítjuk.',
      ],
    },
    {
      title: 'Adattovábbítás az Egyesült Királyságon kívülre',
      paragraphs: [
        'A Cloudflare globális hálózata miatt az adatok az Egyesült Királyságon kívül is feldolgozásra kerülhetnek. Ilyenkor a jogszabályok által elismert garanciák (például a brit nemzetközi adattovábbítási megállapodás vagy az uniós általános szerződési feltételek brit kiegészítése) védik őket.',
      ],
    },
    {
      title: 'Sütik és helyi tárolás',
      paragraphs: [
        `Analitikai vagy hirdetési sütiket nem használunk. A böngésződben csak a választott nyelvet tároljuk${ACCOUNTS ? ', belépés után pedig a bejelentkezést' : ''}. A Cloudflare Turnstile a botok kiszűréséhez a működéshez szükséges adatokat tárolhat; ezek nélkül az űrlap nem küldhető el biztonságosan.`,
      ],
    },
    {
      title: 'A jogaid',
      paragraphs: [
        `Kérheted, hogy hozzáférj az adataidhoz, kijavítsuk vagy töröljük őket, korlátozzuk a kezelésüket, illetve tiltakozhatsz a kezelésük ellen, és kérheted azok kiadását géppel olvasható formában. Ehhez írj nekünk: ${EMAIL}. Egy hónapon belül válaszolunk.`,
        'Ha úgy érzed, nem megfelelően kezeltük az adataidat, panaszt tehetsz a brit adatvédelmi hatóságnál (Information Commissioner’s Office, ico.org.uk, telefon: 0303 123 1113).',
      ],
    },
    {
      title: 'Változások',
      paragraphs: ['Ha ez a tájékoztató változik, a frissített változatot itt tesszük közzé, a dátum módosításával.'],
    },
  ],
  back: 'Vissza a főoldalra',
};

const en: PrivacyContent = {
  linkLabel: 'Privacy',
  formNote: 'We only use your message to reply to your enquiry.',
  title: 'Privacy policy',
  updated: 'Last updated: 18 October 2026',
  intro: `This policy explains how we handle your personal data when you use ${SITE}.`,
  sections: [
    {
      title: 'Who is responsible for your data?',
      paragraphs: [
        `The controller is ${COMPANY} (registered in England & Wales, company no. ${NUMBER}, registered office: ${OFFICE}).`,
        `For any privacy question, contact us at ${EMAIL}.`,
      ],
    },
    {
      title: 'What data do we process?',
      items: [
        'The name, email address and message you enter in the contact form.',
        'For security and spam prevention, the IP address used when sending, and the result of the Cloudflare Turnstile check.',
        'Technical server logs (IP address, time, requested page) used to detect errors and attacks.',
        ...(ACCOUNTS
          ? [
              'If you have an account: your name, email address and a one-way encrypted (hashed) version of your password.',
              'The content and photos of the listings you post, which are shown publicly on the site.',
            ]
          : []),
      ],
    },
    {
      title: 'Why do we use it, and on what legal basis?',
      items: [
        'To reply to your enquiry: our legitimate interests, or, when you ask for a quote, steps taken at your request before entering into a contract.',
        'To keep the site secure and filter out spam: our legitimate interests.',
        ...(ACCOUNTS ? ['To run your account and listings: performance of our terms of use (a contract).'] : []),
        'We do not send newsletters, sell your data or use it for marketing.',
      ],
    },
    {
      title: 'How long do we keep it?',
      items: [
        'Contact messages: up to 24 months, after which they are deleted automatically.',
        'Email correspondence: as long as needed to deal with the matter or to meet legal obligations.',
        'Technical server logs: up to 30 days.',
        ...(ACCOUNTS ? ['Account data: until the account is deleted; deleted listings and their photos are removed immediately.'] : []),
      ],
    },
    {
      title: 'Who has access to it?',
      paragraphs: [
        'We store your data on our own server operated in the United Kingdom. The following providers process it on our behalf and on our instructions:',
      ],
      items: [
        'Cloudflare, Inc.: serving and protecting the site, forwarding and sending email, and Turnstile spam protection.',
        'The email providers we forward incoming messages to.',
      ],
    },
    {
      title: 'Transfers outside the UK',
      paragraphs: [
        'Because Cloudflare runs a global network, data may be processed outside the UK. In that case it is protected by recognised safeguards, such as the UK International Data Transfer Agreement or the UK Addendum to the EU Standard Contractual Clauses.',
      ],
    },
    {
      title: 'Cookies and local storage',
      paragraphs: [
        `We do not use analytics or advertising cookies. In your browser we only store your language choice${ACCOUNTS ? ' and, once you log in, your session' : ''}. Cloudflare Turnstile may store data that is strictly necessary to tell people from bots; without it the form cannot be sent securely.`,
      ],
    },
    {
      title: 'Your rights',
      paragraphs: [
        `You can ask to access, correct or delete your data, to restrict or object to its use, and to receive it in a machine-readable format. Email us at ${EMAIL}; we reply within one month.`,
        'If you are unhappy with how we handled your data, you can complain to the Information Commissioner’s Office (ico.org.uk, 0303 123 1113).',
      ],
    },
    {
      title: 'Changes',
      paragraphs: ['If this policy changes, we will publish the updated version here with a new date.'],
    },
  ],
  back: 'Back to the home page',
};

const es: PrivacyContent = {
  linkLabel: 'Privacidad',
  formNote: 'Solo usamos tu mensaje para responder a tu consulta.',
  title: 'Política de privacidad',
  updated: 'Última actualización: 18 de octubre de 2026',
  intro: `Esta política explica cómo tratamos tus datos personales cuando usas ${SITE}.`,
  sections: [
    {
      title: '¿Quién es el responsable de tus datos?',
      paragraphs: [
        `El responsable del tratamiento es ${COMPANY} (empresa registrada en Inglaterra y Gales, n.º ${NUMBER}, domicilio social: ${OFFICE}).`,
        `Para cualquier consulta sobre privacidad, escríbenos a ${EMAIL}.`,
      ],
    },
    {
      title: '¿Qué datos tratamos?',
      items: [
        'El nombre, el correo electrónico y el mensaje que escribes en el formulario de contacto.',
        'Por seguridad y para evitar spam, la dirección IP desde la que envías el formulario y el resultado de la comprobación de Cloudflare Turnstile.',
        'Los registros técnicos del servidor (dirección IP, hora, página solicitada), que sirven para detectar errores y ataques.',
        ...(ACCOUNTS
          ? [
              'Si tienes una cuenta: tu nombre, tu correo y una versión cifrada de forma irreversible de tu contraseña.',
              'El contenido y las fotos de los anuncios que publicas, que se muestran públicamente.',
            ]
          : []),
      ],
    },
    {
      title: '¿Para qué los usamos y con qué base legal?',
      items: [
        'Para responder a tu consulta: nuestro interés legítimo o, si pides un presupuesto, la aplicación de medidas precontractuales a petición tuya.',
        'Para mantener la web segura y filtrar el spam: nuestro interés legítimo.',
        ...(ACCOUNTS ? ['Para gestionar tu cuenta y tus anuncios: la ejecución de las condiciones de uso (un contrato).'] : []),
        'No enviamos boletines, no vendemos tus datos ni los usamos con fines de marketing.',
      ],
    },
    {
      title: '¿Cuánto tiempo los conservamos?',
      items: [
        'Los mensajes de contacto: hasta 24 meses; después se eliminan automáticamente.',
        'La correspondencia por correo: el tiempo necesario para gestionar el asunto o cumplir obligaciones legales.',
        'Los registros técnicos del servidor: hasta 30 días.',
        ...(ACCOUNTS ? ['Los datos de la cuenta: hasta que se elimina la cuenta; los anuncios eliminados y sus fotos se borran de inmediato.'] : []),
      ],
    },
    {
      title: '¿Quién tiene acceso?',
      paragraphs: [
        'Guardamos tus datos en nuestro propio servidor, situado en el Reino Unido. Los siguientes proveedores los tratan en nuestro nombre y siguiendo nuestras instrucciones:',
      ],
      items: [
        'Cloudflare, Inc.: servir y proteger la web, reenviar y enviar correos y la protección antispam Turnstile.',
        'Los proveedores de correo a los que reenviamos los mensajes recibidos.',
      ],
    },
    {
      title: 'Transferencias fuera del Reino Unido',
      paragraphs: [
        'Como Cloudflare opera una red global, los datos pueden tratarse fuera del Reino Unido. En ese caso están protegidos por garantías reconocidas, como el Acuerdo de Transferencia Internacional de Datos del Reino Unido o el Anexo británico a las Cláusulas Contractuales Tipo de la UE.',
      ],
    },
    {
      title: 'Cookies y almacenamiento local',
      paragraphs: [
        `No usamos cookies analíticas ni publicitarias. En tu navegador solo guardamos el idioma elegido${ACCOUNTS ? ' y, al iniciar sesión, tu sesión' : ''}. Cloudflare Turnstile puede guardar datos estrictamente necesarios para distinguir personas de bots; sin ellos el formulario no puede enviarse de forma segura.`,
      ],
    },
    {
      title: 'Tus derechos',
      paragraphs: [
        `Puedes pedir acceder a tus datos, corregirlos o eliminarlos, limitar su uso u oponerte a él, y recibirlos en un formato legible por máquina. Escríbenos a ${EMAIL}; respondemos en el plazo de un mes.`,
        'Si no estás conforme con cómo hemos tratado tus datos, puedes reclamar ante la autoridad británica de protección de datos (Information Commissioner’s Office, ico.org.uk, 0303 123 1113).',
      ],
    },
    {
      title: 'Cambios',
      paragraphs: ['Si esta política cambia, publicaremos aquí la versión actualizada con la nueva fecha.'],
    },
  ],
  back: 'Volver a la página principal',
};

export const privacy: Record<Lang, PrivacyContent> = { hu, en, es };
