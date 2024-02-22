import { useState, useEffect } from 'react'
import md5  from 'md5'
import './App.css'

function App() {

	const [ ids, setIds ] = useState([])

	useEffect(() => {
		const currentDate = new Date()
		const currentYear = currentDate.getFullYear()
		const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0')
		const currentDay = currentDate.getDate()

		const password = process.env.API_PASSWORD

		const key = md5(`${password}_${currentYear}${currentMonth}${currentDay}`)

		fetch('http://api.valantis.store:40000?', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Auth': key
			},
			body: JSON.stringify( {
				action: 'get_ids'
			})
		})
			.then(res => {
				if (res.ok) {
					return res.json()
				} else {
					throw new Error(`Whoops, the API has returned an error :( Code: ${res.status} Error Text: ${res.statusText}`)
				}
			})
			.then(data => setIds(data.result))
	}, [])

	return (
		<>
			{ids.map(e => <p>{e}</p>)}
		</>
	)
}

export default App
