import { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import accident from '../../accident.png'
function TestInput() {
    const [fields, setFields] = useState([""]);

    const handleAddField = () => {
        setFields([...fields, ""]);
    };

    const handleRemoveField = (index: number) => {
        const filteredFields = fields.filter((_, i) => i !== index);
        setFields(filteredFields);
    };

    return (
        <IconButton style={{scale:'0.3'}}>
        <img src={accident} style={{}}/>
    </IconButton>
    );
}

export default TestInput;