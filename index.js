
const express = require('express')
const admin = require("firebase-admin");
const otpGenerator = require('otp-generator')
const nodemailer = require("nodemailer");

require('dotenv').config()

const app = express()

app.use(express.static('public'));
app.use(express.json())

var serviceAccount = require("./service_account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db=admin.firestore()
db.settings({ ignoreUndefinedProperties: true })

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'yourmail@yourmail.com',
      pass: 'pass',
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });

app.get('/sotp', (req, res) => {
    res.sendFile(__dirname + '/public/sendOtp.html');
});
app.get('/firebase-config.js', (req, res) => {
    res.sendFile(__dirname + '/firebase-config.js');
});
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});
app.get('/votp', (req, res) => {
    res.sendFile(__dirname + '/public/verifyOtp.html');
});
app.post('/sendOtp', async(req,res)=>{
const { email, username, password, phone } = req.body;
console.log('Received request with email:', email);
if (!email) {
    return res.status(400).json({ status: "failed", message: "Recipient email not provided" });
  }
const code = otpGenerator.generate(6, { 
    upperCase: false,
    specialChars: false,
    alphabets: false,
    digits: true
});

let mailOptions = {
    from: 'Mahiyadav1931@gmail.com',
    to: email,
    subject: 'OTP To Complete Your Signup',
    html: `
    <html> 
    <h1>Hi,</h1>
     <br/>
     <p style="color:grey; font-size:1.2em">Please use the below OTP code to complete your account setup on My App</p>
     <br>
     <br>
     <h1 style="color:orange">${code}</h1>
     </html>`
    };
  
try{

    // 2 minutes
    var expiryDate=Date.now()+180000
    
    console.log(`DATE: ${expiryDate}`)

    try{
       await transporter.sendMail(mailOptions)
       await db.collection("otps").doc(email).set({
                email:email,
                username:username,
                password:password,
                phone:phone,
                otp:code,
                expiry: expiryDate
            })
                return res.json({
                status:"success",
                message:"OTP has been sent to the provided email."
            })
    }catch(e){
        console.log(e)
        return res.json({status:"failed", message:"Unable to send email at the momment"})
    }
    

}catch(error){
    return res.json({
        status:"failed",
        message:`Unknown error occured:${error}`
    })
}

})

app.post('/verifyOTP', async(req,res)=>{
    const db=admin.firestore()
    const email = req.body.email
    const otp = req.body.otp

    const emailOtp = await db.collection("otps").doc(email).get()

    if(emailOtp.exists){
        const date = emailOtp.data().expiry
        if(Date.now() > date){
            return res.json({status:"failed", message:"Sorry this otp has expired!"})
        }else{
            const rOtp= emailOtp.data().otp
            if(otp == rOtp){
                return res.json({status:"success", message:"OTP successfully confirmed!"})
            }

            return res.json({status:"failed", message:"Sorry, the otp provided is not valid"})
        }
    }

return res.json({status:"failed", message:"OTP can not be verified at the moment!"})

})
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const db=admin.firestore()
    const email2 = req.body.email
    const pass2 = req.body.password
    try {
        if(email==email2 && password==pass2){
        return res.json({ status: 'success', message: 'Login successful' });
        }
    } catch (error) {
        console.error('Login failed', error);
        return res.json({ status: 'failed', message: 'Invalid credentials' });
    }
});

app.get('/home', (req, res)=>{
    return res.send('Email OTP API')
})


const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`Listening to port ${PORT}`)
})