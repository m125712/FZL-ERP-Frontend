export function generateYearRanges(startYear, endYear) {
	const ranges = [];
	for (let y = startYear; y < endYear; y += 1) {
		ranges.push({
			label: `${y}-${y + 1}`,
			value: Number(`${y}${y + 1}`),
		});
	}
	return ranges;
}
