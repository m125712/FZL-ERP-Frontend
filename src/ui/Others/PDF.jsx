import FZL_IMG from "@assets/img/fzl_png.png";
import jsPDF from "jspdf";

const FONT_SIZE = 10;

// landscape
const landscapeDoc = new jsPDF({
	orientation: "landscape",
	format: "A4",
	unit: "pt",
	floatPrecision: 2,
});
landscapeDoc.setFontSize(FONT_SIZE);

const landscape_ml = 40,
	landscape_mr = 800,
	landscape_mp = (landscape_mr + landscape_ml) / 2;

const landscapeHeader = ({ reportName, extraInfo = "", printedBy }) => {
	landscapeDoc.addImage(FZL_IMG, "PNG", landscape_ml, 5, 70, 35);
	landscapeDoc.text(`${reportName} \n${extraInfo}`, landscape_mp, 25, {
		align: "center",
	});
	landscapeDoc.text(`Printed By: ${printedBy}`, landscape_mr, 25, {
		align: "right",
	});
};

// portrait
const portraitDoc = new jsPDF({
	orientation: "portrait",
	format: "A4",
	unit: "pt",
	floatPrecision: 2,
});
portraitDoc.setFontSize(FONT_SIZE);

const portrait_ml = 20,
	portrait_mr = 570,
	portrait_mp = (portrait_mr + portrait_ml) / 2;

const portraitHeader = ({ reportName, extraInfo = "", printedBy }) => {
	portraitDoc.addImage(FZL_IMG, "PNG", portrait_ml, 5, 70, 35);
	portraitDoc.text(`${reportName} \n${extraInfo}`, portrait_mp, 25, {
		align: "center",
	});
	portraitDoc.text(`Printed By: ${printedBy}`, portrait_mr, 25, {
		align: "right",
	});
};

// table styles
const margin = {
	top: 45,
};
const theme = "striped";
const headStyles = {
	fillColor: [255, 255, 255],
	textColor: [0, 0, 0],
	lineWidth: 1,
	lineColor: [0, 0, 0],
	cellPadding: 2,
};
const styles = {
	fontSize: 8,
	lineWidth: 0.1,
	lineColor: [0, 0, 0],
	cellPadding: 2,
};

export default {
	landscapeDoc,
	landscapeHeader,
	portraitDoc,
	portraitHeader,
	margin,
	theme,
	headStyles,
	styles,
};
