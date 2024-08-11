import React from 'react';
import '../../styles/pages/404.scss';
import Link from 'next/link';

const Custom404 = () => {
  return (
    <div id="notfound">
      <div className="notfound-bg"></div>
      <div className="notfound">
        <div className="notfound-404">
          <h1>404</h1>
        </div>
        <h2>we are sorry, but the page you requested was not found</h2>
        <Link href="/" className="home-btn">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
