import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
 
 export default function Header(){
    return(
        <>
            <List>
                <ListItem>
                    <ListItemText to="/home">
                        <Box><i class="ri-home-4-line"></i></Box>
                        <Typography>Home</Typography>
                    </ListItemText>
                </ListItem>

                <ListItem>
                    <ListItemText to="/home">
                        <Box><span class="material-icons">home</span></Box>
                        <Typography>Markets</Typography>
                    </ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemText to="/home">
                        <Box><span class="material-icons">home</span></Box>
                        <Typography>Futures</Typography>
                    </ListItemText>
                </ListItem>
                <ListItem>
                    <ListItemText to="/home">
                        <Box><span class="material-icons">home</span></Box>
                        <Typography>Perpetual</Typography>
                    </ListItemText>
                </ListItem>
            </List>
        </>
    )
}