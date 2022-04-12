import { FC, Fragment } from 'react';

import { VerySimpleMD } from '.';
import styles from './section.module.scss';
import type { Key, Section as SectionData } from '../types/kneeboard';

export const Section: FC<{
  section: SectionData;
  guide_key?: Key;
}> = ({ section, guide_key }) => {
  return (
    <div className={styles.section}>
      <header className={styles.header}>{section.name}</header>
      <table className={styles.steps}>
        <tbody>
          {section.steps.map((step, i) => (
            <Fragment key={i}>
              <tr
                style={{
                  backgroundColor:
                    guide_key?.colors?.[step.color_key ?? '']?.color ?? 'unset',
                }}
              >
                <td>{i + 1}</td>
                <td>
                  <VerySimpleMD md={step.name} />
                </td>
                <td style={{ fontStyle: 'italic' }}>{step.control_location}</td>
                <td>
                  <VerySimpleMD md={step.state ?? ''} />
                </td>
              </tr>
              {[step.substep, step.substep_location, step.substep_state].some(
                s => s != null,
              ) && (
                <tr
                  style={{
                    backgroundColor:
                      guide_key?.colors?.[step.color_key ?? '']?.color ??
                      'unset',
                  }}
                >
                  <td></td>
                  <td style={{ fontStyle: 'italic' }}>
                    <VerySimpleMD md={step.substep ?? ''} />
                  </td>
                  <td>{step.substep_location}</td>
                  <td>
                    <VerySimpleMD md={step.substep_state ?? ''} />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
