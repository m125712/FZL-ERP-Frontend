// pageNumberGenerator.js - Main page numbering logic and utilities
import { getPageNumberStyle } from './pageNumberStyles.js';
import {
	formatPageNumber,
	validateAndSanitizeOptions,
} from './pageNumberUtils.js';

export class PageNumberGenerator {
	constructor(options = {}) {
		this.options = validateAndSanitizeOptions(options).pageNumbering;
	}

	createPageNumberElement(currentPage, pageCount, isHeader = false) {
		try {
			if (!this.options.showOnFirstPage && currentPage === 1) {
				return null;
			}

			const pageText = formatPageNumber(
				currentPage,
				pageCount,
				this.options
			);

			if (!pageText) {
				return null;
			}

			const margin = isHeader
				? this.options.headerMargin
				: this.options.position === 'below-footer'
					? this.options.belowFooterMargin
					: this.options.footerMargin;

			return {
				text: pageText,
				alignment: this.options.alignment || 'center',
				fontSize:
					this.options.style.fontSize || this.options.fontSize || 10,
				margin: margin,
				color: this.options.style.color || '#000000',
				bold: this.options.style.bold || false,
				italics: this.options.style.italics || false,
				font: this.options.style.font || 'Roboto',
			};
		} catch (error) {
			console.error('Error creating page number element:', error);
			return null;
		}
	}

	enhanceDocumentWithPageNumbers(documentDefinition) {
		if (!documentDefinition || typeof documentDefinition !== 'object') {
			throw new Error('Invalid document definition provided');
		}

		if (!this.options.enabled) {
			return documentDefinition;
		}

		const enhancedDocument = { ...documentDefinition };

		// Handle header positioning
		if (this.options.position === 'header') {
			enhancedDocument.header = this.createHeaderFunction(
				enhancedDocument.header
			);
		}

		// Handle footer and below-footer positioning
		if (
			this.options.position === 'footer' ||
			this.options.position === 'below-footer' ||
			this.options.position === 'both'
		) {
			enhancedDocument.footer = this.createFooterFunction(
				enhancedDocument.footer
			);
		}

		return enhancedDocument;
	}

	createHeaderFunction(existingHeader) {
		return (currentPage, pageCount) => {
			try {
				const pageNumberElement = this.createPageNumberElement(
					currentPage,
					pageCount,
					true
				);

				if (existingHeader) {
					if (typeof existingHeader === 'function') {
						const existingHeaderContent = existingHeader(
							currentPage,
							pageCount
						);
						return [
							existingHeaderContent || '',
							pageNumberElement || '',
						];
					} else {
						return [existingHeader, pageNumberElement || ''];
					}
				}

				return pageNumberElement;
			} catch (error) {
				console.error('Error in header function:', error);
				return null;
			}
		};
	}

	createFooterFunction(existingFooter) {
		return (currentPage, pageCount) => {
			try {
				const pageNumberElement = this.createPageNumberElement(
					currentPage,
					pageCount,
					false
				);

				if (this.options.position === 'below-footer') {
					return this.createBelowFooterLayout(
						existingFooter,
						currentPage,
						pageCount,
						pageNumberElement
					);
				}

				return this.createInlineFooterLayout(
					existingFooter,
					currentPage,
					pageCount,
					pageNumberElement
				);
			} catch (error) {
				console.error('Error in footer function:', error);
				return null;
			}
		};
	}

	createBelowFooterLayout(
		existingFooter,
		currentPage,
		pageCount,
		pageNumberElement
	) {
		const footerContent = [];

		// Add existing footer content first
		if (existingFooter) {
			if (typeof existingFooter === 'function') {
				const existingFooterContent = existingFooter(
					currentPage,
					pageCount
				);
				if (existingFooterContent) {
					footerContent.push(existingFooterContent);
				}
			} else {
				footerContent.push(existingFooter);
			}
		}

		// Add spacing between footer and page number
		if (footerContent.length > 0 && pageNumberElement) {
			footerContent.push({
				text: '',
				margin: [0, this.options.spacingAbovePageNumber, 0, 0],
			});
		}

		// Add page number below footer content
		if (pageNumberElement) {
			footerContent.push(pageNumberElement);
		}

		return footerContent.length > 0 ? { stack: footerContent } : null;
	}

	createInlineFooterLayout(
		existingFooter,
		currentPage,
		pageCount,
		pageNumberElement
	) {
		if (existingFooter) {
			if (typeof existingFooter === 'function') {
				const existingFooterContent = existingFooter(
					currentPage,
					pageCount
				);
				return {
					columns: [
						existingFooterContent || '',
						pageNumberElement || '',
					],
				};
			} else {
				return {
					columns: [existingFooter, pageNumberElement || ''],
				};
			}
		}
		return pageNumberElement;
	}

	// Static method to create generator with predefined style
	static withStyle(styleName, customOptions = {}) {
		const baseStyle = getPageNumberStyle(styleName);
		const options = {
			pageNumbering: {
				...baseStyle,
				...customOptions,
			},
		};
		return new PageNumberGenerator(options);
	}

	// Update options
	updateOptions(newOptions) {
		this.options = validateAndSanitizeOptions(newOptions).pageNumbering;
	}

	// Get current options
	getOptions() {
		return { ...this.options };
	}
}

// Utility functions for direct use
export const enhanceDocumentWithPageNumbers = (
	documentDefinition,
	pageNumberOptions = {}
) => {
	const generator = new PageNumberGenerator({
		pageNumbering: pageNumberOptions,
	});
	return generator.enhanceDocumentWithPageNumbers(documentDefinition);
};

export const createPageNumberGenerator = (options = {}) => {
	return new PageNumberGenerator(options);
};
