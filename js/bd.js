import Dexie from 'dexie'

const db = new Dexie('main')
db.version(1).stores({
	row: `sitio, usuario, password`
})


export default db