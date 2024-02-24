export default function Loader( { loadingIds, loadingItems, loadingFields } : { loadingIds: boolean, loadingItems: boolean, loadingFields: boolean } ) {

    return (
    <div className="app__loader-container">
        {loadingIds && <p className="app__loader">Loading IDs</p>}
        {loadingItems && <p className="app__loader">Loading products</p>}
        {loadingFields && <p className="app__loader">Loading filters</p>}
    </div>
    )
}