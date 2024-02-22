import { useState } from 'react'
import ItemProps from '../types/ItemProps'

export default function Item( { brand, price, product, id } : ItemProps ) {

    const [ itemIdClicked, setItemIdClicked ] = useState<boolean>(false)

    function handleIdClick() {
		setItemIdClicked(prevValue => !prevValue)
	}

    return (
        <>
			<div className="app__item">
			<div className="app__item-img" />
			<h4 className="app__item-title">{brand ? `${brand}` : 'Brand unknown'}</h4>
			<p className="app__item-product">{product ? `${product}` : 'Product name unknown'}</p>
			<p className="app__item-price">{price ? `${price.toLocaleString("ru-RU", {style: 'currency', currency: 'RUB', minimumFractionDigits: 0})}` : 'Price upon request'}</p>
			<p className="app__item-id pointer" onClick={handleIdClick}>{itemIdClicked ? `${id}` : 'Show ID'}</p>
            </div>
        </>
    )
}