export const DEFAULT_FONT_SIZE = 9;
export const xMargin = 30;
export const yMargin = 40;
export const A4_PAGE_WIDTH = 565;

// default style for all headers
export const defaultStyle = {
	fontSize: DEFAULT_FONT_SIZE,
};

// Styles
export const styles = {
	tableHeader: {
		fillColor: "#ced4da",
		color: "#000",
	},
	tableFooter: {
		margin: [0, 2],
		fillColor: "#c5c3c6",
		color: "#000",
	},
};

export const TitleAndValue = (title, value) => [
	{
		text: `${title}: `,
		bold: true,
	},
	{
		text: `${value || "-"}\n`,
	},
];
