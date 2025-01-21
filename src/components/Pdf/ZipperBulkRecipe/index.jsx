import { Table } from 'lucide-react';
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
	getTable('item_description', 'Item'),
	getTable('style', 'Style'),
	getTable('size', 'Size'),
	getTable('quantity', 'Quantity', 'right'),
	getTable('remarks', 'Remarks'),
];
const node2 = [
	getTable('material_name', 'Dyes Name'),
	getTable('quantity', 'Lab'),
	getTable('bulk', 'Bulk'),
	getTable('first', '1st'),
	getTable('second', '2nd'),
	getTable('third', '3rd'),
	getTable('lot', 'Lot'),
];

const separatePaleOrMedium = (programs) => {
	const chemicals = [];
	const neutralizer = [];

	programs.forEach((program) => {
		if (
			program.dyes_category_name === 'Pale' ||
			program.dyes_category_name === 'Medium'
		) {
			if (program.material_name === 'Neutralizer') {
				program.material_name = 'Acitic Acid';
				neutralizer.push(program);
			} else if (
				[
					'Leveling Agent',
					'Buffering Agent',
					'Sequestering Agent',
				].includes(program.material_name)
			) {
				chemicals.push(program);
			}
		}
	});

	return { chemicals, neutralizer };
};

const separateDark = (programs) => {
	const chemicalDark = [];
	const chemicalHydrosa = [];
	const neutralizer = [];

	programs.forEach((program) => {
		if (program.dyes_category_name === 'Dark') {
			if (
				['Leveling Agent', 'Buffering Agent'].includes(
					program.material_name
				)
			) {
				chemicalDark.push(program);
			} else if (program.material_name === 'Caustic') {
				chemicalHydrosa.push(program);
			} else if (program.material_name === 'Neutralizer') {
				program.material_name = 'Acitic Acid';
				neutralizer.push(program);
			}
		}
	});

	return { chemicalDark, chemicalHydrosa, neutralizer };
};
export default function Index(batch, shade_recipes_entries, programs) {
	const headerHeight = 200;
	let footerHeight = 50;
	const { dyeing_batch_entry } = batch;
	shade_recipes_entries?.forEach((item) => {
		item.bulk = Number(item.bulk).toFixed(3);
	});
	programs?.forEach((item) => {
		item.bulk = Number(item.bulk).toFixed(3);
	});

	const processDyePrograms = (programs) => {
		if (!programs?.length) return [];

		return programs[0]?.dyes_category_name === 'Dark'
			? separateDark(programs)
			: separatePaleOrMedium(programs);
	};

	programs = processDyePrograms(programs);

	const yellow = shade_recipes_entries?.filter((e) =>
		e?.material_name.toLowerCase().includes('yellow')
	);
	const red = shade_recipes_entries?.filter((e) =>
		e?.material_name.toLowerCase().includes('red')
	);
	const other = shade_recipes_entries?.filter(
		(e) =>
			!e?.material_name.toLowerCase().includes('red') &&
			!e?.material_name.toLowerCase().includes('yellow')
	);
	const shade = yellow?.concat(red)?.concat(other);

	const grouped =
		dyeing_batch_entry?.reduce(
			(acc, item) => {
				acc.recipe_name?.add(item.recipe_name);
				acc.unit?.add(item.unit);
				acc.bleaching?.add(item.bleaching);
				return acc;
			},
			{
				unit: new Set(),
				bleaching: new Set(),
				recipe_name: new Set(),
			}
		) || {};
	const { unit, bleaching, recipe_name } = grouped;
	const new_batch_entry = [];
	unit?.forEach((item) => {
		bleaching?.forEach((bleach) => {
			recipe_name?.forEach((recipe) => {
				new_batch_entry.push({
					unit: item,
					bleaching: bleach,
					recipe_name: recipe,
					max_size: 0,
					min_size: Infinity,
					size: '',
					unit: item,
					item_description: new Set(),
					quantity: 0,
					style: new Set(),
					color: new Set(),
				});
			});
		});
	});
	new_batch_entry.forEach((item) => {
		batch.dyeing_batch_entry.forEach((entry) => {
			if (
				entry.unit === item.unit &&
				entry.bleaching === item.bleaching &&
				entry.recipe_name === item.recipe_name
			) {
				item.item_description.add(entry.item_description);

				item.quantity += entry.quantity;
				item.style.add(entry.style);
				item.color.add(entry.color);
				item.unit = entry.unit;
				item.max_size = Math.max(item.max_size, Number(entry.size));
				item.min_size = Math.min(item.min_size, Number(entry.size));
				item.size =
					`${item.min_size === item.max_size ? item.min_size : `(${item.min_size} - ${item.max_size})`}` +
					' ' +
					entry.unit;
			}
		});
	});

	new_batch_entry.forEach((item) => {
		item.item_description = Array.from(item.item_description).join(', ');
		item.style = Array.from(item.style).join(', ');
		item.color = Array.from(item.color).join(', ');
	});

	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_A4_PAGE({
			xMargin,
			headerHeight,
			footerHeight,
		}),

		// * Page Header
		header: {
			table: getPageHeader(batch),
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
				text: 'Details',
				Style: 'tableTitle',
				alignment: 'left',
				bold: true,
				fontSize: DEFAULT_FONT_SIZE + 4,
			},
			{
				table: {
					headerRows: 1,
					widths: ['*', '*', 60, 60, '*'],
					body: [
						// * Header
						TableHeader(node),

						// * Body
						...new_batch_entry?.map((item) =>
							node.map((nodeItem) => ({
								text: item[nodeItem.field],
								style: nodeItem.cellStyle,
								alignment: nodeItem.alignment,
							}))
						),
					],
				},
				// layout: 'lightHorizontalLines',
				//layout: tableLayoutStyle,
			},
			{
				text: '\n',
			},
			{
				text: 'Dyes',
				Style: 'tableTitle',
				alignment: 'left',
				bold: true,
				fontSize: DEFAULT_FONT_SIZE + 4,
			},
			{
				table: {
					headerRows: 1,
					widths: ['*', '*', '*', 30, 30, 30, '*'],
					body: [
						TableHeader(node2),
						...(Array.isArray(shade)
							? shade.map((item) =>
									node2.map((nodeItem) => ({
										text: item[nodeItem.field] || '',
										style: nodeItem.cellStyle,
										alignment: nodeItem.alignment,
									}))
								)
							: []),
					],
				},
				// layout: 'lightHorizontalLines',
				//layout: tableLayoutStyle,
			},
			{
				text: '\n',
			},
			{
				...(programs?.chemicalDark?.length > 0 && {
					text: 'Chemicals Dark',
					style: 'tableTitle',
					alignment: 'left',
					bold: true,
					fontSize: DEFAULT_FONT_SIZE + 4,
				}),
			},
			{
				...(programs?.chemicalDark?.length > 0 && {
					table: {
						headerRows: 1,
						widths: ['*', '*', '*', 30, 30, 30, '*'],
						body: [
							TableHeader(node2),
							...(Array.isArray(programs?.chemicalDark)
								? programs.chemicalDark.map((item) =>
										node2.map((nodeItem) => ({
											text: item[nodeItem.field] || '',
											style: nodeItem.cellStyle,
											alignment: nodeItem.alignment,
										}))
									)
								: []),
						],
					},
					// layout: 'lightHorizontalLines',
					// layout: tableLayoutStyle,
				}),
			},
			{
				text: '\n',
			},
			{
				text: 'Chemicals',
				Style: 'tableTitle',
				alignment: 'left',
				bold: true,
				fontSize: DEFAULT_FONT_SIZE + 4,
			},
			{
				table: {
					headerRows: 1,
					widths: ['*', '*', '*', 30, 30, 30, '*'],
					body: [
						TableHeader(node2),
						...(Array.isArray(programs?.chemicals)
							? programs.chemicals.map((item) =>
									node2.map((nodeItem) => ({
										text: item[nodeItem.field] || '',
										style: nodeItem.cellStyle,
										alignment: nodeItem.alignment,
									}))
								)
							: []),
					],
				},
				// layout: 'lightHorizontalLines',
				//layout: tableLayoutStyle,
			},
			{
				text: '\n',
			},
			{
				text: 'Neutralizer',
				Style: 'tableTitle',
				alignment: 'left',
				bold: true,
				fontSize: DEFAULT_FONT_SIZE + 4,
			},
			{
				table: {
					headerRows: 1,
					widths: ['*', '*', '*', 30, 30, 30, '*'],
					body: [
						TableHeader(node2),
						...(Array.isArray(programs?.neutralizer)
							? programs.neutralizer.map((item) =>
									node2.map((nodeItem) => ({
										text: item[nodeItem.field] || '',
										style: nodeItem.cellStyle,
										alignment: nodeItem.alignment,
									}))
								)
							: []),
					],
				},
				// layout: 'lightHorizontalLines',
				//layout: tableLayoutStyle,
			},
		],
	});

	return pdfDocGenerator;
}
