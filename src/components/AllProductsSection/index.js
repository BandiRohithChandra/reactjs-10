import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'
import FiltersGroup from '../FiltersGroup'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    isError: false,
    activeCategoryId: '',
    activeRatingId: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    const {
      searchInput,
      activeCategoryId,
      activeRatingId,
      activeOptionId,
    } = this.state
    this.setState({
      isLoading: true,
      isError: false,
    })
    const jwtToken = Cookies.get('jwt_token')

    const queryParams = new URLSearchParams({
      sort_by: activeOptionId,
      category: activeCategoryId,
      rating: activeRatingId,
      title_search: searchInput,
    })

    // TODO: Update the code to get products with filters applied
    const apiUrl = `https://apis.ccbp.in/products?${queryParams}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
      })
    } else {
      this.setState({
        isError: true,
        isLoading: false,
      })
    }
  }

  onSearch = event => {
    if (event.key === 'Enter') {
      this.getProducts()
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  onChangeSearchInput = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  onClickCategory = categoryId => {
    this.setState(
      {
        activeCategoryId: categoryId,
      },
      this.getProducts,
    )
  }

  onClickRating = ratingId => {
    this.setState(
      {
        activeRatingId: ratingId,
      },
      this.getProducts,
    )
  }

  onClickFiltersClear = () => {
    this.setState(
      {
        searchInput: '',
        activeCategoryId: '',
        activeRatingId: '',
      },
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    if (productsList.length === 0) {
      return this.renderNoProductsView()
    }

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderNoProductsView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
        className="noProducts"
      />
      <h1>No Products Found</h1>
      <p>We Could Not find other products. Try other filters</p>
    </div>
  )

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="failure"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>
        We are having some trouble processing your request.
        <br /> Please try again.
      </p>
    </div>
  )

  render() {
    const {isLoading, isError} = this.state

    let content

    if (isLoading) {
      content = this.renderLoader()
    } else if (isError) {
      content = this.renderFailureView()
    } else {
      content = this.renderProductsList()
    }

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          ratingsList={ratingsList}
          categoriesList={categoryOptions}
          onClickCategory={this.onClickCategory}
          onClickRating={this.onClickRating}
          onClickFiltersClear={this.onClickFiltersClear}
          onChangeSearchInput={this.onChangeSearchInput}
          onSearch={this.onSearch}
        />

        <div>{content}</div>
      </div>
    )
  }
}

export default AllProductsSection
