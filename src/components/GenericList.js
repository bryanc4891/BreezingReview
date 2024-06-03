import React, {useEffect, useState} from 'react';
import { DataGrid } from '@mui/x-data-grid';

const GenericList = ({items, title, renderItem}) => {
    items.forEach(item => console.log(item));
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
    const rows = [
        { id:1, attendees: ["AGAM", "MICH"], place: 'SEAATTLE', time: "TODAY" },
        { id:2, attendees: ["AGAM", "Dariya"], place: 'Tacoma', time: "TOM" },
        { id:3, attendees: ["Bryan", "MICH"], place: 'US', time: "TODAY" },
        { id:4, attendees: ["DARIYA","Bryan", "MICH"], place: 'CALIFORNIA', time: "TODAY" }
    ];
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