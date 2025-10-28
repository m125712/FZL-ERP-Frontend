import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE } from '@/components/Pdf/ui';

import pdfMake from '..';

const PDF_CONFIG = {
	SAFE_FONT_SIZE: 12,
	PAGE_SIZE: 'A4',
	ORIENTATION: 'landscape',
	MARGINS: [15, 15, 15, 15],
	COLUMN_WIDTHS: ['45%', '18%', '18%', '19%'],
};

const COLORS = {
	HEADER: '#F8F8F8',
	CATEGORY: '#E8E8E8',
	HEAD: '#D8D8D8',
	HEAD_SUBTOTAL: '#C8C8C8',
	GROUP: '#F0F0F0',
	BORDER: '#A0A0A0',
};

const INDENTATION = {
	HEAD: 10,
	HEAD_SUBTOTAL: 10,
	GROUP: 15,
	LEADER: 25,
	TOTAL: 20,
};

function formatAmount(amount) {
	if (typeof amount !== 'number' || isNaN(amount)) return '0.00';
	return Math.abs(amount).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

function calculateGroupTotals(leaders) {
	return leaders.reduce(
		(totals, leader) => ({
			currentPeriod:
				totals.currentPeriod + Math.abs(leader.currentPeriod || 0),
			yearToDate: totals.yearToDate + Math.abs(leader.yearToDate || 0),
			lastYear: totals.lastYear + Math.abs(leader.lastYear || 0),
		}),
		{ currentPeriod: 0, yearToDate: 0, lastYear: 0 }
	);
}

function calculateHeadSubtotals(groups) {
	return groups.reduce(
		(totals, group) => {
			const groupTotals = calculateGroupTotals(group.leaders);
			return {
				currentPeriod: totals.currentPeriod + groupTotals.currentPeriod,
				yearToDate: totals.yearToDate + groupTotals.yearToDate,
				lastYear: totals.lastYear + groupTotals.lastYear,
			};
		},
		{ currentPeriod: 0, yearToDate: 0, lastYear: 0 }
	);
}

function calculateCategoryTotals(category) {
	return category.heads.reduce(
		(totals, head) => {
			const headSubtotals = calculateHeadSubtotals(head.groups);
			return {
				currentPeriod:
					totals.currentPeriod + headSubtotals.currentPeriod,
				yearToDate: totals.yearToDate + headSubtotals.yearToDate,
				lastYear: totals.lastYear + headSubtotals.lastYear,
			};
		},
		{ currentPeriod: 0, yearToDate: 0, lastYear: 0 }
	);
}

function createTableCell(text, options = {}) {
	return {
		text: String(text),
		bold: !!options.bold,
		fontSize: options.fontSize,
		fillColor: options.fillColor,
		margin: options.margin || [5, 2, 5, 2],
		alignment: options.alignment || 'left',
	};
}

function createEmptyCell(fillColor) {
	return { text: '', fillColor };
}

function getCategoryDisplayName(type) {
	return type.charAt(0).toUpperCase() + type.slice(1);
}

function transformLeader(leader) {
	return {
		leaderName: leader?.leader_name || 'Unnamed Account',
		currentPeriod: leader?.total_net_current_amount || 0,
		yearToDate: leader?.total_net_ytd_amount || 0,
		lastYear: leader?.total_net_last_year_amount || 0,
	};
}

function transformGroup(group) {
	return {
		groupName: group?.group_name || 'Unnamed Group',
		leaders: (group?.leader_list || []).map(transformLeader),
	};
}

function transformHead(head) {
	return {
		headName: head?.head_name || 'Unnamed Head',
		groups: (head?.groupe_list || []).map(transformGroup),
	};
}

function transformCategory(category) {
	return {
		typeName: getCategoryDisplayName(category.type),
		heads: (category?.headList || []).map(transformHead),
	};
}

function createHeaderRow(baseFontSize) {
	return [
		createTableCell('Particulars', {
			bold: true,
			fontSize: baseFontSize,
			fillColor: COLORS.HEADER,
			margin: [5, 4, 5, 4],
		}),
		createTableCell('Current Period', {
			bold: true,
			fontSize: baseFontSize,
			fillColor: COLORS.HEADER,
			alignment: 'center',
			margin: [5, 4, 5, 4],
		}),
		createTableCell('Year To Date', {
			bold: true,
			fontSize: baseFontSize,
			fillColor: COLORS.HEADER,
			alignment: 'center',
			margin: [5, 4, 5, 4],
		}),
		createTableCell('Last Year', {
			bold: true,
			fontSize: baseFontSize,
			fillColor: COLORS.HEADER,
			alignment: 'center',
			margin: [5, 4, 5, 4],
		}),
	];
}

function createCategoryHeaderRow(category, baseFontSize) {
	return [
		createTableCell(category.typeName, {
			bold: true,
			fontSize: baseFontSize + 1,
			fillColor: COLORS.CATEGORY,
			margin: [5, 5, 5, 5],
		}),
		createEmptyCell(COLORS.CATEGORY),
		createEmptyCell(COLORS.CATEGORY),
		createEmptyCell(COLORS.CATEGORY),
	];
}

function createHeadHeaderRow(head, baseFontSize) {
	return [
		createTableCell(head.headName, {
			bold: true,
			fontSize: baseFontSize,
			fillColor: COLORS.HEAD,
			margin: [INDENTATION.HEAD, 3, 5, 3],
		}),
		createEmptyCell(COLORS.HEAD),
		createEmptyCell(COLORS.HEAD),
		createEmptyCell(COLORS.HEAD),
	];
}

function createHeadSubtotalRow(head, totals, baseFontSize) {
	return [
		createTableCell(`Subtotal`, {
			bold: true,
			fontSize: baseFontSize - 1,
			fillColor: COLORS.HEAD_SUBTOTAL,
			margin: [INDENTATION.HEAD_SUBTOTAL, 3, 5, 3],
		}),
		createTableCell(formatAmount(totals.currentPeriod), {
			bold: true,
			fontSize: baseFontSize - 1,
			alignment: 'right',
			fillColor: COLORS.HEAD_SUBTOTAL,
			margin: [5, 3, 8, 3],
		}),
		createTableCell(formatAmount(totals.yearToDate), {
			bold: true,
			fontSize: baseFontSize - 1,
			alignment: 'right',
			fillColor: COLORS.HEAD_SUBTOTAL,
			margin: [5, 3, 8, 3],
		}),
		createTableCell(formatAmount(totals.lastYear), {
			bold: true,
			fontSize: baseFontSize - 1,
			alignment: 'right',
			fillColor: COLORS.HEAD_SUBTOTAL,
			margin: [5, 3, 8, 3],
		}),
	];
}

function createGroupHeaderRow(group, baseFontSize) {
	return [
		createTableCell(group.groupName, {
			bold: true,
			fontSize: baseFontSize - 1,
			fillColor: COLORS.GROUP,
			margin: [INDENTATION.GROUP, 2, 5, 2],
		}),
		createEmptyCell(COLORS.GROUP),
		createEmptyCell(COLORS.GROUP),
		createEmptyCell(COLORS.GROUP),
	];
}

function createLeaderRow(leader, baseFontSize) {
	return [
		createTableCell(leader.leaderName, {
			fontSize: baseFontSize - 2,
			margin: [INDENTATION.LEADER, 2, 5, 2],
		}),
		createTableCell(formatAmount(leader.currentPeriod), {
			fontSize: baseFontSize - 2,
			alignment: 'right',
			margin: [5, 2, 8, 2],
		}),
		createTableCell(formatAmount(leader.yearToDate), {
			fontSize: baseFontSize - 2,
			alignment: 'right',
			margin: [5, 2, 8, 2],
		}),
		createTableCell(formatAmount(leader.lastYear), {
			fontSize: baseFontSize - 2,
			alignment: 'right',
			margin: [5, 2, 8, 2],
		}),
	];
}

function createGroupTotalRow(totals, baseFontSize) {
	return [
		createTableCell('Total', {
			bold: true,
			fontSize: baseFontSize - 2,
			margin: [INDENTATION.TOTAL, 2, 5, 2],
			fillColor: COLORS.HEADER,
		}),
		createTableCell(formatAmount(totals.currentPeriod), {
			bold: true,
			fontSize: baseFontSize - 2,
			alignment: 'right',
			margin: [5, 2, 8, 2],
			fillColor: COLORS.HEADER,
		}),
		createTableCell(formatAmount(totals.yearToDate), {
			bold: true,
			fontSize: baseFontSize - 2,
			alignment: 'right',
			margin: [5, 2, 8, 2],
			fillColor: COLORS.HEADER,
		}),
		createTableCell(formatAmount(totals.lastYear), {
			bold: true,
			fontSize: baseFontSize - 2,
			alignment: 'right',
			margin: [5, 2, 8, 2],
			fillColor: COLORS.HEADER,
		}),
	];
}

function createCategoryTotalRow(category, totals, baseFontSize) {
	return [
		createTableCell(`${category.typeName} Total`, {
			bold: true,
			fontSize: baseFontSize,
			fillColor: COLORS.CATEGORY,
			margin: [5, 4, 5, 4],
		}),
		createTableCell(formatAmount(totals.currentPeriod), {
			bold: true,
			fontSize: baseFontSize,
			alignment: 'right',
			fillColor: COLORS.CATEGORY,
			margin: [5, 4, 8, 4],
		}),
		createTableCell(formatAmount(totals.yearToDate), {
			bold: true,
			fontSize: baseFontSize,
			alignment: 'right',
			fillColor: COLORS.CATEGORY,
			margin: [5, 4, 8, 4],
		}),
		createTableCell(formatAmount(totals.lastYear), {
			bold: true,
			fontSize: baseFontSize,
			alignment: 'right',
			fillColor: COLORS.CATEGORY,
			margin: [5, 4, 8, 4],
		}),
	];
}

function calculateBalanceByType(categoryTotals) {
	// Find income and expense categories
	const incomeCategory = categoryTotals.find(
		(cat) =>
			cat.category.typeName.toLowerCase().includes('income') ||
			cat.category.typeName.toLowerCase().includes('revenue')
	);
	const expenseCategory = categoryTotals.find(
		(cat) =>
			cat.category.typeName.toLowerCase().includes('expense') ||
			cat.category.typeName.toLowerCase().includes('cost')
	);

	const income = incomeCategory
		? incomeCategory.totals
		: { currentPeriod: 0, yearToDate: 0, lastYear: 0 };
	const expense = expenseCategory
		? expenseCategory.totals
		: { currentPeriod: 0, yearToDate: 0, lastYear: 0 };

	return {
		currentPeriod: income.currentPeriod - expense.currentPeriod,
		yearToDate: income.yearToDate - expense.yearToDate,
		lastYear: income.lastYear - expense.lastYear,
	};
}

function createBalanceSummaryRow(balance, baseFontSize) {
	return [
		createTableCell('BALANCE', {
			bold: true,
			fontSize: baseFontSize + 1,
			fillColor: '#D0D0D0',
			margin: [5, 6, 5, 6],
		}),
		createTableCell(formatAmount(balance.currentPeriod), {
			bold: true,
			fontSize: baseFontSize + 1,
			alignment: 'right',
			fillColor: '#D0D0D0',
			margin: [5, 6, 8, 6],
		}),
		createTableCell(formatAmount(balance.yearToDate), {
			bold: true,
			fontSize: baseFontSize + 1,
			alignment: 'right',
			fillColor: '#D0D0D0',
			margin: [5, 6, 8, 6],
		}),
		createTableCell(formatAmount(balance.lastYear), {
			bold: true,
			fontSize: baseFontSize + 1,
			alignment: 'right',
			fillColor: '#D0D0D0',
			margin: [5, 6, 8, 6],
		}),
	];
}

function generateTableBody(categories, baseFontSize) {
	const rows = [];
	rows.push(createHeaderRow(baseFontSize));

	categories.forEach((category) => {
		rows.push(createCategoryHeaderRow(category, baseFontSize));

		category.heads.forEach((head) => {
			rows.push(createHeadHeaderRow(head, baseFontSize));

			head.groups.forEach((group) => {
				rows.push(createGroupHeaderRow(group, baseFontSize));

				group.leaders.forEach((leader) => {
					rows.push(createLeaderRow(leader, baseFontSize));
				});

				if (group.leaders.length) {
					const groupTotals = calculateGroupTotals(group.leaders);
					rows.push(createGroupTotalRow(groupTotals, baseFontSize));
				}
			});

			if (head.groups.length > 0) {
				const headSubtotals = calculateHeadSubtotals(head.groups);
				rows.push(
					createHeadSubtotalRow(head, headSubtotals, baseFontSize)
				);
			}
		});

		// Add category subtotal after each category
		const categoryTotals = calculateCategoryTotals(category);
		rows.push(
			createCategoryTotalRow(category, categoryTotals, baseFontSize)
		);
	});

	return rows;
}

function generateSummaryTable(categories, baseFontSize, type) {
	const rows = [];

	// Add header for summary table
	rows.push([
		createTableCell('SUMMARY BY TYPE', {
			bold: true,
			fontSize: baseFontSize + 2,
			fillColor: COLORS.HEADER,
			margin: [5, 6, 5, 6],
		}),
		createEmptyCell(COLORS.HEADER),
		createEmptyCell(COLORS.HEADER),
		createEmptyCell(COLORS.HEADER),
	]);

	// Add column headers
	rows.push(createHeaderRow(baseFontSize));

	// Calculate totals for each category
	const categoryTotals = [];

	categories.forEach((category) => {
		const totals = calculateCategoryTotals(category);
		categoryTotals.push({ category, totals });
	});

	// Add category total rows
	categoryTotals.forEach(({ category, totals }) => {
		rows.push(createCategoryTotalRow(category, totals, baseFontSize));
	});

	// Add balance summary by type for profit and loss
	if (type === 'profit_and_loss') {
		const balance = calculateBalanceByType(categoryTotals);
		rows.push(createBalanceSummaryRow(balance, baseFontSize));
	}

	return rows;
}

function createPDFLayout() {
	return {
		fillColor: () => null,
		hLineWidth: (i, node) =>
			i === 0 || i === node.table.body.length ? 1 : 0.5,
		vLineWidth: (i, node) =>
			i === 0 || i === node.table.widths.length ? 1 : 0.5,
		hLineColor: () => COLORS.BORDER,
		vLineColor: () => COLORS.BORDER,
	};
}

export async function generateDetailedBalanceSheetPDF(
	data,
	companyName,
	startDate,
	endDate,
	year,
	type
) {
	const processedCategories = data.map(transformCategory);
	const baseFontSize = DEFAULT_FONT_SIZE || PDF_CONFIG.SAFE_FONT_SIZE;

	const documentDefinition = {
		pageSize: PDF_CONFIG.PAGE_SIZE,
		pageOrientation: PDF_CONFIG.ORIENTATION,
		pageMargins: PDF_CONFIG.MARGINS,
		content: [
			{
				text: companyName.trim(),
				fontSize: baseFontSize + 6,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 8],
			},
			{
				text: `${type === 'balance_sheet' ? 'Balance Sheet' : 'Profit and Loss'} Detail For ${format(startDate, 'dd MMM, yyyy')} To ${format(endDate, 'dd MMM, yyyy')}, Year - ${year}`,
				fontSize: baseFontSize + 1,
				alignment: 'center',
				margin: [0, 0, 0, 15],
			},
			{
				table: {
					headerRows: 1,
					widths: PDF_CONFIG.COLUMN_WIDTHS,
					body: generateTableBody(processedCategories, baseFontSize),
				},
				layout: createPDFLayout(),
			},
			{
				text: '',
				margin: [0, 20, 0, 0],
			},
			{
				table: {
					headerRows: 1,
					widths: PDF_CONFIG.COLUMN_WIDTHS,
					body: generateSummaryTable(
						processedCategories,
						baseFontSize,
						type
					),
				},
				layout: createPDFLayout(),
			},
		],
	};

	return pdfMake.createPdf(documentDefinition);
}
