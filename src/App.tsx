import { useState, useEffect } from 'react'
import md5  from 'md5'
import './App.css'
import Item from './components/Item'

function App() {

	const [ ids, setIds ] = useState([])
	const [ items, setItems ] = useState([])
	const [ loadingIds, setLoadingIds ] = useState(null)
	const [ loadingItems, setLoadingItems ] = useState(null)
	const [ itemIdClicked, setItemIdClicked ] = useState(false)

	const currentDate = new Date()
	const currentYear = currentDate.getFullYear()
	const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0')
	const currentDay = currentDate.getDate()

	const password = process.env.API_PASSWORD

	const key = md5(`${password}_${currentYear}${currentMonth}${currentDay}`)

	useEffect(() => {
		setLoadingIds(true)
		fetch('http://api.valantis.store:40000?', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Auth': key
			},
			body: JSON.stringify( {
				action: 'get_ids',
				params: {
					limit: 50
				}
			})
		})
			.then(res => {
				if (res.ok) {
					return res.json()
				} else {
					throw new Error(`Whoops, the API has returned an error :( Code: ${res.status} Error Text: ${res.statusText}`)
				}
			})
			.then(data => {
				const uniqueValues = new Set(data.result)
				setIds([...uniqueValues])
				setLoadingIds(false)
			})
	}, [])

	useEffect(() => {
		if (ids.length > 0) {
			setLoadingItems(true)
			fetch('http://api.valantis.store:40000?', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Auth': key
				},
				body: JSON.stringify( {
					action: 'get_items',
					params: {
						ids: ids
					}
				})
			})
				.then(res => {
					if (res.ok) {
						return res.json()
					} else {
						throw new Error(`Whoops, the API has returned an error :( Code: ${res.status} Error Text: ${res.statusText}`)
					}
				})
				.then(data => { 
					setItems(data.result)
					setLoadingItems(false)
				})
		}
	}, [ids])

	return (
		<>
			{(loadingIds || loadingItems) && 
				<div className="app__loader-container">
					<p className="app__loader">{loadingIds ? 'Loading IDs' : 'Loading products'}</p>
				</div>
			}
			{!loadingIds && !loadingItems &&
				<div className="app__items-container">
					{items.map(e => {
						return (
							<Item key={e.id} brand={e.brand} price={e.price} product={e.product} id={e.id} />
						)
					})}
				</div>
			}
		</>
	)
}

export default App
