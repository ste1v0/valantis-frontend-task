import { useState, useEffect } from 'react'
import './App.css'
import Item from './components/Item'
import ItemProps from './types/ItemProps'
import getIds from './api/getIds'
import getItems from './api/getItems'

function App() {

	const [ ids, setIds ] = useState<string[]>([])
	const [ items, setItems ] = useState<ItemProps[]>([])
	const [ loadingIds, setLoadingIds ] = useState<boolean>(false)
	const [ loadingItems, setLoadingItems ] = useState<boolean>(false)

	useEffect(() => {
		setLoadingIds(true)
		getIds().then(res => {
			setIds(res.data.result)
			setLoadingIds(false)
		})
	}, [])


	useEffect(() => {
		if (ids.length > 0) {
		setLoadingItems(true)
		getItems(ids).then(res => { 
			for (const id of ids.slice(0, 50)) {
			const result = res.data.result.find((e : ItemProps) => e.id === id)
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
