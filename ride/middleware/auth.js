const jwt=require('jsonwebtoken');
const axios=require('axios');
require('dotenv').config();

const auth=async()=>{
    try{
    const token =req.cookie.token || req.headers.authorization.split(' ')[ 1 ];
    
    if (!token) {
        return res.status(401).json({ message: 'no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const response = await axios.get(`${process.env.BASE_URL}/user/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const user = response.data;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user;

    next();
}
catch(err){
    console.error(err);
    res.status(500).json({messsage:"Internal Server Error",success:false});
}
}