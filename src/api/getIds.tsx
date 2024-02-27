import generateDate from '../utils/generateDate'
import axios from 'axios'
import ItemProps from '../types/ItemProps'

export default function getIds(selectedFilters : ItemProps) {

	return axios.post('https://api.valantis.store:41000/', 
	{
		action: (selectedFilters.brand || selectedFilters.product || selectedFilters.price) ? 'filter' : 'get_ids',
		params: selectedFilters
	},
	{
		headers: {
			'Content-Type': 'application/json',
			'X-Auth': generateDate()
		}
	})
}