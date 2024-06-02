import React from 'react';
import { useUserProfile } from '../contexts/UserContext';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment';
import IconButton from '@mui/material/IconButton';
import { Stack } from '@mui/material';

const GenericList = ({items, title, renderItem}) => {
    items.forEach(item => console.log(item));
    return (
        <Stack spacing={4} sx={{width: '600px;', margin: 'auto'}}>
            {/* <h2>{{title}}</h2> */}
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {items.map((value) => (
            <ListItem
             key={value}
             disableGutters
             secondaryAction={
                 <IconButton aria-label="comment">
                    <CommentIcon />
                 </IconButton>
             }>
             <ListItemText primary={`Line item ${value.name}`} />
            {/* {renderItem ? renderItem(item) : <ListItemText primary={item} />} */}

            </ListItem>
        ))}
        </List>
        </Stack>
    )
}

export default GenericList