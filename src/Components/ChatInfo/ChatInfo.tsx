import React, {useState, useEffect, FC, useContext} from "react"
import {Avatar, Box, Button, List, ListItem, Typography} from "@mui/material";
import Modal from "../Modal";
import {NavLink, useHistory} from "react-router-dom";
import {arrayRemove, arrayUnion, doc, updateDoc} from "firebase/firestore";
import {Context} from "../../index";

const ChatInfo: FC<{id: string, chatName: string, chatImage: string, chatDescription: string, users: any}> = ({id, chatName, users, chatImage, chatDescription}) => {

    const {firestore, user} = useContext(Context)!
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usersArray, setUsersArray] = useState<any | null>(null);
    const [userModalInfo, setUserModalInfo] = useState<null | any>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const history = useHistory()

    useEffect(() => {
        if (users) {
            setUsersArray(Object.entries(users))
        }

    }, [users]);

    const unsubscribeFromChat = async () => {
        await updateDoc(doc(firestore, 'users', `${user?.userId}`), {
            subscribedChats: arrayRemove(id)
        })
        await updateDoc(doc(firestore, 'chats', `${id}`), {
            users: arrayRemove({
                userId: user?.userId
            })
        })
        history.push('/search')
    }

    return (
        <Box >
            <Box sx={{my: 1, mx: 1, display: 'flex'}} >
                <Typography sx={{my: 1, mx: 1}} variant={'body1'}>{id} | {chatName}</Typography>
                <Button onClick={() => setIsModalOpen(true)} sx={{ml: 1}}>Информация</Button>
            </Box>
            {isModalOpen &&
		        <Modal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
			        <Box sx={{textAlign: 'center'}}>
                            <Avatar sx={{width: '200px', height: '200px', mb: 3, mx: 'auto'}} src={chatImage}/>
                            <Typography variant={'h2'} sx={{fontWeight: '800'}}>{chatName}</Typography>
                            <Typography variant={'subtitle1'} sx={{my: 3}}>{chatDescription}</Typography>
                            <Button onClick={unsubscribeFromChat} color={'error'}>Выйти с чата</Button>
                            <Typography variant='h5'>Пользователи ({usersArray.length}):</Typography>
                            <List sx={{width: '100%'}}>
                          {usersArray?.map((el: any, i: number) => {
                              const user = el[1]
                              const {bio, userId, nickname, photoURL} = user

                              return <ListItem className={'typography'} onClick={() => {
                                  setUserModalInfo(user)
                                  setIsUserModalOpen(true)
                              }} sx={{display: 'flex',  justifyContent: 'center'}} key={i}>
                                  <Avatar sx={{width: '50px', height: '50px'}} src={user.photoURL}/>
                                  <Typography sx={{ml: 1}} >
                                      {nickname}
                                  </Typography>

                              </ListItem>
                          })}
							        </List>
                    </Box>
		        </Modal>
            }
            {isUserModalOpen &&
		        <Modal isModalOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)}>
			        <Avatar sx={{width: 200, height: 200}} src={`${userModalInfo.photoURL}`} alt="avatar"/>
			        <NavLink style={{color: 'white'}} to={`/user/${userModalInfo.userId}`}>
				        <Typography sx={{mt: 1}} variant={'h5'}>{userModalInfo.nickname}</Typography>
			        </NavLink>
			        <Typography  variant={'subtitle1'}>{userModalInfo.bio}</Typography>
		        </Modal>
            }
        </Box>
    )
}

export default ChatInfo