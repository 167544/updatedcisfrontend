import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import setdata from '../actions';
import setSelectedData from '../actions/setSetlecteddata';

function DashboardRepresentation(props) {
  const [rows, setRows] = React.useState([]);
  const [data1, setdata] = React.useState(true);
  const dataGridRef = React.useRef();
  const dispatch = useDispatch();

  const [columns, setColumns] = React.useState([
    { field: 'Employee ID', headerName: 'Employee ID', flex: 1 },
    { field: 'Employee Name', headerName: 'Employee Name', flex: 2 },
    { field: 'Band', headerName: 'Band',flex:0.5 },
    { field: 'Customer Name', headerName: 'Customer Name', flex: 2 },
    { field: 'Location Descr', headerName: 'Location Descr', flex: 2},
    { field: 'Resource Type', headerName: 'Resource Type', flex: 1 },
    { field: 'Category', headerName: 'Category', flex: 2 },
    { field: 'Primary Skill', headerName: 'Primary Skill', flex: 2 },
    { field: 'Skill Category for Primary Skill', headerName: 'Skill Category for Primary Skill', flex: 2 },
    { field: 'Skill Level for Primary Skill', headerName: 'Skill Level for Primary Skill', flex: 2 },
    { field: 'Tools Known', headerName: 'Tools Known', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 2,
      renderCell: (params) => (
        <div style={{ margin: "10px" }}>
          <button onClick={() => addedToShortlist(params.row['Employee ID'])} className='btn  m-1' style={{ backgroundColor: '#0A6E7C', color: 'white' }}>Add </button>
          <button onClick={() => RemoveFromList(params.row['Employee ID'])} className='btn m-1 ' style={{ backgroundColor: '#0A6E7C', color: 'white' }}>Remove </button>
        </div>
      ),
    },
  ]);


  const addedToShortlist = async (id) => {
    try {
      alert("Selected and added to selection list " + id);
      const response = await axios.put(`http://localhost:3004/addtoshortlist/${id}`);

    } catch (error) {
      console.error(error);
    }
  }

  const RemoveFromList = async (id) => {
    try {
      alert("Selected and added to selection list " + id);
      const response = await axios.put(`http://localhost:3004/removefromshorlist/${id}`);

    } catch (error) {
      console.error(error);
    }
  }


  const handleRefresh = (prevState) => {

    setdata((prevState) => !prevState);
    console.log(data1)
    if (dataGridRef.current) {
      dataGridRef.current.api.applyFilter({});
    }
  };

  
  

  React.useEffect(() => {
    const fetchData = async () => {
      try {

        console.log("prop" + props.data)
        if (props.data) {
          const response = await axios.get(`http://localhost:3004/fetchbasedOnCondition/${props.data}`);

          console.log(response.data)

          setRows(response.data);

        } else {
          const response = await axios.get(`http://localhost:3004/fetchdata`);

          console.log(response.data)

          setRows(response.data);

        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchEmpOnManager = async () => {
      try {
        const response = await axios.get(`http://localhost:3004/getMangersOFEmployee/${props.data.slice(0, -7)}`);
        dispatch(setSelectedData(response.data))

        setRows(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchEmpOnPrimaryskills = async () => {
      try {
        const response1 = await axios.get(`http://localhost:3004/primaryskills/${props.data.slice(0, -6)}`);
        dispatch(setSelectedData(response1.data))
        setRows(response1.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };


    const fetchEmpOnCategory = async () => {
      try {
        const response1 = await axios.get(`http://localhost:3004/category/${props.data.slice(0, -8)}`);
        dispatch(setSelectedData(response1.data))
        setRows(response1.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };





    if (props.data.slice(-7) === "manager") {
      fetchEmpOnManager();
    } else if (props.data.slice(-6) === "skills") {
      fetchEmpOnPrimaryskills();
    } else if (props.data.slice(-8) === "category") {
      fetchEmpOnCategory()
    }
    else {
      fetchData();
    }
  }, [props.data, data1]);
  
  const handleCellClick = (params, event) => {
    const clickedField = params.field;
    const updatedColumns = columns.map(column => {
      if (column.field === clickedField) {
        return { ...column, flex: 2};
      } else {
        return { ...column, flex: 1 };
      }
    });
    setColumns(updatedColumns);
  };


 
  const getRowId = (row) => row._id;

  return (
    <div>
      <div style={{ height: 500, width: "100%", padding: "10px" }}>
        {/* <button onClick={handleRefresh} className='btn btn-primary'>Refresh</button> */}



        <DataGrid
          rows={rows}
          columns={columns}
          components={{
            Toolbar: GridToolbar,

          }}
          componentsProps={{
            toolbar: {
              style: { backgroundColor: "#0A6E7C" }
            }
          }}
          getRowId={getRowId}
          apiRef={dataGridRef}
          onCellClick={handleCellClick}

        />
      </div>
    </div>
  );
}

export default DashboardRepresentation;
