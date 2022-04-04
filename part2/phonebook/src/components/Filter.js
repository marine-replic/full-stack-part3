const Filter = ({ newSearch, handleSearchChange }) => (
    <form>
        <div>
            filter show with <input value={newSearch} onChange={handleSearchChange} />
        </div>
    </form>
)

export default Filter