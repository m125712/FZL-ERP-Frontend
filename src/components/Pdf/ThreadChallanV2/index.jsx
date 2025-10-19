import { DEFAULT_FONT_SIZE, xMargin } from '@/components/Pdf/ui';
import {
	DEFAULT_LETTER_PAGE,
	getTable,
	TableHeader,
} from '@/components/Pdf/utils';

import { NumToWord } from '@/lib/NumToWord';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

export default function Index(data) {
	const createNode = (fields) => fields.map((field) => getTable(...field));

	const threadNode = createNode([
		['item_description', 'Count'],
		['style', 'Style'],
		['color', 'Color'],
		['recipe_name', 'Shade'],
		['size', 'Length', 'right'],
		['qty', 'Qty(cone)', 'right'],
		['carton_quantity', 'Carton Qty', 'right'],
	]);

	const node = threadNode;

	const headerHeight = 220;
	const footerHeight = 50;
	const { challan_entry } = data;

	// Group items by their properties first (item_description, style, color, size, recipe_name)
	const itemGroups = {};

	challan_entry.forEach((item) => {
		const { item_description, style, color, size, recipe_name, quantity } =
			item;
		const groupKey = `${item_description}-${style}-${color}-${size}-${recipe_name}`;

		if (!itemGroups[groupKey]) {
			itemGroups[groupKey] = {
				...item,
				qty: 0,
			};
		}

		itemGroups[groupKey].qty += parseInt(quantity || 0, 10);
	});

	// Calculate carton quantities for each grouped item
	const challanGroup = Object.values(itemGroups).map((item) => ({
		...item,
		carton_quantity: Math.ceil(item.qty / item.cone_per_carton),
	}));

	// Group items by packing list
	const groupedByPackingList = {};

	challanGroup.forEach((item) => {
		const packingNumber = item.packing_number || 'default';

		if (!groupedByPackingList[packingNumber]) {
			groupedByPackingList[packingNumber] = {
				packing_number: packingNumber,
				item_descriptions: new Set(),
				styles: new Set(),
				colors: new Set(),
				recipe_names: new Set(),
				sizes: new Set(),
				items: [], // Store individual items instead of accumulating
				cone_per_carton: item.cone_per_carton, // Use first item's cone_per_carton for the group
			};
		}

		const group = groupedByPackingList[packingNumber];
		group.item_descriptions.add(item.item_description);
		group.styles.add(item.style);
		group.colors.add(item.color);
		group.recipe_names.add(item.recipe_name);
		group.sizes.add(item.size);
		group.items.push(item); // Store the item instead of accumulating
	}); // Convert grouped items to final format
	const finalChallanGroup = Object.values(groupedByPackingList).map(
		(group) => {
			// Sum quantities from all items in this packing list group
			const totalQty = group.items.reduce(
				(sum, item) => sum + parseInt(item.qty || 0, 10),
				0
			);
			// Calculate carton quantity based on the total quantity for this packing list
			const totalCartonQty = Math.ceil(
				totalQty / (group.cone_per_carton || 1)
			);

			return {
				packing_number: group.packing_number,
				item_description: Array.from(group.item_descriptions).join(
					', '
				),
				style: Array.from(group.styles).join(', '),
				color: Array.from(group.colors).join(', '),
				recipe_name: Array.from(group.recipe_names).join(', '),
				size: Array.from(group.sizes).join(', '),
				qty: totalQty,
				carton_quantity: totalCartonQty,
				cone_per_carton: group.cone_per_carton,
			};
		}
	);

	const uniqueCounts = (challanEntry) =>
		challanEntry?.reduce(
			(acc, item) => {
				acc.itemDescriptions.add(item.item_description);
				acc.styles.add(item.style);
				acc.colors.add(item.color);
				acc.sizes.add(item.size);
				acc.shade.add(item.recipe_name);
				return acc;
			},
			{
				itemDescriptions: new Set(),
				styles: new Set(),
				colors: new Set(),
				shade: new Set(),
				sizes: new Set(),
			}
		) || {};

	// Calculate grand totals directly from finalChallanGroup without double-counting
	const grandTotalQuantity = finalChallanGroup.reduce(
		(sum, item) => sum + parseInt(item.qty || 0, 10),
		0
	);
	const grandTotalCartonQuantity = finalChallanGroup.reduce(
		(sum, item) => sum + parseInt(item.carton_quantity || 0, 10),
		0
	);

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
		content: [
			{
				table: {
					headerRows: 1,
					widths: [70, 130, 60, 60, 60, 50, 50],
					body: [
						[
							{
								text: 'P/L No',
								bold: true,
							},
							{
								text: data.packing_numbers.join(', '),
								bold: true,

								colSpan: 6,
							},
							{},
							{},
							{},
							{},
							{},
						],
						// * Header
						TableHeader(node),

						// * Body
						...finalChallanGroup.map((item) =>
							node.map((nodeItem) => {
								const text =
									nodeItem.field === 'size'
										? `${item[nodeItem.field]} mtr`
										: item[nodeItem.field];
								return {
									text,
									style: nodeItem.cellStyle,
									alignment: nodeItem.alignment,
									colSpan: nodeItem.colSpan,
								};
							})
						),
						[
							{
								text: `Total ${
									uniqueCounts(finalChallanGroup)
										.itemDescriptions?.size
								} Count`,
								bold: true,
								fontSize: DEFAULT_FONT_SIZE + 2,
							},

							{
								text: `${uniqueCounts(finalChallanGroup).styles?.size} Style`,
								bold: true,
								fontSize: DEFAULT_FONT_SIZE + 2,
							},
							{
								text: `${uniqueCounts(finalChallanGroup).colors?.size} Color`,
								bold: true,
								fontSize: DEFAULT_FONT_SIZE + 2,
							},
							{
								text: `${uniqueCounts(finalChallanGroup).shade?.size} Shade`,
								bold: true,
								fontSize: DEFAULT_FONT_SIZE + 2,
							},
							{
								text: `${uniqueCounts(finalChallanGroup).sizes?.size} Length `,
								bold: true,
								alignment: 'right',
								fontSize: DEFAULT_FONT_SIZE + 2,
							},
							{
								text: `${grandTotalQuantity} Cones`,
								bold: true,
								alignment: 'right',
								fontSize: DEFAULT_FONT_SIZE + 2,
							},
							{
								text: `${grandTotalCartonQuantity} Pcs`,
								bold: true,
								alignment: 'right',
								fontSize: DEFAULT_FONT_SIZE + 2,
							},
						],
					],
				},
			},
			{ text: '\n\n' },
			{
				text: `Grand Total Quantity (In Words): ${NumToWord(grandTotalQuantity)} Cone Only`,
				bold: true,
				fontSize: DEFAULT_FONT_SIZE + 2,
			},
		],
	});

	return pdfDocGenerator;
}
