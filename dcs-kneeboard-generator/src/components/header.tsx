import React, { FC } from 'react';

import type { Kneeboard, KeyColor } from '../types/kneeboard';
import styles from './header.module.scss';

export const Header: FC<{ kneeboard: Kneeboard }> = ({ kneeboard }) => {
  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <div className={styles.kneeboard_name}>{kneeboard.name}</div>
        <div className={styles.subject_object_name}>
          {kneeboard.subject_object.name}
        </div>
      </div>

      {kneeboard.key?.colors != null && (
        <div className={styles.key}>
          {Object.keys(kneeboard.key.colors)
            .map(
              name =>
                (kneeboard.key?.colors as Record<string, KeyColor>)[
                  name
                ] as KeyColor,
            )
            .map((key, i) => (
              <div
                key={i}
                style={{ backgroundColor: key.color }}
                className={styles.key_color}
              >
                {key.name}
              </div>
            ))}
        </div>
      )}
    </header>
  );
};
