import { useState, useEffect } from 'react'
import './App.css'
import Item from './components/Item'
import ItemProps from './types/ItemProps'
import getIds from './api/getIds'
import getItems from './api/getItems'
import getBrands from './api/getBrands'
import getProducts from './api/getProducts'
import getPrices from './api/getPrices'
import Loader from './components/Loader'
// import PriceType from './types/priceType'

function App() {

	const [ ids, setIds ] = useState<string[]>([])
	const [ items, setItems ] = useState<ItemProps[]>([])
	const [ brands, setBrands ] = useState<string[]>([])
	// const [ products, setProducts ] = useState<string[]>([])
	// const [ prices, setPrices ] = useState<PriceType[]>([])
	const [ selectedBrand, setSelectedBrand ] = useState<string>('')
	const [ loadingIds, setLoadingIds ] = useState<boolean>(false)
	const [ loadingItems, setLoadingItems ] = useState<boolean>(false)
	const [ loadingFields, setLoadingFields ] = useState<boolean>(false)

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
			})
			.finally(() => setLoadingItems(false))
		}
	}, [ids])

	// useEffect(() => {
	// 	setLoadingFields(true)
	// 	getBrands().then(res => {
	// 		const result = res.data.result.filter((e : string) => e !== null)
	// 		const resultSet: Set<string> = new Set(result)
	// 		setBrands(Array.from(resultSet))
	// 	})
	// 	getProducts().then(res => {
	// 		const result = res.data.result.filter((e : string) => e !== null)
	// 		const resultSet: Set<string> = new Set(result)
	// 		// setProducts(Array.from(resultSet))
	// 	})
	// 	getPrices().then(res => {
	// 		const result = res.data.result.filter((e : number) => e !== null)
	// 		const resultSet: Set<number | string> = new Set(result)
	// 		// setPrices(Array.from(resultSet))
	// 	})
	// 	.finally(() => setLoadingFields(false))
	// }, [])

	useEffect(() => {
		if (selectedBrand !== '') {
			setLoadingItems(true)
			getIds(selectedBrand).then(res => {
				setIds(res.data.result)
			})
			.finally(() => setLoadingItems(false))
		}
	}, [selectedBrand])

	return (
		<>
			{(loadingIds || loadingItems || loadingFields) && <Loader loadingIds={loadingIds} loadingItems={loadingItems} loadingFields={loadingFields} />}

			{!loadingIds && !loadingItems && !loadingFields &&
				<div className="app__container">
					<div className="app__filters">
						<select className="app__select" value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
							<option value="">Choose brand</option>
							{brands.map(e => {
								return (
									<option value={e}>{e}</option>
								)
							})}
						</select>
					</div>
					<div className="app__items-container">
						{items.map(e => {
							return (
								<Item key={e.id} brand={e.brand} price={e.price} product={e.product} id={e.id} />
							)
						})}
					</div>
				</div>
			}
		</>
	)
}

export default App
