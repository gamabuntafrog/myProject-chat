import React, { FC } from "react";
import { Avatar, Box } from "@mui/material";
import { messagesExemplar, messagesType } from "../../../types/messages";

type WhoSeenTheMessagePT = {
	message: messagesType,
	currentUserId: string,
	subscribedUsers: any
}

const WhoSeenTheMessage: FC<WhoSeenTheMessagePT> = ({message, currentUserId, subscribedUsers}) => {


	if (message.messageType === messagesExemplar.startMessage) {
		return <div/>
	}

    return (
		<Box sx={{
			display: "flex",
			overflow: "hidden",
			position: "absolute",
			bottom: "-25px",
			left: 0
		}}>
			{message.seen?.map(({ userId, date }, i) => {
				if (i > 6) {
					return <div style={{ display: "none" }} key={i}/>;
				}
				if (i > 5) {
					return <Box sx={{ width: "20px", height: "20px", mx: 0.5 }} key={i}>...</Box>;
				}
				if (userId === currentUserId) {
					return <div style={{ display: "none" }} key={i}/>;
				}
				if (userId === message.userId) {
					return <div style={{ display: "none" }} key={i}/>;
				}
				return (
					<Avatar
						sx={{
							width: "20px",
							height: "20px",
							mx: 0.3
						}}
						src={subscribedUsers[userId]?.photoURL}
						alt='avatar'
						key={i}
					/>
				);
			})}
		</Box>
    )
}

export default WhoSeenTheMessage