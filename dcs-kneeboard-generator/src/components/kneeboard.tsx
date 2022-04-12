import React, { FC } from 'react';

import { Header, Section } from '.';
import styles from './kneeboard.module.scss';
import type { Kneeboard as KneeboardData } from '../types/kneeboard';

export const Kneeboard: FC<{ kneeboard: KneeboardData }> = ({ kneeboard }) => {
  return (
    <main className={styles.main}>
      <Header kneeboard={kneeboard} />
      <div className={styles.sections}>
        {kneeboard.sections.map((section, i) => (
          <Section key={i} section={section} guide_key={kneeboard.key} />
        ))}
      </div>
    </main>
  );
};
