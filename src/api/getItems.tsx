import generateDate from '../utils/generateDate'
import axios from 'axios'

export default function getItems(ids: string[]) {
	return axios.post('https://api.valantis.store:41000/', 
		{
			action: 'get_items',
			params: {
				ids: ids
			}
		},
		{
			headers: {
				'Content-Type': 'application/json',
				'X-Auth': generateDate()
			}
		})
		.then(res => res)
}