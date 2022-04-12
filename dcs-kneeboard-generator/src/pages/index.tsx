import type { NextPage } from 'next';
import Head from 'next/head';

import { data as kneeboard } from '../data';
import { usePrintEvent } from '../hooks';
import { Kneeboard } from '../components';
import styles from './index.module.scss';

const Home: NextPage = () => {
  const title = `${kneeboard.subject_object.name} ${kneeboard.name}`;

  usePrintEvent(() =>
    download_pdf(kneeboard.subject_object.slug, kneeboard.subject_object.name),
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={kneeboard.description ?? title} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/* <link rel="manifest" href="manifest.json" /> */}

        <link rel="icon" href="/icon.svg" />

        <meta property="og:site_name" content={title} />
        <meta property="og:title" content={title} />
        {/* <meta property="og:type" content="profile" /> */}
        {kneeboard.description != null && (
          <meta property="og:description" content={kneeboard.description} />
        )}
      </Head>

      <Kneeboard kneeboard={kneeboard} />
    </div>
  );
};

export function download_pdf(url: string, name: string) {
  const anchor = document.createElement('a');
  anchor.style.visibility = 'hidden';
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

export default Home;
