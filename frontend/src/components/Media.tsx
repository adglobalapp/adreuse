import { Icon } from './Icon';
import './Media.css';

type MediaProps = {
  /** Kép elérési útja (pl. `/images/portre.jpg` a public/ mappából). Ha üres, placeholder jelenik meg. */
  src?: string;
  alt: string;
  /** CSS aspect-ratio, pl. `4 / 5` vagy `16 / 9`. */
  ratio?: string;
  className?: string;
};

export function Media({ src, alt, ratio = '4 / 3', className = '' }: MediaProps) {
  return (
    <figure className={`media ${className}`.trim()} style={{ aspectRatio: ratio }}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        <div className="media__placeholder" role="img" aria-label={alt}>
          <Icon name="image" size={28} />
          <span>{alt}</span>
        </div>
      )}
    </figure>
  );
}
