import generateDate from './generateDate'
import axios from 'axios'

export default function getIds() {
	return axios.post('https://api.valantis.store:41000/', 
		{
			action: 'get_ids',
			params: {
				limit: 60
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