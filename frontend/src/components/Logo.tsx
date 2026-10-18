import { Link } from 'react-router';
import { brand } from '../brand';
import './Logo.css';

export function LogoMark({ size }: { size?: number }) {
  return <img className="logo__mark" src={brand.logoMarkSrc} alt="" style={size ? { height: size } : undefined} />;
}

/** Ha a brand.ts-ben van `logoSrc`, az a kép jelenik meg; különben a logójel a két feliratrésszel. */
export function Logo() {
  if (brand.logoSrc) {
    return (
      <Link to="/" className="logo logo--image" aria-label={brand.name}>
        <img src={brand.logoSrc} alt={brand.name} />
      </Link>
    );
  }

  return (
    <Link to="/" className="logo" aria-label={brand.name}>
      <span>{brand.logoText[0]}</span>
      <LogoMark />
      <span>{brand.logoText[1]}</span>
    </Link>
  );
}
