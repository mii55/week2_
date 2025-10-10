const express=require('express');
const app = express();


//example middleware logs request method and URL
app.use((req,res,next)=>{
    console.log(`${req.method} ${req.url}`);
    next();
});

//Parse JSON bodies(for POST requests)
app.use(express.json());


//Default page
app.get('/',(req,res)=>{
    res.send('Welcome to the Home Page!');
});

//About Page
app.get('/about',(req,res)=>{
    res.send('This is the about page.');
});

//Contact Page
app.get('/contact',(req,res)=>{
    res.send('You wont believe what page this is(its the contact page)');
});

//Example Post Handler

app.post('/contact',(req,res)=>{
    const{name,message} =req.body;
    res.send(`Thank you, ${name}, Your message: "${message}" has been received.`);
});

const PORT = 3000;

app.listen(PORT,()=>{
    console.log(`Express server running at http://localhost:${PORT}`);
})


