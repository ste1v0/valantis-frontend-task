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

function App() {

	const [ ids, setIds ] = useState<string[]>([])
	const [ items, setItems ] = useState<ItemProps[]>([])
	const [ brands, setBrands ] = useState<string[]>([])
	const [ products, setProducts ] = useState<string[]>([])
	const [ prices, setPrices ] = useState<number[]>([])
	const [ selectedFilters, setSelectedFilters ] = useState({brand: '', product: '', price: 0, id: '', offset: 0})
	const [ searchTerm, setSearchTerm ] = useState('')
	const [ queryResults, setQueryResults ] = useState<string[]>([])
	const [ minPrice, setMinPrice ] = useState<number>()
	const [ maxPrice, setMaxPrice ] = useState<number>()
	const [ priceResults, setPriceResults ] = useState<number[]>([])
	const [ loadingIds, setLoadingIds ] = useState<boolean>(false)
	const [ loadingItems, setLoadingItems ] = useState<boolean>(false)
	const [ loadingFields, setLoadingFields ] = useState<boolean>(false)
	const [ currentPage, setCurrentPage ] = useState(1)
	const [ pages, setPages ] = useState(0)

	useEffect(() => {
		setLoadingIds(true)
		getIds(selectedFilters).then(res => {
			setIds(res.data.result)
			setPages(Math.ceil(res.data.result.length / 50))
		})
		.finally(() => {
			setLoadingIds(false)
		})
	}, [selectedFilters])

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

	useEffect(() => {
		setLoadingFields(true)
		getBrands().then(res => {
			const result = res.data.result.filter((e : string) => e !== null)
			const resultSet: Set<string> = new Set(result)
			setBrands(Array.from(resultSet))
		})
		getProducts().then(res => {
			const result = res.data.result.filter((e : string) => e !== null)
			const resultSet: Set<string> = new Set(result)
			setProducts(Array.from(resultSet))
		})
		getPrices().then(res => {
			const result = res.data.result.filter((e : number) => e !== null)
			const resultSet: Set<number> = new Set(result)
			setPrices(Array.from(resultSet))
		})
		.finally(() => setLoadingFields(false))
	}, [])

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setSearchTerm(e.target.value)
		const arr : string[] = []
		if (items.length > 0) {
			products.forEach(product => {
				if (product.includes(e.target.value)) {
					arr.push(product)
				}
			})
			setQueryResults(arr)
		}
	}

	function handleMaxPriceChange(e: React.ChangeEvent<HTMLInputElement>) {
		setMaxPrice(Number(e.target.value))

	}

	function handleMinPriceChange(e: React.ChangeEvent<HTMLInputElement>) {
		setMinPrice(Number(e.target.value))
	}

	function nextPage() {
		if (currentPage < pages) {
			setCurrentPage(prevValue => prevValue + 1)
			if (selectedFilters.offset) {
				setSelectedFilters(prevValue => ({...prevValue, offset: prevValue.offset + 50}))
			} else {
				setSelectedFilters(prevValue => ({...prevValue, offset: 50}))
			}
		}
	}

	function previousPage() {
		if (currentPage > 1) {
			setCurrentPage(prevValue => prevValue - 1)
			if (selectedFilters.offset) {
				setSelectedFilters(prevValue => ({...prevValue, offset: prevValue.offset - 50}))
			}
		}
	}

	useEffect(() => {
		setQueryResults([])
		const arr : number[] = []
		if (minPrice && maxPrice)
			prices.forEach(e => {
				if (e >= minPrice && e <= maxPrice) {
					arr.push(e)
				}
			})
			setPriceResults(arr)

	}, [minPrice, maxPrice])

	function handleReset() {
		setSearchTerm('')
		setQueryResults([])
		setSelectedFilters({brand: '', product: '', price: 0, id: '', offset: 0})
		setCurrentPage(1)
		setMinPrice(undefined)
		setMaxPrice(undefined)
	}

	return (
		<>
			{(loadingIds || loadingItems || loadingFields) && <Loader loadingIds={loadingIds} loadingItems={loadingItems} loadingFields={loadingFields} />}

			{!loadingIds && !loadingItems && !loadingFields &&
				<div className="app__container">
					<div className="app__filters">
						<h3 className="app__filters-title">By brand</h3>
						<div className="app__select">
							<select className="app__standard-select" value={selectedFilters.brand} onChange={e => {setSelectedFilters({brand: e.target.value, product: '', price: 0, id: '', offset: 0 }), setSearchTerm(''), setMaxPrice(undefined), setMinPrice(undefined)}}>
								<option value=''>Choose brand</option>
								{brands.map((e, index) => {
									return (
										<option key={index} value={e}>{e}</option>
									)
								})}
							</select>
						</div>
						<hr className="app__hr" />
						<h3 className="app__filters-title">By product</h3>
						<form onSubmit={e => e.preventDefault()}>
							<input className="app__standard-input" type="text" placeholder="Золотое кольцо" value={searchTerm} onChange={e => {handleInputChange(e), setPriceResults([])}}/>
						</form>
						<hr className="app__hr" />
							<h3 className="app__filters-title">By price</h3>
						<form onSubmit={e => e.preventDefault()}>
							<input className="app__standard-input__price" value={minPrice} onChange={(e) => handleMinPriceChange(e)} type="number" placeholder="0" />
							<input className="app__standard-input__price" value={maxPrice} onChange={(e) => handleMaxPriceChange(e)} type="number" placeholder="500000"/>
						</form>
						{(selectedFilters.brand !== '' || selectedFilters.product !== '' || selectedFilters.price !== 0) && <button className="app__reset-btn" onClick={handleReset}>Reset filter</button>}
					</div>
					{(selectedFilters.brand === '' && selectedFilters.product === '' && selectedFilters.price === 0) &&
						<div className="app__pagination">
							<button className="app__pagination-btn" onClick={previousPage}>Previous</button>
							<p className="app__pagination-page">{currentPage} of {pages}</p>
							<button className="app_pagination-btn" onClick={nextPage}>Next</button>
						</div>}
					<ul className="app__list">
						{priceResults.length > 0 && 
							priceResults.slice(0, 20).sort((a, b) => b - a).map((el, index) => {
								return (
									<li className="app__list-item pointer" value={el} key={index} onClick={() => setSelectedFilters({ price: el, brand: '', product: '', id: '', offset: 0})}>
										<span>
											{el}
										</span>
									</li>
								)
							})
						}
						{queryResults.length > 0 && 
							queryResults.slice(0, 5).map((el, index) => {
								return (
									<li className="app__list-item pointer" value={el} key={index} onClick={() => {setSelectedFilters({ product: el, brand: '', price: 0, id: '', offset: 0 }), setSearchTerm(el)}}>
										<span>
											{el}
										</span>
									</li>
								)
							})
						}
					</ul>
					<div className="app__items-container">
						{items.length > 0 && items.map(e => {
							return (
								<Item key={e.id} brand={e.brand} price={e.price} product={e.product} id={e.id} offset={e.offset}/>
							)
						})}
					</div>
				</div>
			}
		</>
	)
}

export default App
