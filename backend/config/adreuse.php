<?php

return [

    /*
    | Új fiókok regisztrációja. Kikapcsolva csak a meglévő fiókok (pl. adminok)
    | tudnak belépni; a frontend VITE_REGISTRATION_ENABLED kapcsolóját ugyanígy kell állítani.
    */
    'registration_enabled' => (bool) env('REGISTRATION_ENABLED', false),

];
