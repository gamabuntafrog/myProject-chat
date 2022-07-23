import { Container, Grid, Typography } from '@mui/material';
import React, {FC} from 'react';

const About: FC = () => {
    return (
        <Container sx={{}}>
            <Grid  container pt={5} pb={5} sx={{textAlign: 'center', flexDirection: 'column', alignItems: 'center'}}>
                <Grid xs={8} item>
                    <Typography variant='h4'>
                        Про проект
                    </Typography>
                </Grid>
                <Grid xs={8} item>
                    <Typography variant='subtitle1'>
                        Веб-сайт представляет из себя приложение, которое позволяет
                        создавать беседы и общатся в них между людьми в реальном времени
                    </Typography>
                </Grid>
                <Grid xs={8} item>
                    <Typography variant='body1'>
                        Можно создать свой чат или присоединиться 
                    </Typography>
                </Grid>
                <Grid xs={8} item>
                    <Typography variant='body1'>
                        Если вы не войдете в приложение через Google то у вас будет стандартное имя и фото, как и у всех других
                        невошедших в аккаунт, а так же вы не сможете удалять свои сообщения
                    </Typography>
                </Grid>
                <Grid xs={8} item>
                    <Typography variant='body1'>
                        Когда вы войдетё в существующий или созданый чат, слева в углу будет id этого чата по которому люди могут войти через поиск в этот чат
                    </Typography>  
                </Grid>               
            </Grid>
        </Container>
    );
}

export default About;
