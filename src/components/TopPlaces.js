import { List, ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';


const TopPlaces = ({ items, userCity, onItemClick }) => {

    return (
        <div style={{
            maxWidth: 400,
            maxHeight: '80vh',
            position: 'absolute',
            left: 55,
            top: 15,
            bottom: 15,
            overflow: 'auto',
            borderRadius: 10,
            boxShadow: '2px',
            backgroundColor: 'white',
            opacity: 0.8,
            zIndex: 1000
        }}>
            <Typography variant="h6" style={{
                fontWeight: 'bold',
                color: '#333',
                padding: '10px 16px',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10
            }}>
                {`Top Places in ${userCity}`}
            </Typography>

            <List component="nav" aria-label="main mailbox folders">
                {items.map((item, index) => (
                    <ListItem button key={index} onClick={() => onItemClick(item.lat, item.lng)}>
                        <ListItemIcon>
                            <PlaceIcon/>
                        </ListItemIcon>
                        <ListItemText primary={item.name}/>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default TopPlaces;
