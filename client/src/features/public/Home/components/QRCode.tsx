import TextField from "@mui/material/TextField";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"

const QRCode = () => {
  return (
    <>
    <h3>Create a QR Code</h3>
        <p>Enter your QR Code destination</p>
        <TextField
          id="outlined-basic"
          variant="outlined"
          placeholder="https://long-link.com/qr-code-it"
        />
        <button>Sign Up and get your QR Code</button>
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

export default QRCode
