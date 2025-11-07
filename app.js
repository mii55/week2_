
const express = require('express');
const app = express();
const itemModel = require('./models/item');

// Example middleware: logs request method and URL
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next();
});

// Lightweight CORS middleware so the React dev server (different origin) can call this API
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
	if (req.method === 'OPTIONS') return res.sendStatus(200)
	next()
})

// Parse JSON bodies (for POST requests)
app.use(express.json());

// Default page
app.get('/', (req, res) => {
	res.send('Welcome to the LW Tech!');
});

// About page
app.get('/about', (req, res) => {
	res.send('This is the About Page.');
});

// Contact page
app.get('/contact', (req, res) => {
	res.send('Contact us at contact@example.com');
});

// Example POST handler
app.post('/contact', (req, res) => {
	const { name, message } = req.body;
	res.send(`Thank you, ${name}. Your message: "${message}" has been received.`);
});

// Items API
// GET /items - list all items
app.get('/items', async (req,res)=>{
	try{
		const rows = await itemModel.list();
		res.json(rows);
	}catch(err){
		console.error("GET /items error",err);
		res.status(500).json({error:'Internal server error'});
	}
})

// GET /items/:id - get single item
app.get('/items/:id',async (req, res) => {
	try{
		const it = itemModel.get(req.params.id)
		if (!it) return res.status(404).json({ error: 'Item not found' })
		res.json(it)	
	}catch(err){
		console.error("GET /items/:id error",err);
		res.status(500).json({error:'Internal server error'});
	}
	
})

// POST /items - create new item
app.post('/items',async (req, res) => {
	try{
		const validation = itemModel.validate(req.body)
		if (!validation.valid) return res.status(400).json({ error: validation.error })
		const created = itemModel.create(req.body)
		res.status(201).json(created)
	}catch(err){
		console.error("POST /items error",err);
		res.status(500).json({error:'Internal server error'});
	}
	
})

// PUT /items/:id - update existing item
app.put('/items/:id', async (req, res) => {
	try{
		const existing = itemModel.get(req.params.id)
		if (!existing) return res.status(404).json({ error: 'Item not found' })
		const validation = itemModel.validate({ name: req.body.name ?? existing.name, description: req.body.description ?? existing.description })
		if (!validation.valid) return res.status(400).json({ error: validation.error })
		const updated = itemModel.update(req.params.id, req.body)
		res.json(updated)
	}catch(err){
		console.error("PUT /items/:id error",error);
		res.status(500).json({error:'Internal server error'});
	}
	
})

// DELETE /items/:id - delete item
app.delete('/items/:id',async (req, res) => {
	try{
		const existing = itemModel.get(req.params.id)
		if (!existing) return res.status(404).json({ error: 'Item not found' })
		itemModel.delete(req.params.id)
		res.status(204).end()	
	}catch(err){
		console.error("DELETE /items/:id error",error);
		res.status(500).json({error:'Internal server error'});
	}
	
})

const PORT = 3000;

if (require.main === module) {
	app.listen(PORT, () => {
		console.log(`Express server running at http://localhost:${PORT}`);
		
	});
}

module.exports = app