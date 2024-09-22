const singleScale = {
	x: { stacked: false },
	y: { stacked: false },
};

const groupScale = {
	x: { stacked: true },
	y: { stacked: true },
};

const legend = {
	position: 'top',
	// align: "start",
	labels: {
		boxHeight: 10,
		usePointStyle: true,
		font: { weight: 'bolder' },
	},
};

const bar_chart_options = {
	plugins: {
		title: { display: false },
		legend,
	},
	layout: { padding: 2 },
	responsive: true,
	// scales: groupScale,
	scales: singleScale,
};

export { bar_chart_options, groupScale, legend, singleScale };
