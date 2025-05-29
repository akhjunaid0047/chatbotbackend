import Link from 'next/link';

type Props = {
  to: string;
  bg: string;
  text: string;
  textColor: string;
  onClick?: () => Promise<void>;
};

const NavigationLink = ({ to, bg, text, textColor, onClick }: Props) => {
  return (
    <Link href={to} legacyBehavior>
      <a
        onClick={onClick}
        className="nav-link"
        style={{ background: bg, color: textColor }}
      >
        {text}
      </a>
    </Link>
  );
};

export default NavigationLink;
