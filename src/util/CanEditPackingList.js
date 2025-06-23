import { getDate, isSameMonth } from 'date-fns';

export const CanEditPackingList = (date) => {
	const today = new Date();
	if (!isSameMonth(date, today)) return false;

	const created_at_day = getDate(date);
	const todayDay = getDate(today);

	// Both in 1-15 or both in 16-31
	return (
		(created_at_day <= 15 && todayDay <= 15) ||
		(created_at_day > 15 && todayDay > 15)
	);
};
