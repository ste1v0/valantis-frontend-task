import generateDate from '../utils/generateDate'
import axios from 'axios'

export default function getProducts() {
	return axios.post('https://api.valantis.store:41000/', 
	{
		action: 'get_fields',
		params: {
			field: 'product'
		}
	},
	{
		headers: {
			'Content-Type': 'application/json',
			'X-Auth': generateDate()
		}
	})
}