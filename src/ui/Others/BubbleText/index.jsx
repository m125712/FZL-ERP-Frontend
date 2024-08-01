import styles from "./index.module.css";

const Example = () => {
	return (
		<div className="grid h-screen place-content-center bg-black">
			<BubbleText />
		</div>
	);
};

const BubbleText = ({ text = "FZL" }) => {
	return (
		<h2 className="text-center text-5xl font-medium text-primary-content">
			{text.split("").map((child, idx) => (
				<span className={styles.hoverText} key={idx}>
					{child}
				</span>
			))}
		</h2>
	);
};

export { BubbleText, Example };
