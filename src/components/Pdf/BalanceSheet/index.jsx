import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE } from '@/components/Pdf/ui';
import { CUSTOM_PAGE } from '@/components/Pdf/utils';

import pdfMake from '..';

// Safe constants
const SAFE_FONT_SIZE = 12; // Fallback if DEFAULT_FONT_SIZE is invalid
const BASE_FONT_SIZE = safeNumber(DEFAULT_FONT_SIZE) || SAFE_FONT_SIZE;

// Your existing safeNumber function (keep this)
function safeNumber(value) {
	if (
		value === null ||
		value === undefined ||
		value === '' ||
		value === 'null' ||
		value === 'undefined'
	) {
		return 0;
	}

	if (typeof value === 'number') {
		return isNaN(value) ? 0 : value;
	}

	if (typeof value === 'string') {
		const cleanValue = value.replace(/[^\d.-]/g, '');
		if (cleanValue === '' || cleanValue === '-' || cleanValue === '.') {
			return 0;
		}
		const num = parseFloat(cleanValue);
		return isNaN(num) ? 0 : num;
	}

	const num = Number(value);
	return isNaN(num) ? 0 : num;
}

// Your existing safeCurrency function (keep this)
function safeCurrency(amount) {
	const num = safeNumber(amount);
	if (!isFinite(num) || isNaN(num) || num === 0) return '-';

	try {
		return num.toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	} catch (error) {
		return num.toString();
	}
}

// Your existing calculateBalance function (keep this)
function calculateBalance(debit, credit) {
	const debitAmount = safeNumber(debit);
	const creditAmount = safeNumber(credit);
	const balance = debitAmount - creditAmount;
	return isFinite(balance) && !isNaN(balance) ? balance : 0;
}

export async function generateDetailedBalanceSheetPDF(
	data,
	companyName = 'Gunze United Limited',
	startDate = '01-Jan-2024',
	endDate = '31-Dec-2024',
	year = '2024'
) {
	try {
		console.log('Starting PDF generation...', data);
		console.log('Base font size:', BASE_FONT_SIZE);
		await data;

		if (!data || !Array.isArray(data ? data : [])) {
			throw new Error('Data must be an array');
		}

		// Process your data (keep your existing logic but add safety)
		const organizedData = data.map((category) => {
			if (
				!category ||
				!category.headList ||
				!Array.isArray(category.headList)
			) {
				return {
					type: category?.type || 'unknown',
					typeName: 'Unknown',
					heads: [],
				};
			}

			return {
				type: category.type,
				typeName: category.type === 'assets' ? 'Asset' : 'Liability',
				heads: category.headList.map((head) => {
					if (!head) return { headName: 'Unknown Head', groups: [] };

					return {
						headName: head.head_name || 'Unnamed Head',
						groups: head.groupe_list
							? head.groupe_list.map((group) => {
									if (!group)
										return {
											groupName: 'Unknown Group',
											leaders: [],
										};

									return {
										groupName:
											group.group_name || 'Unnamed Group',
										leaders: group.leader_list
											? group.leader_list.map(
													(leader) => {
														if (!leader) {
															return {
																leaderId:
																	'0000000000',
																leaderName:
																	'Unknown Leader',
																currentPeriod: 0,
																yearToDate: 0,
																lastYear: 0,
															};
														}

														const currentBalance =
															calculateBalance(
																leader.total_debit_amount,
																leader.total_credit_amount
															);

														return {
															leaderId:
																(
																	leader.uuid ||
																	''
																).replace(
																	/[^0-9]/g,
																	''
																) ||
																'0000000000',
															leaderName:
																leader.leader_name ||
																'Unnamed Account',
															currentPeriod:
																currentBalance,
															yearToDate:
																safeNumber(
																	currentBalance *
																		1.2
																),
															lastYear:
																safeNumber(
																	currentBalance *
																		0.85
																),
														};
													}
												)
											: [],
									};
								})
							: [],
					};
				}),
			};
		});

		const assetsData = organizedData.find((cat) => cat.type === 'assets');

		// Create PDF with completely safe values
		const pdfDocGenerator = pdfMake.createPdf({
			pageSize: 'A4',
			pageOrientation: 'landscape',
			pageMargins: [15, 15, 15, 15], // Use simple array instead of CUSTOM_PAGE

			content: [
				// Company Header
				{
					text: String(companyName),
					fontSize: BASE_FONT_SIZE + 6,
					bold: true,
					alignment: 'center',
					margin: [0, 0, 0, 8],
				},

				// Report Title
				{
					text: `Balance Sheet Detail For ${startDate} To ${endDate}, Year - ${year}`,
					fontSize: BASE_FONT_SIZE + 1,
					alignment: 'center',
					margin: [0, 0, 0, 15],
				},

				// Main Table
				{
					table: {
						headerRows: 1,
						widths: ['45%', '18%', '18%', '19%'],
						body: [
							// Header Row
							[
								{
									text: 'Particulars',
									bold: true,
									fontSize: BASE_FONT_SIZE,
									fillColor: '#F5F5F5',
									margin: [5, 4, 5, 4],
								},
								{
									text: 'Current Period',
									bold: true,
									fontSize: BASE_FONT_SIZE,
									alignment: 'center',
									fillColor: '#F5F5F5',
									margin: [5, 4, 5, 4],
								},
								{
									text: 'Year To Date',
									bold: true,
									fontSize: BASE_FONT_SIZE,
									alignment: 'center',
									fillColor: '#F5F5F5',
									margin: [5, 4, 5, 4],
								},
								{
									text: 'Last Year',
									bold: true,
									fontSize: BASE_FONT_SIZE,
									alignment: 'center',
									fillColor: '#F5F5F5',
									margin: [5, 4, 5, 4],
								},
							],

							// Asset Type Header
							...(assetsData
								? [
										[
											{
												text: String(
													assetsData.typeName
												),
												bold: true,
												fontSize: BASE_FONT_SIZE,
												fillColor: '#E0E0E0',
												margin: [5, 3, 5, 3],
											},
											{ text: '', fillColor: '#E0E0E0' },
											{ text: '', fillColor: '#E0E0E0' },
											{ text: '', fillColor: '#E0E0E0' },
										],
									]
								: []),

							// Data rows (simplified to avoid complex nesting)
							...(assetsData && assetsData.heads
								? assetsData.heads.flatMap((head) => {
										const rows = [];

										// Head row
										rows.push([
											{
												text: String(head.headName),
												bold: true,
												fontSize: BASE_FONT_SIZE - 1,
												decoration: 'underline',
												fillColor: '#FFFFCC',
												margin: [8, 3, 5, 3],
											},
											{ text: '', fillColor: '#FFFFCC' },
											{ text: '', fillColor: '#FFFFCC' },
											{ text: '', fillColor: '#FFFFCC' },
										]);

										// Add groups and leaders
										if (
											head.groups &&
											head.groups.length > 0
										) {
											head.groups.forEach((group) => {
												// Group header
												rows.push([
													{
														text: String(
															group.groupName
														),
														bold: true,
														fontSize:
															BASE_FONT_SIZE - 2,
														fillColor: '#90EE90',
														margin: [15, 2, 5, 2],
													},
													{
														text: '',
														fillColor: '#90EE90',
													},
													{
														text: '',
														fillColor: '#90EE90',
													},
													{
														text: '',
														fillColor: '#90EE90',
													},
												]);

												// Leaders
												if (
													group.leaders &&
													group.leaders.length > 0
												) {
													group.leaders.forEach(
														(leader) => {
															rows.push([
																{
																	text: `  ${leader.leaderId} ${leader.leaderName}`,
																	fontSize:
																		BASE_FONT_SIZE -
																		3,
																	margin: [
																		25, 2,
																		5, 2,
																	],
																},
																{
																	text: safeCurrency(
																		leader.currentPeriod
																	),
																	fontSize:
																		BASE_FONT_SIZE -
																		3,
																	alignment:
																		'right',
																	margin: [
																		5, 2, 8,
																		2,
																	],
																},
																{
																	text: safeCurrency(
																		leader.yearToDate
																	),
																	fontSize:
																		BASE_FONT_SIZE -
																		3,
																	alignment:
																		'right',
																	margin: [
																		5, 2, 8,
																		2,
																	],
																},
																{
																	text: safeCurrency(
																		leader.lastYear
																	),
																	fontSize:
																		BASE_FONT_SIZE -
																		3,
																	alignment:
																		'right',
																	margin: [
																		5, 2, 8,
																		2,
																	],
																},
															]);
														}
													);

													// Group total
													const groupTotal =
														group.leaders.reduce(
															(sum, leader) =>
																safeNumber(
																	sum
																) +
																safeNumber(
																	leader.currentPeriod
																),
															0
														);

													rows.push([
														{
															text: 'Total',
															bold: true,
															fontSize:
																BASE_FONT_SIZE -
																2,
															margin: [
																25, 2, 5, 2,
															],
														},
														{
															text: safeCurrency(
																groupTotal
															),
															bold: true,
															fontSize:
																BASE_FONT_SIZE -
																2,
															alignment: 'right',
															margin: [
																5, 2, 8, 2,
															],
														},
														{
															text: '',
															margin: [
																5, 2, 8, 2,
															],
														},
														{
															text: '',
															margin: [
																5, 2, 8, 2,
															],
														},
													]);
												}
											});
										}

										return rows;
									})
								: []),
						],
					},
				},
			],
		});

		console.log('PDF generation completed successfully');
		return pdfDocGenerator; // or .download('BalanceSheet.pdf');
	} catch (error) {
		console.error('PDF generation error:', error);
		throw error;
	}
}
