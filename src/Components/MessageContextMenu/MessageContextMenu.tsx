import React, { useState, useEffect, FC, useContext, memo, Dispatch, SetStateAction } from "react";
import { Avatar, Box, Button, ListItem, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { Context } from "../../index";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { gifMessageType, messagesExemplar, messagesType, messageType, replyMessageType } from "../../types/messages";
import { screenTypes, useGetTypeOfScreen } from "../../hooks/useGetTypeOfScreen";
import { chatType } from "../../types/chatType";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { ThemeContext } from "../../App";
import { user } from "../../types/user";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from '@mui/icons-material/Visibility';


type MessageContextMenuPT = {
	modalInfo: {
		message: messageType | replyMessageType | gifMessageType,
		pageY: number,
		pageX: number,
		isMe: boolean,
	},
	setIsReplying: Dispatch<SetStateAction<boolean>>,
	setReplyMessageInfo: any,
	chatId: string,
	setIsContextMenuOpen: Dispatch<SetStateAction<boolean>>,
	myId: string,
	setChangingMessageId: Dispatch<SetStateAction<string>>,
	setMessageInputValue: Dispatch<SetStateAction<string>>,
	chatInfo: chatType | undefined,
	secondLastMessage: messagesType[] | undefined,
	focusOnInput: () => void,
	subscribedUsers: any,
	setIsUserModalOpen: Dispatch<SetStateAction<boolean>>,
	setUserModalInfo: Dispatch<SetStateAction<any>>,
}

//
// setUserModalInfo
const MessageContextMenu: FC<MessageContextMenuPT> =
	memo(({
			  modalInfo,
			  setIsReplying,
			  setReplyMessageInfo,
			  chatId,
			  setIsContextMenuOpen,
			  myId,
			  setChangingMessageId,
			  chatInfo,
			  secondLastMessage,
			  setMessageInputValue,
			  focusOnInput,
			  subscribedUsers,
			  setIsUserModalOpen,
			  setUserModalInfo
		  }) => {

		const { firestore, user } = useContext(Context)!;
		const { userStyles } = useContext(ThemeContext)!;

		const storage = getStorage();

		const { isMobile } = useGetTypeOfScreen();
		const [isSeenListOpen, setIsSeenListOpen] = useState(false);

		const copyText = (text: string) => {
			const data = [new ClipboardItem({ "text/plain": new Blob([text], { type: "text/plain" }) })];
			navigator.clipboard.write(data);

			setIsContextMenuOpen(false);
		};


		const onDelete = async ({ messageId, images }: { messageId: string, images: { url: string, imageRef: string }[] | null | undefined }) => {
			await deleteDoc(doc(firestore, "chats", `${chatId}`, "messages", `${messageId}`));
			setIsContextMenuOpen(false);

			if (images) {
				images.forEach(async ({ imageRef }) => {
					await deleteObject(ref(storage, `${imageRef}`));
				});
			}

			if (chatInfo!.lastMessage.messageId === messageId) {
				const chatRef = doc(firestore, "chats", `${chatId}`);
				await setDoc(chatRef, {
					lastMessage: secondLastMessage![0]
				}, { merge: true });
			}
		};

		const staticTop = (window.innerHeight / 1.4);
		const mobileStaticLeft = (window.innerWidth / 2.4);

		const isNotGifMessage = modalInfo.message.messageType !== messagesExemplar.gifMessage;

		return (
			<Box
				className='contextMenu'
				sx={isMobile ?
					{
						position: "fixed",
						bottom: 0,
						left: 0,
						width: "100%",
						padding: "10px",
						backgroundColor: userStyles.secondBackgroundColor,
						zIndex: 101,
						borderRadius: "5px",
						wordBreak: "normal"
					}
					:
					{
						position: "fixed",
						top: modalInfo.pageY > staticTop ? staticTop : `${modalInfo.pageY + 10}px`,
						left: isMobile ? mobileStaticLeft : `${modalInfo.pageX + 10}px`,
						padding: "10px",
						backgroundColor: userStyles.secondBackgroundColor,
						zIndex: 101,
						borderRadius: "5px",
						wordBreak: "normal",
						display: "flex"
					}
				}>
				<Box display='flex' textAlign='center' flexDirection='column' justifyContent='center'
				>
					<Button
						color={"error"}
						onClick={() => {
							setIsContextMenuOpen(false);
						}}
						startIcon={<CloseIcon/>}
					>
						Закрыть
					</Button>
					<Button onClick={() => {
						setIsReplying(true);
						setReplyMessageInfo(modalInfo.message);
						setIsContextMenuOpen(false);
						focusOnInput();
					}} startIcon={<ReplyIcon/>}>
						<Typography>Ответить</Typography>
					</Button>
					{modalInfo.isMe && isNotGifMessage &&
					<>
						<Button startIcon={<EditIcon/>} sx={{ my: 1 }} onClick={() => {
							setChangingMessageId(modalInfo.message.messageId);
							// @ts-ignore
							setMessageInputValue(modalInfo.message.message);
							setIsContextMenuOpen(false);
						}}>
							<Typography>Редактировать</Typography>
						</Button>
						{/* @ts-ignore */}
						<Button startIcon={<ContentCopyIcon/>} onClick={() => copyText(modalInfo.message?.message)}>
							Копировать текст
						</Button>
					</>
					}
					<Button startIcon={<VisibilityIcon/>} onClick={() => setIsSeenListOpen(true)}>
						Посмотрели: {modalInfo.message?.seen?.length - 1}
					</Button>
					{modalInfo.isMe &&
					// @ts-ignore
					<Button color={"error"} onClick={() => onDelete({ messageId: modalInfo.message.messageId, images: modalInfo.message.images })} startIcon={<DeleteIcon/>} sx={{ minWidth: "30px" }}>
						<Typography>Удалить</Typography>
					</Button>
					}
				</Box>
				{isSeenListOpen &&
				<Box sx={{ display: "flex", flexDirection: "column", maxHeight: "300px", overflowY: "auto" }}>
					<Button sx={{ ml: "auto", width: "40px", minWidth: "auto" }} onClick={() => setIsSeenListOpen(false)} color='error'>
						<CloseIcon/>
					</Button>
					{modalInfo.message?.seen?.map((userId) => {
						if (userId === myId) {
							return <div key={userId} style={{ display: "none" }}/>;
						}
						if (userId === modalInfo.message.userId) {
							return <div key={userId} style={{ display: "none" }}/>;
						}
						return (
							<Button
								sx={{ display: "flex", alignItems: "center", cursor: "pointer", padding: 1, color: subscribedUsers[userId]?.nicknameColor || userStyles.secondBackgroundColor }}
								onClick={(e) => {
									const { pageX, pageY } = e;

									setIsUserModalOpen(true);
									setUserModalInfo({ user: subscribedUsers[userId], pageX, pageY });
								}}
                                key={userId}
							>
								<Avatar sx={{ width: "30px", height: "30px", mr: 1 }} src={subscribedUsers[userId]?.photoURL} alt='avatar'/>
								<Typography>{subscribedUsers[userId]?.nickname}</Typography>
							</Button>
						);
					})}
				</Box>
				}
			</Box>
		);
	});

export default MessageContextMenu;