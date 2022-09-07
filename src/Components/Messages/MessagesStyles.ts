export const messagesGroupList = () => {

	return ({
		px: 1,
		pb: 3,
		maxHeight: "100vh",
		minHeight: "70vh",
		overflowY: "auto",
		backgroundSize: "cover",
		display: "flex",
		flexDirection: "column",
		alignItems: "start"

	});
};

export const avatarWrapper = {
	mt: 1,
	mr: 1,
	cursor: "pointer",
	position: "sticky",
	bottom: 0
};

export const messageWrapper = (isMessageBeforeIsMine: boolean, isMessageAfterThisMine: boolean, isMobileType: boolean, borderRadius: string | number, backgroundColor: string, theme: "light" | "dark" | "") => {

	if (isMessageAfterThisMine) {
		if (borderRadius) {
			borderRadius = `${borderRadius}px`
		} else {
			borderRadius = 1
		}
	} else {
		borderRadius = `${borderRadius}px ${borderRadius}px ${borderRadius}px 0`
	}

	return ({
		flexGrow: 1,
		backgroundColor: backgroundColor || "#121212",
		px: 2,
		color: theme === "light" ? "black" : "white",
		pt: 2,
		pb: 3,
		borderRadius: borderRadius
	});
};

export const userWrapper = {
	alignItems: "center",
	display: "flex"
};

export const activeUsername = (color: string | undefined) => {

	return ({
		color: color ? color : "",
		cursor: "pointer",
		display: "inline-block",
		wordBreak: "break-all"

	});
};

export const userRole = {
	display: "inline-block",
	ml: 1,
	fontSize: "12px",
	cursor: "default"
};

export const messageContainer = {
	display: "flex",
	wordBreak: "break-word"
};

export const messageListItem = (isMobileType: boolean) => {

	return ({
		padding: 0,
		width: "100%",
		pr: isMobileType ? 1 : 5,
		mt: 1,
		borderRadius: 3,
		display: "inline-flex",
		alignItems: "flex-start",
		flexDirection: "column"
	});
};

export const messageStyles = {
	wordBreak: "break-word",
	mt: 1
};

export const messageLeftLine = {
	width: "2px",
	backgroundColor: "white",
	mr: 1
};

export const dateMessage = {
	fontSize: "12px",
	position: "absolute",
	bottom: "5px",
	right: "10px"
};

export const itemGroupWrapper = {
	padding: 0,
	display: "flex",
	alignItems: "flex-end"
};

export const messagesList = {
	padding: 0,
	width: "100%"
}