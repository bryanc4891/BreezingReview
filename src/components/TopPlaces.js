import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import PlaceIcon from '@mui/icons-material/Place';


const TopPlaces = ({ items, onItemClick }) => {
    return (
        <div style={{
            width: 250,
            position: 'absolute',
            left: 55,
            top: 15,
            bottom: 15,
            overflow: 'auto',
            borderRadius: 10,
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1000
        }}>
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
