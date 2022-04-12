import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { Kneeboard } from '../src';

import { data } from '../src/data';

ReactPDF.render(<Kneeboard kneeboard={data} />, `${__dirname}/example.pdf`);
