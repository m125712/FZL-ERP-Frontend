import { PI_MD_SIGN } from '@/assets/img/base64';

import { DEFAULT_FONT_SIZE, xMargin } from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import { DollarToWord } from '@/lib/NumToWord';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const zipperNode = [
	getTable('order_number', 'Order No'),
	getTable('style', 'Style'),
	getTable('item', 'Item'),
	getTable('specification', 'Specification'),
	getTable('size', 'Size'),
	getTable('quantity', 'Quantity', 'right'),
	getTable('unit_price', 'Price($)', 'right'),
	getTable('value', 'Value($)', 'right'),
];
const threadNode = [
	getTable('order_number', 'Order No'),
	getTable('style', 'Style'),
	getTable('size', 'Size'),
	getTable('quantity', 'Quantity\n(cones)', 'right'),
	getTable('unit_price', 'Price/cone\n($)', 'right'),
	getTable('value', 'Value\n($)', 'right'),
];

export default function Index(data) {
	const headerHeight = 180;
	let footerHeight = 20;
	let { manual_zipper_pi_entry } = data;
	let { manual_thread_pi_entry } = data;

	if (!manual_zipper_pi_entry) {
		manual_zipper_pi_entry = [];
	}
	if (!manual_thread_pi_entry) {
		manual_thread_pi_entry = [];
	}
	const isThreadOrderExist = manual_thread_pi_entry.length > 0;
	const isZipperOrderExist = manual_zipper_pi_entry.length > 0;
	let grand_total_zipper_value = 0;
	let grand_total_thread_value = 0;
	let grand_total_quantity = 0;
	let grand_total_quantity_mtr = 0;
	let grand_total_slider = 0;
	let grand_thread_total_quantity = 0;
	// * Bank Policy
	const bankPolicy = data?.bank_policy
		.replace(/var_routing_no/g, `${data?.routing_no}`)
		.replace(/var_pi_validity/g, `${data?.validity}`)
		.replace(/var_bank_name/g, `${data?.bank_name}`)
		.replace(/var_payment/g, `${data?.payment}`);

	const lines = bankPolicy
		.split(';')
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	const headers = [];
	const values = [];

	lines.forEach((line) => {
		const [header, value] = line.split(':', 2);
		headers.push(header.trim());
		values.push(value ? value.trim() : '');
	});

	grand_total_quantity = manual_zipper_pi_entry.reduce(
		(total, item) => total + item.quantity,
		0
	);
	grand_thread_total_quantity = manual_thread_pi_entry.reduce(
		(total, item) => total + Number(item.quantity),
		0
	);
	grand_total_thread_value = manual_thread_pi_entry.reduce(
		(total, item) => total + Number(item.value),
		0
	);
	grand_total_zipper_value = manual_zipper_pi_entry.reduce(
		(total, item) => total + Number(item.value),
		0
	);
	const sortedZipperData = manual_zipper_pi_entry.sort((a, b) => {
		a.item.localeCompare(b.item);
	});


	const sortedThreadData = manual_thread_pi_entry.sort((a, b) => {
		return a.order_number.localeCompare(b.order_number);
	});
	const zipper = sortedZipperData.map((item) => {
		const rowSpan = sortedZipperData.filter(
			(data) => data.item === item.item
		).length;
		return {
			order_number: { text: item.order_number, rowSpan: rowSpan },
			style: { text: item.style, rowSpan: rowSpan },
			item: { text: item.item, rowSpan: rowSpan },
			specification: { text: item.specification, rowSpan: rowSpan },
			size: { text: item.size, rowSpan: rowSpan },
			quantity: item.quantity,
			unit_price: item.unit_price,
			unit_price_per_pcs: item.unit_price_per_pcs,
			value: item.value,
		};
	});
	const thread = sortedThreadData.map((item) => {
		const rowSpan = sortedThreadData.filter(
			(data) => data.order === item.order
		).length;
		const sizeRowSpan = sortedThreadData.filter(
			(data) =>
				data.size === item.size &&
				data.order_number === item.order_number
		).length;
		return {
			order_number: { text: item.order_number, rowSpan: rowSpan },
			style: { text: item.style, rowSpan: rowSpan },
			size: { text: item.size, rowSpan: sizeRowSpan },
			quantity: item.quantity,
			unit_price: item.unit_price,
			unit_price_per_pcs: item.unit_price_per_pcs,
			value: item.value,
		};
	});

	const grandTotal = grand_total_zipper_value + grand_total_thread_value;
	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_A4_PAGE({
			xMargin,
			headerHeight,
			footerHeight,
		}),

		// * Page Header
		header: {
			table: getPageHeader(data),
			layout: 'noBorders',
			margin: [xMargin, 10, xMargin, 0],
		},
		// * Page Footer
		footer: (currentPage, pageCount) => ({
			table: getPageFooter({
				currentPage,
				pageCount,
			}),
			margin: [xMargin, 2],
			fontSize: DEFAULT_FONT_SIZE - 2,
		}),

		// * Main Table
		content: [
			isZipperOrderExist
				? {
						table: {
							headerRows: 1,
							widths: [40, '*', 50, 70, 40, 35, 35, 35],
							body: [
								[
									{
										text: 'H S.Code',
									},
									{
										text: '9607.11.00',
										colSpan: 7,
									},
									{},
									{},
									{},
									{},
									{},
									{},
									
								],
								// Header
								TableHeader(zipperNode),

								// Body
								...zipper.map((item) =>
									zipperNode.map((nodeItem) => {
										const cellData = item[nodeItem.field];
										return {
											text: cellData?.text || cellData,
											style: nodeItem.cellStyle,
											alignment: nodeItem.alignment,
											rowSpan: cellData?.rowSpan,
										};
									})
								),
								[
									{
										text: [
											Number(grand_total_quantity) > 0
												? `Total Zipper: ${grand_total_quantity} pcs`
												: '',
											Number(grand_total_quantity) > 0 &&
											Number(grand_total_quantity_mtr) > 0
												? ','
												: '',
											Number(grand_total_quantity_mtr) > 0
												? `Total Tape: ${grand_total_quantity_mtr} mtr`
												: '',
											(Number(grand_total_quantity) > 0 ||
												Number(
													grand_total_quantity_mtr
												) > 0) &&
											Number(grand_total_slider) > 0
												? ','
												: '',
											Number(grand_total_slider) > 0
												? `Total Slider: ${grand_total_slider} pcs`
												: '',
										],
										alignment: 'right',
										bold: true,
										colSpan: 6,
									},
									{},
									{},
									{},
									{},
									{},
									{
										text: `U.S.$: ${Number(grand_total_zipper_value || 0).toFixed(2)}`,
										alignment: 'right',
										bold: true,
										colSpan: 2,
									},
									
									{},
								],
							],
						},
					}
				: {},
			isThreadOrderExist && isZipperOrderExist
				? {
						text: '\n',
					}
				: {},
			isThreadOrderExist
				? {
						table: {
							headerRows: 1,
							widths: [45, '*', 65, 55, 45, 40],
							body: [
								[
									{ text: 'Item' },
									{
										text: '100% SPUN POLYESTER SEWING THREAD',
										colSpan: 2,
									},
									{},
									{
										text: 'H S.Code',
									},
									{
										text: '5402.62.00',
										colSpan: 2,
									},
									{},
								],
								// Header
								TableHeader(threadNode),

								// Body
								...thread.map((item) =>
									threadNode.map((nodeItem) => {
										const cellData = item[nodeItem.field];
										return {
											text: cellData?.text || cellData,
											style: nodeItem.cellStyle,
											alignment: nodeItem.alignment,
											rowSpan: cellData?.rowSpan,
										};
									})
								),
								[
									{
										text: `Total Thread: ${grand_thread_total_quantity.toLocaleString()} cones`,
										alignment: 'right',
										bold: true,
										colSpan: 4,
									},
									{},
									{},
									{},
									{
										text: `U.S.$: ${Number(grand_total_thread_value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
										alignment: 'right',
										bold: true,
										colSpan: 2,
									},
									{},
								],
								...(isThreadOrderExist && isZipperOrderExist
									? [
											[
												{
													text: `Grand Total: `,
													alignment: 'right',
													bold: true,
													colSpan: 4,
												},
												{},
												{},
												{},
												{
													text: `U.S.$: ${Number(grandTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
													alignment: 'right',
													bold: true,
													colSpan: 2,
												},
												{},
											],
										]
									: []),
							],
						},
					}
				: {},
			{
				text: '\n',
			},
			// isThreadOrderExist && isZipperOrderExist
			// 	? {
			// 			text:
			// 				'Grand Total (USD): ' +
			// 				(
			// 					grand_total_zipper_value +
			// 					grand_total_thread_value
			// 				).toLocaleString() +
			// 				'',

			// 			bold: true,
			// 		}
			// 	: {},
			isThreadOrderExist && isZipperOrderExist
				? {
						text: '\n',
					}
				: {},
			{
				text:
					'Total Value (In Words): ' +
					DollarToWord(
						grand_total_zipper_value + grand_total_thread_value
					),
				bold: true,
			},
			{
				text: '\n',
			},
			{
				text: 'Terms & Conditions',
				underline: true,
				decoration: 'underline',
				bold: true,
			},

			{
				table: {
					widths: [60, '*'],
					body: headers.map((header, index) => [
						{ text: header, bold: true },
						{
							text:
								index === 0 && data?.is_rtgs
									? 'FDD/RTGS'
									: values[index],
						},
					]),
				},
				layout: 'noBorders',
			},
			{
				image: PI_MD_SIGN.src,
				width: 80,
				height: 90,
				alignment: 'right',
				margin: [0, -28, 0, 0],
			},
		],
	});

	return pdfDocGenerator;
}
