import { Container, Grid, Typography } from '@mui/material';
import React from 'react';

const About = () => {
    return (
        <Container sx={{}}>
            <Grid  container pt={5} pb={5} sx={{textAlign: 'center', flexDirection: 'column', alignItems: 'center'}}>
                <Grid xs={8} item>
                    <Typography variant='h4'>
                        Про чат
                    </Typography>
                </Grid>
                <Grid xs={8} item>
                    <Typography variant='subtitle1'>
                        Ну... это чат
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
