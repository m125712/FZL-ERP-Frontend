function getValues({ end_type, item, stopper_type, zipper_number }) {
	if (end_type === 'open end') {
		if (item === 'nylon') {
			if (stopper_type === 'plastic') {
				if (zipper_number === 3) return { top: 2.5, mtr: 92 };
				if (zipper_number === 5) return { top: 2.5, mtr: 58 };
			}
			if (stopper_type === 'metallic') {
				if (zipper_number === 3) return { top: 3, mtr: 82 };
				if (zipper_number === 5) return { top: 3, mtr: 57 };
			}
			if (stopper_type === 'invisible' && zipper_number === 3)
				return { top: 3, mtr: 103 };
		}
		if (item === 'metal') {
			if (zipper_number === 3) return { top: 3.3, mtr: 101 };
			if (zipper_number === 4) return { top: 3.3, mtr: 96 };
			if (zipper_number === 5) return { top: 3.3, mtr: 87 };
			if (zipper_number === 8) return { top: 3.3, mtr: 59 };
		}
		if (item === 'vislon') {
			if (zipper_number === 3) return { top: 2.5, mtr: 110 };
			if (zipper_number === 5) return { top: 2.5, mtr: 90.5 };
			if (zipper_number === 8) return { top: 2.5, mtr: 75 };
		}
	}
	if (end_type === 'close end') {
		if (item === 'nylon') {
			if (stopper_type === 'plastic') {
				if (zipper_number === 3)
					return { top: 1.5, bottom: 1.5, mtr: 92 };
				if (zipper_number === 5)
					return { top: 1.5, bottom: 1.5, mtr: 58 };
			}
			if (stopper_type === 'metallic') {
				if (zipper_number === 3)
					return { top: 1.5, bottom: 2, mtr: 82 };
				if (zipper_number === 5) return { top: 2, bottom: 2, mtr: 57 };
			}
			if (stopper_type === 'invisible') {
				if (zipper_number === 3)
					return { top: 1.5, bottom: 2, mtr: 103 };
			}
		}
		if (item === 'metal') {
			if (zipper_number === 3) return { top: 2, bottom: 2, mtr: 101 };
			if (zipper_number === 4) return { top: 2, bottom: 2, mtr: 96 };
			if (zipper_number === 4.5) return { top: 2, bottom: 2, mtr: 101 };
			if (zipper_number === 5) return { top: 2.2, bottom: 2.2, mtr: 87 };
			if (zipper_number === 8) return { top: 2.5, bottom: 2, mtr: 59 };
		}
		if (item === 'vislon') {
			if (zipper_number === 3) return { top: 1.5, bottom: 1.5, mtr: 110 };
			if (zipper_number === 5)
				return { top: 1.5, bottom: 1.5, mtr: 90.5 };
			if (zipper_number === 8) return { top: 1.5, bottom: 1.5, mtr: 75 };
		}
	}
}

function getMeasurement({ item, stopper_type, zipper_number, end_type }) {
	const RESULT = getValues({
		item,
		zipper_number: Number(zipper_number),
		end_type,
		stopper_type,
	});

	// console.log({
	// 	item,
	// 	zipper_number: Number(zipper_number),
	// 	end_type,
	// 	stopper_type,
	// });

	if (RESULT?.top === 0 && RESULT?.bottom === 0 && RESULT?.mtr === 0)
		return 0;

	return RESULT;
}

function getTapeRequired({ top, bottom = 0, mtr, size, pcs }) {
	const LENGTH = Number(size) + top + bottom;
	const CM = LENGTH * 2 * Number(pcs);
	const TAPE_REQUIRED = (CM / (mtr * 100)) * 1.03; // 3% extra

	return TAPE_REQUIRED.toFixed(3);
}

function Need({
	item = 'metal',
	stopper_type = '',
	zipper_number = 8,
	end_type = 'OE',
	size = 36.5,
	pcs = 100,
}) {
	const res = getValues({
		end_type,
		item,
		stopper_type,
		zipper_number: Number(zipper_number),
	});

	if (res?.top === 0 && res?.bottom === 0 && res?.mtr === 0) return 0;

	const TOTAL_LENGTH = Number(size) + res?.top + (res?.bottom || 0);
	const TOTAL_CM = TOTAL_LENGTH * 2 * Number(pcs);
	const TAPE_NEED = (TOTAL_CM / (res?.mtr * 100)) * 1.03;

	return TAPE_NEED.toFixed(3);
}

function GetData({
	item = 'metal',
	stopper_type = '',
	zipper_number = 8,
	end_type = 'OE',
	size = 36.5,
	pcs = 100,
}) {
	const res = getValues({
		end_type,
		item,
		stopper_type,
		zipper_number: Number(zipper_number),
	});

	if (res?.top === 0 && res?.bottom === 0 && res?.mtr === 0) return 0;

	const TOTAL_LENGTH = Number(size) + res?.top + (res?.bottom || 0);
	const TOTAL_CM = TOTAL_LENGTH * Number(pcs);
	const TAPE_NEED = (TOTAL_CM / (res?.mtr * 100)) * 1.03;

	return {
		TOTAL_LENGTH,
		TAPE_NEED: TAPE_NEED.toFixed(3),
	};
}

export { GetData, Need, getMeasurement, getTapeRequired };
