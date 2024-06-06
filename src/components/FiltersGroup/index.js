import './index.css'

const FiltersGroup = props => {
  const {
    categoriesList,
    ratingsList,
    onClickCategory,
    onClickRating,
    onClickFiltersClear,
    onChangeSearchInput,
    searchInput,
    onSearch,
  } = props
  return (
    <div className="filters-group-container">
      <h1>Filters Group</h1>
      <input
        type="search"
        value={searchInput}
        onChange={onChangeSearchInput}
        onKeyDown={onSearch}
      />
      <h1>Category</h1>
      <ul>
        {categoriesList.map(eachCategory => (
          <li key={eachCategory.categoryId}>
            <button
              type="button"
              onClick={() => onClickCategory(eachCategory.categoryId)}
            >
              {eachCategory.name}
            </button>
          </li>
        ))}
      </ul>

      <p>Rating</p>
      <ul>
        {ratingsList.map(eachRating => (
          <li key={eachRating.ratingId}>
            <button
              type="button"
              onClick={() => onClickRating(eachRating.ratingId)}
            >
              <div className="rating-container">
                <img
                  src={eachRating.imageUrl}
                  alt={`rating-${eachRating.ratingId}`}
                  className="rating"
                />
                <p>& up</p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <button type="button" className="button" onClick={onClickFiltersClear}>
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
