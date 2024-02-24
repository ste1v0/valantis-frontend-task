import generateDate from '../utils/generateDate'
import axios from 'axios'

export default function getBrands() {
	return axios.post('https://api.valantis.store:41000/', 
		{
			action: 'get_fields',
			params: {
				field: 'brand'
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