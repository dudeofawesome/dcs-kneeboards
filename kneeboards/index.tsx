import ReactPDF from '@react-pdf/renderer';
import { Kneeboard } from 'dcs-kneeboard-generator';

ReactPDF.render(<Kneeboard />, `${__dirname}/example.pdf`);
