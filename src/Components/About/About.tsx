import {Button, Container, Grid, Typography} from '@mui/material';
import React, {FC, useContext} from 'react';
import {NavLink} from "react-router-dom";
import {Context} from "../../index";
import {aboutContainer, aboutSecton} from "./AboutStyles";

const About: FC = () => {

    const {user} = useContext(Context)!

    return (
        <Container component={'section'} sx={aboutSecton}>
            <Grid container sx={aboutContainer}>
                <Grid xs={12} item>
                    <Typography variant='h4'>
                        Про проект
                    </Typography>
                </Grid>
                <Grid xs={12} item>
                    <Typography variant='h6'>
                        Веб-сайт представляет из себя приложение, которое позволяет
                        создавать беседы и общатся в них между людьми в реальном времени
                    </Typography>
                </Grid>
                <Grid xs={12} item>
                    <Typography  variant='h6'>
                        Можно создать свой чат или присоединиться, во время создания можно установить
                        аватар, название и описание сервера, тоже самое возможно при редактировании созданого чата
                    </Typography>
                </Grid>
                {!user &&
                    <Grid xs={12} item>
                        <Button sx={{my: 1, py: 1}} variant={'outlined'}>
                            <NavLink style={{color: 'inherit', textDecoration: 'none'}} to={'/login'}>
                                Что бы пользоватся веб-сайтом необходимо войти спомощью Google
                            </NavLink>
                        </Button>
                    </Grid>
                }
                {/*<Grid xs={12} item>*/}
                {/*    <Typography variant='h6'>*/}
                {/*        Когда вы войдетё в существующий или созданый чат, слева в углу будет id этого чата по которому люди могут войти через поиск в этот чат*/}
                {/*    </Typography>  */}
                {/*</Grid>               */}
            </Grid>
        </Container>
    );
}

export default About;
