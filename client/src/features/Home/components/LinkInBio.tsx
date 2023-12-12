import TextField from "@mui/material/TextField";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { useState } from "react"


const LinkInBio = () => {
    const [domain, setDomain] = useState("default");
    const handleDomainChange = (
        newValue: string
      ) => {
        setDomain(newValue);
      };
  return (
    <>
    <h3>Build a Link-in-bio page and showcase your links</h3>
        <p>Claim your Link-in-bio URL</p>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={domain}
          onChange={void handleDomainChange}
        >
          <MenuItem value={"default"}>Default</MenuItem>
          <MenuItem value={"custom"}>Custom</MenuItem>
        </Select>
        <TextField
          id="outlined-basic"
          placeholder="example: very important links"
          variant="outlined"
        />
        <button>Sign Up and create your page</button>
        <p>No credit card required. Your free plan includes:</p>
        <ul>
          <li>
            <CheckCircleOutlineIcon />
            <p>Short links</p>
          </li>
          <li>
            <CheckCircleOutlineIcon />
            <p>QR Codes</p>
          </li>
          <li>
            <CheckCircleOutlineIcon />
            <p>Link-in-bio page</p>
          </li>
        </ul>
        </>

  )
}

export default LinkInBio
