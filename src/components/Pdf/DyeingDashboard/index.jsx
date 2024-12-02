import { get } from 'react-hook-form';

import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('machine', 'Machine'),
	getTable('slot_1', 'Slot 1'),
	getTable('slot_2', 'Slot 2'),
	getTable('slot_3', 'Slot 3'),
	getTable('slot_4', 'Slot 4'),
	getTable('slot_5', 'Slot 5'),
	getTable('slot_6', 'Slot 6'),
];

export default function Index(data, dyeingDate) {
	const headerHeight = 80;
	let footerHeight = 50;

	const formatSlotData = (slotData) => {
		if (!slotData) return '';
		else if (slotData.is_zipper === 0) {
			return [
				{ text: 'Batch No: ', bold: true },
				slotData.batch_no || '',
				'\n',
				{ text: 'O/N: ', bold: true },
				slotData.order_no || '',
				'\n',
				{ text: 'Item: ', bold: true },
				slotData.item_description || '',
				'\n',
				{ text: 'Color: ', bold: true },
				slotData.color || '',
				'\n',

				{ text: 'Qty(cone): ', bold: true },
				slotData.total_quantity || 0,
				'\n',
				{ text: 'Status: ', bold: true },
				slotData.batch_status || '',
				'\n',
				{ text: 'Production Qty(cone): ', bold: true },
				slotData.total_actual_production_quantity || 0,
			];
		} else {
			return [
				{ text: 'Batch No: ', bold: true },
				slotData.batch_no || '',
				'\n',
				{ text: 'O/N: ', bold: true },
				slotData.order_no || '',
				'\n',
				{ text: 'Item: ', bold: true },
				slotData.item_description || '',
				'\n',
				{ text: 'Color: ', bold: true },
				slotData.color || '',
				'\n',
				{ text: 'Qty: ', bold: true },
				slotData.total_quantity || 0,
				'\n',
				{ text: 'Expected Kg: ', bold: true },
				slotData.expected_kg || 0,
				'\n',
				{ text: 'Production Qty(kg): ', bold: true },
				slotData.total_actual_production_quantity || 0,
				'\n',
				{ text: 'Status: ', bold: true },
				slotData.batch_status || '',
				'\n',
				{ text: 'Received: ', bold: true },
				slotData.received === 1 ? 'Yes' : 'No',
			];
		}
	};

	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_A4_PAGE({
			xMargin,
			headerHeight,
			footerHeight,
		}),
		pageOrientation: 'landscape',
		header: {
			table: getPageHeader(dyeingDate),
			layout: 'noBorders',
			margin: [xMargin, 30, xMargin, 0],
		},
		footer: (currentPage, pageCount) => ({
			table: getPageFooter({
				currentPage,
				pageCount,
			}),
			margin: [xMargin, 2],
			fontSize: DEFAULT_FONT_SIZE - 2,
		}),
		content: [
			{
				table: {
					headerRows: 1,
					widths: [70, '*', '*', '*', '*', '*', '*'],
					body: [
						TableHeader(node),
						...data?.map((item) =>
							node.map((nodeItem) => ({
								text:
									nodeItem.field === 'machine'
										? item[nodeItem.field]
										: formatSlotData(item[nodeItem.field]),
								style: nodeItem.cellStyle,
								alignment: nodeItem.alignment,
							}))
						),
					],
				},
			},
		],
	});

	return pdfDocGenerator;
}
