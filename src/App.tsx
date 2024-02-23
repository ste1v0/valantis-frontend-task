import { useState, useEffect } from 'react'
import md5 from 'md5'
import './App.css'
import Item from './components/Item'
import ItemProps from './types/ItemProps'

function App() {

	const [ ids, setIds ] = useState<string[]>([])
	const [ items, setItems ] = useState<ItemProps[]>([])
	const [ loadingIds, setLoadingIds ] = useState<boolean>(false)
	const [ loadingItems, setLoadingItems ] = useState<boolean>(false)

	const password = process.env.API_PASSWORD

	function generateDate() {
		const timeElapsed = Date.now()
		const today = new Date(timeElapsed)
		
		const currentYear = today.getUTCFullYear()
		const currentMonth = (today.getUTCMonth() + 1).toString().padStart(2, '0')
		const currentDay = today.getUTCDate()

		return md5(`${password}_${currentYear}${currentMonth}${currentDay}`)
	}

	useEffect(() => {
		const key = generateDate()
		setLoadingIds(true)
		fetch('https://api.valantis.store:41000', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Auth': key	
			},
			body: JSON.stringify( {
				action: 'get_ids',
				params: {
					limit: 60
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
				const uniqueIds = new Set<string>(data.result)
				const uniqueArray = Array.from(uniqueIds)
				setIds(uniqueArray)
				setLoadingIds(false)
			})
	}, [])

	useEffect(() => {
		if (ids.length > 0) {
			const key = generateDate()
			setLoadingItems(true)
			fetch('https://api.valantis.store:41000/', {
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
					for (const id of ids.slice(0, 50)) {
						const result = data.result.find((e : ItemProps) => e.id === id)
						if (result) {
							setItems(prevValue => [...prevValue, result])
						}
					}
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
