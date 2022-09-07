import React, { Dispatch, FC, memo, MutableRefObject, SetStateAction, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Context } from "../..";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { Avatar, Box, Button, debounce, IconButton, ImageList, ImageListItem, List, ListItem, TextField, Typography } from "@mui/material";
import Loader from "../Loader";
import UserModalInfo from "../UserModalInfo";
import { gifMessageType, messagesExemplar, messagesType, messagesWhichOnProgressType, messageType } from "../../types/messages";
import MessageContextMenu from "../MessageContextMenu";
import EllipsisText from "react-ellipsis-text";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { user } from "../../types/user";
import { activeUsername, avatarWrapper, dateMessage, itemGroupWrapper, messageContainer, messageLeftLine, messageListItem, messagesGroupList, messagesList, messageStyles, messageWrapper, userRole, userWrapper } from "./MessagesStyles";
import { useGetTypeOfScreen } from "../../hooks/useGetTypeOfScreen";
import "./Messages.css";
import ReplyIcon from "@mui/icons-material/Reply";
import { chatType } from "../../types/chatType";
import { format } from "date-fns";
import { ThemeContext } from "../../App";
import Modal from "../Modal";
import ImageGallery from "react-image-gallery";
import { showRepliedMessageActionTypes } from "../Chat/Chat";
import WhoSeenTheMessage from "./WhoSeenTheMessage/WhoSeenTheMessage";
import GifMessage from "./GifMessage";
import Message from "./Message";


type MessagesPropTypes = {
	chatId: string,
	messagesArray: [messagesType[]],
	subscribedUsers: any,
	setIsReplying: Dispatch<SetStateAction<boolean>>
	setReplyMessageInfo: Dispatch<SetStateAction<null | (messageType | gifMessageType)>>,
	isChatChanging: boolean,
	showRepliedMessage: (message: (messageType | gifMessageType), actionType: showRepliedMessageActionTypes) => void,
	listRef: React.MutableRefObject<HTMLUListElement | null>,
	chatInfo: chatType | undefined,
	focusOnInput: () => void,
	messagesWhichOnProgress: null | messagesWhichOnProgressType[],
	chatReactRef: MutableRefObject<HTMLDivElement | null>

}

const Messages: FC<MessagesPropTypes> = memo((
	{
		chatId,
		messagesArray,
		subscribedUsers,
		setReplyMessageInfo,
		setIsReplying,
		isChatChanging,
		showRepliedMessage,
		listRef,
		chatInfo,
		focusOnInput,
		messagesWhichOnProgress,
		chatReactRef
	}
) => {

	const { user: me, firestore } = useContext(Context)!;

	const [userModalInfo, setUserModalInfo] = useState<null | any | user>(null);
	const [isUserModalOpen, setIsUserModalOpen] = useState(false);
	const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
	const [contextMenuInfo, setContextMenuInfo] = useState<any>(null);
	const [messageInputValue, setMessageInputValue] = useState("");
	const [changingMessageId, setChangingMessageId] = useState("");
	const [replyMessages, setReplyMessages] = useState<any>(null);
	const [isFirstRender, setIsFirstRender] = useState(true);

	const lastMessage = useRef<null | HTMLLIElement>(null);

	const { screenType, isMobile, isMobileOrTablet } = useGetTypeOfScreen();


	useEffect(() => {
		if (listRef.current) {
			const lastGroup = listRef.current.children[messagesArray?.length - 1];
			if (lastGroup) {
				const list = lastGroup.children[1];
				const lastChildOfMessages = list.children[list.children.length - 1];
				if (isInViewport(lastChildOfMessages)) {
					scrollToBottom();
				}
			}
		}
	}, [messagesArray?.[messagesArray?.length - 1]?.length, listRef.current]);

	useLayoutEffect(() => {
		if (lastMessage.current) {
			if (isFirstRender) {
				lastMessage.current!.scrollIntoView();
				setIsFirstRender(false);
			}
		}
	}, [lastMessage.current]);

	useEffect(() => {
		return () => {
			setIsFirstRender(true);
		};
	}, [chatId]);


	const scrollToBottom = () => {
		listRef.current!.scrollTo({ top: listRef.current!.scrollHeight });
	};

	const [isGalleryOpen, setIsGalleryOpen] = useState(false);
	const [galleryImages, setGalleryImages] = useState<{ original: string, thumbnail: string }[] | null>(null);
	const [indexOfOpenedImage, setIndexOfOpenedImage] = useState(0);

	useEffect(() => {
		const clickOnChatWhenUserModalIsOpen = (e: MouseEvent) => {
			// @ts-ignore
			const isUserModalClick = e.path.filter((el: any) => {
				if (el.classList) {
					return el.classList.contains("userModalInfo");
				}
			}).length > 0;

			if (isUserModalClick) {
				return;
			} else {
				setIsUserModalOpen(false);
			}
		};

		if (isUserModalOpen) {
			chatReactRef?.current?.addEventListener("click", clickOnChatWhenUserModalIsOpen);
		}

		const clickOnChatWhenContextMenuIsOpen = (e: MouseEvent) => {
			// @ts-ignore
			const isContextMenuClick = e.path.filter((el: any) => {
				if (el.classList) {
					return el.classList.contains("contextMenu");
				}
			}).length > 0;

			if (isContextMenuClick) {
				return;
			} else {
				setIsContextMenuOpen(false);
			}
		};

		if (isContextMenuOpen) {
			chatReactRef?.current?.addEventListener("click", clickOnChatWhenContextMenuIsOpen);
		}

		return () => {
			chatReactRef?.current?.removeEventListener("click", clickOnChatWhenUserModalIsOpen);
			chatReactRef?.current?.removeEventListener("click", clickOnChatWhenContextMenuIsOpen);
		};
	}, [isUserModalOpen, isContextMenuOpen]);

	useEffect(() => {
		const messagesObj: any = {};
		const messagesList = messagesArray.flatMap((messages) => messages).forEach((message: messagesType) => {
			messagesObj[message.messageId] = message;
		});
		// console.log(messagesObj)
		setReplyMessages(messagesObj);
	}, [messagesArray]);


	const onOpenContextMenu = (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLLIElement, MouseEvent>, message: messagesType, subscribedUser: user) => {

		const openContextMenu = () => {
			const { pageX, pageY } = e;
			const isMe = subscribedUser.userId === me?.userId;

			if (subscribedUser && isMe) {
				setContextMenuInfo({ message, pageX, pageY, isMe: true });
			} else {
				setContextMenuInfo({ message, pageX, pageY, isMe: false });
			}

			setIsContextMenuOpen(true);
		};

		switch (e.type) {
			case "contextmenu":
				e.preventDefault();
				openContextMenu();
				break;
			case "click":
				if (isMobileOrTablet) {
					openContextMenu();
				}
				break;
			default:
				return;
		}

	};

	const showUserInfo = (e: React.MouseEvent<HTMLSpanElement>, user: user | undefined) => {
		const { pageX, pageY } = e;

		if (user) {
			setIsUserModalOpen(true);
			setUserModalInfo({ user, pageX, pageY });
		}
	};

	const changeMessage = async (message: messagesType) => {
		const newMessage = { ...message, message: messageInputValue, changedAt: Date.now() };

		try {
			const messageRef = doc(firestore, "chats", `${chatId}`, "messages", `${message.messageId}`);
			await setDoc(messageRef, newMessage);

			if (chatInfo && chatInfo.lastMessage.messageId === message.messageId) {
				const chatRef = doc(firestore, "chats", `${chatId}`);
				await setDoc(chatRef, {
					lastMessage: newMessage
				}, { merge: true });
			}
		} catch (e) {
			console.log(e);
		} finally {
			setChangingMessageId("");
			setMessageInputValue("");
		}
	};
	const { userStyles } = useContext(ThemeContext)!;

	const getTwoLastMessage = useCallback(
		(messagesArray: [messagesType[]]) => {
			const lastGroup = messagesArray[messagesArray.length - 1];
			const lastSecondMessage = lastGroup.slice(lastGroup.length - 2, lastGroup.length - 1);

			return lastSecondMessage;
		},
		[messagesArray]
	);

	const secondLastMessage = getTwoLastMessage(messagesArray);

	const replyOnMessage = (message: messageType | gifMessageType) => {
		setIsReplying(true);
		setReplyMessageInfo(message);
		focusOnInput();
	};

	function isInViewport(element: Element) {
		if (!element) {
			return false;
		}

		const rect = element.getBoundingClientRect();

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}

	const sendIHaveSeenMessage = async (message: messageType | gifMessageType) => {
		const { userId } = me!;
		const now = Date.now();
		await updateDoc(doc(firestore, "chats", chatId, "messages", message.messageId), {
			seen: arrayUnion({ "userId": userId, "date": now })
		});
	};

	const onListScroll = (e: React.UIEvent<HTMLUListElement>) => {
		let firstContact = false;
		let lastContact = false;

		for (let groupIndex = messagesArray!.length - 1; groupIndex >= 0; groupIndex--) {

			const DOMGroup = listRef.current!.children[groupIndex];
			const DOMList = DOMGroup.children[1];

			const group = messagesArray[groupIndex];

			for (let childIndex = DOMList.children.length - 1; childIndex >= 0; childIndex--) {
				const messageObj = group[childIndex];
				const messageElement = DOMList.children[childIndex];

				if (messageElement && isInViewport(messageElement) && messageObj) {
					// console.log(`group ${groupIndex} element ${childIndex} in viewport`, messageElement)
					firstContact = true;
					if ("seen" in messageObj) {
						const isUserHasSeenLastMessage = messageObj.seen.find(({ userId }) => userId === me?.userId);
						if (!isUserHasSeenLastMessage) {
							sendIHaveSeenMessage(messageObj);
						}
					} else {
						if (messageObj.messageType !== messagesExemplar.startMessage) {
							sendIHaveSeenMessage(messageObj);
						}
					}
				} else {
					if (firstContact) lastContact = true;
				}

				if (lastContact) break;
			}
			if (lastContact) break;
		}
	};

	const onDebouncedListScroll = useCallback(
		debounce(onListScroll, 300),
		[messagesArray]
	);

	const onAvatarClick = ({ event, subscribedUser }: { event: React.MouseEvent<HTMLDivElement>, subscribedUser: user }) => {
		const { pageX, pageY } = event;
		if (subscribedUser) {
			setIsUserModalOpen(true);
			setUserModalInfo({ user: subscribedUser, pageX, pageY });
		}
		setIsContextMenuOpen(false);
	};

	if (!messagesArray && !subscribedUsers && !me) {
		return <List sx={{ minHeight: "100vh" }}>
			<Loader/>
		</List>;
	}

	return (
		<>
			<Modal
				width={isMobile ? "100%" : "70%"}
				jc='center'
				height={isMobile ? "100%" : "90%"}
				buttonPosition='absolute'
				isModalOpen={isGalleryOpen}
				onClose={() => setIsGalleryOpen(false)}
			>
				<Box sx={{
					width: "100%",
					pr: isMobile ? 0 : 2
				}}>
					<ImageGallery
						showPlayButton={false}
						showThumbnails={isMobile ? false : galleryImages && galleryImages?.length > 1}
						startIndex={indexOfOpenedImage}
						showFullscreenButton={false}
						fullscreen
						thumbnailPosition='left'
						sizes='100px'
						infinite={false}
						thumbnailWidth='100%'
						thumbnailHeight='600px'
						originalWidth='100%'
						items={galleryImages || []}
					/>
				</Box>
			</Modal>
			{isChatChanging && <Loader spinColor={me?.nicknameColor}/>}
			{(me && isContextMenuOpen) && <MessageContextMenu
				modalInfo={contextMenuInfo}
				setReplyMessageInfo={setReplyMessageInfo}
				setIsReplying={setIsReplying}
				chatId={chatId}
				setIsContextMenuOpen={setIsContextMenuOpen}
				myId={me.userId}
				setChangingMessageId={setChangingMessageId}
				chatInfo={chatInfo}
				secondLastMessage={secondLastMessage}
				setMessageInputValue={setMessageInputValue}
				focusOnInput={focusOnInput}
				subscribedUsers={subscribedUsers}
				setUserModalInfo={setUserModalInfo}
				setIsUserModalOpen={setIsUserModalOpen}
			/>}
			{isUserModalOpen && <UserModalInfo
				modalInfo={userModalInfo}
				setIsUserModalOpen={setIsUserModalOpen}
			/>}
			<List
				ref={listRef}
				sx={messagesGroupList()}
				onScrollCapture={onDebouncedListScroll}
			>
				{subscribedUsers && replyMessages && messagesArray?.map((messages: messagesType[], i: number) => {
					const { userId } = messages[0];
					const subscribedUser = subscribedUsers[userId];
					const isLastGroup = messagesArray.length - 1 === i;
					const firstMessageInGroup = messages[0];
					const { messageId } = firstMessageInGroup;

					return (
						<ListItem
							sx={itemGroupWrapper}
							key={messageId}
							className='messageItem'
						>
							<Box onClick={(event) => onAvatarClick({ event, subscribedUser })} sx={avatarWrapper}>
								<Avatar sx={{ width: 50, height: 50 }} src={subscribedUser?.photoURL} alt={`avatar of ${subscribedUser?.nickname}`}/>
							</Box>
							<List
								sx={messagesList}
							>
								{messages.map((message, i) => {
									const { createdAt, messageType, messageId, message: messageText } = message;

									const formattedCreatedAt = format(createdAt, "HH mm").split(" ").join(":");

									if (messageType === messagesExemplar.startMessage) {
										return (
											<ListItem
												sx={{ justifyContent: "center", alignItems: "baseline" }}
												key={createdAt}
											>
												<Typography variant="subtitle1">{messageText}</Typography>
												<Typography sx={{ fontSize: "12px", ml: 1 }}>
													{formattedCreatedAt}
												</Typography>
											</ListItem>
										);
									}

									const { replyer } = message;
									const messagesLength = messages.length - 1;
									const changedAtFormatted = message?.changedAt ? format(message.changedAt, "HH mm").split(" ").join(":") : null;

									const isMessageBeforeIsMine = messages[i - 1]?.userId === message.userId;
									const isMessageAfterThisMine = messages[i + 1]?.userId === message.userId;
									const isLastMessage = isLastGroup && (messagesLength === i);

									const subscribedReplyerUser = subscribedUsers[replyer?.userId] || null;
									const replyMessage: messageType | gifMessageType | null = replyMessages[replyer?.messageId] || null;

									if (messageType === messagesExemplar.gifMessage) {
										return (
											<GifMessage
												key={messageId}
												message={message}
												onOpenContextMenu={onOpenContextMenu}
												isLastMessage={isLastMessage}
												lastMessage={lastMessage}
												subscribedUser={subscribedUser}
												isMobile={isMobile}
												isMessageBeforeIsMine={isMessageBeforeIsMine}
												isMessageAfterThisMine={isMessageAfterThisMine}
												userStyles={userStyles}
												showRepliedMessage={showRepliedMessage}
												currentUser={me!}
												subscribedReplyerUser={subscribedReplyerUser}
												subscribedUsers={subscribedUsers}
												replyMessage={replyMessage}
												setGalleryImages={setGalleryImages}
												setIsGalleryOpen={setIsGalleryOpen}
												replyOnMessage={replyOnMessage}
											/>
										);
									}


									const isMessageChanging = message.messageId === changingMessageId;


									if (messageType === messagesExemplar.message) {

										return (
											<Message
												key={messageId}
												message={message}
												onOpenContextMenu={onOpenContextMenu}
												isLastMessage={isLastMessage}
												lastMessage={lastMessage}
												subscribedUser={subscribedUser}
												isMobile={isMobile}
												isMessageBeforeIsMine={isMessageBeforeIsMine}
												isMessageAfterThisMine={isMessageAfterThisMine}
												userStyles={userStyles}
												showRepliedMessage={showRepliedMessage}
												currentUser={me!}
												subscribedReplyerUser={subscribedReplyerUser}
												subscribedUsers={subscribedUsers}
												replyMessage={replyMessage}
												setGalleryImages={setGalleryImages}
												setIsGalleryOpen={setIsGalleryOpen}
												replyOnMessage={replyOnMessage}
												showUserInfo={showUserInfo}
												setIndexOfOpenedImage={setIndexOfOpenedImage}
											/>
										);
										// const subscribedReplyerUser = subscribedUsers[message?.replyer?.userId] || null;
										// const replyMessage: messageType | gifMessageType | null = replyMessages[message?.replyer?.messageId] || null;

										// return (
										// 	<ListItem
										// 		sx={{ padding: 0 }}
										// 		key={messageId}
										// 		onContextMenu={(e) => onOpenContextMenu(e, message, subscribedUser)}
										// 		ref={isLastMessage ? lastMessage : null}
										// 	>
										// 		<Box
										// 			className={"messageWrapper"}
										// 			sx={messageListItem(isMobile)}
										// 		>
										// 			<Box
										// 				className='message'
										// 				sx={messageWrapper(isMessageBeforeIsMine, isMessageAfterThisMine, isMobile, userStyles?.messagesBorderRadius, userStyles.secondBackgroundColor, userStyles.theme)}
										// 			>
										// 				{!isMessageChanging ?
										// 					<>
										// 						<Box sx={userWrapper}>
										// 							{!isMessageBeforeIsMine &&
										// 							<>
										// 								<Typography
										// 									onClick={(e) => showUserInfo(e, subscribedUser)}
										// 									sx={activeUsername(subscribedUser ? subscribedUser?.nicknameColor : "")}
										// 									variant='subtitle1'
										// 								>
										// 									{subscribedUser?.nickname || userId}
										// 								</Typography>
										// 								{subscribedUser?.isAdmin &&
										// 								<Typography variant='subtitle1' sx={userRole}>
										// 									Админ
										// 								</Typography>
										// 								}
										// 							</>
										// 							}
										// 							<IconButton
										// 								className='miniContextmenu'
										// 								onClick={() => {
										// 									replyOnMessage(message);
										// 								}}
										// 								sx={{ color: subscribedUser?.nicknameColor || "" }}
										// 							>
										// 								<ReplyIcon/>
										// 							</IconButton>
										// 						</Box>
										// 						{message.replyer &&
										// 						<Box sx={messageContainer}>
										// 							<Box sx={messageLeftLine}/>
										// 							<Box
										// 								onClick={() => showRepliedMessage(message, showRepliedMessageActionTypes.showRepliedMessage)}
										// 								sx={{ cursor: "pointer" }}
										// 							>
										// 								<Typography
										// 									sx={{
										// 										color: `${subscribedReplyerUser?.userId === me?.userId ? me?.nicknameColor || "" : subscribedReplyerUser?.nicknameColor || ""} !important`,
										// 										cursor: "pointer"
										// 									}}
										// 								>
										// 									{subscribedReplyerUser?.nickname}
										// 								</Typography>
										// 								{replyMessage ?
										// 									<EllipsisText
										// 										sx={messageStyles}
										// 										text={replyMessage.message}
										// 										length={30}
										// 									/>
										// 									:
										// 									<Typography color='error' sx={{}}>Сообщение
										// 										удалено
										// 									</Typography>
										// 								}
										// 							</Box>
										// 						</Box>
										// 						}
										// 						{message.images &&
										// 						<ImageList
										// 							sx={isMobile ? { width: "100%" } : {}}
										// 							cols={isMobile ? 1 : message.images.length > 2 ? 3 : message.images.length}
										// 						>
										// 							{message.images.map(({ imageRef, url }, i) => {
										// 								return <ImageListItem
										// 									onClick={() => {
										// 										setIndexOfOpenedImage(i);
										// 										setGalleryImages(message.images!.map(({ url }) => {
										// 											return {
										// 												original: url,
										// 												thumbnail: url
										// 											};
										// 										}));
										// 										setIsGalleryOpen(true);
										// 									}}
										// 									key={url}
										// 									sx={{
										// 										borderRadius: 2,
										// 										overflow: "hidden",
										// 										mt: 1,
										// 										mx: 0.5,
										// 										cursor: "pointer"
										// 									}}
										// 								>
										// 									<img style={{ height: "300px" }} src={url}/>
										// 								</ImageListItem>;
										// 							})}
										// 						</ImageList>
										// 						}
										// 						<Typography sx={messageStyles}>
										// 							{message.message}
										// 						</Typography>
										// 						{changedAtFormatted ?
										// 							<Typography sx={dateMessage}>
										// 								изменено в {changedAtFormatted}
										// 							</Typography>
										// 							:
										// 							<Typography sx={dateMessage}>
										// 								{formattedCreatedAt}
										// 							</Typography>
										// 						}
										// 						{isLastMessage &&
										// 						<WhoSeenTheMessage message={message} currentUserId={me!.userId} subscribedUsers={subscribedUsers}/>
										// 						}
										// 					</>
										// 					:
										// 					<Box>
										// 						<Box
										// 							onClick={() => showRepliedMessage(message, showRepliedMessageActionTypes.showRepliedMessage)}
										// 							sx={{
										// 								display: "flex",
										// 								wordBreak: "break-all",
										// 								cursor: "pointer"
										// 							}}
										// 						>
										// 							{message.replyer &&
										// 							<Box sx={messageContainer}>
										// 								<Box sx={messageLeftLine}/>
										// 								<Box
										// 									onClick={() => showRepliedMessage(message, showRepliedMessageActionTypes.showRepliedMessage)}
										// 									sx={{ cursor: "pointer" }}
										// 								>
										// 									<Typography
										// 										sx={{
										// 											color: `${subscribedReplyerUser?.userId === me?.userId ? me?.nicknameColor || "" : subscribedReplyerUser?.nicknameColor || ""} !important`,
										// 											cursor: "pointer"
										// 										}}
										// 									>
										// 										{subscribedReplyerUser?.nickname}
										// 									</Typography>
										// 									{replyMessage ?
										// 										<EllipsisText
										// 											sx={messageStyles}
										// 											text={replyMessage.message}
										// 											length={30}
										// 										/>
										// 										:
										// 										<Typography color='error' sx={{}}>Сообщение
										// 											удалено
										// 										</Typography>
										// 									}
										// 								</Box>
										// 							</Box>
										// 							}
										// 						</Box>
										// 						{message.images &&
										// 						<ImageList
										// 							sx={isMobile ? { width: "100%" } : {}}
										// 							cols={isMobile ? 1 : message.images.length > 2 ? 3 : message.images.length}
										// 						>
										// 							{message.images.map(({ imageRef, url }, i) => {
										// 								return <ImageListItem
										// 									onClick={() => {
										// 										setIndexOfOpenedImage(i);
										// 										setGalleryImages(message.images!.map(({ url }) => {
										// 											return {
										// 												original: url,
										// 												thumbnail: url
										// 											};
										// 										}));
										// 										setIsGalleryOpen(true);
										// 									}}
										// 									key={url}
										// 									sx={{
										// 										borderRadius: 2,
										// 										overflow: "hidden",
										// 										mt: 1,
										// 										mx: 0.5,
										// 										cursor: "pointer"
										// 									}}
										// 								>
										// 									<img style={{ height: "300px" }} src={url}/>
										// 								</ImageListItem>;
										// 							})}
										// 						</ImageList>
										// 						}
										// 						<TextField
										// 							fullWidth
										// 							sx={{ div: { px: 1, mb: 1 } }}
										// 							variant={"standard"}
										// 							onChange={(e) => setMessageInputValue(e.target.value)}
										// 							multiline defaultValue={message.message}
										// 						/>
										// 						<Button
										// 							sx={{ mx: 1 }}
										// 							color={"success"}
										// 							onClick={() => {
										// 								changeMessage(message);
										// 							}}>
										// 							<DoneIcon/>
										// 						</Button>
										// 						<Button
										// 							color={"error"}
										// 							onClick={() => {
										// 								setChangingMessageId("");
										// 								setMessageInputValue("");
										// 							}}
										// 						>
										// 							<CloseIcon/>
										// 						</Button>
										//
										// 					</Box>
										// 				}
										// 			</Box>
										// 		</Box>
										// 	</ListItem>
										// );
									}


									return (
										<ListItem key={messageId}>
											{messageText}
										</ListItem>
									);


								})}
							</List>
						</ListItem>
					);


				})}
				{/*{replyMessages && messagesWhichOnProgress && messagesWhichOnProgress.map((message, i) => {*/}
				{/*    console.log(message)*/}
				{/*    const {userId, messageId, messageType} = message*/}
				{/*    const subscribedUser = subscribedUsers[userId]*/}
				{/*    const isMessageBeforeIsMine = messages[i - 1]?.userId === message.userId*/}
				{/*    const isMessageAfterThisMine = messages[i + 1]?.userId === message.userId*/}
				{/*    const isMessageChanging = message.messageId === changingMessageId*/}

				{/*    const subscribedReplyerUser = message.messageType === messagesExemplar.replyMessage ? subscribedUsers[message.replyer!.userId] : null*/}
				{/*    const replyMessage = message.messageType === messagesExemplar.replyMessage ? replyMessages[message.replyer!.messageId] : null*/}

				{/*    return (*/}
				{/*        <ListItem*/}
				{/*            sx={{...messageListItem(isMobile), position: 'relative', py: 2}}*/}
				{/*            key={message.createdAt}*/}
				{/*            className={'messageItem'}*/}

				{/*        >*/}
				{/*            <Loader background='rgba(18, 18, 18, 0.5)'/>*/}
				{/*            <Box sx={avatarWrapper}>*/}
				{/*                {!isMessageAfterThisMine ? <Avatar sx={{width: 50, height: 50}} src={subscribedUser?.photoURL} alt="avatar"/> : <Box sx={{width: 50}}/>}*/}
				{/*            </Box>*/}

				{/*            <Box className='message' sx={messageWrapper(isMessageBeforeIsMine, isMessageAfterThisMine, isMobile, userStyles?.messagesBorderRadius, userStyles.secondBackgroundColor, userStyles.theme)}>*/}
				{/*                {replyMessage &&*/}
				{/*                    <Box sx={messageContainer}>*/}
				{/*                        <Box sx={messageLeftLine} />*/}
				{/*                        <Box sx={{cursor: 'pointer'}}>*/}
				{/*	                        <Typography sx={{color: `${subscribedReplyerUser?.userId === me?.userId ? me?.nicknameColor || '' : subscribedReplyerUser?.nicknameColor || ''} !important`, cursor: 'pointer' }}>{subscribedReplyerUser?.nickname}</Typography>*/}
				{/*                      {replyMessage ?*/}
				{/*                          <EllipsisText sx={messageStyles} text={replyMessage.message} length={30}/>*/}
				{/*                          :*/}
				{/*                          <Typography color='error' sx={{}}>Сообщение удалено</Typography>*/}
				{/*                      }*/}
				{/*                        </Box>*/}
				{/*                    </Box>*/}
				{/*                }*/}
				{/*                <Typography sx={{color: subscribedUser ? subscribedUser?.nicknameColor : '', cursor: 'pointer', display: 'inline-block', wordBreak: 'break-all'}} variant={'subtitle1'}>*/}
				{/*                    {subscribedUser?.nickname || userId}*/}
				{/*                </Typography>*/}
				{/*                {message.images &&*/}
				{/*                    <ImageList sx={{ width: '100%' }} cols={isMobile ? 1 : 3} >*/}
				{/*                    {message.images.map((image) => {*/}
				{/*                        return <ImageListItem key={image} sx={{borderRadius: 2, overflow: 'hidden', mt: 1, mx: 0.5}}>*/}
				{/*                            <img src={image}/>*/}
				{/*                        </ImageListItem>*/}
				{/*                    })}*/}
				{/*                    </ImageList>*/}
				{/*                }*/}
				{/*                <Typography sx={messageStyles} variant={'body1'}>*/}
				{/*                    {message.message}*/}
				{/*                </Typography>*/}
				{/*            </Box>*/}
				{/*        </ListItem>*/}
				{/*    )*/}
				{/*})}*/}

			</List>
		</>
	);

});


export default Messages;