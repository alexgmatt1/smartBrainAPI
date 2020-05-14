const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt-nodejs')
const register = require('./controllers/register.js')

const app = express()
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'Bandito13?',
    database : 'smartbrain'
  }
});


app.use(express.json())
app.use(cors())


const database = {

	users: [

	{
		id : '123',
		name: 'John',
		email: 'john@gmail.com',
		password: 'cookies',
		entries: 0,
		joined: new Date(),
	},
	{
		id : '241',
		name: 'Alex',
		email: 'alex@gmail.com',
		password: 'hello',
		entries: 0,
		joined: new Date(),
	}
	]
}




app.get('/',(req,res) => {
	res.send(console.log(it is working!))
})

app.post('/signin',(req,res) => {
	const {email, password } = req.body
	
	db.select('email','hash').from('login')
	.where('email','=',email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password,data[0].hash);
		if (isValid) {
			return db('users').select('*').where('email','=',email)
			.then(user => res.json(user[0])).catch(err => res.json('unable to get user'))
		} else {
			res.status(400).json('Not Correct')
		}
	}).catch(err => console.log(err))
	/*res.json('incorrect credentials'))*/
})


app.post('/register',(req,res) => {register.handleRegister(req,res,db,bcrypt) })
	

	

app.get('/profile/:id',(req,res) => {
	const {id} = req.params

	db.select('*').from('users').where({id}).
	then(user => { if (user.length) {
		res.json(user[0])
	} else {
		res.json('not found') }
	})
})

app.put('/image',(req,res) => {
	const {id} = req.body
	db('users').where('id','=',id)
	.increment('entries',1)
	.returning('entries')
	.then(entries => {
		res.json(entries)
	})
	.catch(err => res.status(400).json('ERROR'))
})




app.listen(3000)