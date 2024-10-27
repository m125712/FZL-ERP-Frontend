import { PI_MD_SIGN } from '@/assets/img/base64';

import { DEFAULT_FONT_SIZE, xMargin } from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import { DollarToWord } from '@/lib/NumToWord';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('order_number', 'Order No'),
	//getTable('po', 'PO'),
	getTable('style', 'Style'),
	getTable('item', 'Item'),
	getTable('specification', 'Specification'),
	getTable('size', 'Size'),
	getTable('quantity', 'Quantity', 'right'),
	getTable('unit_price', 'Unit Price\n(US$)', 'right'),
	getTable('value', 'Value\n(US$)', 'right'),
];

export default function Index(data) {
	const headerHeight = 180;
	let footerHeight = 20;
	let { manual_pi_entry } = data;

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
	const entry = manual_pi_entry.map((item) => ({
		...item,
		unit_price: item.unit_price+'/dzn',
		quantity: item.is_zipper ? item.quantity + '/pcs' : item.quantity + '/cons' ,
		value: item.quantity * (item.unit_price / 12),
	}));
	const totalQuantityZipper = manual_pi_entry
		.filter((item) => item.is_zipper)
		.reduce((total, item) => total + item.quantity, 0);
	const totalQuantityThread = manual_pi_entry
		.filter((item) => !item.is_zipper)
		.reduce((total, item) => total + item.quantity, 0);

	const grand_total_value = entry.reduce(
		(total, item) => total + item.value,
		0
	);

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
			margin: [xMargin, 30, xMargin, 0],
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
			{
				table: {
					headerRows: 1,
					widths: [47, 50, 50, '*', 65, 40, 45, 40],
					body: [
						// Header
						TableHeader(node),

						// Body
						...entry.map((item) =>
							node.map((nodeItem) => ({
								text:
									nodeItem.field === 'value' &&
									typeof item[nodeItem.field] === 'number'
										? item[nodeItem.field].toFixed(2)
										: item[nodeItem.field],
								style: nodeItem.cellStyle,
								alignment: nodeItem.alignment,
							}))
						),
						[
							{
								text: [
									Number(totalQuantityZipper) > 0
										? `Total Zipper: ${Number(totalQuantityZipper)} pcs`
										: '',
									Number(totalQuantityZipper) > 0 &&
									Number(totalQuantityThread) > 0
										? ', '
										: '',
									Number(totalQuantityThread) > 0
										? `Total Thread: ${totalQuantityThread} cone`
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
								text: `U.S.$: ${Number(grand_total_value || 0).toFixed(2)}`,
								alignment: 'right',
								bold: true,
								colSpan: 2,
							},
							{},
						],
					],
				},
			},
			{
				text: '\n',
			},
			{
				text:
					'Total Value (In Words): ' +
					DollarToWord(grand_total_value),
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
			// {
			// 	text: '\n',
			// },
			{
				table: {
					widths: [60, '*'],
					body: headers.map((header, index) => [
						{ text: header, bold: true },
						{ text: values[index] },
					]),
				},
				layout: 'noBorders',
			},
			{
				image: PI_MD_SIGN.src,
				width: 100,
				height: 100,
				alignment: 'right',
			},
		],
	});

	return pdfDocGenerator;
}
