export function generateBarcodeAsBase64(text, value) {
	const canvas = document.createElement('canvas');
	JsBarcode(canvas, value, {
		format: 'CODE128',
		text: text,
		width: 2,
		height: 40,
		displayValue: false,
		fontSize: 12,
		margin: 10,
		background: '#ffffff',
		lineColor: '#000000',
	});
	return canvas.toDataURL('image/png');
}
