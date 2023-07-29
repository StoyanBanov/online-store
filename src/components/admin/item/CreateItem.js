import { editItemById } from '../../../data/services/itemService'
import { ItemForm } from './ItemForm'

export const CreateItem = () => {

    const values = {
        title: '',
        description: '',
        price: 0,
        count: 0,
        category: ''
    }

    return (
        <ItemForm defValues={values} submitCallback={editItemById} title={'Create'} />
    )
}