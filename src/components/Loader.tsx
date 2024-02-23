export default function Loader( { loadingIds } : { loadingIds: boolean } ) {

    return (
        <div className="app__loader-container">
        <p className="app__loader">{loadingIds ? 'Loading IDs' : 'Loading products'}</p>
    </div>
    )
}