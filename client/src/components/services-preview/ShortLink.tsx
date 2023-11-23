
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import TextField from "@mui/material/TextField"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { useState } from "react"


const ShortLink = () => {
    const [domain, setDomain] = useState("default");
    const handleDomainChange = (
        newValue: string
      ) => {
        setDomain(newValue);
      };
  return (
    <>
    <h3>Shorten a long link</h3>
    <p>Paste a long URL</p>
    <TextField
      id="outlined-basic"
      placeholder="https://long-link.com/shorten-it"
      variant="outlined"
    />
    <div>
      <div>
        <p>Domain</p>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={domain}
          onChange={void handleDomainChange}
        >
          <MenuItem value={"default"}>Default</MenuItem>
          <MenuItem value={"custom"}>Custom</MenuItem>
        </Select>
      </div>
      <div>
        <p>Enter a back-half (optional)</p>
        <TextField
          id="outlined-basic"
          placeholder="example: favorite link"
          variant="outlined"
        />
      </div>
    </div>
    <p>End your link with words that will make it unique</p>
    <button>Sign Up and get your link</button>
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

export default ShortLink
