'use client';

import React from 'react';
import '../styles/pages/404.scss';
import Link from 'next/link';

const ErrorPage = ({ error }: any) => {
  return (
    <div id="notfound">
      <div className="notfound-bg"></div>
      <div className="notfound">
        <div className="notfound-404">
          <h1>{error.status}</h1>
        </div>
        <h2>{error.message}</h2>
        <Link href="/" className="home-btn">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
