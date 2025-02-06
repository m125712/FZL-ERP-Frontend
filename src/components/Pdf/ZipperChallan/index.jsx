import { DEFAULT_FONT_SIZE, xMargin } from '@/components/Pdf/ui';
import {
	DEFAULT_LETTER_PAGE,
	getTable,
	TableHeader,
} from '@/components/Pdf/utils';

import { NumToWord } from '@/lib/NumToWord';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const createNode = (fields) => fields.map((field) => getTable(...field));

const zipperNode = createNode([
	['item_description', 'Item Description'],
	['specification', 'Specification'],
	['style', 'Style'],
	['color', 'Color'],
	['size', 'Size', 'right'],
	['quantity', 'Qty (pcs)', 'right'],
	['poli_quantity', 'Poly', 'right'],
]);

const tapeNode = createNode([
	['item_description', 'Item Description'],
	['specification', 'Specification'],
	['style', 'Style'],
	['color', 'Color'],
	['size', 'Size', 'right'],
	['quantity', 'Qty (mtr)', 'right'],
	['poli_quantity', 'Poly', 'right'],
]);

const sliderNode = createNode([
	['item_description', 'Item Description'],
	['specification', 'Specification'],
	['style', 'Style'],
	['quantity', 'Qty (pcs)', 'right'],
	['poli_quantity', 'Poly', 'right'],
]);

export default function Index(data) {
	const headerHeight = 220;
	const footerHeight = 50;
	const isTapeChallan = data?.item_for === 'tape';
	const isSliderChallan = data?.item_for === 'slider';
	const isSampleZipper = data?.item_for === 'sample_zipper';
	const packingListTable = [];
	const { packing_list_numbers, challan_entry } = data;

	let node = zipperNode;
	if (isTapeChallan) node = tapeNode;
	if (isSliderChallan) node = sliderNode;

	const uniqueCounts = (challan_entry) =>
		challan_entry?.reduce(
			(acc, item) => {
				acc.itemDescriptions.add(item.item_description);
				acc.specifications.add(item.specification);
				acc.styles.add(item.style);
				acc.colors.add(item.color);
				acc.sizes.add(item.size);
				acc.shade.add(item.recipe_name);
				acc.quantity += parseInt(item.quantity, 10) || 0;
				acc.poly_quantity += parseInt(item.poli_quantity, 10) || 0;
				acc.is_inch = item.is_inch;
				return acc;
			},
			{
				itemDescriptions: new Set(),
				specifications: new Set(),
				styles: new Set(),
				colors: new Set(),
				sizes: new Set(),
				shade: new Set(),
				quantity: 0,
				poly_quantity: 0,
				is_inch: 0,
			}
		) || {};

	packing_list_numbers.forEach((pl) => {
		const packingListDetails = [];
		const packingListRowSpan = [];
		challan_entry.forEach((item) => {
			if (pl.packing_list_uuid === item.packing_list_uuid) {
				packingListDetails.push({
					item_description: item.item_description,
					specification: item.specification,
					style: item.style,
					color: item.color,
					size: item.size,
					quantity: challan_entry
						.filter(
							(i) =>
								(item.packing_list_uuid ===
									i.packing_list_uuid &&
									i.item_description) ===
									item.item_description &&
								i.style === item.style &&
								i.color === item.color &&
								i.size === item.size
						)
						.reduce((acc, item) => acc + item.quantity, 0),
					poli_quantity: challan_entry
						.filter(
							(i) =>
								(item.packing_list_uuid ===
									i.packing_list_uuid &&
									i.item_description) ===
									item.item_description &&
								i.style === item.style &&
								i.color === item.color &&
								i.size === item.size
						)
						.reduce((acc, item) => acc + item.poli_quantity, 0),
					is_inch: item.is_inch,
				});
				packingListRowSpan.push({
					item_description: challan_entry.filter(
						(i) =>
							item.packing_list_uuid === i.packing_list_uuid &&
							i.item_description === item.item_description
					).length,
					specification: challan_entry.filter(
						(i) =>
							item.packing_list_uuid === i.packing_list_uuid &&
							i.item_description === item.item_description
					).length,
					style: challan_entry.filter(
						(i) =>
							(item.packing_list_uuid === i.packing_list_uuid &&
								i.item_description) === item.item_description &&
							i.style === item.style
					).length,
					color: challan_entry.filter(
						(i) =>
							(item.packing_list_uuid === i.packing_list_uuid &&
								i.item_description) === item.item_description &&
							i.style === item.style &&
							i.color === item.color
					).length,
					size: challan_entry.filter(
						(i) =>
							(item.packing_list_uuid === i.packing_list_uuid &&
								i.item_description) === item.item_description &&
							i.style === item.style &&
							i.color === item.color &&
							i.size === item.size
					).length,
					quantity: 1,
					poli_quantity: 1,
					is_inch: 1,
				});
			}
		});
		packingListTable.push({
			packing_number: pl.packing_number,
			carton_weight: pl.carton_weight,
			packingListDetails,
			packingListRowSpan,
		});
	});

	const grandTotalQuantity = uniqueCounts(challan_entry).quantity;

	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_LETTER_PAGE({
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
		content: packingListTable.map((pl, index) => [
			index > 0 && index % 4 === 0
				? { text: '', pageBreak: 'before' }
				: null,
			{
				text: `PL NO: ${pl.packing_number} ${
					isSampleZipper
						? ''
						: `(${pl.carton_weight ? pl.carton_weight : 0} Kg)`
				}`,
				fontSize: DEFAULT_FONT_SIZE + 2,
				bold: true,
				alignment: 'left',
			},
			{
				table: {
					headerRows: 1,
					widths: isSliderChallan
						? [70, 110, 90, 80, 80]
						: [70, 110, 90, 70, 60, 50, 30],
					body: [
						// * Header
						TableHeader(node),

						// * Body
						...pl.packingListDetails?.map((item, idx) =>
							node.map((nodeItem) => {
								console.log('item', item);
								const text =
									nodeItem.field === 'size'
										? `${item[nodeItem.field]} ${
												isTapeChallan
													? 'mtr'
													: item.is_inch === 1
														? 'inch'
														: 'cm' || ''
											}`
										: item[nodeItem.field];
								return {
									text,
									style: nodeItem.cellStyle,
									alignment: nodeItem.alignment,
									rowSpan:
										pl.packingListRowSpan[idx][
											nodeItem.field
										],
								};
							})
						),

						isSliderChallan
							? [
									{
										text: `Total ${
											uniqueCounts(
												challan_entry?.filter(
													(item) =>
														item.packing_number ===
														pl.packing_number
												)
											).itemDescriptions?.size
										} Desc`,
										bold: true,
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
									{
										text: `Total ${
											uniqueCounts(
												challan_entry?.filter(
													(item) =>
														item.packing_number ===
														pl.packing_number
												)
											).itemDescriptions?.size
										} Desc`,
										bold: true,
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
									{
										text: `${
											uniqueCounts(
												challan_entry?.filter(
													(item) =>
														item.packing_number ===
														pl.packing_number
												)
											)?.styles.size
										} Style`,
										bold: true,
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
									{
										text: uniqueCounts(
											challan_entry?.filter(
												(item) =>
													item.packing_number ===
													pl.packing_number
											)
										)?.quantity,
										bold: true,
										alignment: 'right',
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
									{
										text: uniqueCounts(
											challan_entry?.filter(
												(item) =>
													item.packing_number ===
													pl.packing_number
											)
										).poly_quantity,
										bold: true,
										alignment: 'right',
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
								]
							: [
									{
										text: `Total ${
											uniqueCounts(
												challan_entry?.filter(
													(item) =>
														item.packing_number ===
														pl.packing_number
												)
											).itemDescriptions?.size
										} Desc`,
										bold: true,
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
									{
										text: `Total ${
											uniqueCounts(
												challan_entry?.filter(
													(item) =>
														item.packing_number ===
														pl.packing_number
												)
											).itemDescriptions?.size
										} Specification`,
										bold: true,
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
									{
										text: `${uniqueCounts(challan_entry?.filter((item) => item.packing_number === pl.packing_number)).styles?.size} Style`,
										bold: true,
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
									{
										text: `${uniqueCounts(challan_entry?.filter((item) => item.packing_number === pl.packing_number)).colors?.size} Color`,
										bold: true,
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
									{
										text: `${uniqueCounts(challan_entry?.filter((item) => item.packing_number === pl.packing_number)).sizes?.size} Size`,
										bold: true,
										alignment: 'right',
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
									{
										text: uniqueCounts(
											challan_entry?.filter(
												(item) =>
													item.packing_number ===
													pl.packing_number
											)
										).quantity,
										bold: true,
										alignment: 'right',
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
									{
										text: uniqueCounts(
											challan_entry?.filter(
												(item) =>
													item.packing_number ===
													pl.packing_number
											)
										).poly_quantity,
										bold: true,
										alignment: 'right',
										fontSize: DEFAULT_FONT_SIZE + 2,
									},
								],
					],
				},
			},
			{ text: '\n' },
			index === packing_list_numbers.length - 1
				? {
						text: `Grand Total: ${grandTotalQuantity} ${
							isTapeChallan ? 'mtr' : 'pcs'
						}`,
						bold: true,
						fontSize: DEFAULT_FONT_SIZE + 2,
					}
				: null,
			index === packing_list_numbers.length - 1
				? {
						text: `Grand Total (In Words): ${NumToWord(grandTotalQuantity)} ${
							isTapeChallan ? 'Meter' : 'Pcs'
						} Only`,
						bold: true,
						fontSize: DEFAULT_FONT_SIZE + 2,
					}
				: null,
		]),
	});

	return pdfDocGenerator;
}
