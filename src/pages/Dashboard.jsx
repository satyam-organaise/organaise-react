import { Button, TextField, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react'
import FileUploadModal from '../components/FileUploadModal/FileUploadModal';
import LeftSideBar from '../components/LeftSideBar/LeftSideBar'
import Typography from '@mui/material/Typography'


//Index prop defiend by according to this array
//['dashboard', 'message', 'folder', 'data', 'privacy-policy', 'settings'];


const Dashboard = () => {
    const [open, setOpen] = useState(false);
    const [jsonData, setJsonData] = useState([]);
    const [textValue, setTextValue] = useState("");
    const [filterDataCreate, setFilterDataCreate] = useState([]);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const typeFind = (str) => {
        if (/[a-zA-Z]/.test(str) && /[0-9]/.test(str)) {
            return "XYZ";
        } else if (/[a-zA-Z]/.test(str)) {
            return "ABC";
        } else if ((/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(str)) || (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(str))) {
            return "D&T";
        } else if (/[0-9]/.test(str)) {
            return "123";
        }
        else {
            return "UN"
        }


    }

    const searchData = (inputVal) => {
        let splitText = inputVal.trim().replace(/\s+/g, ' ').split(" ");
        if ((splitText[0] === "find") && splitText.length === 2) {
            setFilterDataCreate([])
            let ColVal = splitText[1];
            let dataFilter = jsonData.filter((fd, indexVal) => indexVal !== 0 && fd.includes(ColVal));
            console.log(ColVal, dataFilter);
            setFilterDataCreate([jsonData[0], ...dataFilter])
        }

        let splitStr2 = inputVal.trim().replace(/\s+/g, ' ').split("less than");
        if (jsonData[0].includes(splitStr2[0].trim()) && splitStr2.length === 2) {
            let colIndex = jsonData[0].findIndex((a) => a === splitStr2[0].trim());
            let filterData = jsonData.filter((p) => p[colIndex] < Number(splitStr2[1].trim()));
            console.log(colIndex, filterData, "less")
            setFilterDataCreate([jsonData[0], ...filterData])
        }

        let splitStr3 = inputVal.trim().replace(/\s+/g, ' ').split("greater than");
        if (jsonData[0].includes(splitStr3[0].trim()) && splitStr3.length === 2) {
            let colIndex = jsonData[0].findIndex((a) => a === splitStr3[0].trim());
            let filterData = jsonData.filter((p) => p[colIndex] > Number(splitStr3[1].trim()));
            console.log(colIndex, filterData, "greater")
            setFilterDataCreate([jsonData[0], ...filterData])
        }

        let splitStr4 = inputVal.trim().replace(/\s+/g, ' ').split("equal to");
        if (jsonData[0].includes(splitStr4[0].trim()) && splitStr4.length === 2) {
            let colIndex = jsonData[0].findIndex((a) => a === splitStr4[0].trim());
            let filterData = jsonData.filter((p) => p[colIndex] == Number(splitStr4[1].trim()));
            console.log(colIndex, filterData, "equal", Number(splitStr4[1].trim()));
            setFilterDataCreate([jsonData[0], ...filterData])
        }
    }

    return (
        <>
            {/* <div>Dashboard</div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Open alert dialog
            </Button>
            <Grid>
                <TextField id="standard-basic"
                    label="Standard"
                    variant="standard"
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={() => searchData(textValue)}>
                    Search
                </Button>
            </Grid>

            <FileUploadModal open={open} handleClose={handleClose} setJsonData={setJsonData} />
            <table>
                {jsonData.length > 0 && jsonData.map((d, index) => (
                    <>
                        {index === 0 &&
                            <tr> {d.map((col, secondIndex) =>
                                <td
                                    style={{
                                        border: "1px solid #333",
                                        borderRadius: "5px",
                                        padding: "2px",
                                        fontSize: "13px",
                                        marginRight: "5px"
                                    }}>
                                    {col.replace(/-|_/g, " ")}
                                    <br />
                                    {typeFind(jsonData[index + 1][secondIndex])}
                                </td>)}
                            </tr>
                        }
                        {index < 8 && index !== 0 && <tr> {d.map((col) => <td style={{ borderRight: "1px solid #333", padding: "2px", fontSize: "13px", marginRight: "5px" }}>{col}</td>)}</tr>}
                    </>
                ))
                }
            </table>

            <br/>
            <br/>
            <br/>
            <br/>

            <table>
                {filterDataCreate.length > 0 && filterDataCreate.map((d, index) => (
                    <>
                        {index === 0 &&
                            <tr> {d.map((col, secondIndex) =>
                                <td
                                    style={{
                                        border: "1px solid #333",
                                        borderRadius: "5px",
                                        padding: "2px",
                                        fontSize: "13px",
                                        marginRight: "5px"
                                    }}>
                                    {col.replace(/-|_/g, " ")}
                                    <br />
                                    {typeFind(jsonData[index + 1][secondIndex])}
                                </td>)}
                            </tr>
                        }
                        {index < 8 && index !== 0 && <tr> {d.map((col) => <td style={{ borderRight: "1px solid #333", padding: "2px", fontSize: "13px", marginRight: "5px" }}>{col}</td>)}</tr>}
                    </>
                ))
                }
            </table> */}
            <LeftSideBar data={{pageName:"Dashboard",index: 0 }}>
                <Typography variant="h1" color="secondary.dark">DashBoard</Typography>
            </LeftSideBar>
        </>
    )
}

export default Dashboard