import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ReactNode } from 'react';

interface ScrollLinkProps {
  to: string;
  id: string;
  children: ReactNode;
  className?: string;
}

const ScrollLink = ({ to, id, children, className }: ScrollLinkProps) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === to && id) {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location, to, id]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    if (location.pathname === to) {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <Link to={to} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

export default ScrollLink;