<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * A feltöltött képet újrakódolja JPEG-be: eltűnnek a metaadatok (pl. a telefon GPS-koordinátái),
 * és a képnek álcázott, beágyazott tartalom sem kerül ki az oldalra. A túl nagy képet lekicsinyíti.
 */
class ImageSanitizer
{
    private const MAX_SIDE = 2000;

    public static function store(UploadedFile $file, string $dir = 'listings'): string
    {
        $raw = (string) file_get_contents($file->getRealPath());
        $image = @imagecreatefromstring($raw);

        if ($image === false) {
            throw ValidationException::withMessages(['image' => ['A kép nem olvasható.']]);
        }

        $image = self::orient($image, $file->getRealPath());
        $image = self::limit($image);

        ob_start();
        imagejpeg($image, null, 85);
        $jpeg = (string) ob_get_clean();
        imagedestroy($image);

        $path = $dir.'/'.Str::random(40).'.jpg';
        Storage::disk('public')->put($path, $jpeg);

        return $path;
    }

    /**
     * A telefonos fotók tájolása az EXIF-ben van; az újrakódolás előtt alkalmazzuk, különben elfordulna.
     */
    private static function orient(\GdImage $image, string $path): \GdImage
    {
        if (! function_exists('exif_read_data')) {
            return $image;
        }

        $orientation = (int) (@exif_read_data($path)['Orientation'] ?? 1);
        $angle = [3 => 180, 6 => -90, 8 => 90][$orientation] ?? 0;

        return $angle ? (imagerotate($image, $angle, 0) ?: $image) : $image;
    }

    private static function limit(\GdImage $image): \GdImage
    {
        $w = imagesx($image);
        $h = imagesy($image);
        $scale = min(1, self::MAX_SIDE / max($w, $h));

        if ($scale >= 1) {
            return $image;
        }

        return imagescale($image, (int) round($w * $scale), (int) round($h * $scale)) ?: $image;
    }
}
