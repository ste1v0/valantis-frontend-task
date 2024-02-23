import { useState, useEffect } from 'react'
import './App.css'
import Item from './components/Item'
import ItemProps from './types/ItemProps'
import getIds from './api/getIds'
import getItems from './api/getItems'
import Loader from './components/Loader'

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
		const itemsSet: Set<ItemProps> = new Set()
		setLoadingItems(true)
		getItems(ids).then(res => { 
			for (const id of ids.slice(0, 51)) {
			const uniqueObj = res.data.result.find((e : ItemProps) => e.id === id)
				if (uniqueObj) {
					itemsSet.add(uniqueObj)
				}
			}
		const itemsArr = Array.from(itemsSet)
		setItems(itemsArr)
		console.log(itemsArr.length)
		setLoadingItems(false)
		})
		}
	}, [ids])

	return (
		<>
			{(loadingIds || loadingItems) && <Loader loadingIds={loadingIds} />}

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
