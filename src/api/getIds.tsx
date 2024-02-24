import generateDate from '../utils/generateDate'
import axios from 'axios'

export default function getIds(selectedBrand = '') {
	return axios.post('https://api.valantis.store:41000/', 
		{
			action: !selectedBrand ? 'get_ids' : 'filter',
			params: !selectedBrand ? {
				limit: 60
			} : {
				brand: selectedBrand,
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