import { compareItems, rankItem } from "@tanstack/match-sorter-utils";
import { sortingFns } from "@tanstack/react-table";
import Cookies from "js-cookie";

const FuzzyFilter = (row, columnId, value, addMeta) => {
	const itemRank = rankItem(row.getValue(columnId), String(value));
	addMeta({ itemRank });
	return itemRank.passed;
};

const fuzzySort = (rowA, rowB, columnId) => {
	let dir = 0;

	// Only sort by rank if the column has ranking information
	if (rowA.columnFiltersMeta[columnId]) {
		dir = compareItems(
			rowA.columnFiltersMeta[columnId].itemRank,
			rowB.columnFiltersMeta[columnId].itemRank
		);
	}

	// Provide an alphanumeric fallback for when the item ranks are equal
	return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

const isWithinRange = (row) => {
	const startDate = Cookies.get("startDate");
	const endDate = Cookies.get("endDate");
	const date = row.getValue("created_at");

	// If date is not defined and any filter is applied, return false
	if ((startDate || endDate) && !date) return false;

	const start = startDate && new Date(startDate).getTime();
	const end = endDate && new Date(endDate).getTime();
	const dateTime = new Date(date).getTime();

	// Check if date is within the range
	return (!start || dateTime > start) && (!end || dateTime <= end);
};

export default FuzzyFilter;
export { fuzzySort, isWithinRange };
