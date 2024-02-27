import generateDate from '../utils/generateDate'
import axios from 'axios'
import ItemProps from '../types/ItemProps'

export default function getIds({ brand, product, price, offset } : ItemProps) {

	const objParams = {
		brand: brand,
		product: product,
		price: price,
		offset: offset
	}

	function deleteEmpty<T>(obj: T): T {
		for (const key in obj) {
			if (!obj[key]) {
				delete obj[key]
			}
		}
		return obj
	}

	return axios.post('https://api.valantis.store:41000/', 
	{
		action: (brand || product || price) ? 'filter' : 'get_ids',
		params: (brand || product || price) ? deleteEmpty(objParams) : {offset: offset}
	},
	{
		headers: {
			'Content-Type': 'application/json',
			'X-Auth': generateDate()
		}
	})
}