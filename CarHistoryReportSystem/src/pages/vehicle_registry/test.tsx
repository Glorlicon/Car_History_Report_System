import { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";

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
        <Container maxWidth="md" sx={{ mt: 8 }}>
            {fields.map((field, index) => (
                <div key={index}>
                    <TextField
                        value={field}
                        onChange={(e) => {
                            const updatedFields = [...fields];
                            updatedFields[index] = e.target.value;
                            setFields(updatedFields);
                        }}
                    />
                    <IconButton onClick={() => handleRemoveField(index)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            ))}
            <Button variant="contained" onClick={handleAddField} sx={{ mt: 2 }}>
                Add Field
            </Button>
        </Container>
    );
}

export default TestInput;