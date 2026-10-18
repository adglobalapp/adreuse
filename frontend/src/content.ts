// A felület szövegei három nyelven – egy helyen, hogy könnyű legyen cserélni.

export const languages = ['en', 'es', 'hu'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'hu';

export const locales: Record<Lang, string> = { hu: 'hu-HU', en: 'en-GB', es: 'es-ES' };

export type Condition = 'new' | 'like_new' | 'good' | 'fair';

export type Content = {
  nav: { browse: string; sell: string; my: string; login: string; logout: string };
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
  };
  conditions: Record<Condition, string>;
  /** Kategórianevek a backend slugjai szerint; ha egy slug hiányzik, a backend neve jelenik meg. */
  categories: Record<string, string>;
  footer: { tags: string[]; rights: string };
};

const hu: Content = {
  nav: { browse: 'Hirdetések', sell: 'Eladok', my: 'Hirdetéseim', login: 'Belépés', logout: 'Kilépés' },
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
    minPrice: 'Min. ár',
    maxPrice: 'Max. ár',
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
    price: 'Ár (Ft)',
    category: 'Kategória',
    choose: 'Válassz…',
    condition: 'Állapot',
    location: 'Helyszín',
    image: 'Fotó',
    imageHint: 'JPG, PNG vagy WEBP, legfeljebb 5 MB.',
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
  },
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
  footer: { tags: ['Újrahasználat', 'Adás-vétel', 'Fenntarthatóság'], rights: 'Minden jog fenntartva.' },
};

const en: Content = {
  nav: { browse: 'Listings', sell: 'Sell', my: 'My listings', login: 'Log in', logout: 'Log out' },
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
    minPrice: 'Min price',
    maxPrice: 'Max price',
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
    price: 'Price (HUF)',
    category: 'Category',
    choose: 'Choose…',
    condition: 'Condition',
    location: 'Location',
    image: 'Photo',
    imageHint: 'JPG, PNG or WEBP, up to 5 MB.',
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
  },
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
  footer: { tags: ['Reuse', 'Buy & sell', 'Sustainability'], rights: 'All rights reserved.' },
};

const es: Content = {
  nav: { browse: 'Anuncios', sell: 'Vender', my: 'Mis anuncios', login: 'Entrar', logout: 'Salir' },
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
    minPrice: 'Precio mín.',
    maxPrice: 'Precio máx.',
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
    price: 'Precio (HUF)',
    category: 'Categoría',
    choose: 'Elige…',
    condition: 'Estado',
    location: 'Ubicación',
    image: 'Foto',
    imageHint: 'JPG, PNG o WEBP, hasta 5 MB.',
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
  },
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
  footer: { tags: ['Reutilizar', 'Compraventa', 'Sostenibilidad'], rights: 'Todos los derechos reservados.' },
};

export const content: Record<Lang, Content> = { hu, en, es };
