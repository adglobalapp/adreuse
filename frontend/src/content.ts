// A felület szövegei három nyelven – egy helyen, hogy könnyű legyen cserélni.

export const languages = ['en', 'es', 'hu'] as const;
export type Lang = (typeof languages)[number];
/** Alapnyelv, ha a böngésző nyelve sem spanyol, sem angol (magyar böngészőnél is). */
export const defaultLang: Lang = 'en';

export const locales: Record<Lang, string> = { hu: 'hu-HU', en: 'en-GB', es: 'es-ES' };

export type Condition = 'new' | 'like_new' | 'good' | 'fair';

export type SizeKey = 'small' | 'medium' | 'large' | 'custom';

export type Content = {
  nav: { browse: string; sell: string; my: string; admin: string; login: string; logout: string };
  home: {
    eyebrow: string;
    lines: [string, string, string];
    quote: string;
    primaryCta: string;
    secondaryCta: string;
    categoriesLabel: string;
    categoriesTitle: string;
    latestLabel: string;
    latestTitle: string;
    viewAll: string;
    sellTitle: string;
    sellText: string;
    sellCta: string;
  };
  browse: {
    label: string;
    title: string;
    search: string;
    searchPlaceholder: string;
    category: string;
    allCategories: string;
    condition: string;
    anyCondition: string;
    minPrice: string;
    maxPrice: string;
    sort: string;
    sortNewest: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    apply: string;
    reset: string;
    results: (n: number) => string;
    empty: string;
    prev: string;
    next: string;
    page: (current: number, last: number) => string;
  };
  listing: {
    back: string;
    condition: string;
    category: string;
    location: string;
    posted: string;
    seller: string;
    contactSeller: string;
    loginToContact: string;
    buyNow: string;
    reserved: string;
    customShipping: string;
    checkoutCancelled: string;
    shippingFrom: string;
    inquire: string;
    inquiryName: string;
    inquiryEmail: string;
    inquiryMessage: string;
    inquiryPrefill: (title: string, id: number) => string;
    inquirySend: string;
    inquirySending: string;
    inquirySent: string;
    inquiryError: string;
    sold: string;
    edit: string;
    markSold: string;
    markActive: string;
    delete: string;
    confirmDelete: string;
    imageAlt: string;
  };
  form: {
    newLabel: string;
    newTitle: string;
    editTitle: string;
    title: string;
    description: string;
    price: string;
    category: string;
    choose: string;
    condition: string;
    location: string;
    image: string;
    imageHint: string;
    shippingSize: string;
    shippingSizeHint: string;
    priceInvalid: string;
    removeImage: string;
    create: string;
    save: string;
    cancel: string;
    saving: string;
  };
  my: {
    label: string;
    title: string;
    empty: string;
    newListing: string;
    active: string;
    sold: string;
  };
  auth: {
    loginLabel: string;
    loginTitle: string;
    loginLead: string;
    registerLabel: string;
    registerTitle: string;
    registerLead: string;
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    login: string;
    register: string;
    noAccount: string;
    hasAccount: string;
  };
  common: {
    loading: string;
    error: string;
    notFoundTitle: string;
    notFoundText: string;
    home: string;
    reload: string;
  };
  admin: {
    label: string;
    title: string;
    tabs: { overview: string; orders: string; listings: string; categories: string; users: string; messages: string; shipping: string };
    stats: { users: string; active: string; sold: string; week: string; categories: string; unread: string; toShip: string };
    search: string;
    allStatuses: string;
    allSites: string;
    onlyUnread: string;
    columns: {
      title: string;
      category: string;
      price: string;
      seller: string;
      status: string;
      actions: string;
      name: string;
      slug: string;
      position: string;
      listings: string;
      email: string;
      role: string;
      site: string;
      date: string;
    };
    edit: string;
    save: string;
    cancel: string;
    delete: string;
    confirm: string;
    add: string;
    newCategory: string;
    categoryHasListings: string;
    makeAdmin: string;
    removeAdmin: string;
    adminRole: string;
    userRole: string;
    you: string;
    markRead: string;
    markUnread: string;
    reply: string;
    empty: string;
    orders: {
      allStatuses: string;
      statuses: Record<string, string>;
      customer: string;
      address: string;
      items: string;
      carrier: string;
      tracking: string;
      note: string;
      save: string;
      saved: string;
      markShipped: string;
      markDelivered: string;
      cancel: string;
      refund: string;
      restock: string;
      refundConfirm: string;
      details: string;
    };
    shippingRates: {
      title: string;
      lead: string;
      size: string;
      save: string;
      saved: string;
    };
  };
  sizes: Record<SizeKey, string>;
  zones: Record<string, string>;
  checkout: {
    label: string;
    title: string;
    country: string;
    chooseCountry: string;
    item: string;
    shipping: string;
    total: string;
    seller: string;
    delivery: string;
    deliveryText: string;
    customsTitle: string;
    customsUk: string;
    customsEu: string;
    cancelTitle: string;
    cancelText: string;
    acceptBefore: string;
    acceptTerms: string;
    acceptAnd: string;
    acceptReturns: string;
    acceptAfter: string;
    pay: string;
    paying: string;
    secure: string;
    notAvailable: string;
    error: string;
  };
  order: {
    label: string;
    processing: string;
    paidTitle: string;
    paidText: (reference: string) => string;
    pendingText: string;
    notFound: string;
    total: string;
    continue: string;
  };
  legal: { terms: string; returns: string; shipping: string };
  conditions: Record<Condition, string>;
  /** Kategórianevek a backend slugjai szerint; ha egy slug hiányzik, a backend neve jelenik meg. */
  categories: Record<string, string>;
  footer: { tags: string[]; registered: string; companyNo: string; office: string; rights: string };
};

const hu: Content = {
  nav: { browse: 'Hirdetések', sell: 'Eladok', my: 'Hirdetéseim', admin: 'Admin', login: 'Belépés', logout: 'Kilépés' },
  home: {
    eyebrow: 'Használt tárgyak piactere',
    lines: ['Add', 'tovább,', 'vedd újra.'],
    quote: '„Ami neked már nem kell, az másnak pont jó lehet. Hirdesd meg pár perc alatt.”',
    primaryCta: 'Hirdetés feladása',
    secondaryCta: 'Böngészés',
    categoriesLabel: 'Kategóriák',
    categoriesTitle: 'Mit keresel?',
    latestLabel: 'Friss',
    latestTitle: 'Legújabb hirdetések',
    viewAll: 'Összes hirdetés',
    sellTitle: 'Van, ami nem kell?',
    sellText: 'Fotó, ár, pár mondat – és már kint is van. Ingyenes, regisztráció után azonnal.',
    sellCta: 'Eladok valamit',
  },
  browse: {
    label: 'Hirdetések',
    title: 'Böngészés',
    search: 'Keresés',
    searchPlaceholder: 'Pl. kerékpár, kanapé…',
    category: 'Kategória',
    allCategories: 'Minden kategória',
    condition: 'Állapot',
    anyCondition: 'Bármilyen',
    minPrice: 'Min. ár (£)',
    maxPrice: 'Max. ár (£)',
    sort: 'Rendezés',
    sortNewest: 'Legújabb',
    sortPriceAsc: 'Ár szerint növekvő',
    sortPriceDesc: 'Ár szerint csökkenő',
    apply: 'Szűrés',
    reset: 'Törlés',
    results: (n) => `${n} találat`,
    empty: 'Nincs a szűrésnek megfelelő hirdetés.',
    prev: 'Előző',
    next: 'Következő',
    page: (c, l) => `${c} / ${l}. oldal`,
  },
  listing: {
    back: 'Vissza a hirdetésekhez',
    condition: 'Állapot',
    category: 'Kategória',
    location: 'Helyszín',
    posted: 'Feladva',
    seller: 'Eladó',
    contactSeller: 'Üzenet az eladónak',
    loginToContact: 'Lépj be az eladó elérhetőségéért',
    buyNow: 'Megveszem',
    reserved: 'Valaki épp fizet ezért a termékért. Nézz vissza fél óra múlva.',
    customShipping: 'Ez a termék egyedi méretű: a szállításra árajánlatot adunk. Írj nekünk alább.',
    checkoutCancelled: 'A fizetés megszakadt, nem terheltünk semmit. Bármikor újrakezdheted.',
    shippingFrom: 'Szállítás',
    inquire: 'Érdeklődöm',
    inquiryName: 'Név',
    inquiryEmail: 'E-mail',
    inquiryMessage: 'Üzenet',
    inquiryPrefill: (title, id) => `Érdeklődnék a következő hirdetés iránt: ${title} (#${id}).`,
    inquirySend: 'Üzenet küldése',
    inquirySending: 'Küldés…',
    inquirySent: 'Köszönjük! Megkaptuk az üzenetedet, hamarosan válaszolunk.',
    inquiryError: 'Nem sikerült elküldeni. Próbáld újra később.',
    sold: 'Elkelt',
    edit: 'Szerkesztés',
    markSold: 'Megjelölés eladottként',
    markActive: 'Újra aktív',
    delete: 'Törlés',
    confirmDelete: 'Biztosan törlöd a hirdetést?',
    imageAlt: 'Termékfotó helye',
  },
  form: {
    newLabel: 'Eladok',
    newTitle: 'Új hirdetés',
    editTitle: 'Hirdetés szerkesztése',
    title: 'Cím',
    description: 'Leírás',
    price: 'Ár (£)',
    category: 'Kategória',
    choose: 'Válassz…',
    condition: 'Állapot',
    location: 'Helyszín',
    image: 'Fotó',
    imageHint: 'JPG, PNG vagy WEBP, legfeljebb 5 MB.',
    shippingSize: 'Csomagméret',
    shippingSizeHint: 'Ebből számoljuk a szállítási díjat. Az egyedi méretű termék nem rendelhető online.',
    priceInvalid: 'Adj meg egy érvényes árat fontban, pl. 12.50.',
    removeImage: 'Fotó eltávolítása',
    create: 'Hirdetés feladása',
    save: 'Mentés',
    cancel: 'Mégse',
    saving: 'Mentés…',
  },
  my: {
    label: 'Fiók',
    title: 'Hirdetéseim',
    empty: 'Még nincs hirdetésed.',
    newListing: 'Új hirdetés',
    active: 'Aktív',
    sold: 'Elkelt',
  },
  auth: {
    loginLabel: 'Belépés',
    loginTitle: 'Üdv újra.',
    loginLead: 'Lépj be a hirdetéseid kezeléséhez.',
    registerLabel: 'Regisztráció',
    registerTitle: 'Csatlakozz.',
    registerLead: 'Egy perc, és már adhatod is fel az első hirdetésed.',
    name: 'Név',
    email: 'E-mail',
    password: 'Jelszó',
    passwordConfirm: 'Jelszó újra',
    login: 'Belépés',
    register: 'Regisztráció',
    noAccount: 'Nincs még fiókod? Regisztrálj',
    hasAccount: 'Van már fiókod? Lépj be',
  },
  common: {
    loading: 'Betöltés…',
    error: 'Hiba történt. Próbáld újra később.',
    notFoundTitle: 'Nincs ilyen oldal.',
    notFoundText: 'A keresett oldal vagy hirdetés nem található.',
    home: 'Főoldal',
    reload: 'Újratöltés',
  },
  admin: {
    label: 'Admin',
    title: 'Vezérlőpult',
    tabs: { overview: 'Áttekintés', orders: 'Rendelések', shipping: 'Szállítás', listings: 'Hirdetések', categories: 'Kategóriák', users: 'Felhasználók', messages: 'Üzenetek' },
    stats: { users: 'felhasználó', active: 'aktív hirdetés', sold: 'eladott', week: 'új hirdetés (7 nap)', categories: 'kategória', unread: 'olvasatlan üzenet', toShip: 'feladásra váró rendelés' },
    search: 'Keresés…',
    allStatuses: 'Minden állapot',
    allSites: 'Minden oldal',
    onlyUnread: 'Csak olvasatlan',
    columns: { title: 'Cím', category: 'Kategória', price: 'Ár', seller: 'Eladó', status: 'Állapot', actions: 'Műveletek', name: 'Név', slug: 'Azonosító', position: 'Sorrend', listings: 'Hirdetés', email: 'E-mail', role: 'Szerep', site: 'Oldal', date: 'Dátum' },
    edit: 'Szerkesztés',
    save: 'Mentés',
    cancel: 'Mégse',
    delete: 'Törlés',
    confirm: 'Biztos?',
    add: 'Hozzáadás',
    newCategory: 'Új kategória neve',
    categoryHasListings: 'Csak üres kategória törölhető.',
    makeAdmin: 'Admin jog',
    removeAdmin: 'Jog elvétele',
    adminRole: 'Admin',
    userRole: 'Felhasználó',
    you: 'te',
    markRead: 'Olvasott',
    markUnread: 'Olvasatlan',
    reply: 'Válasz',
    empty: 'Nincs találat.',
    orders: {
      allStatuses: 'Minden rendelés',
      statuses: { pending: 'Fizetésre vár', paid: 'Fizetve – feladásra vár', shipped: 'Feladva', delivered: 'Kézbesítve', cancelled: 'Lemondva', refunded: 'Visszatérítve', expired: 'Lejárt' },
      customer: 'Vevő',
      address: 'Szállítási cím',
      items: 'Tétel',
      carrier: 'Futár',
      tracking: 'Csomagkövetési szám',
      note: 'Belső megjegyzés',
      save: 'Mentés',
      saved: 'Mentve.',
      markShipped: 'Feladva (e-mail a vevőnek)',
      markDelivered: 'Kézbesítve',
      cancel: 'Lemondás',
      refund: 'Teljes visszatérítés',
      restock: 'A termék legyen újra eladható',
      refundConfirm: 'Biztosan visszatéríted a teljes összeget?',
      details: 'Részletek',
    },
    shippingRates: {
      title: 'Szállítási díjak',
      lead: 'Csomagméret × zóna, fontban. A vevő ezt látja a fizetés előtt. A futár kiválasztása után állítsd a valós díjakra.',
      size: 'Méret',
      save: 'Díjak mentése',
      saved: 'A díjak elmentve.',
    },
  },
  sizes: {
    small: 'Kicsi (max. 2 kg – pl. könyv, ruha)',
    medium: 'Közepes (max. 10 kg – pl. cipő, kisgép)',
    large: 'Nagy (max. 20 kg – pl. kisebb bútor)',
    custom: 'Egyedi (árajánlatra)',
  },
  zones: { uk: 'Egyesült Királyság', eu: 'Európai Unió' },
  checkout: {
    label: 'Pénztár',
    title: 'Rendelés',
    country: 'Szállítási ország',
    chooseCountry: 'Válassz országot…',
    item: 'Termék',
    shipping: 'Szállítás',
    total: 'Fizetendő',
    seller: 'Eladó',
    delivery: 'Szállítás',
    deliveryText: 'A csomagot a fizetéstől számított 3 munkanapon belül feladjuk; a feladásról csomagkövetési számmal értesítünk.',
    customsTitle: 'Vám és import-ÁFA',
    customsUk: 'Egyesült Királyságon belül nincs további költség.',
    customsEu: 'Az EU-ba küldött csomagoknál a címzett országa import-ÁFÁ-t, vámot és kezelési díjat számolhat fel átvételkor. Ezeket a címzett fizeti, az árunk nem tartalmazza őket.',
    cancelTitle: 'Elállási jog',
    cancelText: 'A termék átvételétől számított 14 napon belül indoklás nélkül elállhatsz a vásárlástól. A visszaküldés költsége a vevőt terheli.',
    acceptBefore: 'Elolvastam és elfogadom az ',
    acceptTerms: 'Általános Szerződési Feltételeket',
    acceptAnd: ' és az ',
    acceptReturns: 'elállási és visszatérítési szabályokat',
    acceptAfter: '.',
    pay: 'Fizetés (fizetési kötelezettséggel járó megrendelés)',
    paying: 'Átirányítás a fizetéshez…',
    secure: 'A fizetés a Stripe biztonságos oldalán történik; a kártyaadataidat mi nem látjuk.',
    notAvailable: 'Ez a termék most nem rendelhető online.',
    error: 'A fizetés most nem indítható. Próbáld újra később.',
  },
  order: {
    label: 'Rendelés',
    processing: 'Fizetés feldolgozása…',
    paidTitle: 'Köszönjük a rendelést!',
    paidText: (r) => `A rendelésszámod: ${r}. A visszaigazolást e-mailben elküldtük.`,
    pendingText: 'A fizetést még feldolgozzuk. Ha sikerült, pár percen belül e-mailt kapsz.',
    notFound: 'Ezt a rendelést nem találjuk.',
    total: 'Fizetett összeg',
    continue: 'Vissza a termékekhez',
  },
  legal: { terms: 'ÁSZF', returns: 'Elállás és visszatérítés', shipping: 'Szállítás és vámok' },
  conditions: { new: 'Új', like_new: 'Újszerű', good: 'Jó', fair: 'Használt' },
  categories: {
    electronics: 'Elektronika',
    furniture: 'Bútor',
    clothing: 'Ruházat',
    books: 'Könyv',
    sports: 'Sport',
    'home-garden': 'Otthon és kert',
    kids: 'Gyerek',
    other: 'Egyéb',
  },
  footer: { tags: ['Újrahasználat', 'Adás-vétel', 'Fenntarthatóság'], registered: 'Bejegyezve: Anglia és Wales', companyNo: 'Cégjegyzékszám', office: 'Bejegyzett székhely', rights: 'Minden jog fenntartva.' },
};

const en: Content = {
  nav: { browse: 'Listings', sell: 'Sell', my: 'My listings', admin: 'Admin', login: 'Log in', logout: 'Log out' },
  home: {
    eyebrow: 'Second-hand marketplace',
    lines: ['Pass it', 'on,', 'buy it again.'],
    quote: '"What you no longer need might be just right for someone else. List it in minutes."',
    primaryCta: 'Post a listing',
    secondaryCta: 'Browse',
    categoriesLabel: 'Categories',
    categoriesTitle: 'What are you looking for?',
    latestLabel: 'Fresh',
    latestTitle: 'Latest listings',
    viewAll: 'All listings',
    sellTitle: 'Got something spare?',
    sellText: 'A photo, a price, a few words – and it is live. Free, right after sign-up.',
    sellCta: 'Sell something',
  },
  browse: {
    label: 'Listings',
    title: 'Browse',
    search: 'Search',
    searchPlaceholder: 'e.g. bike, sofa…',
    category: 'Category',
    allCategories: 'All categories',
    condition: 'Condition',
    anyCondition: 'Any',
    minPrice: 'Min price (£)',
    maxPrice: 'Max price (£)',
    sort: 'Sort',
    sortNewest: 'Newest',
    sortPriceAsc: 'Price: low to high',
    sortPriceDesc: 'Price: high to low',
    apply: 'Filter',
    reset: 'Clear',
    results: (n) => `${n} ${n === 1 ? 'result' : 'results'}`,
    empty: 'No listings match your filters.',
    prev: 'Previous',
    next: 'Next',
    page: (c, l) => `Page ${c} of ${l}`,
  },
  listing: {
    back: 'Back to listings',
    condition: 'Condition',
    category: 'Category',
    location: 'Location',
    posted: 'Posted',
    seller: 'Seller',
    contactSeller: 'Email the seller',
    loginToContact: "Log in to see the seller's contact",
    buyNow: 'Buy now',
    reserved: 'Someone is checking out this item right now. Please check back in half an hour.',
    customShipping: 'This item is oversized: we quote shipping on request. Send us a message below.',
    checkoutCancelled: 'Checkout was cancelled and you have not been charged. You can start again any time.',
    shippingFrom: 'Shipping',
    inquire: 'Ask about this item',
    inquiryName: 'Name',
    inquiryEmail: 'Email',
    inquiryMessage: 'Message',
    inquiryPrefill: (title, id) => `I'm interested in this listing: ${title} (#${id}).`,
    inquirySend: 'Send message',
    inquirySending: 'Sending…',
    inquirySent: 'Thank you! We have received your message and will reply soon.',
    inquiryError: 'The message could not be sent. Please try again later.',
    sold: 'Sold',
    edit: 'Edit',
    markSold: 'Mark as sold',
    markActive: 'Reactivate',
    delete: 'Delete',
    confirmDelete: 'Delete this listing?',
    imageAlt: 'Product photo placeholder',
  },
  form: {
    newLabel: 'Sell',
    newTitle: 'New listing',
    editTitle: 'Edit listing',
    title: 'Title',
    description: 'Description',
    price: 'Price (£)',
    category: 'Category',
    choose: 'Choose…',
    condition: 'Condition',
    location: 'Location',
    image: 'Photo',
    imageHint: 'JPG, PNG or WEBP, up to 5 MB.',
    shippingSize: 'Parcel size',
    shippingSizeHint: 'Used to calculate shipping. Oversized items cannot be ordered online.',
    priceInvalid: 'Enter a valid price in pounds, e.g. 12.50.',
    removeImage: 'Remove photo',
    create: 'Post listing',
    save: 'Save',
    cancel: 'Cancel',
    saving: 'Saving…',
  },
  my: {
    label: 'Account',
    title: 'My listings',
    empty: "You don't have any listings yet.",
    newListing: 'New listing',
    active: 'Active',
    sold: 'Sold',
  },
  auth: {
    loginLabel: 'Log in',
    loginTitle: 'Welcome back.',
    loginLead: 'Log in to manage your listings.',
    registerLabel: 'Sign up',
    registerTitle: 'Join in.',
    registerLead: 'One minute and you can post your first listing.',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    passwordConfirm: 'Confirm password',
    login: 'Log in',
    register: 'Sign up',
    noAccount: "No account yet? Sign up",
    hasAccount: 'Already have an account? Log in',
  },
  common: {
    loading: 'Loading…',
    error: 'Something went wrong. Please try again later.',
    notFoundTitle: 'Page not found.',
    notFoundText: "The page or listing you're looking for doesn't exist.",
    home: 'Home',
    reload: 'Reload',
  },
  admin: {
    label: 'Admin',
    title: 'Dashboard',
    tabs: { overview: 'Overview', orders: 'Orders', shipping: 'Shipping', listings: 'Listings', categories: 'Categories', users: 'Users', messages: 'Messages' },
    stats: { users: 'users', active: 'active listings', sold: 'sold', week: 'new listings (7 days)', categories: 'categories', unread: 'unread messages', toShip: 'orders to ship' },
    search: 'Search…',
    allStatuses: 'All statuses',
    allSites: 'All sites',
    onlyUnread: 'Unread only',
    columns: { title: 'Title', category: 'Category', price: 'Price', seller: 'Seller', status: 'Status', actions: 'Actions', name: 'Name', slug: 'Slug', position: 'Order', listings: 'Listings', email: 'Email', role: 'Role', site: 'Site', date: 'Date' },
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    confirm: 'Sure?',
    add: 'Add',
    newCategory: 'New category name',
    categoryHasListings: 'Only empty categories can be deleted.',
    makeAdmin: 'Make admin',
    removeAdmin: 'Remove admin',
    adminRole: 'Admin',
    userRole: 'User',
    you: 'you',
    markRead: 'Mark read',
    markUnread: 'Mark unread',
    reply: 'Reply',
    empty: 'Nothing found.',
    orders: {
      allStatuses: 'All orders',
      statuses: { pending: 'Awaiting payment', paid: 'Paid – to ship', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled', refunded: 'Refunded', expired: 'Expired' },
      customer: 'Customer',
      address: 'Shipping address',
      items: 'Item',
      carrier: 'Carrier',
      tracking: 'Tracking number',
      note: 'Internal note',
      save: 'Save',
      saved: 'Saved.',
      markShipped: 'Mark shipped (emails the customer)',
      markDelivered: 'Mark delivered',
      cancel: 'Cancel order',
      refund: 'Full refund',
      restock: 'Put the item back on sale',
      refundConfirm: 'Refund the full amount?',
      details: 'Details',
    },
    shippingRates: {
      title: 'Shipping rates',
      lead: 'Parcel size × zone, in pounds. Customers see these before paying. Set them to your carrier’s real prices.',
      size: 'Size',
      save: 'Save rates',
      saved: 'Rates saved.',
    },
  },
  sizes: {
    small: 'Small (up to 2 kg – e.g. book, clothing)',
    medium: 'Medium (up to 10 kg – e.g. shoes, small appliance)',
    large: 'Large (up to 20 kg – e.g. small furniture)',
    custom: 'Oversized (quote on request)',
  },
  zones: { uk: 'United Kingdom', eu: 'European Union' },
  checkout: {
    label: 'Checkout',
    title: 'Your order',
    country: 'Delivery country',
    chooseCountry: 'Choose a country…',
    item: 'Item',
    shipping: 'Shipping',
    total: 'Total to pay',
    seller: 'Seller',
    delivery: 'Delivery',
    deliveryText: 'We dispatch within 3 working days of payment and email you a tracking number.',
    customsTitle: 'Customs and import VAT',
    customsUk: 'No extra charges for UK deliveries.',
    customsEu: 'Parcels sent to the EU may be charged import VAT, customs duty and handling fees by the destination country on delivery. These are paid by the recipient and are not included in our prices.',
    cancelTitle: 'Right to cancel',
    cancelText: 'You can cancel your purchase without giving a reason within 14 days of receiving the item. Return postage is paid by the buyer.',
    acceptBefore: 'I have read and accept the ',
    acceptTerms: 'Terms and Conditions',
    acceptAnd: ' and the ',
    acceptReturns: 'Returns and Refunds policy',
    acceptAfter: '.',
    pay: 'Pay now',
    paying: 'Redirecting to payment…',
    secure: 'Payment is handled on Stripe’s secure page; we never see your card details.',
    notAvailable: 'This item cannot be ordered online right now.',
    error: 'We could not start the payment. Please try again later.',
  },
  order: {
    label: 'Order',
    processing: 'Processing your payment…',
    paidTitle: 'Thank you for your order!',
    paidText: (r) => `Your order number is ${r}. We have emailed you a confirmation.`,
    pendingText: 'We are still processing your payment. If it went through, you will receive an email within a few minutes.',
    notFound: 'We could not find this order.',
    total: 'Total paid',
    continue: 'Back to the shop',
  },
  legal: { terms: 'Terms', returns: 'Returns & refunds', shipping: 'Shipping & customs' },
  conditions: { new: 'New', like_new: 'Like new', good: 'Good', fair: 'Used' },
  categories: {
    electronics: 'Electronics',
    furniture: 'Furniture',
    clothing: 'Clothing',
    books: 'Books',
    sports: 'Sports',
    'home-garden': 'Home & garden',
    kids: 'Kids',
    other: 'Other',
  },
  footer: { tags: ['Reuse', 'Buy & sell', 'Sustainability'], registered: 'Registered in England & Wales', companyNo: 'Company no.', office: 'Registered office', rights: 'All rights reserved.' },
};

const es: Content = {
  nav: { browse: 'Anuncios', sell: 'Vender', my: 'Mis anuncios', admin: 'Admin', login: 'Entrar', logout: 'Salir' },
  home: {
    eyebrow: 'Mercado de segunda mano',
    lines: ['Pásalo,', 'dale', 'otra vida.'],
    quote: '«Lo que ya no necesitas puede ser justo lo que otra persona busca. Publícalo en minutos.»',
    primaryCta: 'Publicar anuncio',
    secondaryCta: 'Explorar',
    categoriesLabel: 'Categorías',
    categoriesTitle: '¿Qué buscas?',
    latestLabel: 'Nuevo',
    latestTitle: 'Últimos anuncios',
    viewAll: 'Todos los anuncios',
    sellTitle: '¿Te sobra algo?',
    sellText: 'Una foto, un precio, unas palabras y ya está publicado. Gratis, nada más registrarte.',
    sellCta: 'Vender algo',
  },
  browse: {
    label: 'Anuncios',
    title: 'Explorar',
    search: 'Buscar',
    searchPlaceholder: 'p. ej. bicicleta, sofá…',
    category: 'Categoría',
    allCategories: 'Todas las categorías',
    condition: 'Estado',
    anyCondition: 'Cualquiera',
    minPrice: 'Precio mín. (£)',
    maxPrice: 'Precio máx. (£)',
    sort: 'Ordenar',
    sortNewest: 'Más recientes',
    sortPriceAsc: 'Precio: de menor a mayor',
    sortPriceDesc: 'Precio: de mayor a menor',
    apply: 'Filtrar',
    reset: 'Borrar',
    results: (n) => `${n} ${n === 1 ? 'resultado' : 'resultados'}`,
    empty: 'Ningún anuncio coincide con los filtros.',
    prev: 'Anterior',
    next: 'Siguiente',
    page: (c, l) => `Página ${c} de ${l}`,
  },
  listing: {
    back: 'Volver a los anuncios',
    condition: 'Estado',
    category: 'Categoría',
    location: 'Ubicación',
    posted: 'Publicado',
    seller: 'Vendedor',
    contactSeller: 'Escribir al vendedor',
    loginToContact: 'Entra para ver el contacto del vendedor',
    buyNow: 'Comprar',
    reserved: 'Alguien está pagando este artículo ahora mismo. Vuelve a mirar en media hora.',
    customShipping: 'Este artículo es de tamaño especial: el envío se presupuesta a petición. Escríbenos abajo.',
    checkoutCancelled: 'El pago se ha cancelado y no se te ha cobrado nada. Puedes volver a empezar cuando quieras.',
    shippingFrom: 'Envío',
    inquire: 'Preguntar por este artículo',
    inquiryName: 'Nombre',
    inquiryEmail: 'Correo',
    inquiryMessage: 'Mensaje',
    inquiryPrefill: (title, id) => `Me interesa este anuncio: ${title} (#${id}).`,
    inquirySend: 'Enviar mensaje',
    inquirySending: 'Enviando…',
    inquirySent: '¡Gracias! Hemos recibido tu mensaje y te responderemos pronto.',
    inquiryError: 'No se pudo enviar. Inténtalo de nuevo más tarde.',
    sold: 'Vendido',
    edit: 'Editar',
    markSold: 'Marcar como vendido',
    markActive: 'Reactivar',
    delete: 'Eliminar',
    confirmDelete: '¿Eliminar este anuncio?',
    imageAlt: 'Espacio para la foto del producto',
  },
  form: {
    newLabel: 'Vender',
    newTitle: 'Nuevo anuncio',
    editTitle: 'Editar anuncio',
    title: 'Título',
    description: 'Descripción',
    price: 'Precio (£)',
    category: 'Categoría',
    choose: 'Elige…',
    condition: 'Estado',
    location: 'Ubicación',
    image: 'Foto',
    imageHint: 'JPG, PNG o WEBP, hasta 5 MB.',
    shippingSize: 'Tamaño del paquete',
    shippingSizeHint: 'Sirve para calcular el envío. Los artículos de tamaño especial no se pueden pedir online.',
    priceInvalid: 'Introduce un precio válido en libras, p. ej. 12.50.',
    removeImage: 'Quitar foto',
    create: 'Publicar anuncio',
    save: 'Guardar',
    cancel: 'Cancelar',
    saving: 'Guardando…',
  },
  my: {
    label: 'Cuenta',
    title: 'Mis anuncios',
    empty: 'Todavía no tienes anuncios.',
    newListing: 'Nuevo anuncio',
    active: 'Activo',
    sold: 'Vendido',
  },
  auth: {
    loginLabel: 'Entrar',
    loginTitle: 'Hola de nuevo.',
    loginLead: 'Entra para gestionar tus anuncios.',
    registerLabel: 'Registro',
    registerTitle: 'Únete.',
    registerLead: 'Un minuto y ya puedes publicar tu primer anuncio.',
    name: 'Nombre',
    email: 'Correo',
    password: 'Contraseña',
    passwordConfirm: 'Repite la contraseña',
    login: 'Entrar',
    register: 'Registrarme',
    noAccount: '¿No tienes cuenta? Regístrate',
    hasAccount: '¿Ya tienes cuenta? Entra',
  },
  common: {
    loading: 'Cargando…',
    error: 'Algo ha fallado. Inténtalo de nuevo más tarde.',
    notFoundTitle: 'Página no encontrada.',
    notFoundText: 'La página o el anuncio que buscas no existe.',
    home: 'Inicio',
    reload: 'Recargar',
  },
  admin: {
    label: 'Admin',
    title: 'Panel',
    tabs: { overview: 'Resumen', orders: 'Pedidos', shipping: 'Envíos', listings: 'Anuncios', categories: 'Categorías', users: 'Usuarios', messages: 'Mensajes' },
    stats: { users: 'usuarios', active: 'anuncios activos', sold: 'vendidos', week: 'anuncios nuevos (7 días)', categories: 'categorías', unread: 'mensajes sin leer', toShip: 'pedidos por enviar' },
    search: 'Buscar…',
    allStatuses: 'Todos los estados',
    allSites: 'Todas las webs',
    onlyUnread: 'Solo sin leer',
    columns: { title: 'Título', category: 'Categoría', price: 'Precio', seller: 'Vendedor', status: 'Estado', actions: 'Acciones', name: 'Nombre', slug: 'Identificador', position: 'Orden', listings: 'Anuncios', email: 'Correo', role: 'Rol', site: 'Web', date: 'Fecha' },
    edit: 'Editar',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    confirm: '¿Seguro?',
    add: 'Añadir',
    newCategory: 'Nombre de la nueva categoría',
    categoryHasListings: 'Solo se pueden eliminar categorías vacías.',
    makeAdmin: 'Hacer admin',
    removeAdmin: 'Quitar admin',
    adminRole: 'Admin',
    userRole: 'Usuario',
    you: 'tú',
    markRead: 'Marcar leído',
    markUnread: 'Marcar no leído',
    reply: 'Responder',
    empty: 'Sin resultados.',
    orders: {
      allStatuses: 'Todos los pedidos',
      statuses: { pending: 'Pendiente de pago', paid: 'Pagado – por enviar', shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado', refunded: 'Reembolsado', expired: 'Caducado' },
      customer: 'Cliente',
      address: 'Dirección de envío',
      items: 'Artículo',
      carrier: 'Transportista',
      tracking: 'Número de seguimiento',
      note: 'Nota interna',
      save: 'Guardar',
      saved: 'Guardado.',
      markShipped: 'Marcar como enviado (avisa al cliente)',
      markDelivered: 'Marcar como entregado',
      cancel: 'Cancelar pedido',
      refund: 'Reembolso completo',
      restock: 'Volver a poner el artículo a la venta',
      refundConfirm: '¿Reembolsar el importe completo?',
      details: 'Detalles',
    },
    shippingRates: {
      title: 'Tarifas de envío',
      lead: 'Tamaño del paquete × zona, en libras. El cliente las ve antes de pagar. Ajústalas a los precios reales del transportista.',
      size: 'Tamaño',
      save: 'Guardar tarifas',
      saved: 'Tarifas guardadas.',
    },
  },
  sizes: {
    small: 'Pequeño (hasta 2 kg – p. ej. libro, ropa)',
    medium: 'Mediano (hasta 10 kg – p. ej. zapatos, pequeño electrodoméstico)',
    large: 'Grande (hasta 20 kg – p. ej. mueble pequeño)',
    custom: 'Especial (presupuesto a petición)',
  },
  zones: { uk: 'Reino Unido', eu: 'Unión Europea' },
  checkout: {
    label: 'Pago',
    title: 'Tu pedido',
    country: 'País de entrega',
    chooseCountry: 'Elige un país…',
    item: 'Artículo',
    shipping: 'Envío',
    total: 'Total a pagar',
    seller: 'Vendedor',
    delivery: 'Entrega',
    deliveryText: 'Enviamos el paquete en un plazo de 3 días laborables desde el pago y te mandamos el número de seguimiento por correo.',
    customsTitle: 'Aduanas e IVA de importación',
    customsUk: 'Sin costes adicionales para entregas en el Reino Unido.',
    customsEu: 'En los envíos a la UE, el país de destino puede cobrar IVA de importación, aranceles y gastos de gestión en la entrega. Los paga el destinatario y no están incluidos en nuestros precios.',
    cancelTitle: 'Derecho de desistimiento',
    cancelText: 'Puedes desistir de la compra sin indicar el motivo en los 14 días siguientes a la recepción del artículo. Los gastos de devolución corren a cargo del comprador.',
    acceptBefore: 'He leído y acepto las ',
    acceptTerms: 'Condiciones Generales',
    acceptAnd: ' y la ',
    acceptReturns: 'política de devoluciones y reembolsos',
    acceptAfter: '.',
    pay: 'Pagar ahora',
    paying: 'Redirigiendo al pago…',
    secure: 'El pago se realiza en la página segura de Stripe; nunca vemos los datos de tu tarjeta.',
    notAvailable: 'Este artículo no se puede pedir online ahora mismo.',
    error: 'No hemos podido iniciar el pago. Inténtalo de nuevo más tarde.',
  },
  order: {
    label: 'Pedido',
    processing: 'Procesando el pago…',
    paidTitle: '¡Gracias por tu pedido!',
    paidText: (r) => `Tu número de pedido es ${r}. Te hemos enviado la confirmación por correo.`,
    pendingText: 'Todavía estamos procesando el pago. Si se ha completado, recibirás un correo en unos minutos.',
    notFound: 'No encontramos este pedido.',
    total: 'Total pagado',
    continue: 'Volver a la tienda',
  },
  legal: { terms: 'Condiciones', returns: 'Devoluciones', shipping: 'Envíos y aduanas' },
  conditions: { new: 'Nuevo', like_new: 'Como nuevo', good: 'Bueno', fair: 'Usado' },
  categories: {
    electronics: 'Electrónica',
    furniture: 'Muebles',
    clothing: 'Ropa',
    books: 'Libros',
    sports: 'Deporte',
    'home-garden': 'Hogar y jardín',
    kids: 'Niños',
    other: 'Otros',
  },
  footer: { tags: ['Reutilizar', 'Compraventa', 'Sostenibilidad'], registered: 'Registrada en Inglaterra y Gales', companyNo: 'N.º de empresa', office: 'Domicilio social', rights: 'Todos los derechos reservados.' },
};

export const content: Record<Lang, Content> = { hu, en, es };
