import threadPDF from '@components/Pdf/OrderStatement/thread';

import pdfMake from '@/components/Pdf/pdfMake';
import {
	DEFAULT_FONT_SIZE,
	defaultStyle,
	styles,
	xMargin,
} from '@/components/Pdf/ui';

import {
	chunkArray,
	getGarmentInfo,
	getPageFooter,
	getPageHeader,
	getSpecialReqInfo,
	grandTotal,
	TableHeader,
} from './utils';

export default function OrderSheetPdf(data) {
	const OrderSheets = data?.thread?.map((item) => threadPDF(item));
	OrderSheets[0].open();

	return;
}
