import { useEffect, useState } from "react"
import "./App.css"
import LoginForm from "./components/LoginForm"
import FirebaseAuthService from "./FirebaseAuthService"
import AddEditRecipeForm from "./components/AddEditRecipeForm"
import FirebaseFireStoreService from "./FirebaseFireStoreService"
import Loading from "./components/Loading"

function App() {
  const [user, setUser] = useState(null)
  const [currentRecipe, setCurrentRecipe] = useState(null)
  const [recipes, setRecipes] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState("")
  const [orderBy, setOrderBy] = useState("publishDateDesc")
  const [recipesPerPage, setRecipesPerPage] = useState(3)

  useEffect(() => {
    setIsLoading(true)
    fetchRecipes()
      .then((fetchRecipes) => {
        setRecipes(fetchRecipes)
      })
      .catch((error) => {
        console.error(error.message)
        throw error
      })
      .finally(() => setIsLoading(false))

      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, categoryFilter, orderBy, recipesPerPage])

  async function fetchRecipes(cursorId = "") {
    const queries = []

    // where句の設定
    if (categoryFilter) {
      queries.push({
        field: "category",
        condition: "==",
        value: categoryFilter,
      })
    }
    if (!user) {
      queries.push({
        field: "isPublished",
        condition: "==",
        value: true,
      })
    }

    // order句の設定
    const orderByField = "publishDate"
    let orderByDirection
    if (orderBy) {
      switch (orderBy) {
        case "publishDateAsc":
          orderByDirection = "asc"
          break
        case "publishDateDesc":
          orderByDirection = "desc"
          break
        default:
          break
      }
    }

    let fetchRecipes = []
    try {
      const response = await FirebaseFireStoreService.readDocuments({
        collection: "recipes",
        queries: queries,
        orderByField: orderByField,
        orderByDirection: orderByDirection,
        perPage: recipesPerPage,
        cursorId: cursorId,
      })
      const newRecipes = response.docs.map((recipeDoc) => {
        const id = recipeDoc.id
        const data = recipeDoc.data()
        data.publishDate = new Date(data.publishDate.seconds * 1000)

        return { ...data, id }
      })

      if (cursorId) {
        fetchRecipes = [...recipes, ...newRecipes]
      } else {
        fetchRecipes = [...newRecipes]
      }
    } catch (error) {
      console.error(error.message)
      throw error
    }

    return fetchRecipes
  }

  function handleRecipesPerPageChange(event) {
    const recipesPerPage = event.target.value
    setRecipes([])
    setRecipesPerPage(recipesPerPage)
  }

  function handleLoadMoreRecipesClick() {
    const lastRecipe = recipes[recipes.length - 1]
    const cursorId = lastRecipe.id
    handleFetchRecipes(cursorId)
  }

  async function handleFetchRecipes(cursorId = "") {
    try {
      setRecipes(await fetchRecipes(cursorId))
    } catch (error) {
      console.error(error.message)
      throw error
    }
  }

  async function handleUpdateRecipe(newRecipe, recipeId) {
    try {
      await FirebaseFireStoreService.updateDocument(
        "recipes",
        recipeId,
        newRecipe
      )

      handleFetchRecipes()

      alert(`successfully update a recipe with an ID = ${recipeId}`)
    } catch (error) {
      alert(error.message)
      throw error
    } finally {
      setCurrentRecipe(null)
    }
  }

  async function handleDeleteRecipe(recipeId) {
    const deleteConfirmation = window.confirm("削除してもよろしいですか？")

    if (deleteConfirmation) {
      try {
        await FirebaseFireStoreService.deleteDocument("recipes", recipeId)
        handleFetchRecipes()
        setCurrentRecipe(null)
        window.scroll(0, 0)
        alert(`successfully deleted a recipe with an ID = ${recipeId}`)
      } catch (error) {
        console.error(error.message)
        throw error
      }
    }
  }

  function handleEditRecipeClick(recipeId) {
    const selectedRecipe = recipes.find((recipe) => {
      return recipe.id === recipeId
    })

    if (selectedRecipe) {
      setCurrentRecipe(selectedRecipe)
      window.scrollTo(0, document.body.scrollHeight)
    }
  }

  function handleEditRecipeCancel() {
    setCurrentRecipe(null)
  }

  // function lookupCategoryLabel(categoryKey) {
  //   const categories = {
  //     breadsSandwichesAndPizza: "パン、サンドウィッチ、ピザ",
  //     eggsAndBreakfast: "たまごと朝食",
  //     dessertsAndBakedGoods: "魚とシーフード",
  //     veg: "野菜",
  //   }

  //   const label = categories[categoryKey]
  //   return label
  // }

  function formatDate(date) {
    const day = date.getUTCDate()
    const month = date.getUTCMonth() + 1
    const year = date.getFullYear()
    const dateString = `${year}-${month}-${day}`

    return dateString
  }

  FirebaseAuthService.subscribeToAuthChanges(setUser)

  async function handleAddRecipe(newRecipe) {
    try {
      const response = await FirebaseFireStoreService.createDocument(
        "recipes",
        newRecipe
      )
      handleFetchRecipes()
      alert(`succesfully created a resipe with an ID = ${response.Id}`)
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <div className="App">
      <div className="title-row">
        <h1 className="title">Firebase Recipes1</h1>
        <LoginForm existingUser={user} />
      </div>
      <div className="main">
        <div className="row filters">
          <label className="recipe-label input-label">
            カテゴリー：
            <select
              className="select"
              required
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value=""></option>
              <option value="breadsSandwichesAndPizza">
                パン、サンドウィッチ、ピザ
              </option>
              <option value="eggsAndBreakfast">たまごと朝食</option>
              <option value="dessertsAndBakedGoods">デザートと焼き菓子</option>
              <option value="fishAndSeafood">魚とシーフード</option>
              <option value="veg">野菜</option>
            </select>
          </label>
          <label className="input-label">
            公開日：
            <select
              className="select"
              required
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
            >
              <option value="publishDateDesc">新しい順</option>
              <option value="publishDateAsc">古い順</option>
            </select>
          </label>
        </div>
        <div className="center">
          <div className="recipe-list-box">
            {isLoading ? <Loading /> : null}
            {!isLoading && recipes && recipes.length === 0 ? (
              <h5 className="no-recopes">レシピがありません</h5>
            ) : null}
            {!isLoading && recipes && recipes.length > 0 ? (
              <div className="recipe-list">
                {recipes.map((recipe) => {
                  return (
                    <div className="recipe-card" key={recipe.id}>
                      {recipe.isPublished ? null : (
                        <div className="unpublished">未公開</div>
                      )}
                      <div className="recipe-name">{recipe.name}</div>
                      <div className="recipe-field">
                        カテゴリー： {recipe.category}
                      </div>
                      <div className="recipe-field">
                        公開日； {formatDate(recipe.publishDate)}
                      </div>

                      {user ? (
                        <button
                          className="primary-button edit-button"
                          type="button"
                          onClick={() => handleEditRecipeClick(recipe.id)}
                        >
                          編集
                        </button>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>
        {isLoading || (recipes && recipes.length > 0) ? (
          <>
            <label className="input-label">
              表示件数：
              <select
                value={recipesPerPage}
                onChange={handleRecipesPerPageChange}
                className="select"
              >
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="9">9</option>
              </select>
            </label>
            <div className="pagination">
              <button
                type="button"
                onClick={handleLoadMoreRecipesClick}
                className="primary-button"
              >もっと見る</button>
            </div>
          </>
        ) : null}
        {user ? (
          <AddEditRecipeForm
            existingRecipe={currentRecipe}
            handleUpdateRecipe={handleUpdateRecipe}
            handleEditRecipeCancel={handleEditRecipeCancel}
            handleAddRecipe={handleAddRecipe}
            handleDeleteRecipe={handleDeleteRecipe}
          />
        ) : null}
      </div>
    </div>
  )
}

export default App
