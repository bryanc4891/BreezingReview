import React, {useEffect, useState} from 'react';
import { DataGrid } from '@mui/x-data-grid';

const GenericList = ({items, title, renderItem}) => {
    const columns = [
        { field: 'attendees', headerName: 'Attendees List', width: 300
        },
        {
            field: 'place',
            headerName: 'Place name',
            width: 150,
            editable: false,
        },
        {
            field: 'time',
            headerName: 'Time of Meeting',
            width: 150,
            editable: false,
        }
    ];    

    console.log('items', items);

    const rows = items.map(item => {
        return {id: item[0],time: item[1], attendees: item[2], place: item[3]}
    });
    
    return (
       <div style={{height: 400, width: '100%'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0, pageSize: 5},
                    },
                }}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
            />
        </div>
    )
}

export default GenericList