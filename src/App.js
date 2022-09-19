import { useEffect, useState } from "react"
import "./App.css"
import LoginForm from "./components/LoginForm"
import FirebaseAuthService from "./FirebaseAuthService"
import AddEditRecipeForm from "./components/AddEditRecipeForm"
import FirebaseFireStoreService from "./FirebaseFireStoreService"

function App() {
  const [user, setUser] = useState(null)
  const [currentRecipe, setCurrentRecipe] = useState(null)
  const [recipes, setRecipes] = useState()

  useEffect(() => {
    fetchRecipes()
      .then((fetchRecipes) => {
        setRecipes(fetchRecipes)
      })
      .catch((error) => {
        console.error(error.message)
        throw error
      })
  }, [user])

  async function fetchRecipes() {
    const queries = []
    if (!user) {
      queries.push({
        field: "isPublished",
        condition: "==",
        value: true,
      })
    }
    let fetchRecipes = []
    try {
      const response = await FirebaseFireStoreService.readDocument({
        collection: "recipes",
        queries: queries,
      })
      const newRecipes = response.docs.map((recipeDoc) => {
        const id = recipeDoc.id
        const data = recipeDoc.data()
        data.publishDate = new Date(data.publishDate.seconds * 1000)

        return { ...data, id }
      })

      fetchRecipes = [...newRecipes]
    } catch (error) {
      console.error(error.message)
      throw error
    }

    return fetchRecipes
  }

  async function handleFetchRecipes() {
    try {
      setRecipes(await fetchRecipes())
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

  function lookupCategoryLabel(categoryKey) {
    const categories = {
      breadsSandwichesAndPizza: "パン、サンドウィッチ、ピザ",
      eggsAndBreakfast: "たまごと朝食",
      dessertsAndBakedGoods: "魚とシーフード",
      veg: "野菜",
    }

    const label = categories[categoryKey]
    return label
  }

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
        <div className="center">
          <div className="recipe-list-box">
            {recipes && recipes.length > 0 ? (
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
