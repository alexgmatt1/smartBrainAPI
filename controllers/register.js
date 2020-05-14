

const handleRegister = (req,res,db,bcrypt) => {

	const {email,name,password} = req.body
		hash = bcrypt.hashSync(password)
		db.transaction( trx => {
			trx.insert({
				hash:hash,
				email:email,
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
				.returning('*')
				.insert({
					name:name,
					email:email,
					joined: new Date()
				})
				.then(user=> {res.json(user[0])}) 
			})
				.then(trx.commit).catch(trx.rollback)
			}).catch(err => res.json(err))

		}

module.exports {
	handleRegister : handleRegister
}